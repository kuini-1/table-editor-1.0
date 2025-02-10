import { createClient } from "@/lib/supabase/client";

export async function getUserRole() {
  try {
    // Create a Supabase client for client-side operations
    const supabase = createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
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
      return null;
    }

    // Return the role from the profile (should be either 'owner' or 'sub_owner')
    return profile?.role || null;

  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}