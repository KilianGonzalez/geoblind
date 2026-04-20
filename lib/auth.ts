import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data) {
    if (process.env.NODE_ENV === 'development' && error) {
      console.log('[getUserProfile]', error.message)
    }
    return null
  }

  return {
    id: String(data.id),
    username: data.username ?? null,
    avatar_url: data.avatar_url ?? null,
  }
}
