import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://edpmhqwbtuqxefotmmjl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_l-XVTJNkh7QixyllhUpxvQ_huResXzr'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
