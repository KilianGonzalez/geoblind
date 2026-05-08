'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profileUsername, setProfileUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function readProfileUsername(userId: string): Promise<string | null> {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .maybeSingle()

      if (error) return null
      const username = String(data?.username ?? '').trim()
      return username || null
    }

    async function syncUser(nextUser: User | null): Promise<void> {
      if (cancelled) return

      setUser(nextUser)

      if (!nextUser) {
        setProfileUsername(null)
        setLoading(false)
        return
      }

      const username = await readProfileUsername(nextUser.id)
      if (cancelled) return
      setProfileUsername(username)
      setLoading(false)
    }

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      void syncUser(u)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncUser(session?.user ?? null)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  return { user, profileUsername, loading }
}
