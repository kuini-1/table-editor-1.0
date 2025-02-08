import Link from 'next/link';

const tiers = [
  {
    name: 'Basic',
    price: '$9',
    description: 'Perfect for small teams and startups',
    features: [
      'Up to 5 tables',
      '2 team members',
      'Basic activity logging',
      'Email support',
    ],
    cta: 'Start with Basic',
    href: '/register?plan=basic',
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Best for growing businesses',
    features: [
      'Up to 20 tables',
      '10 team members',
      'Advanced activity logging',
      'Priority email support',
      'Custom permissions',
    ],
    cta: 'Start with Pro',
    href: '/register?plan=pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited tables',
      'Unlimited team members',
      'Advanced activity logging',
      '24/7 phone & email support',
      'Custom permissions',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    href: '/contact',
  },
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
      <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white text-center">
            Pricing Plans
          </h1>
          <p className="mt-5 text-xl text-gray-600 dark:text-gray-300 text-center">
            Choose the perfect plan for your needs
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl shadow-xl dark:shadow-gray-900/30 divide-y divide-gray-200 dark:divide-gray-700 ${
                tier.featured
                  ? 'border-2 border-indigo-500 dark:border-indigo-400 bg-white dark:bg-gray-800 scale-105 z-10'
                  : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {tier.name}
                </h2>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {tier.price}
                  </span>
                  {tier.price !== 'Custom' && (
                    <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                      /month
                    </span>
                  )}
                </p>
                <Link
                  href={tier.href}
                  className={`mt-8 block w-full py-3 px-4 rounded-lg text-sm font-medium text-center transition-colors ${
                    tier.featured
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600'
                      : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 border border-indigo-500 dark:border-indigo-400'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 dark:text-white tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500 dark:text-green-400"
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
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
