import { createClient } from "@supabase/supabase-js"

/** Public client (anon key) — no `cookies()` / `next/headers`. */
export function createPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
    )
  }
  return createClient(url, key)
}
