import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ADD THESE TEMPORARILY
// console.log('URL:', supabaseUrl)
// console.log('KEY:', supabaseAnonKey)
// If either prints "undefined" → your .env is wrong

export const supabase = createClient(supabaseUrl, supabaseAnonKey)