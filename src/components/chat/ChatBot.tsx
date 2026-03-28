"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "assistant" | "user", content: string }[]>([
    { role: "assistant", content: "Hi there! I'm TripVerseAI. Where are you planning to go next?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to chat");
      }

      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-tr from-[#6C63FF] to-[#00BFA6] rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_-5px_rgba(0,191,166,0.5)] hover:scale-105 transition-transform group relative"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          <MessageSquare className="w-7 h-7 relative z-10" />
          
          {/* Notification Dot */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300 relative">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] p-5 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#00BFA6] flex items-center justify-center border-2 border-white/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">TripVerseAI</h3>
                <p className="text-[#00BFA6] text-xs font-semibold flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 py-6 space-y-6 bg-[#F8FAFC]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                
                {/* Bot Avatar */}
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C63FF]/10 to-[#00BFA6]/20 border border-[#00BFA6]/30 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4 text-[#00BFA6]" />
                  </div>
                )}

                {/* Bubble */}
                <div className={`
                  max-w-[85%] px-5 py-4 text-[14.5px] leading-relaxed
                  ${msg.role === "user" 
                    ? "bg-gradient-to-tr from-[#6C63FF] to-[#8079FF] text-white rounded-[1.5rem] rounded-tr-[4px] shadow-sm font-medium" 
                    : "bg-white text-slate-700 rounded-[1.5rem] rounded-tl-[4px] shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-slate-100/80"}
                `}>
                  {msg.role === "assistant" ? (
                    <div className="space-y-3 whitespace-pre-[unset] break-words leading-relaxed text-[#334155]">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }: any) => <p className="mb-2 last:mb-0" {...props} />,
                          strong: ({ node, ...props }: any) => <strong className="font-bold text-[#1A1A1A]" {...props} />,
                          ul: ({ node, ...props }: any) => <ul className="list-none space-y-2 my-2" {...props} />,
                          ol: ({ node, ...props }: any) => <ol className="list-decimal pl-4 space-y-2 my-2 text-[#00BFA6] font-bold" {...props} />,
                          li: ({ node, ...props }: any) => (
                            <li className="flex gap-2">
                              {/* Keep original list styling if it's ol vs ul, but for now we fallback */}
                              <span className="text-[#00BFA6] shrink-0 mt-[2px]">✦</span>
                              <span className="text-slate-700 font-normal">{props.children}</span>
                            </li>
                          ),
                          h3: ({ node, ...props }: any) => <h3 className="text-base font-bold text-[#6C63FF] mt-4 mb-2 flex items-center gap-1.5" {...props} />,
                          h2: ({ node, ...props }: any) => <h2 className="text-lg font-bold text-[#1A1A1A] mt-5 mb-2 border-b border-slate-100 pb-1" {...props} />,
                          a: ({ node, ...props }: any) => <a className="text-[#00BFA6] underline hover:text-[#00a892]" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-1 shadow-sm border border-slate-700">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-[#E0F7F4] border border-[#00BFA6]/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-[#00BFA6]" />
                </div>
                <div className="bg-white rounded-[1.5rem] rounded-tl-sm shadow-sm border border-slate-100 px-5 py-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100 z-10">
            <div className="relative flex items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about destinations, budgets..."
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-3.5 pl-5 pr-14 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00BFA6] transition-all text-[15px]"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 w-10 h-10 bg-[#1A1A1A] hover:bg-black disabled:bg-slate-300 rounded-full flex items-center justify-center text-white transition-colors"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
              </button>
            </div>
          </form>

        </div>
      )}
    </div>
  );
}
