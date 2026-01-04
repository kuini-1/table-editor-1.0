'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Edit, Copy, Trash2, Search, Filter } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
    // Auto-show edit dialog after a delay
    const timer = setTimeout(() => {
      setShowEditDialog(true);
      setTimeout(() => setShowEditDialog(false), 4000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const tableColumns = [
    { key: 'tblidx', label: 'ID', type: 'number' },
    { key: 'wsznametext', label: 'Name', type: 'text' },
    { key: 'bysell_type', label: 'Sell Type', type: 'number' },
    { key: 'tab_name', label: 'Tab Name', type: 'text' },
    { key: 'dwneedmileage', label: 'Need Mileage', type: 'number' },
  ];

  const tableData = [
    { id: '1', tblidx: 1001, wsznametext: 'Weapon Merchant', bysell_type: 1, tab_name: 'Weapons', dwneedmileage: 0 },
    { id: '2', tblidx: 1002, wsznametext: 'Armor Merchant', bysell_type: 2, tab_name: 'Armor', dwneedmileage: 100 },
    { id: '3', tblidx: 1003, wsznametext: 'Item Merchant', bysell_type: 3, tab_name: 'Items', dwneedmileage: 50 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            TableEditor
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium shadow-lg hover:shadow-indigo-500/50 transform hover:scale-[1.02] transition-all duration-100 ease-out will-change-transform"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 dark:purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <motion.div 
            style={{ opacity, scale }}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={mounted ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-block mb-4 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium"
                >
                  🎮 Game Data Management Platform
                </motion.div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                  Manage 60+ Game Tables with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    Advanced Controls
                  </span>
            </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                  Professional table management platform for game data. Handle massive datasets with advanced filtering, 
                  granular permissions, and real-time collaboration across your entire team.
            </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                    className="group px-8 py-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-lg font-medium shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all duration-100 ease-out will-change-transform"
              >
                Start for Free
                    <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-100 ease-out will-change-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
              </Link>
              <Link
                href="#features"
                    className="px-8 py-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-lg font-medium border-2 border-gray-200 dark:border-gray-700 shadow-md transform hover:scale-[1.02] transition-all duration-100 ease-out will-change-transform"
              >
                Learn More
              </Link>
            </div>
              </motion.div>
              
              {/* Table Skeleton with Edit Dialog */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={mounted ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Merchant Table</h3>
                      <span className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded">60+ rows</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left w-12">
                            <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
                          </th>
                          {tableColumns.map((col) => (
                            <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {col.label}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {tableData.map((row, idx) => (
                          <motion.tr
                            key={row.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={mounted ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{row.tblidx}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{row.wsznametext}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{row.bysell_type}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{row.tab_name}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{row.dwneedmileage}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                                <button 
                                  onClick={() => setShowEditDialog(true)}
                                  className="p-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded transition-colors"
                                >
                                  <Edit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </button>
                                <button className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors">
                                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Edit Dialog Popup */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: showEditDialog ? 1 : 0,
                    scale: showEditDialog ? 1 : 0.95,
                    y: showEditDialog ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-50 ${showEditDialog ? 'pointer-events-auto' : 'pointer-events-none'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Merchant</h3>
                    <button 
                      onClick={() => setShowEditDialog(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                      <input 
                        type="text" 
                        defaultValue="Weapon Merchant" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sell Type</label>
                      <input 
                        type="number" 
                        defaultValue="1" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tab Name</label>
                      <input 
                        type="text" 
                        defaultValue="Weapons" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Need Mileage</label>
                      <input 
                        type="number" 
                        defaultValue="0" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                        Save
                      </button>
                      <button 
                        onClick={() => setShowEditDialog(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
          </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white dark:bg-gray-800 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Powerful Features for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Game Developers
                </span>
            </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to manage your game data efficiently
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: '60+ Table Types',
                  description: 'Manage experience, items, merchants, skills, NPCs, dungeons, and many more game data tables.',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  ),
                  title: 'Advanced Permissions',
                  description: 'Set default permissions per user and override per-table. Granular control over GET, PUT, POST, DELETE operations.',
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  ),
                  title: 'Activity Logs',
                  description: 'Track every change with detailed activity logs showing who did what and when for complete audit trails.',
                  gradient: 'from-green-500 to-emerald-500'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  ),
                  title: 'High Performance',
                  description: 'Optimized for large datasets (70k+ rows) with smart filtering, pagination, and debounced search for lightning-fast performance.',
                  gradient: 'from-orange-500 to-red-500'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                  title: 'Export & Import',
                  description: 'Export your data for backup or analysis. Import data in bulk to quickly populate your tables.',
                  gradient: 'from-indigo-500 to-purple-500'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                  title: 'Advanced Filtering',
                  description: 'Filter by text, numbers, booleans with debounced search. Pin favorite tables for quick access.',
                  gradient: 'from-pink-500 to-rose-500'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: 'Secure & Reliable',
                  description: 'Row-level security, role-based access control, and secure authentication powered by Supabase.',
                  gradient: 'from-teal-500 to-cyan-500'
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ),
                  title: 'Dark Mode',
                  description: 'Beautiful dark mode support for comfortable viewing in any lighting condition.',
                  gradient: 'from-violet-500 to-purple-500'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative p-6 bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 hover:border-transparent transform hover:scale-[1.02] transition-all duration-100 ease-out hover:shadow-xl will-change-transform"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-100 ease-out`}></div>
                  <div className={`relative w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 text-white transform group-hover:scale-105 transition-transform duration-100 ease-out will-change-transform`}>
                    {feature.icon}
                </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-100 ease-out">
                    {feature.title}
                </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              How It Works
            </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Get started in minutes
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Create Account',
                  description: 'Sign up and choose your subscription plan. Get started with Basic or Pro plans.',
                  gradient: 'from-blue-500 to-cyan-500',
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                {
                  step: '02',
                  title: 'Access 60+ Tables',
                  description: 'Immediately access all game table types: experience, items, merchants, skills, NPCs, and more.',
                  gradient: 'from-purple-500 to-pink-500',
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  step: '03',
                  title: 'Manage Users',
                  description: 'Add sub-owners and set default permissions. Override permissions per table as needed.',
                  gradient: 'from-green-500 to-emerald-500',
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                },
                {
                  step: '04',
                  title: 'Start Managing',
                  description: 'Create, edit, filter, and track changes across all your game data tables with full activity logs.',
                  gradient: 'from-orange-500 to-red-500',
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-100 ease-out"></div>
                  <div className="relative p-6 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 h-full transform group-hover:-translate-y-1 transition-transform duration-100 ease-out will-change-transform">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 text-white transform group-hover:scale-105 transition-transform duration-100 ease-out will-change-transform`}>
                      {item.icon}
                    </div>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-4">
                    {item.step}
                  </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Completely Remade */}
        <section className="py-32 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Text content */}
                <div className="text-center lg:text-left">
                  <div className="inline-block mb-6 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                    🚀 Start Your Free Trial Today
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                    Ready to Transform Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                      Game Data Management?
                    </span>
            </h2>
                  
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Join game development teams using TableEditor to manage 60+ game tables with advanced permissions and real-time collaboration. No credit card required.
            </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                    <div>
            <Link
              href="/register"
                        className="group inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-lg font-semibold shadow-lg hover:shadow-indigo-500/50 transform hover:scale-[1.02] transition-all duration-100 ease-out will-change-transform"
            >
              Start Your Free Trial
                        <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-100 ease-out will-change-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                    <div>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold border-2 border-gray-200 dark:border-gray-700 shadow-md transform hover:scale-[1.02] transition-all duration-100 ease-out will-change-transform"
                      >
                        View Pricing
            </Link>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600 dark:text-gray-400">
                    {[
                      { icon: '✓', text: 'No credit card' },
                      { icon: '✓', text: '14-day free trial' },
                      { icon: '✓', text: 'Cancel anytime' }
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2"
                      >
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Right side - SVG Illustration */}
                <div className="relative hidden lg:block">
                  <div className="relative">
                    {/* Main illustration - Table with data flowing */}
                    <svg viewBox="0 0 500 400" className="w-full h-auto">
                      {/* Background glow */}
                      <defs>
                        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Animated table representation */}
                      <g transform="translate(50, 50)">
                        {/* Table container */}
                        <rect x="0" y="0" width="400" height="300" rx="16" fill="white" className="dark:fill-gray-800" filter="url(#glow)" />
                        <rect x="0" y="0" width="400" height="50" rx="16" fill="#F3F4F6" className="dark:fill-gray-700" />
                        
                        {/* Table header */}
                        <line x1="20" y1="25" x2="380" y2="25" stroke="#4F46E5" strokeWidth="2" />
                        <circle cx="30" cy="25" r="6" fill="#4F46E5" className="animate-pulse" />
                        <text x="50" y="30" className="text-sm font-semibold fill-gray-700 dark:fill-gray-300">ID</text>
                        <text x="150" y="30" className="text-sm font-semibold fill-gray-700 dark:fill-gray-300">Name</text>
                        <text x="250" y="30" className="text-sm font-semibold fill-gray-700 dark:fill-gray-300">Type</text>
                        <text x="350" y="30" className="text-sm font-semibold fill-gray-700 dark:fill-gray-300">Value</text>
                        
                        {/* Table rows */}
                        {[0, 1, 2].map((i) => (
                          <g key={i} transform={`translate(0, ${60 + i * 50})`}>
                            <rect x="0" y="0" width="400" height="40" fill={i % 2 === 0 ? "white" : "#F9FAFB"} className="dark:fill-gray-800" />
                            <line x1="0" y1="40" x2="400" y2="40" stroke="#E5E7EB" className="dark:stroke-gray-700" />
                            <circle cx="30" cy="20" r="4" fill="#9CA3AF" />
                            <rect x="50" y="12" width="60" height="16" rx="4" fill="#E5E7EB" className="dark:fill-gray-700" />
                            <rect x="150" y="12" width="80" height="16" rx="4" fill="#E5E7EB" className="dark:fill-gray-700" />
                            <rect x="250" y="12" width="60" height="16" rx="4" fill="#E5E7EB" className="dark:fill-gray-700" />
                            <rect x="350" y="12" width="40" height="16" rx="4" fill="#E5E7EB" className="dark:fill-gray-700" />
                          </g>
                        ))}
                        
                        {/* Action buttons */}
                        <g transform="translate(360, 80)">
                          <circle cx="0" cy="0" r="12" fill="#4F46E5" opacity="0.8" className="animate-pulse" />
                          <text x="-3" y="4" className="text-xs fill-white">✎</text>
                        </g>
                      </g>
                      
                      {/* Floating data elements */}
                      <g className="animate-float">
                        <circle cx="450" cy="100" r="8" fill="#4F46E5" opacity="0.6" />
                        <circle cx="430" cy="150" r="6" fill="#7C3AED" opacity="0.6" className="animation-delay-1000" />
                        <circle cx="460" cy="200" r="7" fill="#EC4899" opacity="0.6" className="animation-delay-2000" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href="/pricing" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Pricing
              </Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} TableEditor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.8;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
