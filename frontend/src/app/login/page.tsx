'use client';

import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';

const PREFERENCE_OPTIONS = [
  'casual', 'minimal', 'formal', 'boho', 'elegant', 'streetwear', 'classic', 'cotton', 'silk'
];

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [ageGroup, setAgeGroup] = useState<'child' | 'young' | 'old'>('young');
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);

  const { login, register } = useAuth();

  const handlePrefToggle = (pref: string) => {
    if (stylePreferences.includes(pref)) {
      setStylePreferences(stylePreferences.filter(p => p !== pref));
    } else {
      setStylePreferences([...stylePreferences, pref]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({
          username,
          email,
          password,
          ageGroup,
          stylePreferences
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-16 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#131b2e] via-[#0b0f19] to-[#0b0f19]">
      <div className="w-full max-w-md">
        
        {/* Decorative elements */}
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="h-4 w-4 text-cyan-accent" />
            <span>Style Advisor Access</span>
          </motion.div>
        </div>

        {/* Card */}
        <motion.div 
          layout
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="bg-card border border-border-premium rounded-2xl p-8 shadow-xl shadow-cyan-accent/5 backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-muted mt-2">
              {isLogin ? 'Enter your details to access your stylist profile' : 'Set up your fashion profile to get AI curations'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted" />
                    <input
                      type="text"
                      required={!isLogin}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. Aurelia"
                      className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5 pt-2"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide block">Age Group Demographic</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['child', 'young', 'old'] as const).map((group) => (
                        <button
                          key={group}
                          type="button"
                          onClick={() => setAgeGroup(group)}
                          className={`py-2 rounded-lg text-xs font-bold capitalize transition-all border ${
                            ageGroup === group 
                              ? 'bg-cyan-accent/15 border-cyan-accent text-cyan-accent' 
                              : 'bg-[#0a0d16] border-border-premium text-muted hover:border-gray-500 hover:text-white'
                          }`}
                        >
                          {group === 'child' ? 'Child' : group === 'young' ? 'Youth' : 'Elderly'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide block">Style Preferences</label>
                    <div className="flex flex-wrap gap-1.5">
                      {PREFERENCE_OPTIONS.map((pref) => {
                        const selected = stylePreferences.includes(pref);
                        return (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => handlePrefToggle(pref)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize border transition-all ${
                              selected 
                                ? 'bg-teal-accent/15 border-teal-accent text-teal-accent' 
                                : 'bg-[#0a0d16] border-border-premium text-muted hover:border-gray-500 hover:text-white'
                            }`}
                          >
                            {selected && <Check className="h-3 w-3" />}
                            {pref}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-accent to-teal-accent text-background py-2.5 rounded-lg font-bold tracking-wide shadow-md shadow-cyan-accent/10 hover:shadow-cyan-accent/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-4 cursor-pointer"
            >
              <span>{loading ? 'Please wait...' : isLogin ? 'Access Advisor' : 'Create Profile'}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6 pt-6 border-t border-border-premium/50">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs font-medium text-cyan-accent hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Register Profile" : 'Already configured? Log in here'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
