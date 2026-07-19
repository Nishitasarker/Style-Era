'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../utils/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ItemDetailsPage() {
  const { id } = useParams() as { id: string };

  // ১. মেইন আইটেম ফেচ করা
  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['item', id],
    queryFn: () => api.getItemById(id),
  });

  // ২. ক্যাটাগরি অনুযায়ী সাজেশন ফেচ করা
  const { data: suggestions = [] } = useQuery({
    queryKey: ['suggestions', item?.category],
    queryFn: () => api.getItems({ category: item?.category }),
    enabled: !!item, // item লোড হলে তবেই এটি রান করবে
  });

  // বর্তমান আইটেমটি বাদ দিয়ে বাকি সাজেশন ফিল্টার করা
  const relatedItems = suggestions.filter((i) => i._id !== id).slice(0, 4);

  if (isLoading) return <div className="text-center py-20 text-muted">Loading details...</div>;
  if (isError || !item) return <div className="text-center py-20 text-red-400">Item not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link href="/explore" className="flex items-center gap-2 text-sm text-muted hover:text-white mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Catalogue
      </Link>

      {/* মূল প্রোডাক্ট ডিটেইলস */}
      <div className="grid md:grid-cols-2 gap-12 bg-card border border-border-premium rounded-2xl p-6">
        <div className="aspect-square rounded-xl overflow-hidden bg-white/5">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <span className="text-cyan-accent text-xs font-bold uppercase tracking-widest">{item.category}</span>
            <h1 className="text-4xl font-extrabold mt-2">{item.name}</h1>
          </div>
          <p className="text-muted leading-relaxed">{item.description}</p>

          <div className="space-y-4 border-t border-border-premium/50 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-400">Price</span>
              <span className="text-2xl font-extrabold text-cyan-accent">${item.price}</span>
            </div>
            
            {item.styleAttributes && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-[10px] text-muted uppercase">Material</p>
                  <p className="text-sm font-bold">{item.styleAttributes.material || 'N/A'}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-[10px] text-muted uppercase">Vibe</p>
                  <p className="text-sm font-bold">{item.styleAttributes.vibe || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* সাজেশন সেকশন */}
      {relatedItems.length > 0 && (
        <div className="mt-16 border-t border-border-premium pt-12">
          <h2 className="text-2xl font-bold mb-8">More {item.category} styles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedItems.map((relatedItem) => (
              <Link href={`/items/${relatedItem._id}`} key={relatedItem._id}>
                <div className="group bg-card border border-border-premium rounded-xl overflow-hidden hover:border-cyan-accent transition-all">
                  <div className="h-40 w-full overflow-hidden">
                    <img src={relatedItem.imageUrl} alt={relatedItem.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold truncate">{relatedItem.name}</h4>
                    <p className="text-cyan-accent text-xs font-bold mt-1">${relatedItem.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}