'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Item } from '../../../utils/api';
import { Trash2, Edit, Plus, PackageOpen } from 'lucide-react';

export default function MyProductsPage() {
  const queryClient = useQueryClient();

  // ইউজারের নিজের প্রোডাক্ট ফেচ করার জন্য সঠিক api.getMyItems ব্যবহার করা হলো
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ['myItems'],
    queryFn: () => api.getMyItems(),
  });

  // ডিলিট মিউটেশন
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myItems'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete item.');
    }
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center border-b border-border-premium/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Products</h1>
          <p className="text-sm text-muted mt-1">Manage, edit, or delete the products you have added.</p>
        </div>
        <Link
          href="/items/add"
          className="flex items-center gap-2 bg-cyan-accent text-background px-4 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 w-full rounded-xl bg-card border border-border-premium animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-card border border-dashed border-border-premium rounded-2xl space-y-4">
          <PackageOpen className="h-12 w-12 text-muted mx-auto" />
          <p className="text-muted text-sm">You haven't added any products yet.</p>
          <Link href="/items/add" className="inline-block text-cyan-accent font-bold text-sm hover:underline">
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border-premium rounded-2xl overflow-hidden divide-y divide-border-premium">
          {items.map((item) => (
            <div key={item._id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-xl object-cover border border-border-premium" />
                <div>
                  <h3 className="font-bold text-white text-base">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-cyan-accent/10 border border-cyan-accent/20 px-2 py-0.5 rounded text-cyan-accent uppercase font-bold">
                      {item.category}
                    </span>
                    <span className="text-xs text-teal-accent font-semibold">${item.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/items/edit/${item._id}`}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-blue-400 border border-border-premium transition-colors"
                  title="Edit Product"
                >
                  <Edit size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500 rounded-lg text-red-400 hover:text-white border border-red-500/20 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}