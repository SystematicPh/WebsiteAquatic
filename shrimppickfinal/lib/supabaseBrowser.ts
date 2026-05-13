import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabaseEnv";

export const createSupabaseBrowser = () => createBrowserClient(supabaseUrl, supabaseAnonKey);
