'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import ChatInterface from '@/components/chat-interface';

export default function Home() {
  const chatRef = useRef<HTMLElement>(null);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="flex flex-col bg-[#030303] font-sans selection:bg-blue-500/30 text-white overflow-x-hidden">
      
      {/* SECTION 1: Animated Hero (100vh) */}
      <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        {/* Deep Glassmorphic Background Glows */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

        {/* Floating Glassmorphic Orbs for Depth */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-blue-500/[0.02] border border-blue-500/10 backdrop-blur-3xl rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="z-10 text-center flex flex-col items-center"
        >
          {/* MASSIVE Typography */}
          <h1 className="text-[6rem] sm:text-[8rem] md:text-[12rem] leading-none font-extrabold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-800 drop-shadow-2xl">
            Skylark
          </h1>
          <p className="text-xl md:text-3xl text-blue-200/60 font-medium tracking-widest mb-12 uppercase drop-shadow-md">
            Monday.com Intelligence Suite
          </p>
        </motion.div>

        {/* Bouncing Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 flex flex-col items-center cursor-pointer group z-20"
          onClick={scrollToChat}
        >
          <span className="text-xs text-white/40 mb-3 uppercase tracking-[0.3em] group-hover:text-blue-400 transition-colors font-semibold">
            Scroll to Access
          </span>
          <div className="p-4 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
            <svg className="w-6 h-6 text-white/60 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: Chat Interface Container */}
      <section ref={chatRef} className="flex items-center justify-center min-h-screen p-4 md:p-6 w-full relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-blue-900/10 to-[#030303] pointer-events-none" />
        
        {/* Heavy Glassmorphism Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 100, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_0_20px_rgba(255,255,255,0.02)] relative"
        >
          {/* Header Section */}
          <header className="flex items-center justify-between border-b border-white/10 px-8 py-6 relative z-10 bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/80 to-purple-600/80 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight text-white/90 drop-shadow-md">
                  Skylark <span className="text-blue-400 font-medium">BI Agent</span>
                </h2>
                <p className="text-xs text-white/40 tracking-widest uppercase font-semibold mt-1">
                  Secure Enterprise Connection
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/[0.03] px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-md shadow-inner">
              <span className="flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"></span>
              <span className="text-xs font-bold text-white/70 tracking-widest uppercase">Online</span>
            </div>
          </header>

          {/* Main Agent Interface */}
          <div className="flex-1 overflow-hidden relative z-10">
            <ChatInterface />
          </div>
        </motion.div>
      </section>

    </main>
  );
}