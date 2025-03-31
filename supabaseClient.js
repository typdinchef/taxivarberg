// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'public-anon-key'; // Hitta i Supabase > Inställningar > API
export const supabase = createClient(supabaseUrl, supabaseKey);
