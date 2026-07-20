'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Item } from '../utils/api';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface EditItemModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditItemModal({ item, isOpen, onClose }: EditItemModalProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'child' | 'young' | 'old'>('young');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [vibe, setVibe] = useState('');

  const [error, setError] = useState('');

  // আইটেম সিলেক্ট হলে স্টেট ফিলআপ করে নেওয়া
  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setDescription(item.description || '');
      setCategory(item.category || 'young');
      setPrice(item.price ? item.price.toString() : '');
      setImageUrl(item.imageUrl || '');
      setTags(item.tags ? item.tags.join(', ') : '');
      setColor(item.styleAttributes?.color || '');
      setMaterial(item.styleAttributes?.material || '');
      setVibe(item.styleAttributes?.vibe || '');
      setError('');
    }
  }, [item]);

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (updatedData: any) => api.updateItem(item!._id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exploreItems'] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to update garment.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setError('');

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please provide a valid positive price.');
      return;
    }

    const tagList = tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    updateMutation.mutate({
      name,
      description,
      category,
      price: priceNum,
      imageUrl,
      tags: tagList,
      styleAttributes: {
        color: color || undefined,
        material: material || undefined,
        vibe: vibe || undefined,
      },
    });
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-card border border-border-premium rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-border-premium/50 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Wardrobe Garment</h2>
            <p className="text-xs text-muted">Update your collection details seamlessly.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-muted hover:text-white bg-white/5 p-2 rounded-lg border border-border-premium"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Garment Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2 px-3 text-sm text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Category Demographic *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2 px-3 text-sm text-white outline-none"
              >
                <option value="child">Child (Ages 2 - 12)</option>
                <option value="young">Youth / Young (Ages 13 - 50)</option>
                <option value="old">Elderly / Senior (Ages 50+)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Price ($ USD) *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2 px-3 text-sm text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Image URL *</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2 px-3 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Search Tags (Comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2 px-3 text-sm text-white outline-none"
            />
          </div>

          {/* Extra Attributes */}
          <div className="border-t border-border-premium/50 pt-3 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-cyan-accent" />
              Extra Style Attributes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-1.5 px-3 text-xs text-white outline-none"
              />
              <input
                type="text"
                placeholder="Material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-1.5 px-3 text-xs text-white outline-none"
              />
              <input
                type="text"
                placeholder="Style Vibe"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-1.5 px-3 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-lg py-2 px-3 text-sm text-white outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs bg-white/5 border border-border-premium text-gray-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-cyan-accent text-background flex items-center gap-1.5 disabled:opacity-50"
            >
              {updateMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}