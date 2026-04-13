import Link from 'next/link'
import { Globe } from 'lucide-react'
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

  const user = await getCurrentUser()
  const profile = user ? await getUserProfile(user.id) : null

  // Si no está autenticado, mostrar mensaje para registrarse
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <Globe className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Ranking Global</h1>
          <p className="text-foreground/70 mb-6">
            Debes iniciar sesión para ver las tablas de posiciones y competir con otros jugadores.
          </p>
          <Link 
            href="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  let globalRankings = await getGlobalRanking(50).catch(() => [])

  const rankingsByMode: Partial<Record<GameMode, Awaited<ReturnType<typeof getRankingByMode>>>> = {}
  await Promise.all(
    MODES.map(async m => {
      rankingsByMode[m] = await getRankingByMode(m, 50).catch(() => [])
    })
  )

  return (
    <RankingView
      globalRankings={globalRankings}
      rankingsByMode={rankingsByMode}
      isLoggedIn={!!user}
      currentProfileId={profile?.id ?? null}
    />
  )
}
