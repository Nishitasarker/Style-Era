'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Item } from '../../utils/api';
import { useAuth } from '../../providers/AuthProvider';
import { Package, PlusCircle, Loader2, FolderTree, Database } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  // ইউজারের নিজস্ব আইটেমগুলো সেফলি ফেচ করার জন্য
  const { data: myItems = [], isLoading: myItemsLoading } = useQuery<Item[]>({
    queryKey: ['myItems'],
    queryFn: async () => {
      try {
        const res = await api.getMyItems();
        if (Array.isArray(res)) return res;
        if (res && Array.isArray((res as any).items)) return (res as any).items;
        if (res && Array.isArray((res as any).data)) return (res as any).data;
        return [];
      } catch (error) {
        console.error('Failed to fetch my items:', error);
        return [];
      }
    },
  });

  // প্ল্যাটফর্মের সব প্রোডাক্ট (টোটাল প্রোডাক্ট কাউন্ট করার জন্য) ফেচ করার জন্য
  const { data: allItems = [], isLoading: allItemsLoading } = useQuery<Item[]>({
    queryKey: ['exploreItems'],
    queryFn: async () => {
      try {
        const res = await api.getItems();
        if (Array.isArray(res)) return res;
        if (res && Array.isArray((res as any).items)) return (res as any).items;
        if (res && Array.isArray((res as any).data)) return (res as any).data;
        return [];
      } catch (error) {
        console.error('Failed to fetch all items:', error);
        return [];
      }
    },
  });

  const isLoading = myItemsLoading || allItemsLoading;

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 text-cyan-accent animate-spin" />
    </div>
  );

  // ক্যাটাগরি হিসাব করা (ইউজারের আইটেমগুলোর ওপর ভিত্তি করে)
  const uniqueCategories = Array.from(new Set(myItems.map((i) => i.category).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.username || 'User'}</h1>
        <p className="text-muted mt-1">Manage your style collection and track your contributions.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products (Platform-wide) */}
        <div className="bg-card border border-border-premium p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider font-semibold">Total Products</p>
            <h2 className="text-3xl font-bold text-white mt-1">{allItems.length}</h2>
          </div>
        </div>

        {/* Total Added Products (User specific) */}
        <div className="bg-card border border-border-premium p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-cyan-accent/10 rounded-xl text-cyan-accent">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider font-semibold">Total Added Products</p>
            <h2 className="text-3xl font-bold text-white mt-1">{myItems.length}</h2>
          </div>
        </div>

        {/* Categories Used */}
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

        {myItems.length === 0 ? (
          <div className="p-12 text-center text-muted space-y-3">
            <p>You haven't added any products yet.</p>
            <Link href="/items/add" className="inline-flex items-center gap-2 bg-cyan-accent text-background px-4 py-2 rounded-lg text-sm font-bold">
              <PlusCircle className="h-4 w-4" /> Add New Item
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border-premium">
            {myItems.slice(0, 5).map((item) => (
              <div key={item._id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover border border-border-premium bg-white/5" />
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