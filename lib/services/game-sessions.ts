import { createClient } from '@/lib/supabase/client'
import type { Country, GameMode, GameSessionRow } from '@/lib/types'
import {
  calculateBearingDegrees,
  countryToCountryData,
  directionToArrowLabel,
} from '@/lib/game-logic'
import type { GuessResult } from '@/lib/game-logic'

const COUNTRY_SELECT =
  'id, name, iso_code, lat, lng, continent, region, neighbor_codes, population, area_km2, flag_emoji'

async function getGameModeId(slug: GameMode): Promise<string> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('game_modes')
    .select('id')
    .eq('slug', slug)
    .single()

  if (error) {
    throw new Error(`Failed to get game mode ID for ${slug}: ${error.message}`)
  }

  return data.id
}

export interface GuessInsertResult {
  id: string
  session_id: string
  country_id: string
  attempt_number: number
  distance_km: number
  direction: string
  proximity_pct: number
}

export async function createGameSession(data: {
  gameMode: GameMode
  countryId: string
  dailyChallengeId?: string
  isAnonymous: boolean
  profileId?: string
}): Promise<GameSessionRow> {
  const supabase = createClient()
  const gameModeId = await getGameModeId(data.gameMode)

  const { data: row, error } = await supabase
    .from('game_sessions')
    .insert({
      game_mode_id: gameModeId,
      country_id: data.countryId,
      daily_challenge_id: data.dailyChallengeId ?? null,
      is_anonymous: data.isAnonymous,
      profile_id: data.profileId ?? null,
      completed: false,
      won: false,
      attempts_used: 0,
      time_elapsed_sec: 0,
      score: 0,
    })
    .select(`
      *,
      game_modes (slug)
    `)
    .single()

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[createGameSession]', error.message)
    }
    throw new Error(error.message)
  }

  return mapSessionRow(row as Record<string, unknown>)
}

export async function saveGuess(data: {
  sessionId: string
  countryId: string
  attemptNumber: number
  distanceKm: number
  direction: string
  proximityPct: number
}): Promise<GuessInsertResult> {
  const supabase = createClient()
  const { data: row, error } = await supabase
    .from('guesses')
    .insert({
      session_id: data.sessionId,
      country_id: data.countryId,
      attempt_number: data.attemptNumber,
      distance_km: data.distanceKm,
      direction: data.direction,
      proximity_pct: data.proximityPct,
    })
    .select()
    .single()

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[saveGuess]', error.message)
    }
    throw new Error(error.message)
  }

  return mapGuessRow(row as Record<string, unknown>)
}

export async function closeGameSession(data: {
  sessionId: string
  won: boolean
  attemptsUsed: number
  timeElapsedSec: number
  score: number
}): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('game_sessions')
    .update({
      completed: true,
      won: data.won,
      attempts_used: data.attemptsUsed,
      time_elapsed_sec: data.timeElapsedSec,
      score: data.score,
    })
    .eq('id', data.sessionId)

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[closeGameSession]', error.message)
    }
    throw new Error(error.message)
  }
}

export async function getCompletedDailySessionForProfile(params: {
  profileId: string
  gameMode: GameMode
}): Promise<GameSessionRow | null> {
  const supabase = createClient()
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const gameModeId = await getGameModeId(params.gameMode)

  const { data, error } = await supabase
    .from('game_sessions')
    .select(`
      *,
      game_modes (slug)
    `)
    .eq('profile_id', params.profileId)
    .eq('game_mode_id', gameModeId)
    .eq('completed', true)
    .gte('played_at', start.toISOString())
    .lte('played_at', end.toISOString())
    .order('played_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getCompletedDailySessionForProfile]', error.message)
    }
    throw new Error(error.message)
  }

  if (!data) return null
  return mapSessionRow(data as Record<string, unknown>)
}

export async function getSessionById(sessionId: string): Promise<GameSessionRow | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('game_sessions')
    .select(`
      *,
      game_modes (slug)
    `)
    .eq('id', sessionId)
    .maybeSingle()

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getSessionById]', error.message)
    }
    throw new Error(error.message)
  }

  if (!data) return null
  return mapSessionRow(data as Record<string, unknown>)
}

export async function getGuessesForSessionWithCountries(
  sessionId: string,
  target: Country
): Promise<GuessResult[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('guesses')
    .select(`
      attempt_number,
      distance_km,
      direction,
      proximity_pct,
      countries (${COUNTRY_SELECT})
    `)
    .eq('session_id', sessionId)
    .order('attempt_number', { ascending: true })

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getGuessesForSessionWithCountries]', error.message)
    }
    throw new Error(error.message)
  }

  const rows = data ?? []
  const results: GuessResult[] = []

  for (const raw of rows) {
    const r = raw as {
      attempt_number: number
      distance_km: number
      direction: string
      proximity_pct: number
      countries: Record<string, unknown> | Record<string, unknown>[] | null
    }

    const countryRaw = Array.isArray(r.countries) ? r.countries[0] : r.countries
    if (!countryRaw) continue

    const guessed = mapCountryRow(countryRaw)
    const bearing = calculateBearingDegrees(guessed.lat, guessed.lng, target.lat, target.lng)
    const proximityPct = Number(r.proximity_pct)
    const isCorrect = proximityPct === 100 || guessed.id === target.id

    results.push({
      country: countryToCountryData(guessed),
      distance: Math.round(Number(r.distance_km)),
      bearing,
      direction: directionToArrowLabel(String(r.direction)),
      proximityPct,
      isCorrect,
      attemptNumber: r.attempt_number,
    })
  }

  return results
}

function mapSessionRow(row: Record<string, unknown>): GameSessionRow {
  const gameModeData = row.game_modes as { slug: string } | { slug: string }[] | null
  const gameMode = Array.isArray(gameModeData) ? gameModeData[0]?.slug : gameModeData?.slug

  return {
    id: String(row.id),
    game_mode: gameMode as GameMode,
    country_id: String(row.country_id),
    daily_challenge_id: row.daily_challenge_id != null ? String(row.daily_challenge_id) : null,
    is_anonymous: Boolean(row.is_anonymous),
    profile_id: row.profile_id != null ? String(row.profile_id) : null,
    completed: Boolean(row.completed),
    won: row.won == null ? null : Boolean(row.won),
    attempts_used: Number(row.attempts_used ?? 0),
    time_elapsed_sec: Number(row.time_elapsed_sec ?? 0),
    score: Number(row.score ?? 0),
    played_at: String(row.played_at),
  }
}

function mapGuessRow(row: Record<string, unknown>): GuessInsertResult {
  return {
    id: String(row.id),
    session_id: String(row.session_id),
    country_id: String(row.country_id),
    attempt_number: Number(row.attempt_number),
    distance_km: Number(row.distance_km),
    direction: String(row.direction),
    proximity_pct: Number(row.proximity_pct),
  }
}

function mapCountryRow(row: Record<string, unknown>): Country {
  return {
    id: String(row.id),
    name: String(row.name),
    iso_code: String(row.iso_code),
    lat: Number(row.lat),
    lng: Number(row.lng),
    continent: String(row.continent),
    region: String(row.region),
    neighbor_codes: row.neighbor_codes != null ? (row.neighbor_codes as string[]) : [],
    population: row.population != null ? Number(row.population) : null,
    area_km2: row.area_km2 != null ? Number(row.area_km2) : null,
    flag_emoji: String(row.flag_emoji ?? '??'),
  }
}
