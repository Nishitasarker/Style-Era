'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Home, ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center space-y-8 bg-card border border-border-premium p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl">
        
        {/* Background Glowing Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-accent/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Icon Badge */}
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent mx-auto shadow-inner">
          <Sparkles className="h-8 w-8 animate-pulse" />
        </div>

        {/* Error Code & Heading */}
        <div className="space-y-3">
          <h1 className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-white via-cyan-accent to-teal-accent bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Oops! This Style Page Doesn't Exist
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            The collection, look, or page you are looking for might have been moved, removed, or never existed in our era.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-accent text-background px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-cyan-accent/20"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          
          <Link
            href="/explore"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-200 border border-border-premium px-6 py-3 rounded-xl text-sm font-semibold transition-all"
          >
            <Compass className="h-4 w-4 text-teal-accent" /> Explore Collection
          </Link>
        </div>

      </div>
    </div>
  );
}