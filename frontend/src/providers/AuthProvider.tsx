'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, User } from '../utils/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('style_era_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getCurrentUser();
        setUser(data.user);
      } catch (err) {
        console.warn('Failed to load user session, clearing token:', err);
        localStorage.removeItem('style_era_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await api.login(credentials);
      localStorage.setItem('style_era_token', data.token);
      setUser(data.user);
      setLoading(false); // <-- এখানে ফিক্স করা হয়েছে
      router.push('/');
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const data = await api.register(userData);
      localStorage.setItem('style_era_token', data.token);
      setUser(data.user);
      setLoading(false); // <-- এখানে ফিক্স করা হয়েছে
      router.push('/');
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('style_era_token');
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}