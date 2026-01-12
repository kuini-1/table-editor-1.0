'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Base /settings route - redirect to profile
export default function SettingsRootPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/settings/profile');
  }, [router]);
  
  return null;
}
