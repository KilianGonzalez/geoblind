export interface Hint {
  type: 'distance' | 'direction' | 'temperature' | 'capital' | 'population' | 'currency' | 'language' | 'fun_fact'
  value: string | number
  revealed: boolean
}

/** País tal como viene de la tabla `countries` en Supabase */
export interface Country {
  id: string
  name: string
  iso_code: string
  lat: number
  lng: number
  continent: string
  region: string
  neighbor_codes: string[]
  population: number | null
  area_km2: number | null
  flag_emoji: string
}

export type GameMode = 'daily' | 'infinite' | 'region' | 'timed' | 'hard'

export interface GameState {
  secretCountry: string | null
  guesses: string[]
  hints: Hint[]
  gameOver: boolean
  won: boolean
  attempts: number
}

export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
}

export interface GameSessionRow {
  id: string
  game_mode: GameMode
  country_id: string
  daily_challenge_id: string | null
  is_anonymous: boolean
  profile_id: string | null
  completed: boolean
  won: boolean | null
  attempts_used: number
  time_elapsed_sec: number
  score: number
  played_at: string
}

export interface GuessRow {
  id: string
  session_id: string
  country_id: string
  attempt_number: number
  distance_km: number
  direction: string
  proximity_pct: number
}

export interface RankingEntry {
  rank: number
  profileId: string
  username: string
  totalScore: number
  gamesPlayed: number
  winRate: number
  currentStreak: number
  bestStreak: number
}
