'use client';

import { useParams, redirect } from 'next/navigation';
import { SettingsPage } from '@/components/settings/SettingsPage';

export default function SettingsSectionPage() {
  const params = useParams();
  const section = params?.section as string;

  // Valid sections (security and notifications removed)
  const validSections = ['profile', 'password', 'subscription'];
  
  // If invalid section, redirect to profile
  if (section && !validSections.includes(section)) {
    redirect('/settings/profile');
  }

  // This route handles /settings/[section]
  // The SettingsPage component reads the section from the URL pathname
  return <SettingsPage />;
}

