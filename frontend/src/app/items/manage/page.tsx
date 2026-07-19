'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Item } from '../../../utils/api';
import { useAuth } from '../../../providers/AuthProvider';
import { FolderHeart, Plus, Trash2, Edit, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';

export default function ManageItemsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Query to fetch all items
  const { data: items = [], isLoading, isError } = useQuery<Item[]>({
    queryKey: ['exploreItems'],
    queryFn: () => api.getItems(),
  });

  // Mutation to delete item
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exploreItems'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete garment.');
    }
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this custom wardrobe item?')) {
      deleteMutation.mutate(id);
    }
  };

  // Render loading state
  if (authLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-cyan-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Auth lock
  if (!isAuthenticated) {
    return (
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-card border border-border-premium rounded-2xl p-8 text-center space-y-6">
          <AlertCircle className="h-12 w-12 text-cyan-accent mx-auto" />
          <h2 className="text-xl font-bold text-white">Wardrobe Access Locked</h2>
          <p className="text-sm text-muted">
            You must be logged into your Style Era profile to view and manage custom styling pieces.
          </p>
          <Link
            href="/login"
            className="block w-full text-center bg-cyan-accent text-background py-2.5 rounded-lg font-bold hover:scale-[1.01] transition-transform"
          >
            Access Login / Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-premium/50 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FolderHeart className="h-6 w-6 text-cyan-accent" />
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Collections</h1>
          </div>
          <p className="text-sm text-muted">
            View the store catalog and manage custom garments uploaded by your account.
          </p>
        </div>

        <Link
          href="/items/add"
          className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-accent to-teal-accent text-background px-4 py-2.5 rounded-lg text-sm font-bold shadow-md hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Custom Garment</span>
        </Link>
      </div>

      {/* List content */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 w-full rounded-xl skeleton-shimmer border border-border-premium" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-card border border-premium-border rounded-xl">
          <p className="text-red-400">Error loading catalog details.</p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Custom user items */}
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-cyan-accent" />
              Your Uploaded Garments ({items.filter(item => item.createdBy === user?.id).length})
            </h2>
            
            {items.filter(item => item.createdBy === user?.id).length === 0 ? (
              <div className="text-center py-10 bg-card/45 border border-dashed border-border-premium rounded-xl space-y-3">
                <p className="text-xs text-muted">You haven't uploaded any custom items yet.</p>
                <Link
                  href="/items/add"
                  className="inline-flex items-center gap-1 text-xs text-cyan-accent font-bold hover:underline"
                >
                  Upload your first dress coordinates <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {items
                  .filter(item => item.createdBy === user?.id)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="bg-card border border-border-premium rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="h-16 w-16 rounded-lg bg-cover bg-center border border-border-premium flex-shrink-0"
                          style={{ backgroundImage: `url(${item.imageUrl})` }}
                        />
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-white leading-snug">{item.name}</h3>
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-[10px] bg-cyan-accent/10 border border-cyan-accent/20 px-2 py-0.5 rounded text-cyan-accent uppercase font-bold tracking-wider">
                              {item.category === 'child' ? 'Child' : item.category === 'young' ? 'Youth' : 'Elderly'}
                            </span>
                            <span className="text-xs text-teal-accent font-bold">${item.price}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-white bg-red-950/20 border border-red-500/25 hover:border-red-500 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Seeded items */}
          <div className="pt-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Seeded Store Collections ({items.filter(item => !item.createdBy).length})
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {items
                .filter(item => !item.createdBy)
                .map((item) => (
                  <div
                    key={item._id}
                    className="bg-[#0b0f19]/40 border border-border-premium/50 rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-12 w-12 rounded-lg bg-cover bg-center border border-border-premium/50 opacity-80 flex-shrink-0"
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-300">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-400 capitalize">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-400">${item.price}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted border border-border-premium px-2.5 py-1 rounded-lg">
                      Store Seed Item
                    </span>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
