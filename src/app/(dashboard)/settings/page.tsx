'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { LogOut, Loader2, User, Building2, Mail, Lock, CreditCard, Shield, Bell, Settings2 } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  role: 'owner' | 'sub_owner';
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: User,
    href: '#profile',
  },
  {
    title: 'Password',
    icon: Lock,
    href: '#password',
  },
  {
    title: 'Subscription',
    icon: CreditCard,
    href: '#subscription',
  },
  {
    title: 'Security',
    icon: Shield,
    href: '#security',
  },
  {
    title: 'Notifications',
    icon: Bell,
    href: '#notifications',
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('profile');

  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profile);
      setFormData(prev => ({
        ...prev,
        full_name: profile.full_name || '',
        company_name: profile.company_name || '',
        email: user.email || '',
      }));
    } catch (err) {
      setError('Failed to fetch profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate required fields
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          company_name: formData.company_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile?.id);

      if (updateError) throw updateError;

      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate required fields
    if (!formData.currentPassword) {
      setError('Current password is required');
      return;
    }
    if (!formData.newPassword) {
      setError('New password is required');
      return;
    }
    if (!formData.confirmPassword) {
      setError('Please confirm your new password');
      return;
    }
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) throw error;

      setSuccess('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setError('Failed to update password');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className={`flex items-center px-2 py-2 mt-2 text-sm font-medium rounded-lg transition-colors
              text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300`}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          <span className="ml-3">Sign Out</span>
        </button>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) => (
              <button
                key={item.href}
                onClick={() => setActiveSection(item.href.replace('#', ''))}
                className={`flex items-center justify-start space-x-2 rounded-lg px-3 py-2 w-full hover:bg-accent hover:text-accent-foreground transition-colors ${activeSection === item.href.replace('#', '')
                    ? 'bg-accent/50 text-accent-foreground'
                    : 'text-muted-foreground'
                  }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 lg:max-w-2xl">
          {activeSection === 'profile' && (
            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile details and contact information.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="bg-red-50 text-white dark:bg-red-900/50 border-red-200 dark:border-red-800">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-900/30 dark:text-emerald-200">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({ ...formData, full_name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name" className="text-sm font-medium">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) =>
                          setFormData({ ...formData, company_name: e.target.value })
                        }
                        placeholder="Enter your company name"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="relative"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {activeSection === 'password' && (
            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handlePasswordChange}>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="bg-red-50 text-white dark:bg-red-900/50 border-red-200 dark:border-red-800">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-900/30 dark:text-emerald-200">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="current-password"
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, currentPassword: e.target.value })
                        }
                        placeholder="Enter your current password"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, newPassword: e.target.value })
                        }
                        placeholder="Enter your new password"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm your new password"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="relative"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {activeSection === 'subscription' && (
            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Current Plan: Pro</h4>
                      <p className="text-sm text-muted-foreground">$29/month</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next billing date</span>
                      <span>April 1, 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tables included</span>
                      <span>20</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Team members</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-4">Payment Method</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/24</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" className="text-red-400 hover:bg-destructive/90 hover:text-white">
                  Cancel Subscription
                </Button>
                <Button>
                  Update Billing Info
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your security preferences and two-factor authentication.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold">Two-factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground">Manage your active sessions across devices</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications about your account activity</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold">Browser Notifications</h4>
                      <p className="text-sm text-muted-foreground">Get real-time notifications in your browser</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
