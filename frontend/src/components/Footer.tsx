'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Mail, Shield, Globe, MessageCircle } from 'lucide-react';
import { FaLinkedin, FaFacebook } from 'react-icons/fa'; // সোশ্যাল আইকনগুলোর জন্য (যদি রিয়্যাক্ট আইকন ইনস্টল করা থাকে)

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0d16] border-t border-border-premium mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Intro */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-accent/10 border border-cyan-accent/30">
                <Sparkles className="h-4 w-4 text-cyan-accent" />
              </div>
              <span className="text-lg font-bold tracking-wider text-white">
                STYLE ERA
              </span>
            </div>
            <p className="text-sm text-muted max-w-sm">
              Style Era is a premium, agentic AI-powered fashion platform curated exclusively for female styling across all generations—from playful childhood coordinates to elegant senior attire.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted hover:text-cyan-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-muted hover:text-cyan-accent transition-colors">
                  Explore Catalogue
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted hover:text-cyan-accent transition-colors">
                  AI Style Advisor
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Support / Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Connect & Support</h4>
            <ul className="space-y-2.5 text-sm text-muted">
              {/* Email */}
              <li>
                <a 
                  href="mailto:nishitasarkerjui@gmail.com" 
                  className="flex items-center gap-2 hover:text-cyan-accent transition-colors"
                >
                  <Mail className="h-4 w-4 text-cyan-accent shrink-0" />
                  <span>nishitasarkerjui@gmail.com</span>
                </a>
              </li>

              {/* WhatsApp */}
              <li>
                <a 
                  href="https://wa.me/8801859384536" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-cyan-accent transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-teal-accent shrink-0" />
                  <span>+880 1859-384536</span>
                </a>
              </li>

              {/* LinkedIn */}
              <li>
                <a 
                  href="https://www.linkedin.com/in/nishitasarkerjui" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-cyan-accent transition-colors"
                >
                  <Shield className="h-4 w-4 text-cyan-accent shrink-0" />
                  <span>LinkedIn Profile</span>
                </a>
              </li>

              {/* Facebook */}
              <li>
                <a 
                  href="https://www.facebook.com/100080777081861/posts/962049083164319/?substory_index=1745046966465629&app=fbl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-cyan-accent transition-colors"
                >
                  <Globe className="h-4 w-4 text-teal-accent shrink-0" />
                  <span>Facebook Profile / Post</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border-premium/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Style Era Inc. All rights reserved. Designed with rich premium aesthetics.
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <a href="#" className="hover:text-cyan-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}