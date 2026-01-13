'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Mail, Lock, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getBandwidthInfo } from "@/lib/bandwidth-tracker";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'owner' | 'sub_owner';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status?: string;
  monthly_bandwidth_limit?: number;
  current_month_bandwidth_used?: number;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  priceId: string;
  amount: number;
  interval: string;
  description: string;
  productId: string;
  features: string[];
  marketingFeatures: string[];
}

interface Subscription {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  plan?: {
    id: string;
    name: string;
    amount: number;
    interval: string;
  };
  items?: {
    plan?: {
      id: string;
      nickname?: string;
      amount?: number;
      interval?: string;
    };
  };
}

interface PlanSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPlan: (priceId: string) => void;
  plans: SubscriptionPlan[];
  currentPlanId?: string;
}

function PlanSelectorDialog({ open, onOpenChange, onSelectPlan, plans, currentPlanId }: PlanSelectorDialogProps) {
  const basicFeatures: string[] = [
    "Create up to 3 sub accounts",
    "10GB monthly bandwidth",
    "Access to 60+ tables",
    "Set individual user permissions for each table"
  ];

  const proFeatures: string[] = [
    "Create up to 6 sub accounts",
    "50GB monthly bandwidth",
    "Access to 60+ tables",
    "Set individual user permissions for each table"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select a subscription plan that fits your needs
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlanId === plan.priceId;
            const features = plan.name.toLowerCase().includes('basic') ? basicFeatures : proFeatures;
            
            return (
              <Card key={plan.priceId} className={isCurrentPlan ? 'border-indigo-500 border-2' : ''}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${(plan.amount / 100).toFixed(2)}
                    <span className="text-sm font-normal text-gray-500">/{plan.interval}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => onSelectPlan(plan.priceId)}
                    className="w-full"
                    disabled={isCurrentPlan}
                    variant={isCurrentPlan ? 'outline' : 'default'}
                  >
                    {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const sidebarNavItems = [
  { href: '/settings/profile', section: 'profile', title: 'Profile', icon: User },
  { href: '/settings/password', section: 'password', title: 'Password', icon: Lock },
  { href: '/settings/subscription', section: 'subscription', title: 'Subscription', icon: CreditCard },
];

export function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Get active section from URL path or default to 'profile'
  const getActiveSection = () => {
    const path = pathname || '';
    const section = path.split('/settings/')[1] || 'profile';
    return section || 'profile';
  };
  
  const [activeSection, setActiveSection] = useState(() => {
    const path = pathname || '';
    const section = path.split('/settings/')[1] || 'profile';
    return section || 'profile';
  });
  
  // Update active section when URL changes
  useEffect(() => {
    const section = getActiveSection();
    setActiveSection(section);
    
    // If on /settings (no section), redirect to profile
    if (pathname === '/settings') {
      router.replace('/settings/profile');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [bandwidthInfo, setBandwidthInfo] = useState<{ used: number; limit: number } | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fetchProfile = useCallback(async () => {
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
        email: user.email || '',
      }));
    } catch (err) {
      setError('Failed to fetch profile');
      console.error(err);
    }
  }, [router]);


  const fetchSubscription = useCallback(async () => {
    try {
      console.log('Fetching subscription data...');
      const response = await fetch('/api/stripe');
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error response from /api/stripe:', data);
        throw new Error(data.error || 'Failed to fetch subscription');
      }

      console.log('Subscription data received:', data);
      setSubscription(data.subscription);
    } catch (err) {
      console.error('Error in fetchSubscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription information');
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Fetch bandwidth info when on subscription section
  useEffect(() => {
    const fetchBandwidth = async () => {
      if (activeSection === 'subscription' && profile?.id) {
        try {
          const info = await getBandwidthInfo(profile.id);
          setBandwidthInfo(info);
        } catch (err) {
          console.error('Error fetching bandwidth info:', err);
        }
      }
    };
    fetchBandwidth();
  }, [activeSection, profile?.id]);

  useEffect(() => {
    if (activeSection === 'subscription') {
      console.log('Subscription section active, fetching data...');
      fetchSubscription();
    }
  }, [activeSection, fetchSubscription]);

  useEffect(() => {
    if (activeSection === 'subscription') {
      fetchStripePrices();
    }
  }, [activeSection]);

  const fetchStripePrices = async () => {
    try {
      setLoadingPrices(true);
      setError(null);
      const response = await fetch('/api/stripe/prices');
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      const data = await response.json();
      console.log('All plans:', data.prices.map((plan: SubscriptionPlan) => ({
        name: plan.name,
        interval: plan.interval,
        amount: plan.amount,
        priceId: plan.priceId
      })));
      setSubscriptionPlans(data.prices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoadingPrices(false);
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

  useEffect(() => {
    const updateSubscriptionStatus = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');

      if (success === 'true') {
        try {
          console.log('Payment successful, fetching updated subscription');
          await fetchSubscription();
          setSuccess('Subscription updated successfully');
          // Update URL to remove query parameters
          const currentSection = getActiveSection();
          window.history.replaceState({}, '', `/settings/${currentSection}`);
        } catch (err) {
          console.error('Error updating subscription after payment:', err);
          setError('Failed to update subscription. Please refresh the page or contact support.');
        }
      } else if (canceled === 'true') {
        setError('Subscription process was canceled');
        const currentSection = getActiveSection();
        window.history.replaceState({}, '', `/settings/${currentSection}`);
      }
    };

    updateSubscriptionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSubscription]);

  const handleCancelSubscription = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: subscription?.items?.plan?.id,
          action: 'cancel',
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSuccess('Subscription cancelled successfully');
      await fetchSubscription();
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectPlan = async (priceId: string) => {
    setShowPlanSelector(false);
    await handleSubscribe(priceId);
  };

  const handleSubscribe = async (priceId: string) => {
    try {
      setSaving(true);
      setError(null);
      console.log('Creating subscription with price ID:', priceId);

      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          action: 'create',
        }),
      });

      const data = await response.json();
      console.log('Server response:', data);
      
      if (!response.ok) {
        console.error('Error creating subscription:', data);
        throw new Error(data.error || 'Failed to create subscription');
      }

      if (!data.url) {
        console.error('No checkout URL received from server');
        throw new Error('No checkout URL received');
      }

      window.open(data.url, "_self");
    } catch (err) {
      console.error('Error in handleSubscribe:', err);
      setError(err instanceof Error ? err.message : 'Failed to create subscription. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage your account settings and preferences
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Sign Out
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar Navigation */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="space-y-1">
              {sidebarNavItems.map((item) => {
                const isActive = activeSection === item.section;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-200 dark:border-indigo-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {activeSection === "profile" && (
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <CardDescription className="text-sm">
                    Update your profile details and contact information
                  </CardDescription>
                </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900">
                      <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50">
                      <AlertDescription className="text-emerald-800 dark:text-emerald-200">{success}</AlertDescription>
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
                        className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
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
                        className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

            {activeSection === "password" && (
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <CardTitle className="text-lg">Change Password</CardTitle>
                  <CardDescription className="text-sm">
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>

              <form onSubmit={handlePasswordChange}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900">
                      <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50">
                      <AlertDescription className="text-emerald-800 dark:text-emerald-200">{success}</AlertDescription>
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
                        className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
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
                        className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
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
                        className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

            {activeSection === "subscription" && (
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <CardTitle className="text-lg">Subscription Plan</CardTitle>
                  <CardDescription className="text-sm">
                    Manage your subscription and billing
                  </CardDescription>
                </CardHeader>

              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900">
                    <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50">
                    <AlertDescription className="text-emerald-800 dark:text-emerald-200">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {subscription?.plan?.name || subscription?.items?.plan?.nickname || subscription?.items?.plan?.id || 'No active subscription'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                          {subscription?.plan?.amount ? `$${(subscription.plan.amount / 100).toFixed(2)}` : 
                           subscription?.items?.plan?.amount ? `$${(subscription.items.plan.amount / 100).toFixed(2)}` : ''} 
                          {subscription && ' / '}
                          {subscription?.plan?.interval || subscription?.items?.plan?.interval || 'month'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={subscription?.status === 'active' || subscription?.status === 'trialing' ? 'default' : 'destructive'}
                          className="px-2.5 py-1"
                        >
                          {subscription?.status === 'trialing' ? 'Trial' : subscription?.status || 'No subscription'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {loadingPrices ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-500 text-center py-4">{error}</div>
                  ) : (
                    <div>
                      {subscription && (
                        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4">
                          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Bandwidth Usage</h4>
                          {(() => {
                            // Always use bandwidthInfo from getBandwidthInfo() to match sidebar calculation
                            // Don't show if bandwidthInfo hasn't loaded yet to avoid showing incorrect values
                            if (!bandwidthInfo) {
                              return (
                                <div className="flex items-center justify-center py-4">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                              );
                            }
                            
                            const used = bandwidthInfo.used;
                            const limit = bandwidthInfo.limit;
                            const usagePercent = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
                            // Use profile.subscription_status to match the API endpoint logic
                            const isTrial = profile?.subscription_status === 'trialing';
                            const isNearLimit = usagePercent >= 80;
                            
                            // Format based on size - use MB for small limits, GB for larger
                            const formatBytes = (bytes: number) => {
                              if (bytes < 1024 * 1024) {
                                return `${(bytes / 1024).toFixed(0)} KB`;
                              } else if (bytes < 1024 * 1024 * 1024) {
                                return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
                              } else {
                                return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
                              }
                            };
                            
                            return (
                              <div className="space-y-3">
                                {isTrial && (
                                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                      <strong>Free Trial:</strong> You&apos;re on a trial plan with {formatBytes(limit)} monthly bandwidth. Upgrade to continue after your trial ends.
                                    </p>
                                  </div>
                                )}
                                {isNearLimit && !isTrial && (
                                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-3">
                                    <p className="text-sm text-orange-800 dark:text-orange-200">
                                      <strong>Warning:</strong> You&apos;ve used {usagePercent.toFixed(0)}% of your monthly bandwidth. Consider upgrading to avoid service interruption.
                                    </p>
                                  </div>
                                )}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Used This Month</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {formatBytes(used)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Limit</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {formatBytes(limit)}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                  <div 
                                    className={`h-3 rounded-full transition-all duration-300 ${
                                      isNearLimit 
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                    }`}
                                    style={{ 
                                      width: `${Math.min(usagePercent, 100)}%` 
                                    }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                  {Math.round(usagePercent)}% used
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      <PlanSelectorDialog
                        open={showPlanSelector}
                        onOpenChange={setShowPlanSelector}
                        onSelectPlan={handleSelectPlan}
                        plans={subscriptionPlans}
                      />
                    </div>
                  )}
                </div>
              </CardContent>

              {profile?.role === 'owner' && (
                <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pt-4">
                  {subscription ? (
                    <>
                      <Button 
                        variant="outline" 
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={handleCancelSubscription}
                        disabled={saving || subscription.cancel_at_period_end}
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {subscription.cancel_at_period_end ? 'Subscription Cancelled' : 'Cancel Subscription'}
                      </Button>
                      <Button
                        onClick={() => setShowPlanSelector(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                      >
                        Change Plan
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setShowPlanSelector(true)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                    >
                      Add Subscription
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          )}

        </div>
      </div>
      </div>

      <PlanSelectorDialog
        open={showPlanSelector}
        onOpenChange={setShowPlanSelector}
        onSelectPlan={handleSelectPlan}
        currentPlanId={subscription?.items?.plan?.id}
        plans={subscriptionPlans}
      />
    </div>
  );
}

