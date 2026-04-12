import { createClient } from '@/lib/supabase/server'
import type { RankingEntry } from '@/lib/types'

const RANKING_SELECT = `
  profile_id,
  total_score,
  games_played,
  win_rate,
  current_streak,
  best_streak,
  profiles ( username )
`

type ProfileJoin = { username: string | null } | { username: string | null }[] | null

function normalizeWinRate(raw: unknown): number {
  const n = Number(raw ?? 0)
  if (n <= 1 && n >= 0) return Math.round(n * 100)
  return Math.round(n)
}

function profileUsername(profiles: ProfileJoin): string {
  if (!profiles) return 'Jugador'
  const p = Array.isArray(profiles) ? profiles[0] : profiles
  return p?.username?.trim() || 'Jugador'
}

function mapRankingRows(data: Record<string, unknown>[]): RankingEntry[] {
  return data.map((row, i) => ({
    rank: i + 1,
    profileId: String(row.profile_id),
    username: profileUsername(row.profiles as ProfileJoin),
    totalScore: Number(row.total_score ?? 0),
    gamesPlayed: Number(row.games_played ?? 0),
    winRate: normalizeWinRate(row.win_rate),
    currentStreak: Number(row.current_streak ?? 0),
    bestStreak: Number(row.best_streak ?? 0),
  }))
}

export async function getGlobalRanking(limit = 50): Promise<RankingEntry[]> {
  const supabase = await createClient()
  const withMode = await supabase
    .from('rankings')
    .select(`${RANKING_SELECT}, game_mode_slug`)
    .is('game_mode_slug', null)
    .order('total_score', { ascending: false })
    .limit(limit)

  if (!withMode.error) {
    return mapRankingRows((withMode.data ?? []) as Record<string, unknown>[])
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[getGlobalRanking] fallback sin game_mode_slug:', withMode.error.message)
  }

  const { data, error } = await supabase
    .from('rankings')
    .select(RANKING_SELECT)
    .order('total_score', { ascending: false })
    .limit(limit)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getGlobalRanking]', error.message)
    }
    throw new Error(error.message)
  }

  return mapRankingRows((data ?? []) as Record<string, unknown>[])
}

export async function getRankingByMode(gameModeSlug: string, limit = 50): Promise<RankingEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rankings')
    .select(`${RANKING_SELECT}, game_mode_slug`)
    .eq('game_mode_slug', gameModeSlug)
    .order('total_score', { ascending: false })
    .limit(limit)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getRankingByMode]', error.message)
    }
    throw new Error(error.message)
  }

  return mapRankingRows((data ?? []) as Record<string, unknown>[])
}

export async function getUserRanking(profileId: string): Promise<RankingEntry | null> {
  const supabase = await createClient()
  let data: Record<string, unknown> | null = null

  const filtered = await supabase
    .from('rankings')
    .select(`${RANKING_SELECT}, game_mode_slug`)
    .eq('profile_id', profileId)
    .is('game_mode_slug', null)
    .maybeSingle()

  if (!filtered.error && filtered.data) {
    data = filtered.data as Record<string, unknown>
  } else {
    if (process.env.NODE_ENV === 'development' && filtered.error) {
      console.log('[getUserRanking] fallback sin filtro de modo:', filtered.error.message)
    }
    const fb = await supabase.from('rankings').select(RANKING_SELECT).eq('profile_id', profileId).maybeSingle()
    if (fb.error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[getUserRanking]', fb.error.message)
      }
      throw new Error(fb.error.message)
    }
    data = fb.data as Record<string, unknown> | null
  }

  if (!data) return null

  const score = Number(data.total_score ?? 0)
  let count: number | null = null
  const countFiltered = await supabase
    .from('rankings')
    .select('*', { count: 'exact', head: true })
    .is('game_mode_slug', null)
    .gt('total_score', score)

  if (!countFiltered.error) {
    count = countFiltered.count
  } else {
    const countFb = await supabase
      .from('rankings')
      .select('*', { count: 'exact', head: true })
      .gt('total_score', score)
    if (!countFb.error) count = countFb.count
    else if (process.env.NODE_ENV === 'development') {
      console.log('[getUserRanking] count', countFb.error.message)
    }
  }

  const rank = (count ?? 0) + 1
  return {
    rank,
    profileId: String(data.profile_id),
    username: profileUsername(data.profiles as ProfileJoin),
    totalScore: Number(data.total_score ?? 0),
    gamesPlayed: Number(data.games_played ?? 0),
    winRate: normalizeWinRate(data.win_rate),
    currentStreak: Number(data.current_streak ?? 0),
    bestStreak: Number(data.best_streak ?? 0),
  }
}
