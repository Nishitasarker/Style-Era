'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../utils/api';
import { Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

export default function MyProductsPage() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ['myItems'], queryFn: () => api.getMyItems() });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myItems'] })
  });

  return (
    <div className="bg-card border border-border-premium rounded-2xl overflow-hidden">
      {items.map((item: any) => (
        <div key={item._id} className="p-4 flex items-center justify-between border-b border-border-premium">
          <div className="flex items-center gap-4">
            <img src={item.imageUrl} className="h-16 w-16 rounded-lg object-cover" />
            <span className="font-medium">{item.name}</span>
          </div>
          <div className="flex gap-2">
            <Link href={`/items/edit/${item._id}`} className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Edit size={18}/></Link>
            <button onClick={() => deleteMutation.mutate(item._id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 size={18}/></button>
          </div>
        </div>
      ))}
    </div>
  );
}