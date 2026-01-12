import Link from 'next/link';

const features = [
  '60+ Game Table Types',
  'Unlimited Tables & Data',
  'Advanced Role-Based Permissions',
  'Default Permissions per User',
  'Per-Table Permission Overrides',
  'Sub-Owner Management',
  'Advanced Filtering & Search',
  'Server-Side Pagination',
  'Export & Import Data',
  'Activity Logs & Tracking',
  'High Performance (70k+ rows)',
  'Real-Time Collaboration',
  'Dark Mode Support',
  'Secure & Reliable',
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="fixed w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            TableEditor
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-5 text-xl text-gray-600 dark:text-gray-300">
            Everything you need to manage your game data tables
          </p>
        </div>

        {/* Single Pricing Card */}
        <div className="rounded-2xl shadow-2xl dark:shadow-gray-900/30 border-2 border-indigo-500 dark:border-indigo-400 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                TableEditor Pro
                </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Complete game data management solution
              </p>
              <div className="flex items-baseline justify-center">
                <span className="text-6xl font-bold text-gray-900 dark:text-white">
                  $29
                  </span>
                <span className="text-xl font-medium text-gray-500 dark:text-gray-400 ml-2">
                      /month
                    </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Start your 3-day free trial. No credit card required.
                </p>
            </div>

                <Link
              href="/register"
              className="block w-full py-4 px-6 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white text-lg font-semibold text-center hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-lg hover:shadow-indigo-500/50"
                >
              Start Free Trial
                </Link>
              </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 pb-8 px-8 sm:px-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Everything Included
                </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-start space-x-3">
                      <svg
                    className="flex-shrink-0 h-5 w-5 text-green-500 dark:text-green-400 mt-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Need help? <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
