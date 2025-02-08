'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Check your email
          </h2>
          <div className="mt-4 text-center">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    We sent a verification link to{' '}
                    <span className="font-medium">{email}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-base text-gray-600">
            Click the link in the email to verify your account. After verification,
            you can{' '}
            <Link href="/login" className="font-medium text-black hover:text-gray-800">
              sign in to your account
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-4 text-gray-600">
          <div className="text-sm text-center space-y-1">
            <p>Didn't receive the email?</p>
            <p>
              • Check your spam folder
            </p>
            <p>
              • Make sure you entered the correct email address
            </p>
          </div>
          
          <div className="text-center">
            <Link
              href="/register"
              className="font-medium text-black hover:text-gray-800"
            >
              Try with a different email address
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 