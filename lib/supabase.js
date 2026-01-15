import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL:', supabaseUrl)
  console.error('Supabase Key length:', supabaseAnonKey?.length)
  throw new Error(`Missing Supabase environment variables - URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`)
}

if (supabaseAnonKey.length < 40) {
  throw new Error('Supabase anon key appears to be incomplete. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)