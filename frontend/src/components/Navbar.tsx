'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import { Sparkles, FolderHeart, PlusCircle, LogOut, ChevronDown, User as UserIcon, LayoutDashboard, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          {/* Main Navigation (Only Essential Links) */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive('/') ? 'text-cyan-accent bg-cyan-accent/5' : 'text-gray-300 hover:text-white'}`}>Home</Link>
            <Link href="/explore" className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive('/explore') ? 'text-cyan-accent bg-cyan-accent/5' : 'text-gray-300 hover:text-white'}`}>Explore Collection</Link>
            
            {isAuthenticated && (
              <Link href="/profile" className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${isActive('/profile') ? 'text-cyan-accent bg-cyan-accent/5' : 'text-gray-300 hover:text-white'}`}>
                <Sparkles className="h-4 w-4" /> AI Style Advisor
              </Link>
            )}
          </nav>

          {/* User Controls */}
          <div>
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-white/5 border border-border-premium px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all">
                  <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}`} alt="Avatar" className="h-7 w-7 rounded-full border border-cyan-accent/50" />
                  <span className="text-sm font-semibold text-white">{user.username}</span>
                  <ChevronDown className={`h-4 w-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-950/20 hover:text-red-300">
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
          </div>
        </div>
      </div>
    </header>
  );
}