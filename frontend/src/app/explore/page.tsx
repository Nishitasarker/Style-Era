'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api, Item } from '../../utils/api';
import { Search, SlidersHorizontal, Sparkles, X, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Fetch items via TanStack Query
  const { data: items = [], isLoading, isError } = useQuery<Item[]>({
    queryKey: ['exploreItems', categoryFilter, search],
    queryFn: () => api.getItems({ 
      category: categoryFilter || undefined, 
      search: search || undefined 
    }),
  });

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header and description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-premium/50 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Catalogue Catalogue</h1>
          <p className="text-sm text-muted">
            Browse through our premium, handpicked female fashion clothes sorted across generations.
          </p>
        </div>
        
        {/* Quick statistics */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted bg-[#101625] px-4 py-2 rounded-lg border border-border-premium">
          <Sparkles className="h-4 w-4 text-cyan-accent" />
          <span>Showing {items.length} Curated Items</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dresses, linen, satin slip, tags..."
            className="w-full bg-card border border-border-premium focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'All Categories', slug: '' },
            { label: 'Child', slug: 'child' },
            { label: 'Youth/Young', slug: 'young' },
            { label: 'Elderly/Senior', slug: 'old' }
          ].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCategoryFilter(cat.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                categoryFilter === cat.slug
                  ? 'bg-cyan-accent/15 border-cyan-accent text-cyan-accent'
                  : 'bg-card border-border-premium text-muted hover:border-gray-500 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Reset Filters */}
          {(search || categoryFilter) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-white hover:bg-red-950/20 border border-red-500/20 hover:border-red-500/40 transition-all"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Content */}
      {isLoading ? (
        // Responsive Grid with Skeleton Loaders
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="bg-card border border-border-premium rounded-xl overflow-hidden h-[380px] flex flex-col space-y-4"
            >
              <div className="h-52 w-full skeleton-shimmer" />
              <div className="p-5 flex-grow space-y-3">
                <div className="h-3.5 w-2/3 rounded bg-border-premium skeleton-shimmer" />
                <div className="h-3 w-full rounded bg-border-premium skeleton-shimmer" />
                <div className="h-3 w-5/6 rounded bg-border-premium skeleton-shimmer" />
                <div className="flex items-center justify-between pt-4 border-t border-border-premium/50">
                  <div className="h-4 w-12 rounded bg-border-premium skeleton-shimmer" />
                  <div className="h-4 w-16 rounded bg-border-premium skeleton-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-card border border-premium-border rounded-2xl">
          <p className="text-red-400 font-medium">Failed to retrieve clothes items.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs"
          >
            Retry Connection
          </button>
        </div>
      ) : items.length === 0 ? (
        // Empty State
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-card border border-premium-border rounded-2xl space-y-4"
        >
          <SlidersHorizontal className="h-10 w-10 text-muted mx-auto" />
          <h3 className="text-lg font-bold text-white">No Coordinates Match Your Query</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try adjusting your search terms or age filter toggles. Registered users can add custom items to style.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-border-premium rounded-lg text-xs font-semibold"
            >
              Reset Filters
            </button>
            <Link
              href="/items/add"
              className="flex items-center gap-1 bg-cyan-accent text-background px-4 py-2 rounded-lg text-xs font-bold"
            >
              <Plus className="h-4 w-4" /> Add Item
            </Link>
          </div>
        </motion.div>
      ) : (
        // Clothes Grid (4 cards per row on desktop)
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                layout
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-border-premium rounded-xl overflow-hidden flex flex-col h-full premium-glow-card"
              >
                <div
                  className="h-52 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                      {item.category === 'child' ? 'Child' : item.category === 'young' ? 'Youth' : 'Elderly'}
                    </span>
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">{item.description}</p>
                    
                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] text-cyan-accent border border-cyan-accent/20 bg-cyan-accent/5 px-2 py-0.5 rounded-full capitalize"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing footer */}
                 <div className="flex items-center justify-between pt-4 border-t border-border-premium/50 mt-4">
  <span className="text-base font-extrabold text-cyan-accent">${item.price}</span>
  <span className="text-[10px] text-muted">
    {item.styleAttributes?.vibe ? item.styleAttributes.vibe : 'Casual Chic'}
  </span>
</div>

{/* এই অংশটি যোগ করুন */}
<Link 
  href={`/items/${item._id}`} 
  className="mt-4 w-full py-2 bg-white/5 hover:bg-cyan-accent/20 border border-border-premium hover:border-cyan-accent rounded-lg text-xs font-bold text-center text-white transition-all"
>
  View Details
</Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
}
