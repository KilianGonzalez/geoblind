import { getCurrentUser, getUserProfile } from '@/lib/auth'
import { getGlobalRanking, getRankingByMode } from '@/lib/services/rankings'
import type { GameMode } from '@/lib/types'
import RankingView from '@/components/ranking-view'

const MODES: GameMode[] = ['daily', 'infinite', 'region', 'timed', 'hard']

export default async function RankingPage({
  params,
  searchParams,
}: {
  params: Promise<Record<string, never>>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await params
  await searchParams

  let globalRankings = await getGlobalRanking(50).catch(() => [])

  const rankingsByMode: Partial<Record<GameMode, Awaited<ReturnType<typeof getRankingByMode>>>> = {}
  await Promise.all(
    MODES.map(async m => {
      rankingsByMode[m] = await getRankingByMode(m, 50).catch(() => [])
    })
  )

  const user = await getCurrentUser()
  const profile = user ? await getUserProfile(user.id) : null

  return (
    <RankingView
      globalRankings={globalRankings}
      rankingsByMode={rankingsByMode}
      isLoggedIn={!!user}
      currentProfileId={profile?.id ?? null}
    />
  )
}
