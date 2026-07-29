'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api, Item } from '../../utils/api';
import { Search, SlidersHorizontal, Sparkles, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const ITEMS_PER_PAGE = 8; // প্রতি পেজে ৮টি করে প্রোডাক্ট

// Framer Motion এনিমেশন ভ্যারিয়েন্ট
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06, // কার্ডগুলো একটা একটা করে স্মুথলি আসবে
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // Fetch items via TanStack Query
  const { data: rawItems = [], isLoading, isError } = useQuery<Item[]>({
    queryKey: ['exploreItems', categoryFilter, search],
    queryFn: () => api.getItems({ 
      category: categoryFilter || undefined, 
      search: search || undefined 
    }),
  });

  const handleCategoryChange = (slug: string) => {
    setCategoryFilter(slug);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setPage(1);
  };

  // Pagination Logic
  const totalItems = rawItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const displayedItems = rawItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header and description */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-premium/50 pb-6"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Catalogue Catalogue</h1>
          <p className="text-sm text-muted">
            Browse through our premium, handpicked female fashion clothes sorted across generations.
          </p>
        </div>
        
        {/* Quick statistics */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted bg-[#101625] px-4 py-2 rounded-lg border border-border-premium">
          <Sparkles className="h-4 w-4 text-cyan-accent" />
          <span>Showing {displayedItems.length} of {totalItems} Items</span>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="flex flex-col lg:flex-row gap-4"
      >
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
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
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                categoryFilter === cat.slug
                  ? 'bg-cyan-accent/15 border-cyan-accent text-cyan-accent shadow-lg shadow-cyan-accent/10'
                  : 'bg-card border-border-premium text-muted hover:border-gray-500 hover:text-white'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}

          {/* Reset Filters */}
          {(search || categoryFilter) && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-white hover:bg-red-950/20 border border-red-500/20 hover:border-red-500/40 transition-all"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Main Grid Content */}
      {isLoading ? (
        // Skeleton Loaders
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
        <div className="text-center py-20 bg-card border border-border-premium rounded-2xl">
          <p className="text-red-400 font-medium">Failed to retrieve clothes items.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs"
          >
            Retry Connection
          </button>
        </div>
      ) : displayedItems.length === 0 ? (
        // Empty State
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-20 bg-card border border-border-premium rounded-2xl space-y-4"
        >
          <SlidersHorizontal className="h-10 w-10 text-muted mx-auto" />
          <h3 className="text-lg font-bold text-white">No Coordinates Match Your Query</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try adjusting your search terms or age filter toggles.
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
        <>
          {/* Clothes Grid WITH Smooth AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={page + categoryFilter + search} // Key পরিবর্তনের সাথে সাথে স্মুথ এনিমেশন হবে
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {displayedItems.map((item) => (
                <motion.div
                  key={item._id}
                  variants={cardVariants}
                  whileHover={{ 
                    y: -6, 
                    transition: { duration: 0.2, ease: 'easeOut' } 
                  }}
                  className="bg-card border border-border-premium rounded-xl overflow-hidden flex flex-col h-full premium-glow-card"
                >
                  <div
                    className="h-52 bg-cover bg-center transition-transform duration-500 hover:scale-105"
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
                      {item.tags && item.tags.length > 0 && (
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
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pt-4 border-t border-border-premium/50 mt-4">
                        <span className="text-base font-extrabold text-cyan-accent">${item.price}</span>
                        <span className="text-[10px] text-muted">
                          {item.styleAttributes?.vibe ? item.styleAttributes.vibe : 'Casual Chic'}
                        </span>
                      </div>

                      <Link 
                        href={`/items/${item._id}`} 
                        className="block w-full py-2 bg-white/5 hover:bg-cyan-accent/20 border border-border-premium hover:border-cyan-accent rounded-lg text-xs font-bold text-center text-white transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Smooth Pagination Controls */}
          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 pt-8 border-t border-border-premium/40"
            >
              {/* Previous Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === 1}
                className="p-2 rounded-lg bg-card border border-border-premium text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-accent transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1.5 px-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      key={pageNumber}
                      onClick={() => {
                        setPage(pageNumber);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`h-9 w-9 rounded-lg text-xs font-bold transition-all border ${
                        page === pageNumber
                          ? 'bg-cyan-accent text-background border-cyan-accent shadow-lg shadow-cyan-accent/20'
                          : 'bg-card border-border-premium text-muted hover:text-white hover:border-gray-500'
                      }`}
                    >
                      {pageNumber}
                    </motion.button>
                  );
                })}
              </div>

              {/* Next Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setPage((prev) => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-card border border-border-premium text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-accent transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}
        </>
      )}

    </div>
  );
}