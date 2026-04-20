interface SupabasePublicEnv {
  url: string
  anonKey: string
}

const publicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const

function readEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'): string {
  const value = publicEnv[name]?.trim()

  if (value) {
    return value
  }

  const locationHint =
    typeof window === 'undefined'
      ? 'Check `.env.local` or your deployment environment variables.'
      : 'Check your `.env.local`, then restart `npm run dev` so the browser bundle picks up the new value.'

  throw new Error(`Missing Supabase env "${name}". ${locationHint}`)
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  return {
    url: readEnv('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  }
}
