'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Loader2, User, Mail, Lock, CreditCard, Shield, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
  items: {
    id: string;
    object: string;
    billing_thresholds: null;
    created: number;
    current_period_end: number;
    current_period_start: number;
    discounts: Array<{
      id: string;
      object: string;
      amount_off: number | null;
      percent_off: number | null;
      duration: string | null;
      duration_in_months: number | null;
    }>;
    metadata: Record<string, string>;
    plan: {
      id: string;
      object: string;
      active: boolean;
      aggregate_usage: null;
      amount: number;
      amount_decimal: string;
      billing_scheme: string;
      created: number;
      currency: string;
      interval: 'month' | 'year' | 'one-time';
      interval_count: number;
      livemode: boolean;
      metadata: Record<string, string>;
      meter: null;
      nickname: string | null;
      product: string;
      tiers_mode: null;
      transform_usage: null;
      trial_period_days: null;
      usage_type: string;
    };
    price: {
      id: string;
      object: string;
      active: boolean;
      billing_scheme: string;
      created: number;
      currency: string;
      custom_unit_amount: null;
      livemode: boolean;
      lookup_key: null;
      metadata: Record<string, string>;
      nickname: string | null;
      product: string;
      recurring: {
        interval: string;
        interval_count: number;
        usage_type: string;
        aggregate_usage: null;
        trial_period_days: null;
      };
      tax_behavior: string;
      tiers_mode: null;
      transform_quantity: null;
      type: string;
      unit_amount: number;
      unit_amount_decimal: string;
    };
    quantity: number;
    subscription: string;
    tax_rates: Array<{
      id: string;
      object: string;
      active: boolean;
      country: string;
      created: number;
      description: string;
      display_name: string;
      inclusive: boolean;
      jurisdiction: string;
      livemode: boolean;
      metadata: Record<string, string>;
      percentage: number;
      state: string;
      tax_type: string;
    }>;
  };
}

const sidebarNavItems = [
  {
    title: "Profile",
    icon: User,
    href: "#profile",
  },
  {
    title: "Password",
    icon: Lock,
    href: "#password",
  },
  {
    title: "Subscription",
    icon: CreditCard,
    href: "#subscription",
  },
  {
    title: "Security",
    icon: Shield,
    href: "#security",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "#notifications",
  },
];

// Feature lists for subscription plans
const basicFeatures: string[] = [
  "Create up to 3 sub accounts",
  "5GB monthly bandwidth",
  "Access to 60+ tables",
  "Set individual user permissions for each table"
];

const proFeatures: string[] = [
  "Create up to 6 sub accounts",
  "50GB monthly bandwidth",
  "Access to 60+ tables",
  "Set individual user permissions for each table"
];

// Check mark SVG component
const CheckMark = () => (
  <svg 
    className="h-5 w-5 text-green-500 flex-shrink-0" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M5 13l4 4L19 7" 
    />
  </svg>
);

function PlanSelectorDialog({ 
  open, 
  onOpenChange, 
  onSelectPlan, 
  currentPlanId,
  plans
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSelectPlan: (priceId: string) => void;
  currentPlanId?: string;
  plans: SubscriptionPlan[];
}) {
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year' | 'lifetime'>('month');

  // Group plans by product
  const basicPlans = plans.filter(plan => plan.name.toLowerCase().includes('basic'));
  const proPlans = plans.filter(plan => plan.name.toLowerCase().includes('pro'));

  // Get the selected plan based on interval
  const getSelectedPlan = (plans: SubscriptionPlan[]) => {
    return plans.find(plan => {
      if (selectedInterval === 'lifetime') {
        return plan.interval === 'one-time';
      }
      return plan.interval === selectedInterval;
    });
  };

  const selectedBasicPlan = getSelectedPlan(basicPlans);
  const selectedProPlan = getSelectedPlan(proPlans);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select the plan that best fits your needs
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center space-x-2 mb-6">
          <Button
            variant={selectedInterval === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedInterval('month')}
            className="min-w-[100px]"
          >
            Monthly
          </Button>
          <Button
            variant={selectedInterval === 'year' ? 'default' : 'outline'}
            onClick={() => setSelectedInterval('year')}
            className="min-w-[100px]"
          >
            Yearly
          </Button>
          <Button
            variant={selectedInterval === 'lifetime' ? 'default' : 'outline'}
            onClick={() => setSelectedInterval('lifetime')}
            className="min-w-[100px]"
          >
            Lifetime
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Basic Plan */}
          <Card className={`relative transition-colors ${
            currentPlanId === selectedBasicPlan?.id ? 'border-primary' : ''
          }`}>
            <CardHeader>
              <CardTitle className="text-xl">Basic</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">
                ${selectedBasicPlan?.amount ? selectedBasicPlan.amount / 100 : 0}
                {selectedInterval !== 'lifetime' && (
                  <span className="text-sm font-normal text-muted-foreground">
                    /{selectedInterval}
                  </span>
                )}
              </div>
              <ul className="space-y-3">
                {basicFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckMark />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full"
                onClick={() => selectedBasicPlan && onSelectPlan(selectedBasicPlan.priceId)}
                disabled={!selectedBasicPlan}
              >
                Select Basic Plan
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className={`relative transition-colors ${
            currentPlanId === selectedProPlan?.id ? 'border-primary' : ''
          }`}>
            <CardHeader>
              <CardTitle className="text-xl">Pro</CardTitle>
              <CardDescription>For growing businesses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">
                ${selectedProPlan?.amount ? selectedProPlan.amount / 100 : 0}
                {selectedInterval !== 'lifetime' && (
                  <span className="text-sm font-normal text-muted-foreground">
                    /{selectedInterval}
                  </span>
                )}
              </div>
              <ul className="space-y-3">
                {proFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckMark />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full"
                onClick={() => selectedProPlan && onSelectPlan(selectedProPlan.priceId)}
                disabled={!selectedProPlan}
              >
                Select Pro Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const SettingsPage = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [currentSession, setCurrentSession] = useState<{
    created_at: string;
    last_active_at: string;
  } | null>(null);
  const [loadingSession, setLoadingSession] = useState(false);

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

  const fetchCurrentSession = useCallback(async () => {
    try {
      setLoadingSession(true);
      const supabase = createClient();
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        setCurrentSession({
          created_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
        });
      } else {
        setCurrentSession(null);
      }
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to fetch session information');
    } finally {
      setLoadingSession(false);
    }
  }, []);

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

  useEffect(() => {
    if (activeSection === 'security') {
      fetchCurrentSession();
    }
  }, [activeSection, fetchCurrentSession]);

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
          window.history.replaceState({}, '', '/settings');
        } catch (err) {
          console.error('Error updating subscription after payment:', err);
          setError('Failed to update subscription. Please refresh the page or contact support.');
        }
      } else if (canceled === 'true') {
        setError('Subscription process was canceled');
        window.history.replaceState({}, '', '/settings');
      }
    };

    updateSubscriptionStatus();
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

  if (loadingPrices) {
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
                className={`flex items-center justify-start space-x-2 rounded-lg px-3 py-2 w-full hover:bg-accent hover:text-accent-foreground transition-colors ${
                  activeSection === item.href.replace('#', '')
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
          {activeSection === "profile" && (
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

          {activeSection === "password" && (
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

          {activeSection === "subscription" && (
            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
              </CardHeader>

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

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {subscription?.plan?.name || subscription?.items?.plan?.nickname || subscription?.items?.plan?.id || 'No active subscription'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {subscription?.plan?.amount ? `$${(subscription.plan.amount / 100).toFixed(2)}` : 
                         subscription?.items?.plan?.amount ? `$${(subscription.items.plan.amount / 100).toFixed(2)}` : ''} 
                        / {subscription?.plan?.interval || subscription?.items?.plan?.interval || 'month'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={subscription?.status === 'active' ? 'default' : 'destructive'}>
                        {subscription?.status || 'No subscription'}
                      </Badge>
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
                        <div className="rounded-lg border p-4">
                          <h4 className="font-semibold mb-4">Bandwidth Usage</h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">Used This Month</p>
                                <p className="font-medium">
                                  {profile?.current_month_bandwidth_used ? `${(profile.current_month_bandwidth_used / (1024 * 1024 * 1024)).toFixed(1)} GB` : '0 GB'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Monthly Limit</p>
                                <p className="font-medium">
                                  {profile?.monthly_bandwidth_limit ? `${(profile.monthly_bandwidth_limit / (1024 * 1024 * 1024)).toFixed(1)} GB` : '5 GB'}
                                </p>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ 
                                  width: `${profile?.monthly_bandwidth_limit && profile?.current_month_bandwidth_used 
                                    ? Math.min((profile.current_month_bandwidth_used / profile.monthly_bandwidth_limit) * 100, 100) 
                                    : 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
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
                <CardFooter className="flex justify-between">
                  {subscription ? (
                    <>
                      <Button 
                        variant="outline" 
                        className="text-red-400 hover:bg-destructive/90 hover:text-white"
                        onClick={handleCancelSubscription}
                        disabled={saving || subscription.cancel_at_period_end}
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {subscription.cancel_at_period_end ? 'Subscription Cancelled' : 'Cancel Subscription'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowPlanSelector(true)}
                      >
                        Change Plan
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setShowPlanSelector(true)}
                      className="w-full"
                    >
                      Add Subscription
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          )}

          {activeSection === "security" && (
            <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your security preferences and active sessions.
                </CardDescription>
              </CardHeader>

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

                <div className="rounded-lg border">
                  <div className="p-4 border-b">
                    <h4 className="font-semibold">Current Session</h4>
                    <p className="text-sm text-muted-foreground">Information about your current session</p>
                  </div>
                  
                  <div className="p-4">
                    {loadingSession ? (
                      <div className="text-center">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground mt-2">Loading session information...</p>
                      </div>
                    ) : currentSession ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">Current Device</p>
                            <p className="text-sm text-muted-foreground">
                              Last active: {new Date(currentSession.last_active_at).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSignOut}
                            disabled={saving}
                          >
                            {saving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Sign Out'
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        No active session found
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "notifications" && (
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
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      aria-label="Toggle email notifications"
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold">Browser Notifications</h4>
                      <p className="text-sm text-muted-foreground">Get real-time notifications in your browser</p>
                    </div>
                    <Switch
                      checked={browserNotifications}
                      onCheckedChange={setBrowserNotifications}
                      aria-label="Toggle browser notifications"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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

export default SettingsPage;
