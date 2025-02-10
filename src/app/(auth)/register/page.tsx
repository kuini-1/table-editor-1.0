'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'basic';
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState(0);

  useEffect(() => {
    if (retryTimeout > 0) {
      const timer = setTimeout(() => {
        setRetryTimeout(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [retryTimeout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (retryTimeout > 0) {
      setError(`Please wait ${retryTimeout} seconds before trying again`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            plan,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('rate_limit')) {
          setRetryTimeout(25);
          throw new Error('Please wait 25 seconds before trying again');
        }
        throw signUpError;
      }

      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            role: 'owner',
          });

        if (profileError) throw profileError;

        const { error: ownerError } = await supabase
          .from('owners')
          .insert({
            profile_id: data.user.id,
          });

        if (ownerError) throw ownerError;

        const { data: ownerData } = await supabase
          .from('owners')
          .select('id')
          .eq('profile_id', data.user.id)
          .single();

        if (ownerData) {
          const tableTypes = ['exp', 'merchant', 'item'];
          const tablesToCreate = tableTypes.map((type) => ({
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} Table`,
            type,
            owner_id: ownerData.id,
          }));

          const { data: tablesData, error: tablesError } = await supabase
            .from('tables')
            .insert(tablesToCreate)
            .select();

          if (tablesError) throw tablesError;

          if (tablesData) {
            const { data: subOwners, error: subOwnersError } = await supabase
              .from('sub_owners')
              .select('id')
              .eq('owner_id', ownerData.id);

            if (subOwnersError) throw subOwnersError;

            if (subOwners && subOwners.length > 0) {
              const defaultPermissions = tablesData.flatMap(table => 
                subOwners.map(subOwner => ({
                  table_id: table.id,
                  sub_owner_id: subOwner.id,
                  can_get: false,
                  can_put: false,
                  can_post: false,
                  can_delete: false
                }))
              );

              const { error: permissionsError } = await supabase
                .from('sub_owner_permissions')
                .insert(defaultPermissions);

              if (permissionsError) throw permissionsError;
            }
          }
        }

        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            TableEditor
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow-xl dark:shadow-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/50 p-4 text-sm text-red-700 dark:text-red-200 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            {retryTimeout > 0 && (
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/50 p-4 text-sm text-yellow-700 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800">
                Please wait {retryTimeout} seconds before trying again
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors sm:text-sm"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors sm:text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || retryTimeout > 0}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-colors ${
                  loading || retryTimeout > 0
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
                }`}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
