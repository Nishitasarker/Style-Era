'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import { authClient } from '../lib/auth-client'; 
import { Sparkles, FolderHeart, PlusCircle, LogOut, ChevronDown, User as UserIcon, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser, logout: authLogout, isAuthenticated: authIsAuthenticated } = useAuth();
  
  const { data: session } = authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // পারফেক্ট লগআউট হ্যান্ডলার: সেশন ক্লিয়ার করে হোমপেজে রিডাইরেক্ট করবে
  const handleLogout = async () => {
    try {
      await authLogout(); // AuthProvider এর লগআউট
      await authClient.signOut(); // Better-auth এর নিজস্ব সাইনআউট
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsOpen(false);
      setIsMobileMenuOpen(false);
      // সেশনের সমস্ত ক্যাশ মুছে ফেলে একদম ফ্রেশ লগইন স্টেট ফিরিয়ে আনতে পেজ রিলোড সহ হোমপেজে পাঠানো
      window.location.href = '/';
    }
  };
  
  const isAuthenticated = authIsAuthenticated || !!session?.user;
  const user = authUser || session?.user;

  const isActive = (path: string) => pathname === path;

  // বাইরে ক্লিক করলে ড্রপডাউন ও মোবাইল মেনু বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // পেজ চেঞ্জ হলে মোবাইল মেনু অটো বন্ধ হয়ে যাবে
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full glass-nav border-b border-border-premium/50 bg-[#050a18]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-accent/10 border border-cyan-accent/30 group-hover:border-cyan-accent transition-all duration-300">
              <Sparkles className="h-5 w-5 text-cyan-accent" />
            </div>
            <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-white via-cyan-accent to-teal-accent bg-clip-text text-transparent">
              STYLE ERA
            </span>
          </Link>

          {/* Main Navigation (Desktop Only) */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive('/') ? 'text-cyan-accent bg-cyan-accent/5' : 'text-gray-300 hover:text-white'}`}>Home</Link>
            <Link href="/explore" className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive('/explore') ? 'text-cyan-accent bg-cyan-accent/5' : 'text-gray-300 hover:text-white'}`}>Explore Collection</Link>
            
            {isAuthenticated && (
              <Link href="/profile" className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${isActive('/profile') ? 'text-cyan-accent bg-cyan-accent/5' : 'text-gray-300 hover:text-white'}`}>
                <Sparkles className="h-4 w-4" /> AI Style Advisor
              </Link>
            )}
          </nav>

          {/* User Controls & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-white/5 border border-border-premium px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all">
                  <img src={(user as any).image || (user as any).avatarUrl || `https://ui-avatars.com/api/?name=${user.name || user.username || 'User'}`} alt="Avatar" className="h-7 w-7 rounded-full border border-cyan-accent/50" />                 <ChevronDown className={`h-4 w-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#0B101F] border border-border-premium rounded-xl shadow-xl py-1 z-50 overflow-hidden">
                    <Link href="/dashboard" className={`flex items-center gap-2 px-4 py-2.5 text-xs ${isActive('/dashboard') ? 'text-cyan-accent bg-white/5' : 'text-gray-300'} hover:bg-white/5 hover:text-white`}>
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/items/add" className={`flex items-center gap-2 px-4 py-2.5 text-xs ${isActive('/items/add') ? 'text-cyan-accent bg-white/5' : 'text-gray-300'} hover:bg-white/5 hover:text-white`}>
                      <PlusCircle className="h-4 w-4" /> Add Item
                    </Link>
                    <Link href="/items/manage" className={`flex items-center gap-2 px-4 py-2.5 text-xs ${isActive('/items/manage') ? 'text-cyan-accent bg-white/5' : 'text-gray-300'} hover:bg-white/5 hover:text-white`}>
                      <FolderHeart className="h-4 w-4" /> Manage Items
                    </Link>
                    <div className="h-px bg-border-premium my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-950/20 hover:text-red-300">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-accent to-teal-accent text-background px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-[1.02]">
                Login / Register
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-border-premium text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sidebar / Dropdown Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden absolute top-full left-0 w-full bg-[#050a18]/95 border-b border-border-premium backdrop-blur-xl px-4 py-5 space-y-3 shadow-2xl z-40">
          <nav className="flex flex-col space-y-1">
            <Link href="/" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/') ? 'text-cyan-accent bg-cyan-accent/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
              Home
            </Link>
            <Link href="/explore" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/explore') ? 'text-cyan-accent bg-cyan-accent/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
              Explore Collection
            </Link>
            {isAuthenticated && (
              <Link href="/profile" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isActive('/profile') ? 'text-cyan-accent bg-cyan-accent/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                <Sparkles className="h-4 w-4 text-cyan-accent" /> AI Style Advisor
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}