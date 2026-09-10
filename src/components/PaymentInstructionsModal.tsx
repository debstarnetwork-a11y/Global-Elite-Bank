import React, { useState } from 'react';
import { 
  X, Banknote, Bitcoin, CreditCard, Copy, Check, ShieldCheck, 
  ArrowLeft, QrCode, Sparkles, CheckCircle, ExternalLink, Printer,
  Maximize2, Download, AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useBank, DEFAULT_BROKER_WALLETS } from '../store';

interface PaymentInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isNewAccountNotice?: boolean;
}

interface QrModalData {
  currency: string;
  name: string;
  network: string;
  address: string;
  badge: string;
  symbol: string;
  iconBg: string;
  color: string;
  memo: string;
  qrImageUrl?: string;
}

export function PaymentInstructionsModal({ isOpen, onClose, isNewAccountNotice = false }: PaymentInstructionsModalProps) {
  const { adminSettings, currentUser, adminUpdateUser } = useBank();
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'wire' | 'crypto' | 'ewallet'>('all');
  const [activeQrModal, setActiveQrModal] = useState<QrModalData | null>(null);
  const [qrFormat, setQrFormat] = useState<'address' | 'uri'>('address');
  const [qrMode, setQrMode] = useState<'image' | 'code'>('image');

  if (!isOpen) return null;

  const primaryAccount = currentUser?.accounts?.[0];
  const brokerWallets = {
    btc: (adminSettings?.brokerWallets?.btc || DEFAULT_BROKER_WALLETS.btc).trim(),
    eth: (adminSettings?.brokerWallets?.eth || DEFAULT_BROKER_WALLETS.eth).trim(),
    usdt: (adminSettings?.brokerWallets?.usdt || DEFAULT_BROKER_WALLETS.usdt).trim(),
    sol: (adminSettings?.brokerWallets?.sol || DEFAULT_BROKER_WALLETS.sol).trim(),
    btcQr: (adminSettings?.brokerWallets?.btcQr || DEFAULT_BROKER_WALLETS.btcQr || '').trim(),
    ethQr: (adminSettings?.brokerWallets?.ethQr || DEFAULT_BROKER_WALLETS.ethQr || '').trim(),
    usdtQr: (adminSettings?.brokerWallets?.usdtQr || DEFAULT_BROKER_WALLETS.usdtQr || '').trim(),
    solQr: (adminSettings?.brokerWallets?.solQr || DEFAULT_BROKER_WALLETS.solQr || '').trim(),
  };

  const getCryptoUri = (currency: string, address: string, format: 'address' | 'uri'): string => {
    const cleanAddr = address.trim();
    if (!cleanAddr || format === 'address') return cleanAddr;
    const c = currency.toUpperCase();
    if (c.includes('BTC') || c.includes('BITCOIN')) return `bitcoin:${cleanAddr}`;
    if (c.includes('ETH') || c.includes('ETHEREUM')) return `ethereum:${cleanAddr}`;
    if (c.includes('USDT') || c.includes('TRON') || c.includes('TRC')) return cleanAddr.startsWith('T') ? `tron:${cleanAddr}` : cleanAddr;
    if (c.includes('SOL') || c.includes('SOLANA')) return `solana:${cleanAddr}`;
    return cleanAddr;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const downloadQR = (currency: string, imageUrl?: string) => {
    if (imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `GEB-${currency}-Official-QR.jpg`;
      a.target = '_blank';
      a.rel = 'noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
    const svg = document.getElementById(`geb-instructions-qr-${currency}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `GEB-${currency}-Deposit-QR.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handleAcknowledgeAndClose = () => {
    if (currentUser?.id) {
      localStorage.setItem(`geb_seen_deposit_modal_${currentUser.id}`, 'true');
      if (primaryAccount?.accountNumber) {
        localStorage.setItem(`geb_seen_deposit_modal_${primaryAccount.accountNumber}`, 'true');
      }
      if (currentUser.newAccountPromptPending) {
        adminUpdateUser(currentUser.id, { newAccountPromptPending: false });
      }
    }
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-background/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) handleAcknowledgeAndClose(); }}
    >
      <div className="bg-card border border-border w-full max-w-3xl rounded-3xl p-5 sm:p-7 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-xs">
              <Banknote size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Deposit & Payment Instructions
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <ShieldCheck size={12} /> Official Bank Rail
                </span>
              </div>
              <p className="text-xs text-foreground/60">
                Official funding instructions verified with current administrative payment settings.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              title="Print payment instructions"
              className="p-2 rounded-xl text-foreground/60 hover:text-foreground hover:bg-background border border-border transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
            >
              <Printer size={15} />
              <span>Print</span>
            </button>
            <button 
              type="button"
              onClick={handleAcknowledgeAndClose} 
              className="text-foreground/50 hover:text-foreground p-2 rounded-xl hover:bg-background border border-transparent hover:border-border transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-6 overflow-y-auto pr-1 py-4 flex-1">
          
          {/* Celebratory Banner for New Accounts */}
          {isNewAccountNotice && (
            <div className="bg-gradient-to-r from-emerald-500/15 via-primary/15 to-purple-500/15 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-foreground">
                      🎉 Your Account is Officially Open & Active!
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white uppercase tracking-wider">
                      Ready for Funding
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 mt-1 leading-relaxed">
                    Welcome, <span className="font-bold text-foreground">{currentUser?.name || 'Valued Client'}</span>! 
                    Your account <span className="font-mono font-bold text-primary">#{primaryAccount?.accountNumber || ''}</span> has been officially opened. 
                    Use the official payment instructions below to deposit funds and begin transacting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* User Account Quick Reference Bar */}
          {primaryAccount && (
            <div className="bg-background border border-border/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-foreground/50 uppercase tracking-wider font-bold text-[10px]">Beneficiary Name:</span>
                <span className="font-bold text-foreground">{currentUser?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground/50 uppercase tracking-wider font-bold text-[10px]">Account Number:</span>
                <span className="font-mono font-bold text-foreground">{primaryAccount.accountNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground/50 uppercase tracking-wider font-bold text-[10px]">IBAN:</span>
                <span className="font-mono font-bold text-primary">{primaryAccount.iban || `CH93 0000 0000 ${primaryAccount.accountNumber.substring(0, 4)}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground/50 uppercase tracking-wider font-bold text-[10px]">Account Type:</span>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">{primaryAccount.type || 'Checking'}</span>
              </div>
            </div>
          )}

          {/* Navigation Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background text-foreground/70 border border-border hover:border-primary/40'
              }`}
            >
              All Payment Methods
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('wire')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'wire'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background text-foreground/70 border border-border hover:border-primary/40'
              }`}
            >
              <Banknote size={14} />
              <span>Fiat Bank Wire</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('crypto')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'crypto'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background text-foreground/70 border border-border hover:border-primary/40'
              }`}
            >
              <Bitcoin size={14} />
              <span>Crypto Wallets (4)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ewallet')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'ewallet'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background text-foreground/70 border border-border hover:border-primary/40'
              }`}
            >
              <CreditCard size={14} />
              <span>E-Wallet & PayPal</span>
            </button>
          </div>

          {/* 1. Bank Wire Transfer Section */}
          {(activeTab === 'all' || activeTab === 'wire') && (
            <div className="space-y-4 bg-card border border-border rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-base">
                  <Banknote size={20} />
                  <span>Fiat Bank Wire Transfer</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Global Wire / SWIFT
                </span>
              </div>

              <div className="bg-background border border-border rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-widest">Bank Name</p>
                    <p className="text-sm font-bold mt-1 text-foreground font-mono">
                      {adminSettings?.fiatDepositInstructions?.bankName || 'Global Elite Partner Bank (US)'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-widest">SWIFT / BIC</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-mono font-bold text-foreground">
                        {adminSettings?.fiatDepositInstructions?.swiftBic || 'GEHBUS33'}
                      </p>
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(adminSettings?.fiatDepositInstructions?.swiftBic || 'GEHBUS33', 'swift')} 
                        className="text-foreground/50 hover:text-primary p-1 rounded transition-colors"
                        title="Copy SWIFT"
                      >
                        {copied === 'swift' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-widest">Account Name (Beneficiary)</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-bold text-foreground font-mono">
                        {adminSettings?.fiatDepositInstructions?.accountName || 'Global Elite Holdings LLC'}
                      </p>
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(adminSettings?.fiatDepositInstructions?.accountName || 'Global Elite Holdings LLC', 'fiat-acc-name')} 
                        className="text-foreground/50 hover:text-primary p-1 rounded transition-colors"
                        title="Copy Account Name"
                      >
                        {copied === 'fiat-acc-name' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-widest">Account Number</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-mono font-bold text-foreground">
                        {adminSettings?.fiatDepositInstructions?.accountNumber || '3482910048'}
                      </p>
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(adminSettings?.fiatDepositInstructions?.accountNumber || '3482910048', 'fiat-acc-num')} 
                        className="text-foreground/50 hover:text-primary p-1 rounded transition-colors"
                        title="Copy Account Number"
                      >
                        {copied === 'fiat-acc-num' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-widest">Routing Number / Sort Code</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-mono font-bold text-foreground">
                        {adminSettings?.fiatDepositInstructions?.routingNumber || '021000021'}
                      </p>
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(adminSettings?.fiatDepositInstructions?.routingNumber || '021000021', 'fiat-routing')} 
                        className="text-foreground/50 hover:text-primary p-1 rounded transition-colors"
                        title="Copy Routing Number"
                      >
                        {copied === 'fiat-routing' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-widest">Bank Address</p>
                    <p className="text-xs mt-1 text-foreground/80 font-mono">
                      {adminSettings?.fiatDepositInstructions?.bankAddress || '120 Broadway, New York, NY 10271, USA'}
                    </p>
                  </div>
                </div>

                {/* Transfer Memo Instructions */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-600 dark:text-emerald-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="font-bold">Required Transfer Reference / Memo:</p>
                    <p className="font-mono text-[11px] text-foreground select-all">
                      {adminSettings?.fiatDepositInstructions?.referencePlaceholder || 'Include your Account ID in transfer memo'} (Memo Ref: ACC-{primaryAccount?.accountNumber || currentUser?.id})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`ACC-${primaryAccount?.accountNumber || currentUser?.id}`, 'memo-ref')}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-[11px] hover:bg-emerald-600 transition-colors flex items-center gap-1"
                  >
                    {copied === 'memo-ref' ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copied === 'memo-ref' ? 'Copied' : 'Copy Memo'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Crypto Wallets Section (Tallying with Admin Payment Settings) */}
          {(activeTab === 'all' || activeTab === 'crypto') && (
            <div className="space-y-4 bg-card border border-border rounded-2xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-sm sm:text-base">
                  <Bitcoin size={20} />
                  <span>Bank Broker Crypto Deposit Wallets</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 w-fit">
                  Live Admin Payment Configuration
                </span>
              </div>

              <p className="text-xs text-foreground/60">
                Official deposit addresses configured by the bank administrator. Scan the QR code or copy the address. Deposits are cleared and credited to your balance upon standard network confirmations.
              </p>

              {/* Personal Assigned BTC Wallet (if set in Admin for Gary/User) */}
              {currentUser?.btcWallet && (
                <div className="bg-gradient-to-r from-amber-500/10 via-background to-amber-500/5 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-xs">
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveQrModal({
                          currency: 'BTC',
                          name: 'Dedicated Client Bitcoin Wallet',
                          network: 'Native SegWit (Bitcoin)',
                          address: currentUser.btcWallet!.trim(),
                          badge: 'Personal Dedicated',
                          symbol: '₿',
                          iconBg: 'bg-amber-500 text-white',
                          color: 'text-amber-500',
                          memo: 'Your personal dedicated custodial Bitcoin deposit address. Transferred crypto automatically clears and credits to your active balance.'
                        });
                        setQrFormat('address');
                      }}
                      className="w-16 h-16 shrink-0 bg-white p-1 rounded-lg border border-border flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform relative group/qr"
                      title="Click to enlarge scannable QR code"
                    >
                      <QRCodeSVG value={currentUser.btcWallet.trim()} size={54} level="M" includeMargin={true} />
                      <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover/qr:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Maximize2 size={16} />
                      </div>
                    </button>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                          Personal Dedicated Client Bitcoin Wallet Assigned to You
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                          Native SegWit
                        </span>
                      </div>
                      <p className="text-xs font-mono font-bold text-foreground break-all select-all bg-card px-2.5 py-1.5 rounded-lg border border-border">
                        {currentUser.btcWallet}
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentUser.btcWallet!.trim(), 'user-btc-wallet')}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      {copied === 'user-btc-wallet' ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copied === 'user-btc-wallet' ? 'Copied!' : 'Copy Dedicated Address'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveQrModal({
                          currency: 'BTC',
                          name: 'Dedicated Client Bitcoin Wallet',
                          network: 'Native SegWit (Bitcoin)',
                          address: currentUser.btcWallet!.trim(),
                          badge: 'Personal Dedicated',
                          symbol: '₿',
                          iconBg: 'bg-amber-500 text-white',
                          color: 'text-amber-500',
                          memo: 'Your personal dedicated custodial Bitcoin deposit address. Transferred crypto automatically clears and credits to your active balance.'
                        });
                        setQrFormat('address');
                      }}
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-background font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <QrCode size={13} />
                      <span>Scan / Enlarge QR</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 4 Broker Crypto Wallets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. BTC */}
                <div className="bg-background border border-border hover:border-amber-500/40 rounded-xl p-4 flex gap-3.5 items-start transition-all">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQrModal({
                        currency: 'BTC',
                        name: 'Bitcoin (BTC)',
                        network: 'Native SegWit (Bitcoin)',
                        address: brokerWallets.btc,
                        badge: 'BTC',
                        symbol: '₿',
                        iconBg: 'bg-amber-500 text-white',
                        color: 'text-amber-500',
                        memo: 'Send only Bitcoin (BTC) via the Native SegWit network to this address. Credits after 3 blockchain confirmations.',
                        qrImageUrl: brokerWallets.btcQr
                      });
                      setQrMode('image');
                      setQrFormat('address');
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white p-1 rounded-xl border border-border flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform relative group/qr overflow-hidden"
                    title="Click to enlarge and scan official Bitcoin QR Code"
                  >
                    {brokerWallets.btcQr ? (
                      <img 
                        src={brokerWallets.btcQr} 
                        alt="Bitcoin Official QR Code" 
                        className="w-full h-full object-contain rounded-lg" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : brokerWallets.btc ? (
                      <QRCodeSVG value={brokerWallets.btc} size={60} level="M" includeMargin={true} />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-mono">No QR</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/qr:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-bold gap-0.5">
                      <Maximize2 size={16} />
                      <span>Scan</span>
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Bitcoin (BTC)
                      </span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                        Native SegWit
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-foreground/80 break-all bg-card px-2 py-1.5 rounded-lg border border-border select-all mt-1">
                      {brokerWallets.btc}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-foreground/50">3 confirmations</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveQrModal({
                              currency: 'BTC',
                              name: 'Bitcoin (BTC)',
                              network: 'Native SegWit (Bitcoin)',
                              address: brokerWallets.btc,
                              badge: 'BTC',
                              symbol: '₿',
                              iconBg: 'bg-amber-500 text-white',
                              color: 'text-amber-500',
                              memo: 'Send only Bitcoin (BTC) via the Native SegWit network to this address. Credits after 3 blockchain confirmations.',
                              qrImageUrl: brokerWallets.btcQr
                            });
                            setQrMode('image');
                            setQrFormat('address');
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
                          title="Scan official Bitcoin QR code"
                        >
                          <QrCode size={12} />
                          <span>Scan QR</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(brokerWallets.btc, 'btc-wallet')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          {copied === 'btc-wallet' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copied === 'btc-wallet' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. ETH */}
                <div className="bg-background border border-border hover:border-indigo-500/40 rounded-xl p-4 flex gap-3.5 items-start transition-all">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQrModal({
                        currency: 'ETH',
                        name: 'Ethereum (ETH)',
                        network: 'Ethereum (ERC-20)',
                        address: brokerWallets.eth,
                        badge: 'ERC-20',
                        symbol: 'Ξ',
                        iconBg: 'bg-indigo-600 text-white',
                        color: 'text-indigo-400',
                        memo: 'Send only Ethereum (ETH) or compatible ERC-20 tokens to this address. Credits after 12 confirmations.',
                        qrImageUrl: brokerWallets.ethQr
                      });
                      setQrMode('image');
                      setQrFormat('address');
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white p-1 rounded-xl border border-border flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform relative group/qr overflow-hidden"
                    title="Click to enlarge and scan official Ethereum QR Code"
                  >
                    {brokerWallets.ethQr ? (
                      <img 
                        src={brokerWallets.ethQr} 
                        alt="Ethereum Official QR Code" 
                        className="w-full h-full object-contain rounded-lg" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : brokerWallets.eth ? (
                      <QRCodeSVG value={brokerWallets.eth} size={60} level="M" includeMargin={true} />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-mono">No QR</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/qr:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-bold gap-0.5">
                      <Maximize2 size={16} />
                      <span>Scan</span>
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        Ethereum (ETH)
                      </span>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">
                        ERC-20
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-foreground/80 break-all bg-card px-2 py-1.5 rounded-lg border border-border select-all mt-1">
                      {brokerWallets.eth}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-foreground/50">12 confirmations</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveQrModal({
                              currency: 'ETH',
                              name: 'Ethereum (ETH)',
                              network: 'Ethereum (ERC-20)',
                              address: brokerWallets.eth,
                              badge: 'ERC-20',
                              symbol: 'Ξ',
                              iconBg: 'bg-indigo-600 text-white',
                              color: 'text-indigo-400',
                              memo: 'Send only Ethereum (ETH) or compatible ERC-20 tokens to this address. Credits after 12 confirmations.',
                              qrImageUrl: brokerWallets.ethQr
                            });
                            setQrMode('image');
                            setQrFormat('address');
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
                          title="Scan official Ethereum QR code"
                        >
                          <QrCode size={12} />
                          <span>Scan QR</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(brokerWallets.eth, 'eth-wallet')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          {copied === 'eth-wallet' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copied === 'eth-wallet' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. USDT */}
                <div className="bg-background border border-border hover:border-emerald-500/40 rounded-xl p-4 flex gap-3.5 items-start transition-all">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQrModal({
                        currency: 'USDT',
                        name: 'Tether USD (USDT)',
                        network: 'TRON (TRC-20)',
                        address: brokerWallets.usdt,
                        badge: 'TRC-20',
                        symbol: '₮',
                        iconBg: 'bg-emerald-600 text-white',
                        color: 'text-emerald-500',
                        memo: 'Send only USDT via TRC-20 (TRON network) to this address. Transactions on other chains (ERC-20, BSC) cannot be recovered.',
                        qrImageUrl: brokerWallets.usdtQr
                      });
                      setQrMode('image');
                      setQrFormat('address');
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white p-1 rounded-xl border border-border flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform relative group/qr overflow-hidden"
                    title="Click to enlarge and scan official USDT TRC-20 QR Code"
                  >
                    {brokerWallets.usdtQr ? (
                      <img 
                        src={brokerWallets.usdtQr} 
                        alt="USDT TRC-20 Official QR Code" 
                        className="w-full h-full object-contain rounded-lg" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : brokerWallets.usdt ? (
                      <QRCodeSVG value={brokerWallets.usdt} size={60} level="M" includeMargin={true} />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-mono">No QR</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/qr:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-bold gap-0.5">
                      <Maximize2 size={16} />
                      <span>Scan</span>
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Tether USD (USDT)
                      </span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                        TRC-20 (Tron)
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-foreground/80 break-all bg-card px-2 py-1.5 rounded-lg border border-border select-all mt-1">
                      {brokerWallets.usdt}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-foreground/50">19 confirmations</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveQrModal({
                              currency: 'USDT',
                              name: 'Tether USD (USDT)',
                              network: 'TRON (TRC-20)',
                              address: brokerWallets.usdt,
                              badge: 'TRC-20',
                              symbol: '₮',
                              iconBg: 'bg-emerald-600 text-white',
                              color: 'text-emerald-500',
                              memo: 'Send only USDT via TRC-20 (TRON network) to this address. Transactions on other chains (ERC-20, BSC) cannot be recovered.',
                              qrImageUrl: brokerWallets.usdtQr
                            });
                            setQrMode('image');
                            setQrFormat('address');
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
                          title="Scan official USDT TRC-20 QR code"
                        >
                          <QrCode size={12} />
                          <span>Scan QR</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(brokerWallets.usdt, 'usdt-wallet')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          {copied === 'usdt-wallet' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copied === 'usdt-wallet' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. SOL */}
                <div className="bg-background border border-border hover:border-purple-500/40 rounded-xl p-4 flex gap-3.5 items-start transition-all">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQrModal({
                        currency: 'SOL',
                        name: 'Solana (SOL)',
                        network: 'Solana SPL',
                        address: brokerWallets.sol,
                        badge: 'SPL',
                        symbol: '◎',
                        iconBg: 'bg-purple-600 text-white',
                        color: 'text-purple-400',
                        memo: 'Send only Solana (SOL) or SPL assets to this address. Rapid transaction finality within 1 minute.',
                        qrImageUrl: brokerWallets.solQr
                      });
                      setQrMode('image');
                      setQrFormat('address');
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white p-1 rounded-xl border border-border flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform relative group/qr overflow-hidden"
                    title="Click to enlarge and scan official Solana QR Code"
                  >
                    {brokerWallets.solQr ? (
                      <img 
                        src={brokerWallets.solQr} 
                        alt="Solana Official QR Code" 
                        className="w-full h-full object-contain rounded-lg" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : brokerWallets.sol ? (
                      <QRCodeSVG value={brokerWallets.sol} size={60} level="M" includeMargin={true} />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-mono">No QR</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/qr:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-bold gap-0.5">
                      <Maximize2 size={16} />
                      <span>Scan</span>
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Solana (SOL)
                      </span>
                      <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded-full border border-purple-500/20">
                        Solana SPL
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-foreground/80 break-all bg-card px-2 py-1.5 rounded-lg border border-border select-all mt-1">
                      {brokerWallets.sol}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-foreground/50">Fast confirmation</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveQrModal({
                              currency: 'SOL',
                              name: 'Solana (SOL)',
                              network: 'Solana SPL',
                              address: brokerWallets.sol,
                              badge: 'SPL',
                              symbol: '◎',
                              iconBg: 'bg-purple-600 text-white',
                              color: 'text-purple-400',
                              memo: 'Send only Solana (SOL) or SPL assets to this address. Rapid transaction finality within 1 minute.',
                              qrImageUrl: brokerWallets.solQr
                            });
                            setQrMode('image');
                            setQrFormat('address');
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
                          title="Scan official Solana QR code"
                        >
                          <QrCode size={12} />
                          <span>Scan QR</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(brokerWallets.sol, 'sol-wallet')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          {copied === 'sol-wallet' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copied === 'sol-wallet' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 3. E-Wallet & PayPal Section */}
          {(activeTab === 'all' || activeTab === 'ewallet') && (
            <div className="space-y-4 bg-card border border-border rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-blue-500 font-bold text-sm sm:text-base">
                  <CreditCard size={20} />
                  <span>E-Wallet & PayPal Instructions</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Instant Clearing
                </span>
              </div>

              <div className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    {adminSettings?.eWalletInstructions?.providerName || 'Global Elite Official PayPal'}
                  </p>
                  <p className="text-xs text-foreground/60 font-mono">
                    {adminSettings?.eWalletInstructions?.accountEmail || 'deposits@globalelitebank.com'}
                  </p>
                  <p className="text-[11px] text-foreground/50 mt-1">
                    Include your Account #{primaryAccount?.accountNumber || currentUser?.id} in the payment notes/memo.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => copyToClipboard(adminSettings?.eWalletInstructions?.accountEmail || 'deposits@globalelitebank.com', 'ewallet-email')}
                  className="px-4 py-2.5 text-xs font-bold bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-xl flex items-center justify-center gap-2 transition-colors border border-blue-500/20 shrink-0"
                >
                  {copied === 'ewallet-email' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copied === 'ewallet-email' ? 'Email Copied!' : 'Copy Payment Email'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-foreground/50 text-center sm:text-left">
            Security Notice: Always verify recipient details prior to authorizing institutional transfers.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAcknowledgeAndClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              {isNewAccountNotice ? "I Have Saved My Deposit Instructions" : "Close Instructions"}
            </button>
          </div>
        </div>

      </div>

      {/* Enlarged Scannable QR Code Modal */}
      {activeQrModal && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setActiveQrModal(null)}
        >
          <div 
            className="bg-card border border-border w-full max-w-sm rounded-3xl p-5 sm:p-6 text-center shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Navigation Bar with Back Arrow and Cancel Button */}
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-border/70">
              <button 
                type="button"
                onClick={() => setActiveQrModal(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer"
                title="Go back to wallet instructions"
              >
                <ArrowLeft size={16} className="shrink-0" />
                <span>Go Back</span>
              </button>

              <button 
                type="button"
                onClick={() => setActiveQrModal(null)}
                className="flex items-center gap-1 text-xs font-semibold text-foreground/60 hover:text-foreground px-2.5 py-1 rounded-full hover:bg-foreground/5 transition-colors cursor-pointer"
                title="Cancel and close"
              >
                <span>Cancel</span>
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${activeQrModal.iconBg}`}>
                {activeQrModal.symbol}
              </span>
              <h3 className="font-bold text-lg text-foreground">{activeQrModal.name}</h3>
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-3">
              <span className="text-[11px] font-semibold text-foreground/70 bg-background px-3 py-0.5 rounded-full border border-border">
                Network: <strong className="text-foreground">{activeQrModal.network}</strong>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Live Matched
              </span>
            </div>

            {/* Toggle between Official Embedded Image & Dynamic Raw Code when image exists */}
            {activeQrModal.qrImageUrl && (
              <div className="flex rounded-xl bg-background p-1 border border-border mb-3 text-xs">
                <button
                  type="button"
                  onClick={() => setQrMode('image')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
                    qrMode === 'image' 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Official QR Image
                </button>
                <button
                  type="button"
                  onClick={() => setQrMode('code')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
                    qrMode === 'code' 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Dynamic Generator
                </button>
              </div>
            )}

            {/* If in dynamic generator mode or no image, show URI vs Address toggle */}
            {(!activeQrModal.qrImageUrl || qrMode === 'code') && (
              <div className="flex rounded-xl bg-background p-1 border border-border mb-3 text-xs">
                <button
                  type="button"
                  onClick={() => setQrFormat('address')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
                    qrFormat === 'address' 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Standard Address
                </button>
                <button
                  type="button"
                  onClick={() => setQrFormat('uri')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
                    qrFormat === 'uri' 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Wallet URI (BIP-21)
                </button>
              </div>
            )}

            {/* Main Display: Embedded Image with Crypto Labels OR Crisp SVG */}
            {activeQrModal.qrImageUrl && qrMode === 'image' ? (
              <div className="bg-white p-3 rounded-2xl border-2 border-border shadow-md inline-block mb-3 max-w-[280px] sm:max-w-[300px] w-full">
                <img 
                  id={`geb-instructions-qr-${activeQrModal.currency}`}
                  src={activeQrModal.qrImageUrl}
                  alt={`${activeQrModal.name} Official QR Code`}
                  className="w-full h-auto max-h-[290px] object-contain rounded-xl mx-auto block shadow-xs"
                  referrerPolicy="no-referrer"
                />
                {/* Respective Crypto Label embedded directly below the QR image */}
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeQrModal.iconBg}`} />
                    <span className="text-xs font-bold text-gray-900">{activeQrModal.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                    {activeQrModal.badge}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl border-2 border-border shadow-md inline-block mb-3">
                <QRCodeSVG 
                  id={`geb-instructions-qr-${activeQrModal.currency}`}
                  value={getCryptoUri(activeQrModal.currency, activeQrModal.address, qrFormat)}
                  size={210} 
                  level="Q" 
                  includeMargin={true}
                />
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-gray-900">{activeQrModal.name}</span>
                  <span className="text-[10px] font-mono text-gray-500 font-bold">{activeQrModal.badge}</span>
                </div>
              </div>
            )}

            <p className="text-[11px] text-foreground/60 mb-2">
              Scan with your crypto wallet (Trust Wallet, Binance, Coinbase, MetaMask, Phantom) to send or receive funds.
            </p>

            {/* Address Box */}
            <div className="bg-background border border-border rounded-xl p-3 mb-3 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
                  {qrFormat === 'uri' && qrMode === 'code' ? 'Encoded URI Payload' : 'Exact Deposit Address'}
                </span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">100% Tally Verified</span>
              </div>
              <p className="text-xs font-mono text-foreground font-semibold break-all leading-relaxed select-all">
                {activeQrModal.address}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button 
                type="button"
                onClick={() => copyToClipboard(activeQrModal.address, `modal-${activeQrModal.currency}`)}
                className="bg-primary text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
              >
                {copied === `modal-${activeQrModal.currency}` ? (
                  <>
                    <Check size={14} className="text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Address</span>
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => downloadQR(activeQrModal.currency, activeQrModal.qrImageUrl)}
                className="bg-background border border-border text-foreground font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs hover:bg-foreground/5 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Save QR Code</span>
              </button>
            </div>

            {/* Memo / Network Caution */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[11px] text-amber-600 dark:text-amber-400 text-left flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{activeQrModal.memo}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
