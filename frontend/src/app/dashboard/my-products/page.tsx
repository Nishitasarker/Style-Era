'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Item } from '../../../utils/api';
import { useAuth } from '../../../providers/AuthProvider';
import { Trash2, Edit, Plus, PackageOpen, Loader2 } from 'lucide-react';
import EditItemModal from '../../../components/EditItemModal'; 

export default function MyProductsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItemToEdit, setSelectedItemToEdit] = useState<Item | null>(null);

   const { data: allItems = [], isLoading } = useQuery<Item[]>({
    queryKey: ['exploreItems'],
    queryFn: () => api.getItems(),
  });

    const items = allItems.filter(item => {
    if (!user || (!user.id && !(user as any)._id)) return false;
    if (!item.createdBy) return false; // ব্যাকএন্ডের ডিফল্ট প্রোডাক্টগুলোতে createdBy না থাকায় সেগুলো বাদ যাবে

    const userId = user.id || (user as any)._id;
    return String(item.createdBy) === String(userId);
  });

 
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exploreItems'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete item.');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenEdit = (item: Item) => {
    setSelectedItemToEdit(item);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-cyan-accent animate-spin" />
      </div>
    );
  }

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

      {items.length === 0 ? (
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
                <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-xl object-cover border border-border-premium bg-white/5" />
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
                {/* Edit Button - Opens Modal */}
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-blue-400 border border-border-premium transition-colors cursor-pointer"
                  title="Edit Product"
                >
                  <Edit size={16} />
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500 rounded-lg text-red-400 hover:text-white border border-red-500/20 transition-colors cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal Component */}
      <EditItemModal 
        item={selectedItemToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItemToEdit(null);
        }}
      />
    </div>
  );
}