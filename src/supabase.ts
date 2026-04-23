import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvsdsvokooayuvxjijab.supabase.co';
const supabaseAnonKey = 'sb_publishable_w4VJHHPZy01InR_H1lvniw_SxpTM3NC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
