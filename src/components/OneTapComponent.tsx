'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'

interface OneTapComponentProps {
  children?: React.ReactNode;
  onStateChange?: Dispatch<SetStateAction<boolean>>;
}

const OneTapComponent: React.FC<OneTapComponentProps> = ({ children, onStateChange }) => {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push('/tables')
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/tables')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleClick = async () => {
    if (onStateChange) onStateChange(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
          },
        }
      })

      if (error) throw error
      
      // If no error but also no URL to redirect to, something went wrong
      if (!data?.url) {
        throw new Error('No redirect URL received')
      }
    } catch (error) {
      console.error('Error initiating Google sign-in:', error)
      if (onStateChange) onStateChange(false)
    }
  }

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  )
}

export default OneTapComponent