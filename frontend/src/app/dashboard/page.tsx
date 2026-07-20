'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Item } from '../../utils/api';
import { useAuth } from '../../providers/AuthProvider';
import { Package, PlusCircle, LayoutDashboard, Loader2, FolderTree } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  // সরাসরি ইউজারের নিজের আইটেমগুলো ফেচ করবে
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ['myItems'],
    queryFn: () => api.getMyItems(),
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 text-cyan-accent animate-spin" />
    </div>
  );

  // ক্যাটাগরি হিসাব করা
  const uniqueCategories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.username || 'User'}</h1>
        <p className="text-muted mt-1">Manage your style collection and track your contributions.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border-premium p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-cyan-accent/10 rounded-xl text-cyan-accent">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider font-semibold">Total Added Products</p>
            <h2 className="text-3xl font-bold text-white mt-1">{items.length}</h2>
          </div>
        </div>

        <div className="bg-card border border-border-premium p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-teal-accent/10 rounded-xl text-teal-accent">
            <FolderTree className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider font-semibold">Categories Used</p>
            <h2 className="text-3xl font-bold text-white mt-1">{uniqueCategories.length}</h2>
          </div>
        </div>
      </div>

      {/* Recent Items Preview */}
      <div className="bg-card border border-border-premium rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border-premium flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Your Recent Contributions</h2>
          <Link href="/dashboard/my-products" className="text-xs text-cyan-accent hover:underline font-semibold">
            View All
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center text-muted space-y-3">
            <p>You haven't added any products yet.</p>
            <Link href="/items/add" className="inline-flex items-center gap-2 bg-cyan-accent text-background px-4 py-2 rounded-lg text-sm font-bold">
              <PlusCircle className="h-4 w-4" /> Add New Item
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border-premium">
            {items.slice(0, 5).map((item) => (
              <div key={item._id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover border border-border-premium" />
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-xs text-muted capitalize">{item.category} • ${item.price}</p>
                  </div>
                </div>
                <Link href={`/items/edit/${item._id}`} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-border-premium text-gray-300">
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}