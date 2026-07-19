'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Package, ChevronRight } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Products', path: '/dashboard/my-products', icon: Package },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-[#050a18]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-premium bg-card p-6 hidden md:block">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-cyan-accent/10 text-cyan-accent' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}