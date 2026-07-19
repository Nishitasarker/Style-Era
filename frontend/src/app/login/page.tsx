'use client';

import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { authClient } from '@/lib/auth-client'; // নিশ্চিত করুন এটি সঠিক পাথে আছে
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";

const PREFERENCE_OPTIONS = [
  'casual', 'minimal', 'formal', 'boho', 'elegant', 'streetwear', 'classic', 'cotton', 'silk'
];

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        await register({ username, email, password, ageGroup, stylePreferences });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/", // লগইনের পর কোথায় যাবে
    });
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-16 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#131b2e] via-[#000000] to-[#000000]">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="h-4 w-4" />
            <span>Style Advisor Access</span>
          </motion.div>
        </div>

        <motion.div 
          layout
          transition={{ duration: 0.4 }}
          className="bg-[#0b0f19] border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-sm text-gray-400 mt-2">{isLogin ? 'Access your stylist profile' : 'Set up your fashion profile'}</p>
          </div>

          {error && <div className="mb-6 p-3 rounded-lg bg-red-900/20 border border-red-500/20 text-red-400 text-xs text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                  <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#131b2e] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500" placeholder="Aurelia" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#131b2e] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500" placeholder="you@example.com" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#131b2e] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500" placeholder="••••••••" />
              </div>
            </div>

            {/* AI Preferences (Only for registration) */}
            {!isLogin && (
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Style Preferences</label>
                <div className="flex flex-wrap gap-1.5">
                  {PREFERENCE_OPTIONS.map((pref) => (
                    <button key={pref} type="button" onClick={() => handlePrefToggle(pref)} className={`px-2 py-1 rounded-md text-[10px] capitalize border ${stylePreferences.includes(pref) ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-[#131b2e] border-gray-700 text-gray-500'}`}>
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all mt-4">
              {loading ? 'Processing...' : isLogin ? 'Access Advisor' : 'Create Profile'}
            </button>
          </form>

          {/* Google Login with custom theme */}

          <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold mx-20 pt-2 text-gray-400 hover:text-cyan-400 transition-colors">
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Log in'}
            </button>

         
          <div className="text-center mt-3 pt-3 border-t border-gray-800">
            
             <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mt-4 py-2.5 flex items-center justify-center gap-2 bg-[#131b2e] border border-gray-700 text-gray-300 rounded-lg hover:bg-[#1a253d] transition-all font-medium text-sm"
          >
            <FcGoogle className="h-4 w-4" /> Continue with Google
          </button>


          </div>
        </motion.div>
      </div>
    </div>
  );
}