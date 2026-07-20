'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api'; // আপনার API ইউটিলিটি
import { useAuth } from '../../providers/AuthProvider';
import { Package, PlusCircle, LayoutDashboard, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  // ইউজার তার নিজের আইটেমগুলো ফেচ করবে
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['myItems'],
    queryFn: () => api.getMyItems(), // API-তে এই মেথডটি থাকতে হবে
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 text-cyan-accent animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.username}</h1>
        <p className="text-muted mt-2">Manage your style collection and track your contributions.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-card border border-border-premium p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-accent/10 rounded-lg text-cyan-accent">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Total Added Items</p>
              <h2 className="text-2xl font-bold">{items.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-card border border-border-premium rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border-premium flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Contributions</h2>
          <Link href="/items/add" className="flex items-center gap-2 bg-cyan-accent text-background px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-accent/90">
            <PlusCircle className="h-4 w-4" /> Add New Item
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center text-muted">
            <p>You haven't added any items yet.</p>
            <Link href="/items/add" className="text-cyan-accent hover:underline mt-2 inline-block">Start adding items now</Link>
          </div>
        ) : (
          <div className="divide-y divide-border-premium">
            {items.map((item: any) => (
              <div key={item._id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-xs text-muted">{item.category} • ${item.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Link href={`/items/manage`} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-border-premium">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}