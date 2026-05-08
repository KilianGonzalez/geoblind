import Link from 'next/link'
import { ArrowRight, Globe } from 'lucide-react'
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

  if (!user) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto grid min-h-[70vh] w-full max-w-4xl place-items-center">
          <article className="reveal-up relative w-full overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-sky-500/10 via-card to-cyan-500/10 px-6 py-12 text-center sm:px-10">
            <div className="float-soft pointer-events-none absolute -left-10 top-6 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="float-soft pointer-events-none absolute -right-12 bottom-2 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="relative z-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-black sm:text-4xl">Ranking global</h1>
              <p className="mx-auto mt-4 max-w-xl text-sm text-foreground/75 sm:text-base">
                Inicia sesion para ver tablas por modo, comparar progreso y seguir tu posicion en tiempo real.
              </p>
              <Link
                href="/auth"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Iniciar sesion
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </section>
      </main>
    )
  }

  const globalRankings = await getGlobalRanking(50).catch(() => [])

  const rankingsByMode: Partial<Record<GameMode, Awaited<ReturnType<typeof getRankingByMode>>>> = {}
  await Promise.all(
    MODES.map(async mode => {
      rankingsByMode[mode] = await getRankingByMode(mode, 50).catch(() => [])
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
