import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lyybwjyrxldxaodedkqm.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qG5-_CYmdrJAbeePUr5J0A_K4VGXuXY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
