'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api, Item } from '../../utils/api';
import { Sparkles, Send, Bot, User as UserIcon, Shirt, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  recommendedIds?: string[];
  styleTip?: string;
  timestamp: Date;
}

export default function AIStyleAdvisorPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! I am your Style Era Agentic Advisor. I see you are styled in the "${user?.ageGroup || 'young'}" demographic category. Ask me styling coordinates (e.g. "suggest a fancy evening teal dress set" or "show me comfortable linen coords") and I will query our catalog to coordinate your outfit!`,
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch catalog to resolve item details for recommendation cards
  const { data: catalog = [] } = useQuery<Item[]>({
    queryKey: ['catalogItems'],
    queryFn: () => api.getItems(),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setError('');
    
    // Add user message
    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Map message history to simple prompt format
      const historyContext = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await api.getStyleAdvice(userText, historyContext);
      
      const botMsg: Message = {
        id: 'msg-' + Date.now(),
        sender: 'bot',
        text: res.advice,
        recommendedIds: res.recommendedItemIds,
        styleTip: res.styleTip,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      // Fallback message error
      setMessages(prev => [...prev, {
        id: 'msg-err-' + Date.now(),
        sender: 'bot',
        text: "I encountered a coordination issue scanning our database. Please verify your connection and try again.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const [error, setError] = useState('');

  // Render loading state
  if (authLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-cyan-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Auth lock
  if (!isAuthenticated) {
    return (
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-card border border-border-premium rounded-2xl p-8 text-center space-y-6">
          <AlertCircle className="h-12 w-12 text-cyan-accent mx-auto" />
          <h2 className="text-xl font-bold text-white">AI Advisor Locked</h2>
          <p className="text-sm text-muted">
            You must be logged into your Style Era profile to consult the conversational AI Style Advisor.
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

  // Find recommended item objects
  const getRecommendedItems = (ids?: string[]) => {
    if (!ids) return [];
    return catalog.filter(item => ids.includes(item._id));
  };

  return (
    <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)]">
      
      {/* Left Chat Window */}
      <div className="flex-grow lg:w-3/5 bg-card border border-border-premium rounded-2xl flex flex-col h-full overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-border-premium/50 bg-[#101625] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-cyan-accent/15 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent">
              <Bot className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                AI Style Advisor
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              </h2>
              <p className="text-[10px] text-muted capitalize">Active Stylist: {user?.username} ({user?.ageGroup} category)</p>
            </div>
          </div>
          <button
            onClick={() => setMessages([
              {
                id: 'welcome',
                sender: 'bot',
                text: `Conversations reset. I am ready to advise you on your clothing needs!`,
                timestamp: new Date()
              }
            ])}
            className="p-1.5 hover:bg-white/5 border border-border-premium/60 hover:border-border-premium rounded-lg text-muted hover:text-white transition-all text-xs flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Messaging Box */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`h-8 w-8 rounded-full border flex-shrink-0 flex items-center justify-center ${
                    isUser 
                      ? 'bg-cyan-accent/10 border-cyan-accent/30 text-cyan-accent' 
                      : 'bg-teal-accent/10 border-teal-accent/30 text-teal-accent'
                  }`}>
                    {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className="space-y-2">
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-gradient-to-r from-cyan-accent/10 to-cyan-accent/20 border border-cyan-accent/20 text-white rounded-tr-none' 
                        : 'bg-[#101625] border border-border-premium text-gray-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>

                    {msg.styleTip && (
                      <div className="p-3 bg-teal-accent/5 border border-teal-accent/20 rounded-xl text-[11px] text-gray-300">
                        <span className="font-bold text-teal-accent block mb-1">Stylist Tip</span>
                        {msg.styleTip}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 mr-auto items-center"
              >
                <div className="h-8 w-8 rounded-full bg-teal-accent/10 border border-teal-accent/30 text-teal-accent flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex gap-1.5 p-3 rounded-2xl bg-[#101625] border border-border-premium">
                  <div className="h-2 w-2 rounded-full bg-cyan-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-cyan-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-cyan-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-border-premium/50 bg-[#101625] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={`Stylist is listening... Query coordinates for "${user?.ageGroup}" outfits`}
            className="flex-grow bg-[#0a0d16] border border-border-premium focus:border-cyan-accent rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-11 w-11 rounded-xl bg-cyan-accent text-background flex items-center justify-center hover:scale-[1.03] transition-all disabled:opacity-40"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>

      </div>

      {/* Right Recommendations Sidebar */}
      <div className="lg:w-2/5 flex flex-col h-full bg-[#0a0d16] border border-border-premium rounded-2xl p-5 overflow-y-auto">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Shirt className="h-4.5 w-4.5 text-cyan-accent" />
          Ensemble Coordinates
        </h3>

        {/* Find the last bot message and extract recommendations */}
        {(() => {
          const lastBotMsg = [...messages].reverse().find(m => m.sender === 'bot');
          const recommendedItems = getRecommendedItems(lastBotMsg?.recommendedIds);

          if (recommendedItems.length === 0) {
            return (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border border-dashed border-border-premium rounded-xl text-muted">
                <Shirt className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-xs">No active clothing pieces coordinated yet.</p>
                <p className="text-[10px] mt-1">Ask the Advisor for recommendations to see matches appear here.</p>
              </div>
            );
          }

          return (
            <div className="space-y-4">
              <p className="text-[11px] text-muted mb-2">Based on the latest stylist query match:</p>
              {recommendedItems.map((item) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={item._id}
                  className="bg-card border border-border-premium rounded-xl overflow-hidden flex"
                >
                  <div
                    className="h-28 w-24 bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  />
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-muted line-clamp-2 mt-1 leading-normal">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-border-premium/50 pt-2 mt-2">
                      <span className="text-xs font-extrabold text-cyan-accent">${item.price}</span>
                      <span className="text-[9px] text-muted capitalize px-2 py-0.5 rounded bg-white/5">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          );
        })()}
      </div>

    </div>
  );
}
