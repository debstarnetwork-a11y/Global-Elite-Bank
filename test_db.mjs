import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.log("No credentials locally.");
  process.exit(0);
}

const supabase = createClient(url, key);

async function check() {
  const { data: users, error: uErr } = await supabase.from('users').select('*');
  const { data: settings, error: sErr } = await supabase.from('admin_settings').select('*');
  
  console.log("Users:", users?.length || 0, "Error:", uErr);
  if (users && users.length > 0) console.log("Admin email:", users.find(u => u.role === 'admin')?.email);
  
  console.log("Settings found:", settings?.length || 0, "Error:", sErr);
  if (settings && settings.length > 0) console.log("Logo URL:", settings[0].logo_url);
}
check();
