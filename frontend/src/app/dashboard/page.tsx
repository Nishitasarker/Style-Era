'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Item } from '../../utils/api';
import { useAuth } from '../../providers/AuthProvider';
import { Package, PlusCircle, Loader2, FolderTree, Database, PieChart as PieIcon } from 'lucide-react';
import Link from 'next/link';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// পাই চার্টের বিভিন্ন ক্যাটাগরির জন্য কালার কোড
const COLORS = ['#00e5ff', '#00b0ff', '#1de9b6', '#7c4dff', '#ff9100'];

export default function DashboardPage() {
  const { user } = useAuth();

  // প্ল্যাটফর্মের সব প্রোডাক্ট ফেচ করার জন্য
  const { data: allItems = [], isLoading: allItemsLoading } = useQuery<Item[]>({
    queryKey: ['exploreItems'],
    queryFn: () => api.getItems(),
  });

  const isLoading = allItemsLoading;

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 text-cyan-accent animate-spin" />
    </div>
  );

  // ইউজার আইডি দিয়ে নিজের প্রোডাক্টগুলো ফিল্টার করে নেওয়া
  const myItems = allItems.filter(item => item.createdBy === user?.id);

  // ক্যাটাগরি হিসাব করা (ইউজারের আইটেমগুলোর ওপর ভিত্তি করে)
  const uniqueCategories = Array.from(new Set(myItems.map((i) => i.category).filter(Boolean)));

  // পাই চার্টের জন্য ক্যাটাগরি অনুযায়ী ডাটা প্রস্তুত করা (যেমন: Child-এ কয়টি, Young-এ কয়টি ইত্যাদি)
  const categoryCountMap: Record<string, number> = {};
  myItems.forEach((item) => {
    const cat = item.category ? item.category.toUpperCase() : 'OTHER';
    categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
  });

  const chartData = Object.keys(categoryCountMap).map((cat) => ({
    name: cat,
    value: categoryCountMap[cat],
  }));

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

      {/* Visual Analytics & Recent Contributions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pie Chart Section (Category Breakdown) */}
        <div className="bg-card border border-border-premium rounded-2xl p-6 flex flex-col justify-between lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="h-5 w-5 text-cyan-accent" />
            <h2 className="text-lg font-bold text-white">Contribution Share</h2>
          </div>

          {myItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-muted text-xs">
              <p>No data available for chart</p>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="text-[11px] text-muted text-center mt-2">Breakdown of your added items by category.</p>
        </div>

        {/* Recent Items Preview Section */}
        <div className="bg-card border border-border-premium rounded-2xl overflow-hidden lg:col-span-2 flex flex-col">
          <div className="p-6 border-b border-border-premium flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Your Recent Contributions</h2>
            <Link href="/dashboard/my-products" className="text-xs text-cyan-accent hover:underline font-semibold">
              View All
            </Link>
          </div>

          {myItems.length === 0 ? (
            <div className="p-12 text-center text-muted space-y-3 flex-grow flex flex-col items-center justify-center">
              <p>You haven't added any products yet.</p>
              <Link href="/items/add" className="inline-flex items-center gap-2 bg-cyan-accent text-background px-4 py-2 rounded-lg text-sm font-bold">
                <PlusCircle className="h-4 w-4" /> Add New Item
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border-premium flex-grow">
              {myItems.slice(0, 4).map((item) => (
                <div key={item._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover border border-border-premium bg-white/5" />
                    <div>
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-xs text-muted capitalize">{item.category} • ${item.price}</p>
                    </div>
                  </div>
                  {/* <Link href={`/items/edit/${item._id}`} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-border-premium text-gray-300">
                    Edit
                  </Link> */}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}