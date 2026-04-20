import { createClient } from '@/lib/supabase/server'
import type { RankingEntry } from '@/lib/types'

const RANKING_SELECT = `
  profile_id,
  game_mode_id,
  total_score,
  games_played,
  games_won,
  avg_attempts,
  current_streak,
  best_streak,
  profiles ( username )
`

const MODE_RANKING_SELECT = `
  profile_id,
  total_score,
  games_played,
  games_won,
  avg_attempts,
  current_streak,
  best_streak,
  profiles ( username ),
  game_modes!inner ( slug )
`

type ProfileJoin = { username: string | null } | { username: string | null }[] | null

type RankingRow = {
  profile_id: string
  game_mode_id?: string
  total_score: number | null
  games_played: number | null
  games_won: number | null
  avg_attempts: number | null
  current_streak: number | null
  best_streak: number | null
  profiles: ProfileJoin
}

function profileUsername(profiles: ProfileJoin): string {
  if (!profiles) return 'Jugador'
  const p = Array.isArray(profiles) ? profiles[0] : profiles
  return p?.username?.trim() || 'Jugador'
}

function computeWinRate(gamesPlayed: number, gamesWon: number): number {
  if (gamesPlayed <= 0) return 0
  return Math.round((gamesWon / gamesPlayed) * 100)
}

function mapModeRankingRows(data: RankingRow[]): RankingEntry[] {
  return data.map((row, i) => {
    const gamesPlayed = Number(row.games_played ?? 0)
    const gamesWon = Number(row.games_won ?? 0)

    return {
      rank: i + 1,
      profileId: String(row.profile_id),
      username: profileUsername(row.profiles),
      totalScore: Number(row.total_score ?? 0),
      gamesPlayed,
      winRate: computeWinRate(gamesPlayed, gamesWon),
      currentStreak: Number(row.current_streak ?? 0),
      bestStreak: Number(row.best_streak ?? 0),
    }
  })
}

function aggregateGlobalRankingRows(data: RankingRow[]): RankingEntry[] {
  const byProfile = new Map<string, RankingEntry & { gamesWon: number }>()

  for (const row of data) {
    const profileId = String(row.profile_id)
    const current = byProfile.get(profileId)
    const gamesPlayed = Number(row.games_played ?? 0)
    const gamesWon = Number(row.games_won ?? 0)

    if (current) {
      current.totalScore += Number(row.total_score ?? 0)
      current.gamesPlayed += gamesPlayed
      current.gamesWon += gamesWon
      current.currentStreak = Math.max(current.currentStreak, Number(row.current_streak ?? 0))
      current.bestStreak = Math.max(current.bestStreak, Number(row.best_streak ?? 0))
      continue
    }

    byProfile.set(profileId, {
      rank: 0,
      profileId,
      username: profileUsername(row.profiles),
      totalScore: Number(row.total_score ?? 0),
      gamesPlayed,
      winRate: 0,
      currentStreak: Number(row.current_streak ?? 0),
      bestStreak: Number(row.best_streak ?? 0),
      gamesWon,
    })
  }

  return [...byProfile.values()]
    .map(entry => ({
      rank: 0,
      profileId: entry.profileId,
      username: entry.username,
      totalScore: entry.totalScore,
      gamesPlayed: entry.gamesPlayed,
      winRate: computeWinRate(entry.gamesPlayed, entry.gamesWon),
      currentStreak: entry.currentStreak,
      bestStreak: entry.bestStreak,
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((entry, i) => ({ ...entry, rank: i + 1 }))
}

async function getAllRankingRows(): Promise<RankingRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rankings')
    .select(RANKING_SELECT)
    .order('total_score', { ascending: false })

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getAllRankingRows]', error.message)
    }
    throw new Error(error.message)
  }

  return (data ?? []) as RankingRow[]
}

export async function getGlobalRanking(limit = 50): Promise<RankingEntry[]> {
  const rows = await getAllRankingRows()
  return aggregateGlobalRankingRows(rows).slice(0, limit)
}

export async function getRankingByMode(gameModeSlug: string, limit = 50): Promise<RankingEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rankings')
    .select(MODE_RANKING_SELECT)
    .eq('game_modes.slug', gameModeSlug)
    .order('total_score', { ascending: false })
    .limit(limit)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getRankingByMode]', error.message)
    }
    throw new Error(error.message)
  }

  return mapModeRankingRows((data ?? []) as RankingRow[])
}

export async function getUserRanking(profileId: string): Promise<RankingEntry | null> {
  const rows = await getAllRankingRows()
  const aggregated = aggregateGlobalRankingRows(rows)
  return aggregated.find(entry => entry.profileId === profileId) ?? null
}
