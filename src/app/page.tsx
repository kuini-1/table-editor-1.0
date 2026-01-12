'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Search, Filter, Sparkles, Zap, Shield, Database, Users, Clock, Download, Moon, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(useTransform(mouseX, (latest) => latest / 20), springConfig);
  const y = useSpring(useTransform(mouseY, (latest) => latest / 20), springConfig);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setShowEditDialog(true);
      setTimeout(() => setShowEditDialog(false), 4000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const tableData = [
    { id: '1', tblidx: 1001, wsznametext: 'Weapon Merchant', bysell_type: 1, tab_name: 'Weapons', dwneedmileage: 0 },
    { id: '2', tblidx: 1002, wsznametext: 'Armor Merchant', bysell_type: 2, tab_name: 'Armor', dwneedmileage: 100 },
    { id: '3', tblidx: 1003, wsznametext: 'Item Merchant', bysell_type: 3, tab_name: 'Items', dwneedmileage: 50 },
  ];

  const features = [
    {
      icon: Database,
      title: '60+ DBO Table Types',
      description: 'Edit items, skills, NPCs, quests, merchants, dungeons, dragon balls, vehicles, and all DBO game data tables.',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      delay: 0
    },
    {
      icon: Users,
      title: 'Team Permissions',
      description: 'Perfect for server teams. Set default permissions per user and override per-table. Control who can edit items, skills, NPCs, and more.',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      delay: 0.1
    },
    {
      icon: Clock,
      title: 'Change History',
      description: 'Track every edit to your DBO tables. See who modified items, skills, or NPCs and when. Perfect for debugging and rollbacks.',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      delay: 0.2
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for large DBO tables (70k+ rows). Smart filtering, pagination, and debounced search for instant results even with massive datasets.',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      delay: 0.3
    },
    {
      icon: Download,
      title: 'Export & Import',
      description: 'Export your DBO table files for backup or server deployment. Import data in bulk to quickly populate tables or migrate between servers.',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      delay: 0.4
    },
    {
      icon: Search,
      title: 'Smart Search & Filter',
      description: 'Find any item, skill, or NPC instantly. Filter by text, numbers, booleans with debounced search. Pin your most-used DBO tables.',
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      delay: 0.5
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Keep your DBO server data safe. Row-level security, role-based access control, and secure authentication. Your tables are protected.',
      gradient: 'from-teal-500 via-cyan-500 to-blue-500',
      delay: 0.6
    },
    {
      icon: Moon,
      title: 'Dark Mode',
      description: 'Beautiful dark mode support for comfortable viewing in any lighting condition.',
      gradient: 'from-violet-500 via-purple-500 to-indigo-500',
      delay: 0.7
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden">
      {/* Modern Navbar with Glassmorphism */}
      <header className="fixed w-full top-0 z-50">
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50"></div>
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between relative">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            DBO Table Editor
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/pricing" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="relative px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section - Asymmetric Modern Design */}
        <section 
          className="relative min-h-screen flex items-center pt-20 overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              style={{ x, y }}
              className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
            />
            <motion.div
              style={{ x: useTransform(x, (v) => -v), y: useTransform(y, (v) => -v) }}
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Content - Takes 7 columns */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-7 space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={mounted ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-indigo-200/50 dark:border-indigo-800/50 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Dragon Ball Online Table Editor
                  </span>
                </motion.div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight">
                  <span className="block text-gray-900 dark:text-white mb-2">Edit DBO</span>
                  <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Table Files
                  </span>
                  <span className="block text-gray-900 dark:text-white mt-2">Like Never Before</span>
            </h1>

                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                  The ultimate table editor for Dragon Ball Online private servers. Manage items, skills, NPCs, quests, and 60+ game tables with powerful tools designed for server owners.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/register"
                    className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg overflow-hidden shadow-2xl shadow-indigo-500/50"
              >
                    <span className="relative z-10 flex items-center gap-2">
                Start for Free
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
              </Link>
              <Link
                href="#features"
                    className="px-8 py-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-semibold text-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                    Explore Features
              </Link>
            </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 pt-8">
                  {[
                    { value: '60+', label: 'Table Types' },
                    { value: '70k+', label: 'Rows Supported' },
                    { value: '100%', label: 'Secure' }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={mounted ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex flex-col"
                    >
                      <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
            </div>
              </motion.div>
              
              {/* Right Side - Table Preview with 3D Effect */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: -15 }}
                animate={mounted ? { opacity: 1, x: 0, rotateY: 0 } : {}}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5 relative"
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="relative"
                >
                  {/* Glassmorphism Card */}
                  <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 p-6 overflow-hidden">
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
                    
                  {/* Table Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Merchant Table</h3>
                        <span className="px-3 py-1 text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full">
                          60+ rows
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                    <div className="space-y-2">
                        {tableData.map((row, idx) => (
                        <motion.div
                            key={row.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={mounted ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.6 + idx * 0.1 }}
                          className="group p-3 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4 text-sm">
                            <div className="w-12 text-gray-500 dark:text-gray-400 font-mono">{row.tblidx}</div>
                            <div className="flex-1 font-medium text-gray-900 dark:text-white">{row.wsznametext}</div>
                            <div className="w-20 text-right text-gray-600 dark:text-gray-400">{row.bysell_type}</div>
                            <div className="w-24 text-right text-gray-600 dark:text-gray-400">{row.tab_name}</div>
                              </div>
                        </motion.div>
                        ))}
                </div>

                    {/* Edit Dialog */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: showEditDialog ? 1 : 0,
                        scale: showEditDialog ? 1 : 0.9,
                    y: showEditDialog ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                      className={`absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-2xl ${showEditDialog ? 'pointer-events-auto' : 'pointer-events-none'}`}
                >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Merchant</h3>
                    <button 
                      onClick={() => setShowEditDialog(false)}
                          className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-4">
                        {['Name', 'Sell Type', 'Tab Name', 'Need Mileage'].map((field, i) => (
                          <div key={i}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field}</label>
                      <input 
                              type={field === 'Sell Type' || field === 'Need Mileage' ? 'number' : 'text'}
                              defaultValue={field === 'Name' ? 'Weapon Merchant' : field === 'Tab Name' ? 'Weapons' : '1'}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                        ))}
                        <div className="flex gap-3 pt-2">
                          <button className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all">
                        Save
                      </button>
                      <button 
                        onClick={() => setShowEditDialog(false)}
                            className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - Modern Grid with Glassmorphism */}
        <section id="features" className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/50 to-transparent dark:via-gray-900/50"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="inline-block px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6">
                Powerful Features
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
                <span className="text-gray-900 dark:text-white">Everything for </span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  DBO Servers
                </span>
            </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Manage all your Dragon Ball Online table files with powerful editing tools
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                    transition={{ delay: feature.delay, duration: 0.5 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    <div className="relative h-full p-6 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 hover:border-indigo-300/50 dark:hover:border-indigo-700/50 transition-all">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                </p>
                    </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section - Refined Design with Radix UI */}
        <section className="relative py-32 overflow-hidden">
          {/* Subtle background instead of blinding gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-indigo-50/30 to-white dark:from-gray-900 dark:via-indigo-950/30 dark:to-gray-950"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)]"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Left Card - Main CTA */}
                <Card className="relative overflow-hidden border-2 border-indigo-200/50 dark:border-indigo-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                  <CardHeader className="relative">
                    <Badge className="w-fit mb-4 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                      Get Started Today
                    </Badge>
                    <CardTitle className="text-4xl md:text-5xl font-extrabold mb-4">
                      Ready to Master Your{' '}
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        DBO Server?
                      </span>
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                      Join DBO private server owners using DBO Table Editor to manage 60+ game tables with advanced permissions and real-time collaboration.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                        <Link href="/register" className="flex items-center gap-2">
                          Start Your Free Trial
                          <motion.svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </motion.svg>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg">
                        <Link href="/pricing">View Pricing</Link>
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex flex-wrap gap-4">
                      {[
                        { icon: Check, text: 'No credit card' },
                        { icon: Check, text: '3-day free trial' },
                        { icon: Check, text: 'Cancel anytime' }
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>{item.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Right Card - Features Highlight */}
                <Card className="border-2 border-indigo-200/50 dark:border-indigo-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Why Choose DBO Table Editor?</CardTitle>
                    <CardDescription>
                      Everything you need to manage your server tables
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { icon: Database, text: '60+ DBO Table Types' },
                      { icon: Users, text: 'Team Collaboration' },
                      { icon: Shield, text: 'Secure & Reliable' },
                      { icon: Zap, text: 'Lightning Fast Performance' }
                    ].map((feature, i) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{feature.text}</span>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 dark:bg-black border-t border-gray-800">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} DBO Table Editor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
