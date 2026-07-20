'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import { api } from '../../../utils/api';
import { Loader2, CheckCircle2, User as UserIcon, Image as ImageIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.put('/users/profile', { username, avatarUrl });
      
      if (response.success || response) {
        setSuccessMessage('Profile updated successfully!');
        
        if (setUser && user) {
          setUser({ ...user, username, avatarUrl });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Profile Settings</h1>
        <p className="text-sm text-muted mt-1">Update your display name and profile picture.</p>
      </div>

      <div className="bg-card border border-border-premium rounded-2xl p-6 sm:p-8 space-y-6">
        {successMessage && (
          <div className="p-4 bg-teal-accent/10 border border-teal-accent/20 rounded-xl flex items-center gap-3 text-teal-accent text-sm">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Profile Preview */}
        <div className="flex items-center gap-4 pb-6 border-b border-border-premium">
          <div className="h-16 w-16 rounded-full bg-cover bg-center border border-border-premium bg-white/5 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="h-8 w-8 text-muted" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{username || 'Your Name'}</h3>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Display Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full bg-[#050a18] border border-border-premium rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Profile Image URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                <ImageIcon size={18} />
              </span>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-[#050a18] border border-border-premium rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-accent"
              />
            </div>
            <p className="text-[11px] text-muted mt-1.5">Provide a direct link to your image.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-accent text-background py-3 rounded-xl font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Save Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
}