'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const isTablePage = pathname?.startsWith('/tables/') && searchParams?.has('id');

  useEffect(() => {
    setHasPreviousPage(window.history.length > 1);
  }, []);

  const handleNavigation = () => {
    if (hasPreviousPage) {
        router.push('/tables');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          {isTablePage ? (
            <>
              <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent py-2">
                Coming Soon
              </h1>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Table Not Available Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-lg">
                This table is currently under development and will be available soon.
                Please check back later or contact support for more information.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-7xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                404
              </h1>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Page Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-lg">
                Oops! The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
              </p>
            </>
          )}
        </div>

        <Button
          onClick={handleNavigation}
          className={`${
            isTablePage 
              ? 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
          } text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-900/50 transition-all duration-200 mt-5`}
        >
          {hasPreviousPage ? (
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </>
          ) : (
            <>
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 