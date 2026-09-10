import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  TrendingUp, 
  Coins, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useBank } from '../store';

interface ReinvestProfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SUPPORTED_CURRENCIES = [
  { currency: 'USDT', name: 'Tether USD', price: 1.00, symbol: '₮', badge: 'TRC-20' },
  { currency: 'BTC', name: 'Bitcoin', price: 65100.00, symbol: '₿', badge: 'Mainnet' },
  { currency: 'ETH', name: 'Ethereum', price: 3420.50, symbol: 'Ξ', badge: 'ERC-20' },
  { currency: 'SOL', name: 'Solana', price: 145.20, symbol: '◎', badge: 'SOL' },
  { currency: 'BNB', name: 'BNB Chain', price: 580.40, symbol: 'B', badge: 'BEP-20' }
];

const DURATION_TIERS = [
  { days: 7, label: '7 Days', roiPercent: 4.5, tierName: 'Standard Yield' },
  { days: 14, label: '14 Days', roiPercent: 8.2, tierName: 'Enhanced Yield' },
  { days: 30, label: '30 Days', roiPercent: 15.0, tierName: 'Premium Alpha' },
  { days: 60, label: '60 Days', roiPercent: 24.0, tierName: 'Institutional' },
  { days: 90, label: '90 Days', roiPercent: 35.0, tierName: 'Treasury Vault' }
];

export function ReinvestProfitModal({ isOpen, onClose, onSuccess }: ReinvestProfitModalProps) {
  const { currentUser, reinvestProfit } = useBank();

  const availableProfit = currentUser?.investorWallets?.balance || 0;

  const [amountUsd, setAmountUsd] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [selectedDurationDays, setSelectedDurationDays] = useState(30);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastCreatedTxHash, setLastCreatedTxHash] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  const parsedAmount = parseFloat(amountUsd) || 0;
  const activeAsset = SUPPORTED_CURRENCIES.find(c => c.currency === selectedCurrency) || SUPPORTED_CURRENCIES[0];
  const activeTier = DURATION_TIERS.find(t => t.days === selectedDurationDays) || DURATION_TIERS[2];

  const estimatedCrypto = parsedAmount > 0 ? (parsedAmount / activeAsset.price).toFixed(6) : '0.000000';
  const projectedProfit = parsedAmount > 0 ? ((parsedAmount * activeTier.roiPercent) / 100).toFixed(2) : '0.00';
  const maturationDate = new Date(Date.now() + selectedDurationDays * 86400000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleSetPercent = (pct: number) => {
    setErrorMsg(null);
    const calculated = (availableProfit * pct) / 100;
    setAmountUsd(Math.floor(calculated).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (parsedAmount <= 0) {
      setErrorMsg('Please enter an amount of profit to reinvest.');
      return;
    }

    if (parsedAmount < 50) {
      setErrorMsg('Minimum profit reinvestment is $50.00 USD.');
      return;
    }

    if (parsedAmount > availableProfit) {
      setErrorMsg(`Entered amount exceeds your available profit balance of $${availableProfit.toLocaleString()} USD.`);
      return;
    }

    const res = reinvestProfit({
      userId: currentUser.id,
      amount: parsedAmount,
      currency: selectedCurrency,
      durationDays: selectedDurationDays
    });

    if (res.success) {
      setIsSuccess(true);
      setLastCreatedTxHash(res.investment?.txHash || 'CONFIRMED');
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleCloseAndReset = () => {
    setIsSuccess(false);
    setAmountUsd('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-background/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseAndReset();
      }}
    >
      <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <RefreshCw size={18} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Reinvest Profit</h3>
              <p className="text-xs text-foreground/60">Compound profits into institutional fixed duration stakes</p>
            </div>
          </div>
          <button 
            onClick={handleCloseAndReset}
            className="text-foreground/40 hover:text-foreground p-1.5 rounded-xl hover:bg-foreground/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">Profit Reinvestment Confirmed!</h4>
                <p className="text-xs text-foreground/60 mt-1 max-w-sm mx-auto">
                  <strong className="text-foreground">${parsedAmount.toLocaleString()} USD</strong> has been converted into a <strong className="text-foreground">{selectedDurationDays}-day {selectedCurrency} stake</strong>.
                </p>
              </div>

              <div className="bg-background/80 border border-border rounded-2xl p-4 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-foreground/50">Contract Asset:</span>
                  <span className="font-mono font-bold text-foreground">{estimatedCrypto} {selectedCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/50">Fixed Lock Duration:</span>
                  <span className="font-bold text-foreground">{selectedDurationDays} Days (Admin Approved)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/50">Maturation Date:</span>
                  <span className="font-semibold text-foreground">{maturationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/50">Projected Yield:</span>
                  <span className="font-bold text-emerald-500">+{activeTier.roiPercent}% (+${projectedProfit} USD)</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-500 max-w-sm mx-auto flex items-start gap-2 text-left">
                <Lock size={15} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Principal Locked:</strong> In accordance with bank rules, this principal cannot be withdrawn until the {selectedDurationDays}-day duration approved by the admin has completed. Realized profits can be withdrawn or reinvested.
                </span>
              </div>

              <button
                type="button"
                onClick={handleCloseAndReset}
                className="w-full max-w-sm bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20"
              >
                View Active Portfolio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profit Balance Card */}
              <div className="bg-gradient-to-br from-emerald-950/40 via-background to-card border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-500 flex items-center gap-1">
                    <Sparkles size={12} />
                    Available Profit for Reinvestment
                  </span>
                  <div className="text-2xl font-black text-foreground font-mono mt-1">
                    ${availableProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-normal text-foreground/50">USD</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-foreground/50">Zero Out-of-Pocket</span>
                  <p className="text-xs font-bold text-emerald-500 mt-0.5">Funded from Gains</p>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
                    Reinvestment Amount ($ USD)
                  </label>
                  <span className="text-[11px] text-foreground/50 font-mono">
                    Equiv: ~{estimatedCrypto} {selectedCurrency}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-foreground/40 text-sm">$</span>
                  <input
                    type="number"
                    value={amountUsd}
                    onChange={(e) => {
                      setAmountUsd(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder="Enter amount (min $50)"
                    min="50"
                    step="any"
                    className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-2.5 text-sm text-foreground font-mono focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Quick percentages */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSetPercent(pct)}
                      className="py-1 px-2 rounded-lg bg-background hover:bg-foreground/5 border border-border text-[11px] font-bold text-foreground/70 hover:text-foreground transition-colors"
                    >
                      {pct === 100 ? 'Max (100%)' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Currency Selection */}
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1.5">
                  Target Crypto Asset
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {SUPPORTED_CURRENCIES.map((asset) => (
                    <button
                      key={asset.currency}
                      type="button"
                      onClick={() => setSelectedCurrency(asset.currency)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        selectedCurrency === asset.currency
                          ? 'border-emerald-500 bg-emerald-500/10 text-foreground font-bold shadow-xs'
                          : 'border-border bg-background hover:bg-foreground/5 text-foreground/70'
                      }`}
                    >
                      <div className="text-sm font-mono">{asset.symbol} {asset.currency}</div>
                      <div className="text-[10px] opacity-60 mt-0.5">{asset.badge}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fixed Duration Selection (Admin Approved) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock size={12} className="text-amber-500" />
                    Fixed Duration (Admin Approved Lockup)
                  </label>
                  <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    Principal Locked
                  </span>
                </div>
                <div className="space-y-2">
                  {DURATION_TIERS.map((tier) => {
                    const isSelected = selectedDurationDays === tier.days;
                    const tierGain = parsedAmount > 0 ? ((parsedAmount * tier.roiPercent) / 100).toFixed(2) : '0.00';
                    return (
                      <div
                        key={tier.days}
                        onClick={() => setSelectedDurationDays(tier.days)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/10 text-foreground shadow-xs'
                            : 'border-border bg-background hover:bg-foreground/5 text-foreground/70'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="duration"
                            checked={isSelected}
                            onChange={() => setSelectedDurationDays(tier.days)}
                            className="text-emerald-500"
                          />
                          <div>
                            <div className="text-xs font-bold text-foreground flex items-center gap-2">
                              <span>{tier.label}</span>
                              <span className="text-[10px] text-foreground/50 font-normal">({tier.tierName})</span>
                            </div>
                            <div className="text-[11px] text-foreground/50 flex items-center gap-1 mt-0.5">
                              <Calendar size={11} />
                              <span>Matures {new Date(Date.now() + tier.days * 86400000).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-500">+{tier.roiPercent}% ROI</div>
                          <div className="text-[10px] text-foreground/50 font-mono">
                            {parsedAmount > 0 ? `+$${tierGain} USD` : 'Yield'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Policy Disclosure Box */}
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3.5 space-y-1.5 text-xs text-foreground/80 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-amber-500">
                  <Lock size={14} />
                  <span>Rule: Principal Locked Until Admin-Approved Duration</span>
                </div>
                <p className="text-[11px] text-foreground/70">
                  By bank regulation, your principal remains locked in institutional trading custody for the exact duration of <strong>{selectedDurationDays} days</strong> approved by the administrator.
                </p>
                <p className="text-[11px] text-foreground/70">
                  You can freely withdraw or reinvest any profits earned from this contract. All crypto withdrawals are subject to compliance administrator approval.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseAndReset}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-border text-xs font-bold text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={availableProfit <= 0}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                    availableProfit > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 active:scale-95'
                      : 'bg-foreground/20 cursor-not-allowed opacity-60'
                  }`}
                >
                  <RefreshCw size={14} />
                  <span>Confirm Reinvestment</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
