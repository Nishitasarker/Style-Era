'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../providers/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../utils/api';
import { Shirt, Plus, Sparkles, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AddItemPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'child' | 'young' | 'old'>('young');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  
  // Style Attributes
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [vibe, setVibe] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Mutation to add item
  const addItemMutation = useMutation({
    mutationFn: (body: any) => api.addItem(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exploreItems'] });
      setSuccess(true);
      setTimeout(() => {
        router.push('/items/manage');
      }, 1500);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to upload wardrobe garment.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !description || !category || !price || !imageUrl) {
      setError('Please fill in all required inputs.');
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please provide a valid positive price.');
      return;
    }

    const tagList = tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    addItemMutation.mutate({
      name,
      description,
      category,
      price: priceNum,
      imageUrl,
      tags: tagList,
      color: color || undefined,
      material: material || undefined,
      vibe: vibe || undefined
    });
  };

  // Render loading state
  if (authLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-cyan-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Auth Protection Panel
  if (!isAuthenticated) {
    return (
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-card border border-border-premium rounded-2xl p-8 text-center space-y-6">
          <AlertCircle className="h-12 w-12 text-cyan-accent mx-auto" />
          <h2 className="text-xl font-bold text-white">Wardrobe Access Locked</h2>
          <p className="text-sm text-muted">
            You must be logged into your Style Era profile to upload custom styling pieces and coordinate them using our AI systems.
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
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/items/manage"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-cyan-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Manage Wardrobe</span>
        </Link>
      </div>

      <div className="bg-card border border-border-premium rounded-2xl p-8 shadow-xl shadow-cyan-accent/5">
        <div className="flex items-center gap-3 border-b border-border-premium/50 pb-5 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent">
            <Shirt className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Add Wardrobe Item</h1>
            <p className="text-xs text-muted">Upload custom garment details to make them queryable by the AI advisor.</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-teal-accent mx-auto animate-bounce" />
            <h2 className="text-xl font-bold text-white">Garment Catalogued!</h2>
            <p className="text-sm text-muted">Redirecting back to your collection dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Garment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classic Trench Coat"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Category Demographic *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2.5 px-4 text-sm text-white outline-none transition-all"
                >
                  <option value="child">Child (Ages 2 - 12)</option>
                  <option value="young">Youth / Young (Ages 13 - 50)</option>
                  <option value="old">Elderly / Senior (Ages 50+)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Price ($ USD) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 85"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Search Tags (Comma separated)</label>
                <span className="text-[10px] text-muted">e.g. linen, boho, formal, evening</span>
              </div>
              <input
                type="text"
                placeholder="linen, formal, comfort, white"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 outline-none transition-all"
              />
            </div>

            {/* Extra Styling Parameters */}
            <div className="border-t border-border-premium/50 pt-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-cyan-accent" />
                Extra Style Attributes (Optional)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted font-medium">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Navy Blue"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2 px-3 text-xs text-white placeholder-gray-700 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted font-medium">Material</label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Silk"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2 px-3 text-xs text-white placeholder-gray-700 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted font-medium">Style Vibe</label>
                  <input
                    type="text"
                    placeholder="e.g. Minimalist Boss"
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2 px-3 text-xs text-white placeholder-gray-700 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Garment Description *</label>
              <textarea
                required
                rows={4}
                placeholder="Give details about fit, neckline, sleeve type, occasion recommendation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={addItemMutation.isPending}
              className="w-full bg-gradient-to-r from-cyan-accent to-teal-accent text-background py-3 rounded-lg font-bold tracking-wide transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              <span>{addItemMutation.isPending ? 'Cataloguing Garment...' : 'Add Wardrobe Garment'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
