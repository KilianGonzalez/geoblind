import { createClient } from '@/lib/supabase/client'

export async function getProfileIdByUserId(userId: string): Promise<string | undefined> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data?.id ? String(data.id) : undefined
}
