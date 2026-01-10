import { createClient } from "@/lib/supabase/client";

// Cache user role to avoid duplicate API calls
let cachedUserRole: { role: string | null; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getUserRole() {
  try {
    // Return cached role if still valid
    if (cachedUserRole && Date.now() - cachedUserRole.timestamp < CACHE_DURATION) {
      return cachedUserRole.role;
    }

    // Create a Supabase client for client-side operations
    const supabase = createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      cachedUserRole = { role: null, timestamp: Date.now() };
      return null;
    }

    // Get user's profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      cachedUserRole = { role: null, timestamp: Date.now() };
      return null;
    }

    // Cache and return the role
    const role = profile?.role || null;
    cachedUserRole = { role, timestamp: Date.now() };
    return role;

  } catch (error) {
    console.error("Error getting user role:", error);
    cachedUserRole = { role: null, timestamp: Date.now() };
    return null;
  }
}