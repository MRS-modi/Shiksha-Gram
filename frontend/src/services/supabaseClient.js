import { createClient } from '@supabase/supabase-js';

// Retrieve from environment or use placeholders
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key');

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to trigger Google OAuth with Supabase
export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured) {
    console.info("Supabase not fully configured; using simulated Google Auth.");
    return { error: null, simulated: true };
  }
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
};
