import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser-side client. Uses the public anon key.
 * Row Level Security on the `responses` table must only allow INSERT
 * for this key — see supabase/schema.sql.
 */
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
