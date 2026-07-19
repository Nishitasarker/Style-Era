'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api, Item } from '../utils/api';
import { useAuth } from '../providers/AuthProvider';
import { 
  Sparkles, 
  ArrowRight, 
  Baby, 
  UserCheck, 
  Heart, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

// Hero Slider Data
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
    title: 'The AI Fashion Revolution is Here',
    subtitle: 'Step into Style Era, a premium styling platform configured with advanced conversational Agentic AI tailored for your generation.',
    cta: 'Consult AI Advisor',
    link: '/profile'
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
    title: 'Curated Elegance Across Generations',
    subtitle: 'From playful childrens wear to sophisticated ensembles for seniors—experience tailored style advice and coordinates.',
    cta: 'Explore Collection',
    link: '/explore'
  }
];

const STATS = [
  { icon: ShoppingBag, value: '1,200+', label: 'Premium Garments' },
  { icon: Sparkles, value: '25k+', label: 'AI Style Ensembles' },
  { icon: Users, value: '12k+', label: 'Active Members' },
  { icon: TrendingUp, value: '98%', label: 'Advisor Match Rate' }
];

const TESTIMONIALS = [
  {
    quote: "The AI Style Advisor is a game changer! It analyzed my preference for minimal designs and suggested the Emerald Satin Dress. It fit perfectly for my gallery opening.",
    author: "Elena Rostova",
    role: "Art Curator, Age 28",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
  },
  {
    quote: "Finding clothes for my granddaughter used to be stressful. Style Era's Child category recommendations made it simple to select organic cotton dresses she loves.",
    author: "Martha Vance",
    role: "Grandmother, Age 67",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=120"
  }
];

const FAQS = [
  {
    q: "How does the Agentic AI Style Advisor work?",
    a: "Our AI advisor runs on Gemini models to parse your visual styling questions. It scans our catalog and synthesizes structured recommendations (like kaftans, dresses, and layers) explaining exactly why they fit your body category."
  },
  {
    q: "Can I upload my own wardrobe items?",
    a: "Yes! Once you are registered and logged in, you can go to 'Add Item' to insert custom items. The AI will immediately include them in its search parameters when curating outfits for you."
  },
  {
    q: "Is there a styling option for different age groups?",
    a: "Absolutely. We categorize collections into 'Child' (toddlers & girls), 'Young' (trendy and corporate youth), and 'Old' (sophisticated kaftans and luxury coordinates for seniors) to serve all generations."
  }
];

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [heroIndex, setHeroIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Fetch AI Recommendations using TanStack Query
  const { data: aiData, isLoading: aiLoading } = useQuery({
    queryKey: ['aiRecommendations', user?.id],
    queryFn: () => api.getSmartRecommendations(),
    // Query runs if authenticated, or falls back to generic
    enabled: true,
  });

  // Fetch General items for Trending section
  const { data: itemsData, isLoading: itemsLoading } = useQuery<Item[]>({
    queryKey: ['trendingItems'],
    queryFn: () => api.getItems(),
  });

  const nextHero = () => setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="w-full space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[600px] overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10" />
        
        {/* Background Image Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.65, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_SLIDES[heroIndex].image})` }}
          />
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl space-y-6"
          >
            <span className="text-cyan-accent text-sm font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-cyan-accent" /> Premium AI Curation
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {HERO_SLIDES[heroIndex].title}
            </h1>
            <p className="text-base sm:text-lg text-gray-300">
              {HERO_SLIDES[heroIndex].subtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href={HERO_SLIDES[heroIndex].link}
                className="flex items-center gap-2 bg-cyan-accent hover:bg-cyan-accent/90 text-background px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-accent/15 cursor-pointer"
              >
                <span>{HERO_SLIDES[heroIndex].cta}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-lg font-bold transition-all cursor-pointer"
              >
                View Catalogue
              </Link>
            </div>
          </motion.div>

          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-4 sm:left-8 flex gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  heroIndex === idx ? 'w-8 bg-cyan-accent' : 'w-2.5 bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. DEMOGRAPHIC CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">Age-Based Navigation</h2>
          <p className="text-muted text-sm max-w-md mx-auto">
            Find immediate fashion styles catalogued for young children, active youth, and sophisticated elders.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Child Collection',
              desc: 'Vibrant colors, comfortable organic cottons, and playful sets designed for toddlers and growing girls.',
              age: 'Ages 2 - 12',
              bg: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=600',
              slug: 'child'
            },
            {
              title: 'Youth & Corporate',
              desc: 'Regal satin slip dresses, structured trenches, and cyber streetwear statement pieces.',
              age: 'Ages 13 - 50',
              bg: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600',
              slug: 'young'
            },
            {
              title: 'Elderly / Senior Elegance',
              desc: 'Breathable linen kaftans, soft luxury cashmere sweaters, and sophisticated coords sets.',
              age: 'Ages 50+',
              bg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
              slug: 'old'
            }
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="group relative h-[360px] rounded-xl overflow-hidden border border-premium-border bg-[#101625] flex flex-col justify-end p-6 shadow-md"
            >
              {/* Blur backdrop image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-45 group-hover:scale-105 group-hover:opacity-60 transition-all duration-500"
                style={{ backgroundImage: `url(${cat.bg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-[#0b0f19]/70 to-transparent z-10" />
              
              {/* Content */}
              <div className="relative z-20 space-y-3">
                <span className="inline-block px-2.5 py-1 rounded bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-xs font-bold uppercase tracking-wider">
                  {cat.age}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-accent transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {cat.desc}
                </p>
                <Link
                  href={`/explore?category=${cat.slug}`}
                  className="flex items-center gap-1.5 text-cyan-accent hover:text-white text-xs font-bold uppercase tracking-wider pt-2 group-hover:gap-2.5 transition-all"
                >
                  <span>Browse Category</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. DYNAMIC AI RECOMMENDATIONS (Agentic AI Features) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-[#111827] to-[#0a0d16] border border-premium-border rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xl shadow-cyan-accent/5">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-accent/5 blur-3xl" />
          
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left intro panel */}
            <div className="lg:w-1/3 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4 animate-spin-slow" />
                <span>Smart Recommendation Engine</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                {aiData?.theme || 'Custom Styling Synthesis'}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                {aiData?.intro || (
                  isAuthenticated 
                    ? "Curating a custom outfit set specifically aligned with your age category profile settings..."
                    : "Log in to activate your profile settings. For guests, the styling advisor scans the general collections to deliver high-contrast coordinate items."
                )}
              </p>
              {isAuthenticated ? (
                <div className="p-4 rounded-xl bg-cyan-accent/5 border border-cyan-accent/20">
                  <p className="text-xs text-gray-400">
                    Your current profile: <strong className="text-white capitalize">{user?.ageGroup || 'Youth'} Category</strong>.
                    You can toggle your age category and style tags under login profile updates.
                  </p>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-accent hover:text-white uppercase tracking-wider"
                >
                  <span>Configure your style profile</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {/* Right recommendations cards */}
            <div className="lg:w-2/3 w-full">
              {aiLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((n) => (
                    <div key={n} className="h-80 rounded-xl skeleton-shimmer border border-premium-border" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {itemsData
                    ?.filter(item => aiData?.recommendedIds.includes(item._id))
                    ?.slice(0, 2)
                    ?.map((item) => (
                      <div
                        key={item._id}
                        className="bg-card border border-premium-border rounded-xl overflow-hidden flex flex-col h-full"
                      >
                        <div
                          className="h-48 w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.imageUrl})` }}
                        />
                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                          <div>
                            <span className="text-[10px] text-cyan-accent font-bold uppercase tracking-wider block mb-1">
                              AI Rationale
                            </span>
                            <p className="text-xs text-gray-300 italic line-clamp-2">
                              "{aiData?.reasonings[item._id] || 'Selected based on premium visual contrast.'}"
                            </p>
                            <h4 className="text-sm font-bold text-white mt-3">{item.name}</h4>
                            <p className="text-xs text-muted mt-1">{item.description.slice(0, 70)}...</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border-premium/50">
                            <span className="text-sm font-extrabold text-cyan-accent">${item.price}</span>
                            <span className="text-[10px] text-muted capitalize bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                              {item.category === 'child' ? 'Child' : item.category === 'young' ? 'Youth' : 'Elderly'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  {(!aiData || aiData.recommendedIds.length === 0) && (
                    <div className="col-span-2 py-12 text-center text-muted">
                      No tailored recommendations synthesized. Check back shortly.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRENDING STYLES (Feature Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">Trending Collections</h2>
            <p className="text-muted text-sm max-w-md">
              Discover top coordinates requested by users. Filter items inside the complete catalogue.
            </p>
          </div>
          <Link
            href="/explore"
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-accent hover:text-white uppercase tracking-wider"
          >
            <span>View All Catalogue</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {itemsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-xl skeleton-shimmer border border-premium-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {itemsData?.slice(0, 4).map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ y: -4 }}
                className="bg-card border border-premium-border rounded-xl overflow-hidden flex flex-col h-full premium-glow-card"
              >
                <div
                  className="h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((t, i) => (
                        <span key={i} className="text-[10px] bg-white/5 border border-white/15 px-2 py-0.5 rounded text-gray-300 uppercase tracking-wider">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border-premium/50 mt-4">
                    <span className="text-base font-extrabold text-cyan-accent">${item.price}</span>
                    <span className="text-xs text-muted font-medium capitalize block">{item.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 5. STATISTICS & INSIGHTS */}
      <section className="bg-[#0a0d16] border-y border-premium-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-accent/10 border border-cyan-accent/25">
                    <Icon className="h-6 w-6 text-cyan-accent" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                  <p className="text-xs text-muted uppercase tracking-wider font-semibold">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">Client Success Stories</h2>
          <p className="text-muted text-sm max-w-sm mx-auto">
            See how Style Era client advisors coordinate outfits with visual grace.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-card border border-premium-border rounded-xl p-8 space-y-6 flex flex-col justify-between relative shadow-sm"
            >
              <p className="text-sm text-gray-300 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-border-premium/50">
                <img
                  className="h-10 w-10 rounded-full object-cover border border-cyan-accent"
                  src={t.image}
                  alt={t.author}
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.author}</h4>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. NEWSLETTER & FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* FAQ panel */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Common Style Questions</h2>
              <p className="text-muted text-sm mt-1">Frequently asked advisor details.</p>
            </div>
            
            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = faqOpen === idx;
                return (
                  <div
                    key={idx}
                    className="bg-card border border-premium-border rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-white hover:text-cyan-accent transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-cyan-accent" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pb-5 border-t border-border-premium/30"
                        >
                          <p className="text-xs text-gray-300 leading-relaxed pt-3">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Newsletter Panel */}
          <div className="bg-card border border-premium-border rounded-2xl p-8 md:p-10 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-cyan-accent" />
                Join the Style Newsletter
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Stay updated on weekly capsule drops curated by our agentic advisors. Receive styling tip summaries for kids, youth, and elderly.
              </p>
            </div>

            {newsletterSubscribed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-xl bg-cyan-accent/5 border border-cyan-accent/35 text-center space-y-3"
              >
                <CheckCircle2 className="h-8 w-8 text-cyan-accent mx-auto" />
                <h4 className="text-sm font-bold text-white">Subscription Active!</h4>
                <p className="text-xs text-muted">You will receive the next premium fashion editorial catalog.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-[#0a0d16] border border-border-premium focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-accent to-teal-accent text-background py-2.5 rounded-lg font-bold tracking-wide transition-all hover:scale-[1.01] cursor-pointer"
                >
                  Join Editorial
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
