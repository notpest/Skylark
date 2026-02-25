'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInterface() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onError: (error) => {
      console.error('Chat API Error:', error);
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // FIX: Only scroll into view if there are actually messages.
  // This prevents the page from auto-scrolling on initial load.
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-white/50 space-y-8"
          >
            <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] backdrop-blur-xl">
              <svg className="w-10 h-10 text-blue-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-xl font-light tracking-wide text-white/70">Awaiting your command.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => sendMessage({ text: 'Generate a Leadership Update summarizing our pipeline health.' })}
                className="px-6 py-3 bg-white/[0.03] border border-white/10 text-white/70 rounded-full hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium backdrop-blur-md shadow-lg"
              >
                ✨ Leadership Update
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((m) => (
            <motion.div 
              key={m.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] rounded-3xl p-5 shadow-2xl backdrop-blur-xl border ${
                m.role === 'user' 
                  ? 'bg-blue-600/20 border-blue-400/30 text-white rounded-tr-sm' 
                  : 'bg-white/[0.03] border-white/10 text-gray-200 rounded-tl-sm'
              }`}>
                
                {m.parts.map((part, index) => {
                  if (part.type === 'text') {
                    return <div key={index} className="whitespace-pre-wrap text-[15px] leading-relaxed font-light">{part.text}</div>;
                  }

                  if ('toolName' in part && part.toolName === 'call_monday_tool') {
                    const { toolCallId, state } = part;
                    
                    return (
                      <div key={toolCallId} className="mt-4 mb-2 text-xs text-white/50 flex items-center space-x-3 bg-black/40 p-3 rounded-xl border border-white/5 backdrop-blur-md">
                        {state === 'input-streaming' || state === 'input-available' ? (
                          <>
                            <div className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                            </div>
                            <span className="font-mono tracking-wider uppercase">Executing MCP Data Fetch...</span>
                          </>
                        ) : state === 'output-available' ? (
                          <>
                            <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            <span className="font-mono text-emerald-400/80 tracking-wider uppercase">Data Secured</span>
                          </>
                        ) : (
                          <>
                            <span className="text-red-400">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </span>
                            <span className="font-mono text-red-400/80 tracking-wider uppercase">Execution Failed</span>
                          </>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* General Loading Indicator */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
            <div className="bg-white/[0.02] border border-white/10 backdrop-blur-xl text-white/40 rounded-3xl rounded-tl-sm p-5 text-sm flex space-x-2 items-center shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500/50 animate-bounce"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500/50 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2.5 h-2.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-8 bg-transparent relative z-20 border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query your Monday.com data..."
            className="w-full pl-8 pr-16 py-5 bg-white/[0.03] border border-white/10 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-base text-white placeholder-white/30 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all font-light tracking-wide"
            disabled={isLoading}
            autoFocus={false} 
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-3 p-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center"
          >
            <svg className="w-5 h-5 translate-x-[1px] translate-y-[-1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}