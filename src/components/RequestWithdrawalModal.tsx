import React, { useState } from 'react';
import { 
  X, 
  ArrowDownToLine, 
  AlertCircle, 
  CheckCircle2, 
  Coins, 
  ShieldAlert, 
  Info, 
  Sparkles,
  ArrowRight,
  Wallet,
  Lock
} from 'lucide-react';
import { useBank } from '../store';

interface RequestWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultSource?: 'investor' | 'crypto_portfolio';
}

const SUPPORTED_ASSETS = [
  { currency: 'USDT', name: 'Tether USD', network: 'TRC-20 (Tron)', defaultPrice: 1.00, symbol: '₮', iconBg: 'bg-emerald-500/20 text-emerald-400' },
  { currency: 'BTC', name: 'Bitcoin', network: 'Bitcoin Mainnet', defaultPrice: 65100.00, symbol: '₿', iconBg: 'bg-amber-500/20 text-amber-400' },
  { currency: 'ETH', name: 'Ethereum', network: 'ERC-20 (Ethereum)', defaultPrice: 3420.50, symbol: 'Ξ', iconBg: 'bg-indigo-500/20 text-indigo-400' },
  { currency: 'SOL', name: 'Solana', network: 'Solana Network', defaultPrice: 145.20, symbol: '◎', iconBg: 'bg-purple-500/20 text-purple-400' },
  { currency: 'BNB', name: 'Binance Coin', network: 'BEP-20 (BNB Chain)', defaultPrice: 580.40, symbol: 'B', iconBg: 'bg-yellow-500/20 text-yellow-400' },
  { currency: 'XRP', name: 'Ripple', network: 'XRP Ledger', defaultPrice: 0.62, symbol: '✕', iconBg: 'bg-blue-500/20 text-blue-400' },
];

export function RequestWithdrawalModal({ isOpen, onClose, onSuccess, defaultSource = 'investor' }: RequestWithdrawalModalProps) {
  const { currentUser, adminSettings, requestCryptoWithdrawal, investments } = useBank();

  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [amountUsd, setAmountUsd] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [memo, setMemo] = useState('');
  const [sourceWallet, setSourceWallet] = useState<'investor' | 'crypto_portfolio'>(defaultSource);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  const maxLimit = adminSettings?.maxCryptoWithdrawalLimit || 25000;
  const currentAsset = SUPPORTED_ASSETS.find(a => a.currency === selectedCurrency) || SUPPORTED_ASSETS[0];

  const parsedAmountUsd = parseFloat(amountUsd) || 0;
  const cryptoEquivalent = parsedAmountUsd > 0 && currentAsset.defaultPrice > 0
    ? (parsedAmountUsd / currentAsset.defaultPrice).toFixed(6)
    : '0.000000';

  const investorBalance = currentUser.investorWallets?.balance || 0;
  const maxAvailableBalance = sourceWallet === 'investor' ? investorBalance : 100000;

  const userActiveStakes = (investments || []).filter(inv => inv.userId === currentUser.id && (inv.status === 'active' || inv.status === 'pending'));
  const lockedPrincipal = userActiveStakes.reduce((acc, inv) => acc + (inv.amount || 0), 0);

  const isExceedingAdminLimit = parsedAmountUsd > maxLimit;
  const isBelowMinLimit = parsedAmountUsd > 0 && parsedAmountUsd < 100;
  const isExceedingBalance = sourceWallet === 'investor' && parsedAmountUsd > investorBalance;

  const handleSetMaxLimit = () => {
    const target = Math.min(maxLimit, sourceWallet === 'investor' && investorBalance > 0 ? investorBalance : maxLimit);
    setAmountUsd(target.toString());
    setErrorMsg(null);
  };

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setWalletAddress(text.trim());
    } catch (e) {
      console.warn('Clipboard read failed:', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!amountUsd || parsedAmountUsd <= 0) {
      setErrorMsg('Please enter a valid withdrawal amount.');
      return;
    }

    if (parsedAmountUsd < 100) {
      setErrorMsg('Minimum crypto withdrawal amount is $100.00 USD. You cannot withdraw below $100 USD.');
      return;
    }

    if (isExceedingAdminLimit) {
      setErrorMsg(`Withdrawal amount cannot exceed $${maxLimit.toLocaleString()} USD as managed by the administrator.`);
      return;
    }

    if (isExceedingBalance) {
      setErrorMsg(`Requested amount ($${parsedAmountUsd.toLocaleString()}) exceeds your available balance ($${investorBalance.toLocaleString()}).`);
      return;
    }

    if (!walletAddress.trim()) {
      setErrorMsg('Please provide a valid destination crypto wallet address.');
      return;
    }

    const result = requestCryptoWithdrawal({
      userId: currentUser.id,
      userName: currentUser.name || 'Private Client',
      userEmail: currentUser.email,
      amount: parsedAmountUsd,
      cryptoAmount: parseFloat(cryptoEquivalent),
      currency: currentAsset.currency,
      network: currentAsset.network,
      walletAddress: walletAddress.trim(),
      memo: memo.trim() || undefined,
      sourceWallet,
      networkFee: 12.50
    });

    if (result.success) {
      setIsSubmitted(true);
      setLastSubmittedId(result.request?.receiptNumber || result.request?.id || 'CW-SUBMITTED');
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setAmountUsd('');
    setWalletAddress('');
    setMemo('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-background/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
              <ArrowDownToLine size={18} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Request Crypto Withdrawal</h3>
              <p className="text-xs text-foreground/60">Automated settlement & official on-chain receipt</p>
            </div>
          </div>
          <button 
            onClick={handleResetAndClose}
            className="text-foreground/40 hover:text-foreground p-1.5 rounded-xl hover:bg-foreground/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {isSubmitted ? (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">Withdrawal Request Dispatched!</h4>
                <p className="text-xs text-foreground/60 mt-1 max-w-sm mx-auto">
                  Your request for <span className="font-bold text-foreground">{cryptoEquivalent} {currentAsset.currency}</span> (${parsedAmountUsd.toLocaleString()} USD) has been submitted for compliance verification.
                </p>
              </div>

              <div className="bg-background/80 border border-border rounded-2xl p-4 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-foreground/50">Tracking Reference:</span>
                  <span className="font-mono font-bold text-foreground">{lastSubmittedId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/50">Destination Network:</span>
                  <span className="font-semibold text-foreground">{currentAsset.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/50">Settlement Status:</span>
                  <span className="font-bold text-amber-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                    Pending Admin Approval
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary max-w-sm mx-auto flex items-start gap-2 text-left">
                <Sparkles size={16} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Automatic Official Receipt:</strong> As soon as the administrator verifies and approves this request, your formal cryptographic transaction receipt will be generated automatically and accessible under your receipts tab.
                </span>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full max-w-sm bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Admin Policy Limit & Principal Lock Notice Card */}
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-start gap-3">
                  <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-500 uppercase tracking-wide">
                        Swiss Compliance & Withdrawal Policy
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
                        <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/30">
                          Min: $100 USD
                        </span>
                        <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/30">
                          Cap: ${maxLimit.toLocaleString()} USD
                        </span>
                      </div>
                    </div>
                    <p className="text-foreground/80 mt-1 leading-relaxed">
                      <strong>Admin Discretionary Review:</strong> Every crypto withdrawal is subject to admin approval. An investor can request any amount up to the cap; the admin has full authority to review, adjust the credited amount, and disburse to your wallet address.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-amber-500/20 text-[11px] text-amber-500">
                  <Lock size={13} className="shrink-0" />
                  <span>
                    <strong>Principal Lockup:</strong> Staked principal is locked for the fixed duration approved by the admin. Only realized profits may be withdrawn or reinvested.
                  </span>
                </div>
              </div>

              {/* Source Balance Selector */}
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1.5">
                  Funding Wallet Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSourceWallet('investor')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      sourceWallet === 'investor'
                        ? 'border-primary bg-primary/10 text-foreground shadow-xs'
                        : 'border-border bg-background hover:bg-foreground/5 text-foreground/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold">Realized Profits</span>
                      <Wallet size={12} className="text-primary" />
                    </div>
                    <p className="text-sm font-black font-mono">
                      ${investorBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-0.5">
                      Available to withdraw
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSourceWallet('crypto_portfolio')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      sourceWallet === 'crypto_portfolio'
                        ? 'border-primary bg-primary/10 text-foreground shadow-xs'
                        : 'border-border bg-background hover:bg-foreground/5 text-foreground/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold">Crypto Portfolio</span>
                      <Coins size={12} className="text-emerald-500" />
                    </div>
                    <p className="text-sm font-black font-mono text-emerald-500">
                      Multi-Asset Vault
                    </p>
                    <p className="text-[10px] text-foreground/50 mt-0.5">
                      Admin-cleared assets
                    </p>
                  </button>
                </div>

                {userActiveStakes.length > 0 && (
                  <div className="mt-2 px-3 py-2 bg-background/80 border border-border/80 rounded-xl flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-foreground/60 text-[11px]">
                      <Lock size={12} className="text-amber-500" />
                      Active Staked Principal ({userActiveStakes.length} contract{userActiveStakes.length > 1 ? 's' : ''}):
                    </span>
                    <span className="font-mono font-bold text-amber-500 text-[11px]">
                      Locked until maturity
                    </span>
                  </div>
                )}
              </div>

              {/* Asset Selector */}
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1.5">
                  Select Crypto Asset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SUPPORTED_ASSETS.map((asset) => (
                    <button
                      type="button"
                      key={asset.currency}
                      onClick={() => setSelectedCurrency(asset.currency)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                        selectedCurrency === asset.currency
                          ? 'border-primary bg-primary/10 text-foreground shadow-xs'
                          : 'border-border bg-background hover:bg-foreground/5 text-foreground/70'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${asset.iconBg}`}>
                        {asset.symbol}
                      </span>
                      <div className="text-left min-w-0">
                        <p className="text-xs font-bold truncate leading-none">{asset.currency}</p>
                        <p className="text-[10px] text-foreground/50 truncate mt-0.5">${asset.defaultPrice.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-foreground/50 mt-1.5">
                  Target Network: <span className="font-semibold text-foreground">{currentAsset.network}</span>
                </p>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
                    Amount to Withdraw (USD)
                  </label>
                  <button
                    type="button"
                    onClick={handleSetMaxLimit}
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    Set Max Limit (${maxLimit.toLocaleString()})
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/50 font-bold text-base">$</span>
                  <input
                    type="number"
                    step="any"
                    min="100"
                    value={amountUsd}
                    onChange={(e) => {
                      setAmountUsd(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder={`Min. $100 (e.g. 500)`}
                    className={`w-full bg-background border rounded-xl pl-8 pr-28 py-3 text-base font-mono font-bold outline-none transition-all ${
                      isExceedingAdminLimit || isBelowMinLimit
                        ? 'border-rose-500 ring-2 ring-rose-500/20 text-rose-500'
                        : 'border-border focus:border-primary'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-right pointer-events-none">
                    <span className="text-xs font-bold font-mono text-foreground/80">
                      ≈ {cryptoEquivalent} {currentAsset.currency}
                    </span>
                  </div>
                </div>

                {/* Quick preset amount chips */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-foreground/50 uppercase font-bold">Quick:</span>
                  {[
                    { label: '$100 Min', val: 100 },
                    { label: '$500', val: 500 },
                    { label: '$1,000', val: 1000 },
                    { label: `$${Math.min(5000, maxLimit).toLocaleString()}`, val: Math.min(5000, maxLimit) }
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => { setAmountUsd(chip.val.toString()); setErrorMsg(null); }}
                      className="px-2 py-0.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-border text-[11px] font-mono font-bold text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Warning Banner if below minimum limit */}
                {isBelowMinLimit && (
                  <div className="mt-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-500">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>Minimum withdrawal is $100.00 USD. Below $100 cannot be processed.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setAmountUsd('100'); setErrorMsg(null); }}
                      className="font-bold underline text-[11px] ml-2 shrink-0 hover:text-amber-400"
                    >
                      Set $100 Min
                    </button>
                  </div>
                )}

                {/* Warning Banner if exceeding limit */}
                {isExceedingAdminLimit && (
                  <div className="mt-2 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs text-rose-500">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>Exceeds admin limit (${maxLimit.toLocaleString()} USD).</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSetMaxLimit}
                      className="font-bold underline text-[11px] ml-2 shrink-0 hover:text-rose-400"
                    >
                      Cap to ${maxLimit.toLocaleString()}
                    </button>
                  </div>
                )}

                {isExceedingBalance && !isExceedingAdminLimit && (
                  <div className="mt-2 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-500">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>Exceeds available balance (${investorBalance.toLocaleString()} USD).</span>
                  </div>
                )}
              </div>

              {/* Destination Wallet Address */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
                    Destination {currentAsset.currency} Address
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteAddress}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Paste from Clipboard
                  </button>
                </div>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder={`Enter your ${currentAsset.name} address (${currentAsset.network})`}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary outline-none"
                />
              </div>

              {/* Memo (optional) */}
              {(currentAsset.currency === 'XRP' || currentAsset.currency === 'BNB') && (
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1.5">
                    Destination Tag / Memo (Optional)
                  </label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Enter numeric destination tag if required by your exchange"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary outline-none"
                  />
                </div>
              )}

              {/* Generic Error message */}
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-500 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isExceedingAdminLimit || isExceedingBalance || !amountUsd || !walletAddress}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm"
              >
                <span>Submit Withdrawal Request</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
