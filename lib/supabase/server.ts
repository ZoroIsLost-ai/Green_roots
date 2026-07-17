import { createClient } from "@supabase/supabase-js";

/**
 * Server-only client using the service role key.
 * NEVER import this file from a client component.
 * Used by API routes: form submission and the admin dashboard.
 */
export function supabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
