import { createBrowserClient } from '@supabase/ssr'
import { getSupabasePublicEnv } from './config'

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (browserClient) {
    return browserClient
  }

  const { url, anonKey } = getSupabasePublicEnv()
  browserClient = createBrowserClient(url, anonKey)
  return browserClient
}
