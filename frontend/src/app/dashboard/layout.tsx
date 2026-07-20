'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Package, ChevronRight, Sparkles, Menu, X, PlusCircle, FolderHeart, LogOut, Home } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // আপনার নির্দিষ্ট করা navItems অ্যারে
  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Products', path: '/dashboard/my-products', icon: Package },
    { name: 'Add Item', path: '/items/add', icon: PlusCircle },
    { name: 'Manage Items', path: '/items/manage', icon: FolderHeart },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-[#050a18] text-white">
      {/* Mobile Top Header (Small Devices) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#050a18]/90 backdrop-blur-md border-b border-border-premium px-4 flex items-center justify-between z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-accent/10 border border-cyan-accent/30">
            <Sparkles className="h-4 w-4 text-cyan-accent" />
          </div>
          <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-white via-cyan-accent to-teal-accent bg-clip-text text-transparent">
            STYLE ERA
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 border border-border-premium text-gray-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 border-r border-border-premium bg-card p-6 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0 pt-20 md:pt-6' : '-translate-x-full'}
      `}>
        <div className="space-y-6">
          {/* লোগো ও ব্র্যান্ড নেম */}
          <div className="flex items-center gap-2 px-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-accent/10 border border-cyan-accent/30">
              <Sparkles className="h-5 w-5 text-cyan-accent" />
            </div>
            <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-white via-cyan-accent to-teal-accent bg-clip-text text-transparent">
              STYLE ERA
            </span>
          </div>

          {/* মেইন নেভিগেশন লিংকস */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-cyan-accent text-background font-semibold shadow-lg shadow-cyan-accent/20' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* নিচের অংশ: Browse to Home এবং Logout বাটন */}
        <div className="space-y-2 pt-4 border-t border-border-premium">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-cyan-accent hover:bg-cyan-accent/10 transition-all border border-cyan-accent/30"
          >
            <Home className="h-5 w-5" />
            Browse to Home
          </Link>

          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* মোবাইল স্ক্রিনের জন্য ব্যাকড্রপ */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      {/* মূল কন্টেন্ট এরিয়া */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto mt-16 md:mt-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}