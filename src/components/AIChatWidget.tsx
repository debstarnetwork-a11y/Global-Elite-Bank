import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Sparkles, RotateCcw, ShieldCheck, 
  ChevronDown, Bot, User, CheckCheck, Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export function AIChatWidget() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = sessionStorage.getItem('geb_ai_chat_messages');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) {}
    return [];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'model',
          content: t(
            'welcomeMessage',
            'Welcome to Global Elite Bank. I am Aura, your dedicated 24/7 AI Private Wealth Concierge. How may I assist your private banking inquiries today?'
          ),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [language, t, messages.length]);

  // Save messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('geb_ai_chat_messages', JSON.stringify(messages));
    } catch (_) {}
  }, [messages]);

  // Scroll to bottom when messages update or when opened
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build history for model
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || "I am at your service. Please let me know how I can assist your private banking operations.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat failed:', err);
      // Fallback message
      const fallbackMsg: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        role: 'model',
        content: "Thank you for reaching out to Global Elite Bank. Our private advisors and concierge desk are available 24/7. How may I assist you with your accounts, transfers, or crypto custody today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    const initialWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'model',
      content: t(
        'welcomeMessage',
        'Welcome to Global Elite Bank. I am Aura, your dedicated 24/7 AI Private Wealth Concierge. How may I assist your private banking inquiries today?'
      ),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialWelcome]);
    try {
      sessionStorage.removeItem('geb_ai_chat_messages');
    } catch (_) {}
  };

  const suggestedQuestions = [
    t('q1', 'How do I apply for an account?'),
    t('q2', 'What are international wire limits?'),
    t('q3', 'Tell me about crypto vault custody'),
    t('q4', 'Swiss privacy & asset protection'),
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Closed Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-gradient-to-r from-primary via-indigo-600 to-primary text-white shadow-[0_10px_25px_rgba(79,70,229,0.45)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          aria-label="Open AI Assistant Live Chat"
        >
          {/* Pulsing indicator */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>

          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-xs border border-white/20">
            <Sparkles size={16} className="text-yellow-300 animate-pulse" />
          </div>

          <div className="text-left">
            <div className="text-xs font-black tracking-wide uppercase flex items-center gap-1.5 leading-tight">
              <span>{t('chatWithConcierge', 'AI Concierge')}</span>
              <span className="text-[9px] bg-white/25 px-1.5 py-0.2 rounded font-mono">24/7</span>
            </div>
            <div className="text-[10px] text-white/80 font-medium">Aura • Private Wealth</div>
          </div>
        </button>
      )}

      {/* Expanded Live Chat Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-6rem)] bg-[#0f172a] border border-white/15 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#1e1b4b] via-[#1e293b] to-[#0f172a] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-purple-600 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-[#0f172a] rounded-[14px] flex items-center justify-center">
                    <Sparkles size={18} className="text-primary" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0f172a] shadow-xs"></span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {t('aiChatTitle', 'Private Wealth Concierge')}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{t('onlineStatus', 'Online • 24/7 Instant Service')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title={t('clearChat', 'Clear Conversation')}
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title="Minimize"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Sub-header Banner */}
          <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 flex items-center justify-between text-[11px] text-primary shrink-0">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>{t('securityBadge', 'Swiss Banking Grade Security')}</span>
            </div>
            <span className="text-[10px] font-mono text-white/50">Gemini 3.8</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-normal">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[85%] ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] ${
                        isUser
                          ? 'bg-primary text-white'
                          : 'bg-gradient-to-tr from-purple-600 to-primary text-white'
                      }`}
                    >
                      {isUser ? <User size={12} /> : <Bot size={12} />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-xs ${
                        isUser
                          ? 'bg-primary text-white rounded-tr-xs'
                          : 'bg-white/10 text-white/95 rounded-tl-xs border border-white/10'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-white/40 mt-1 px-8 flex items-center gap-1">
                    <Clock size={10} />
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-primary text-white flex items-center justify-center shrink-0">
                  <Bot size={12} />
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white/10 border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-white/50 ml-1.5">{t('typing', 'Aura is composing a response...')}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 py-2 border-t border-white/5 bg-white/5">
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">
                {t('quickQuestions', 'Suggested Inquiries')}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all border border-white/10 text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-[#1e293b]/90 border-t border-white/10 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('aiChatPlaceholder', 'Ask about accounts, wires, crypto custody, or loans...')}
                disabled={isLoading}
                className="flex-1 h-10 px-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md"
                aria-label={t('aiSend', 'Send')}
              >
                <Send size={15} />
              </button>
            </form>

            <div className="text-[9px] text-white/40 text-center mt-2 leading-tight">
              Bank staff will never ask for confidential passwords or transfer PINs.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
