import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      {/* Navbar */}
      <header className="fixed w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            TableEditor
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Pricing
            </Link>
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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              Powerful Table Management <span className="text-indigo-600 dark:text-indigo-400">Solution</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Manage your data with ease. Create, edit, and collaborate on tables with
              advanced permission controls and real-time activity tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-lg font-medium transition-colors"
              >
                Start for Free
              </Link>
              <Link
                href="#features"
                className="px-8 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-lg font-medium transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Multi-User Access
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Granular permissions control for owners and sub-owners across different tables.
                </p>
              </div>
              <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Activity Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor all changes with detailed activity logs for each table.
                </p>
              </div>
              <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Real-time Updates
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  See changes instantly as they happen across your organization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Create Account',
                  description: 'Sign up and create your organization profile in minutes.'
                },
                {
                  step: '02',
                  title: 'Add Tables',
                  description: 'Create tables and customize them to your needs.'
                },
                {
                  step: '03',
                  title: 'Invite Team',
                  description: 'Add team members and set their access permissions.'
                },
                {
                  step: '04',
                  title: 'Start Managing',
                  description: 'Begin managing your data with real-time collaboration.'
                }
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-indigo-600 dark:bg-indigo-500">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8 text-white">
              Ready to get started?
            </h2>
            <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
              Join thousands of teams already using TableEditor to manage their data efficiently.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-indigo-600 dark:text-white text-lg font-medium transition-colors"
            >
              Start Your Free Trial
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pricing</Link></li>
                <li><Link href="/security" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About</Link></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Documentation</Link></li>
                <li><Link href="/api" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">API Reference</Link></li>
                <li><Link href="/support" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} TableEditor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
