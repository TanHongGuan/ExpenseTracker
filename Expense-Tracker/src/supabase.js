import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uqkpxlrnbsqoswncskct.supabase.co'
const supabaseAnonKey = 'sb_publishable_NGrpVlfypwvv7iihwfbvzw_hVLXotWZ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)