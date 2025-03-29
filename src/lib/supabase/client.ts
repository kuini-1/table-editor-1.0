import "client-only";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          'X-Client-Info': 'table-editor-1.0'
        }
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  );
}