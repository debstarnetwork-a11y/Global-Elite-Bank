import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Sparkles, RotateCcw, ShieldCheck, 
  ChevronDown, Bot, User, CheckCheck, Clock, KeyRound
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBank } from '../store';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

function generateIntelligentBankingResponse(text: string, language: string = 'en'): string {
  const lower = text.toLowerCase();

  // German responses
  if (language === 'de' || /konto|schweiz|überweisung|zinsen|anlegen|passwort|sicherheit/i.test(lower)) {
    if (lower.includes('pin') || lower.includes('code') || lower.includes('transaktion')) {
      return "Ihre 4-stellige Transaktions-PIN ist ein hochverschlüsselter Sicherheitsschlüssel, der für alle ausgehenden Überweisungen, SWIFT-Transaktionen und Kartenverifizierungen benötigt wird. Sie können Ihre PIN im Online-Banking unter Ihren Kontoeinstellungen einsehen und aktualisieren.";
    }
    if (lower.includes('konto') || lower.includes('eröffnen') || lower.includes('anmeld') || lower.includes('registrier')) {
      return "Um ein exklusives Konto bei der Global Elite Bank zu eröffnen, klicken Sie bitte oben in der Navigationsleiste auf 'Mitgliedschaft beantragen'. Unser Zulassungsausschuss prüft Anträge von vermögenden Privatkunden und Unternehmen diskret innerhalb von 24 Stunden.";
    }
    if (lower.includes('überweisung') || lower.includes('swift') || lower.includes('sepa') || lower.includes('limit')) {
      return "Global Elite Bank führt internationale Überweisungen über unser Schweizer FINMA-reguliertes Netzwerk in über 30 Währungen aus. Verifizierte Kontoinhaber profitieren von unbegrenzten Transaktionsvolumina mit garantierter Echtzeitabrechnung.";
    }
    if (lower.includes('krypto') || lower.includes('bitcoin') || lower.includes('wallet') || lower.includes('eth')) {
      return "Unsere institutionelle Krypto-Verwahrung lagert Vermögenswerte in FINMA-zertifizierten Schweizer Tiefstollen-Tresoren (Cold Storage). Wir unterstützen BTC, ETH, USDT und SOL mit sofortigen Konvertierungen in CHF, USD und EUR.";
    }
    if (lower.includes('karte') || lower.includes('kreditkarte') || lower.includes('visa')) {
      return "Wir bieten exklusive virtuelle und physische Titanium Black Cards mit anpassbaren Auszahlungslimits, weltweiter Akzeptanz und 0% Devisengebühren.";
    }
    return `Vielen Dank für Ihre Anfrage zu "${text}". Als Ihr privater Concierge unterstütze ich Sie jederzeit gerne bei Vermögensverwaltung, internationalen SWIFT-Überweisungen, Schweizer Krypto-Tresoren und diskreter Kontoführung.`;
  }

  // French responses
  if (language === 'fr' || /compte|suisse|virement|taux|banque|sécurité/i.test(lower)) {
    if (lower.includes('pin') || lower.includes('code')) {
      return "Votre code PIN de transaction à 4 chiffres est une clé de sécurité confidentielle requise pour autoriser chaque virement international et opération sensible. Vous pouvez le consulter ou le modifier dans les paramètres de votre compte.";
    }
    if (lower.includes('compte') || lower.includes('ouvrir') || lower.includes('adhér') || lower.includes('inscri')) {
      return "Pour ouvrir un compte d'élite, veuillez cliquer sur 'Demander l\\'adhésion' dans la barre de navigation. Notre comité d'admission suisse examine confidentiellement chaque dossier sous 24 heures.";
    }
    if (lower.includes('virement') || lower.includes('swift') || lower.includes('sepa') || lower.includes('limite')) {
      return "Global Elite Bank propose des virements prioritaires via SWIFT et SEPA dans plus de 30 devises, sans plafond pour les membres de Niveau 1, avec traçabilité FINMA intégrale.";
    }
    if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('sol') || lower.includes('sécurité')) {
      return "Notre infrastructure de conservation d'actifs numériques repose sur des coffres-forts froids souterrains dans les Alpes suisses, garantissant une protection maximale pour vos BTC, ETH, USDT et SOL.";
    }
    return `Merci pour votre demande relative à "${text}". Je me tiens à votre entière disposition pour vos questions bancaires, vos transferts de fonds confidentiels et la gestion de vos coffres sécurisés.`;
  }

  // Spanish responses
  if (language === 'es' || /cuenta|suiza|transferencia|tasa|banco|seguridad/i.test(lower)) {
    if (lower.includes('pin') || lower.includes('código')) {
      return "Su PIN de transacción de 4 dígitos es una clave cifrada indispensable para autorizar transferencias internacionales SWIFT y proteger sus fondos contra operaciones no autorizadas. Puede consultarlo y gestionarlo en la vista de su cuenta.";
    }
    if (lower.includes('cuenta') || lower.includes('abrir') || lower.includes('membresía')) {
      return "Para solicitar una cuenta exclusiva en Global Elite Bank, haga clic en 'Solicitar Membresía' en la parte superior. Nuestro comité evalúa las solicitudes con estricta confidencialidad en menos de 24 horas.";
    }
    if (lower.includes('transferencia') || lower.includes('swift') || lower.includes('sepa')) {
      return "Ofrecemos transferencias internacionales prioritarias mediante SWIFT y SEPA en más de 30 divisas con liquidación en tiempo real y sin límites estrictos para cuentas verificadas.";
    }
    if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('billetera')) {
      return "Nuestra custodia institucional de criptoactivos opera en bóvedas subterráneas frías en Suiza bajo estándares FINMA, protegiendo sus tenencias de BTC, ETH, USDT y SOL.";
    }
    return `Agradecemos su consulta sobre "${text}". Como su asistente privado 24/7, puedo ayudarle con transferencias, códigos de compensación, cuentas multidivisa y custodia patrimonial.`;
  }

  // English dynamic answers
  if (lower.includes('pin') || lower.includes('transaction pin') || lower.includes('4 digit') || lower.includes('code')) {
    return "Your 4-Digit Transaction PIN is your primary authorization code required to execute outgoing wires, authorize card issuance, and approve investment withdrawals. You can view or generate a new PIN directly inside your Account Details portal, or have your Relationship Manager reset it securely.";
  }

  if (lower.includes('cot') || lower.includes('swift') || lower.includes('imf') || lower.includes('aml') || lower.includes('clearance')) {
    return "Global Elite Bank implements multi-tier international clearance protocols (SWIFT-SEC, COT, IMF Clearance, and AML Validation) complying with Swiss FINMA and FATF directives. These codes guarantee sovereign legal compliance for high-value cross-border liquidity settlements.";
  }

  if (lower.includes('open') || lower.includes('account') || lower.includes('apply') || lower.includes('register') || lower.includes('membership')) {
    return "To establish an account with Global Elite Bank, click the 'Apply for Membership' button in the navigation bar. Our admissions desk discreetly evaluates each application within 24 hours. Upon approval, your multi-currency IBAN, checking account, and private credentials will be provisioned.";
  }

  if (lower.includes('wire') || lower.includes('transfer') || lower.includes('send') || lower.includes('limit')) {
    return "Global Elite Bank facilitates unlimited priority wire transfers worldwide across 30+ reserve currencies (USD, CHF, EUR, GBP, AED, JPY) via direct SWIFT and SEPA integration. Outgoing transfers for verified accounts settle rapidly with Swiss cryptographic authentication.";
  }

  if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('btc') || lower.includes('eth') || lower.includes('usdt') || lower.includes('vault') || lower.includes('sol')) {
    return "Our Institutional Digital Asset Custody secures client Bitcoin, Ethereum, Tether (USDT), and Solana in deep Swiss Alpine cold-storage bunkers under strict FINMA regulatory standards. We support instant OTC conversions to fiat currencies with zero slippage.";
  }

  if (lower.includes('card') || lower.includes('visa') || lower.includes('mastercard') || lower.includes('virtual')) {
    return "Global Elite Bank provisions both instant Virtual Black Cards and bespoke Laser-Engraved Metal Titanium Cards. You can toggle full card number visibility, set custom daily spending thresholds, and connect directly to Apple Pay or Google Pay from your client dashboard.";
  }

  if (lower.includes('interest') || lower.includes('deposit') || lower.includes('yield') || lower.includes('invest')) {
    return "We offer high-yield fixed-term private placements ranging from 5.4% to 12.8% APY across CHF, USD, EUR, and sovereign gold-backed liquidity tiers, backed by Swiss asset segregation covenants.";
  }

  if (lower.includes('loan') || lower.includes('grant') || lower.includes('credit') || lower.includes('borrow')) {
    return "Members have access to structured liquidity facilities and asset-backed credit lines from $250,000 up to $50M+. Applications can be submitted directly within your client portal under the Grants & Loans section.";
  }

  if (lower.includes('security') || lower.includes('safe') || lower.includes('privacy') || lower.includes('biometric') || lower.includes('swiss')) {
    return "We enforce multi-factor biometric authentication (FIDO2 / WebAuthn Enclave), AES-256 encrypted hardware keystores, and complete Swiss banking confidentiality doctrines to safeguard your wealth and identity.";
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('good morning') || lower.includes('good afternoon') || lower.includes('who are you')) {
    return "Greetings. I am Aura, your dedicated 24/7 AI Private Wealth Concierge for Global Elite Bank. How may I assist your private banking affairs, transfers, or account operations today?";
  }

  return `Thank you for your question regarding "${text}". As your Global Elite Bank Private Concierge, I can assist you with your 4-digit transaction PIN, multi-currency IBAN accounts, Swiss cold-storage crypto vaults, and priority SWIFT transfers. Please let me know what specific details you would like me to review.`;
}

export function AIChatWidget() {
  const { language, t } = useLanguage();
  const { adminSettings, currentUser } = useBank();
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

    let replyText = '';
    const geminiKey = adminSettings?.geminiApiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

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
          apiKey: geminiKey,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.reply) {
          replyText = data.reply;
        }
      }
    } catch (err) {
      console.warn('API chat route unreachable, trying direct model fallback:', err);
    }

    // Direct Gemini fallback if serverless function not configured on host/Vercel
    if (!replyText && geminiKey) {
      try {
        const directRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              ...messages.slice(-6).map((m) => ({
                role: m.role === 'model' ? 'model' : 'user',
                parts: [{ text: m.content }]
              })),
              { role: 'user', parts: [{ text }] }
            ],
            systemInstruction: {
              parts: [{ text: `You are Aura, the 24/7 AI Private Wealth Concierge for Global Elite Bank. You provide courteous, prompt, Swiss private banking assistance. Language: ${language}. Keep replies professional and concise (2-3 paragraphs).` }]
            }
          })
        });
        if (directRes.ok) {
          const directData = await directRes.json();
          const cand = directData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (cand) replyText = cand;
        }
      } catch (_) {}
    }

    // High-intelligence Concierge fallback engine
    if (!replyText) {
      await new Promise(r => setTimeout(r, 300));
      replyText = generateIntelligentBankingResponse(text, language);
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'model',
      content: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
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
    t('qPIN', 'Where do I find my 4-digit PIN?'),
    t('q1', 'How do I apply for an account?'),
    t('q2', 'What are international wire limits?'),
    t('q3', 'Tell me about crypto vault custody'),
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      {/* Closed Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-gradient-to-r from-primary via-indigo-600 to-primary text-white shadow-[0_10px_25px_rgba(79,70,229,0.45)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 min-h-[48px] touch-manipulation"
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
        <div className="w-[calc(100vw-24px)] sm:w-[420px] max-w-[420px] h-[520px] sm:h-[580px] max-h-[calc(100dvh-5rem)] bg-[#0f172a] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
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
                className="flex-1 h-11 px-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-base sm:text-xs min-h-[44px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md touch-manipulation"
                aria-label={t('aiSend', 'Send')}
              >
                <Send size={16} />
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
