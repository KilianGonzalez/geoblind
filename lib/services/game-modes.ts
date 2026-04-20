import { createClient } from '@/lib/supabase/client'
import type { GameMode } from '@/lib/types'

export interface GameModeConfig {
  id: string
  slug: GameMode
  label: string
  time_limit_sec: number | null
  show_color_hints: boolean
  show_direction: boolean
  max_attempts: number | null
}

const modeConfigCache = new Map<GameMode, GameModeConfig>()

const FALLBACK_MODE_CONFIG: Record<GameMode, Omit<GameModeConfig, 'id'>> = {
  daily: {
    slug: 'daily',
    label: 'Diario',
    time_limit_sec: null,
    show_color_hints: true,
    show_direction: true,
    max_attempts: 6,
  },
  infinite: {
    slug: 'infinite',
    label: 'Infinito',
    time_limit_sec: null,
    show_color_hints: true,
    show_direction: true,
    max_attempts: null,
  },
  region: {
    slug: 'region',
    label: 'Por Region',
    time_limit_sec: null,
    show_color_hints: true,
    show_direction: true,
    max_attempts: null,
  },
  timed: {
    slug: 'timed',
    label: 'Contrarreloj',
    time_limit_sec: 60,
    show_color_hints: true,
    show_direction: true,
    max_attempts: null,
  },
  hard: {
    slug: 'hard',
    label: 'Dificil',
    time_limit_sec: null,
    show_color_hints: false,
    show_direction: false,
    max_attempts: 6,
  },
}

function mapGameModeRow(row: Record<string, unknown>): GameModeConfig {
  return {
    id: String(row.id),
    slug: row.slug as GameMode,
    label: String(row.label),
    time_limit_sec: row.time_limit_sec == null ? null : Number(row.time_limit_sec),
    show_color_hints: Boolean(row.show_color_hints),
    show_direction: Boolean(row.show_direction),
    max_attempts: row.max_attempts == null ? null : Number(row.max_attempts),
  }
}

export function getFallbackGameModeConfig(mode: GameMode): GameModeConfig {
  return {
    id: mode,
    ...FALLBACK_MODE_CONFIG[mode],
  }
}

export async function getGameModeConfig(mode: GameMode): Promise<GameModeConfig> {
  const cached = modeConfigCache.get(mode)
  if (cached) return cached

  const supabase = createClient()
  const { data, error } = await supabase
    .from('game_modes')
    .select('id, slug, label, time_limit_sec, show_color_hints, show_direction, max_attempts')
    .eq('slug', mode)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  const config = data ? mapGameModeRow(data as Record<string, unknown>) : getFallbackGameModeConfig(mode)
  modeConfigCache.set(mode, config)
  return config
}
