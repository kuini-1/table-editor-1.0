import { NextResponse } from "next/server"
 
import { createClient } from "@/lib/supabase/server"
 
export async function GET(request: Request) {
  // Extract search parameters and origin from the request URL
  const { searchParams, origin } = new URL(request.url)
 
  // Get the authorization code and type
  const code = searchParams.get("code")
  const type = searchParams.get("type")
 
  if (code) {
    // Create a Supabase client
    const supabase = createClient()
 
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
 
    if (!error) {
      // If this is a password recovery flow, redirect to reset password page
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`)
      }
      
      // Otherwise, redirect to tables page (normal login/email verification)
      return NextResponse.redirect(`${origin}/tables`)
    }
  }
 
  // If there's no code or an error occurred, redirect to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}