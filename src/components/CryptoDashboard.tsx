import { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, YAxis } from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Activity, 
  Bell, 
  BellRing, 
  Plus, 
  Trash2, 
  X, 
  Zap, 
  Lock, 
  TrendingUp, 
  Calculator, 
  Coins, 
  AlertTriangle,
  ArrowDownToLine,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ArrowLeftRight,
  QrCode,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBank, CryptoWithdrawalRequest, CryptoTradeOrder } from '../store';
import { RequestWithdrawalModal } from './RequestWithdrawalModal';
import { CryptoReceiptModal } from './CryptoReceiptModal';
import { PaymentInstructionsModal } from './PaymentInstructionsModal';
import { QRCodeSVG } from 'qrcode.react';

const data = [
  { time: '00:00', price: 61200 },
  { time: '04:00', price: 62500 },
  { time: '08:00', price: 61800 },
  { time: '12:00', price: 63400 },
  { time: '16:00', price: 64200 },
  { time: '20:00', price: 63800 },
  { time: '24:00', price: 65100 },
];

export function CryptoDashboard() {
  const { currentUser, adminSettings, cryptoWithdrawals, cryptoOrders, requestCryptoTradeOrder } = useBank();
  const [activeModal, setActiveModal] = useState<'buy' | 'deposit' | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedReceiptWithdrawal, setSelectedReceiptWithdrawal] = useState<CryptoWithdrawalRequest | null>(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<CryptoTradeOrder | null>(null);

  // Separated Balances: Crypto vs Bank Credit
  const cryptoBalance = currentUser?.investorWallets?.balance || 0;
  const bankCreditBalance = currentUser?.accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;

  
  // Quick Trade States
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeCoin, setTradeCoin] = useState<'BTC' | 'ETH' | 'BNB' | 'XRP' | 'ADA'>('BTC');
  const [payAmount, setPayAmount] = useState<string>('5000');
  const [receiveAmount, setReceiveAmount] = useState<string>('0.076805');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [tradeConfirmationModal, setTradeConfirmationModal] = useState<CryptoTradeOrder | null>(null);
  const [tradeError, setTradeError] = useState<string>('');
  const [historyTab, setHistoryTab] = useState<'trades' | 'withdrawals'>('trades');
  const [depositCopied, setDepositCopied] = useState(false);

  const [alerts, setAlerts] = useState([
    { id: 1, coin: 'BTC', target: 68000, condition: 'above', active: true },
    { id: 2, coin: 'ETH', target: 3300, condition: 'below', active: true }
  ]);
  const [newAlertCoin, setNewAlertCoin] = useState('BTC');
  const [newAlertTarget, setNewAlertTarget] = useState('');
  const [newAlertCondition, setNewAlertCondition] = useState('above');
  
  const [stakeCoin, setStakeCoin] = useState('ETH');
  const [stakeAmount, setStakeAmount] = useState('10');
  const [stakePeriod, setStakePeriod] = useState(30);

  const stakingRates = {
    ETH: { 30: 4.5, 60: 5.2, 90: 6.1, symbol: 'Ξ', color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
    SOL: { 30: 6.5, 60: 7.1, 90: 8.4, symbol: '◎', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    DOT: { 30: 10.5, 60: 12.0, 90: 14.5, symbol: '●', color: 'text-pink-500', bg: 'bg-pink-500/20' },
  };

  const currentApy = stakingRates[stakeCoin as keyof typeof stakingRates][stakePeriod as 30 | 60 | 90];
  const parsedAmount = parseFloat(stakeAmount) || 0;
  const projectedYield = parsedAmount * (currentApy / 100) * (stakePeriod / 365);
  const totalReturn = parsedAmount + projectedYield;

  // Fixed benchmark for BTC at $65,100.00 as required
  const [livePrices, setLivePrices] = useState({
    BTC: 65100.00,
    ETH: 3420.50,
    BNB: 580.40,
    XRP: 0.62,
    ADA: 0.45,
  });

  const [toasts, setToasts] = useState<any[]>([]);

  // Current exchange rate for the selected trade coin
  const currentRate = tradeCoin === 'BTC' ? 65100.00 : (livePrices[tradeCoin] || 1000);

  // Synchronize amounts dynamically
  const handlePayAmountChange = (val: string) => {
    setPayAmount(val);
    setTradeError('');
    const parsed = parseFloat(val);
    if (!val || isNaN(parsed) || parsed <= 0) {
      setReceiveAmount('');
      return;
    }
    if (tradeType === 'buy') {
      // Pay USD, Receive Crypto
      const crypto = parsed / currentRate;
      setReceiveAmount(crypto.toFixed(6));
    } else {
      // Pay Crypto, Receive USD
      const usd = parsed * currentRate;
      setReceiveAmount(usd.toFixed(2));
    }
  };

  const handleReceiveAmountChange = (val: string) => {
    setReceiveAmount(val);
    setTradeError('');
    const parsed = parseFloat(val);
    if (!val || isNaN(parsed) || parsed <= 0) {
      setPayAmount('');
      return;
    }
    if (tradeType === 'buy') {
      // Receive Crypto, Pay USD
      const usd = parsed * currentRate;
      setPayAmount(usd.toFixed(2));
    } else {
      // Receive USD, Pay Crypto
      const crypto = parsed / currentRate;
      setPayAmount(crypto.toFixed(6));
    }
  };

  const handleToggleTradeType = (newType: 'buy' | 'sell') => {
    if (newType === tradeType) return;
    setTradeType(newType);
    setTradeError('');
    if (newType === 'buy') {
      setPayAmount('5000');
      setReceiveAmount((5000 / currentRate).toFixed(6));
    } else {
      const defaultCrypto = (5000 / currentRate).toFixed(6);
      setPayAmount(defaultCrypto);
      setReceiveAmount('5000.00');
    }
  };

  const handleSelectCoin = (coin: 'BTC' | 'ETH' | 'BNB' | 'XRP' | 'ADA') => {
    setTradeCoin(coin);
    setTradeError('');
    const newRate = coin === 'BTC' ? 65100.00 : (livePrices[coin] || 1000);
    const parsed = parseFloat(payAmount);
    if (!isNaN(parsed) && parsed > 0) {
      if (tradeType === 'buy') {
        setReceiveAmount((parsed / newRate).toFixed(6));
      } else {
        setReceiveAmount((parsed * newRate).toFixed(2));
      }
    }
  };

  const handleConfirmOrder = () => {
    setTradeError('');
    if (!currentUser) {
      setTradeError('Please log in to your account to place crypto trade orders.');
      return;
    }

    const payNum = parseFloat(payAmount);
    const receiveNum = parseFloat(receiveAmount);

    if (isNaN(payNum) || payNum <= 0 || isNaN(receiveNum) || receiveNum <= 0) {
      setTradeError('Please enter a valid positive trade amount.');
      return;
    }

    const fiatAmount = tradeType === 'buy' ? payNum : receiveNum;
    const cryptoAmount = tradeType === 'buy' ? receiveNum : payNum;

    // USD balance validation for Buy order
    const primaryAccount = currentUser.accounts?.[0];
    if (tradeType === 'buy' && primaryAccount && primaryAccount.balance < fiatAmount) {
      setTradeError(`Insufficient USD balance ($${primaryAccount.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} available). Please fund your account.`);
      return;
    }

    setIsSubmittingOrder(true);
    setTimeout(() => {
      const res = requestCryptoTradeOrder({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        orderType: tradeType,
        cryptoCurrency: tradeCoin,
        fiatCurrency: 'USD',
        cryptoAmount,
        fiatAmount,
        exchangeRate: currentRate,
        notes: `Instant ${tradeType.toUpperCase()} order placed via Quick Trade Desk at spot rate 1 ${tradeCoin} = $${currentRate.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD.`
      });

      setIsSubmittingOrder(false);
      if (res.success && res.order) {
        setTradeConfirmationModal(res.order);
        setHistoryTab('trades');
      } else {
        setTradeError(res.message || 'Unable to place trade order. Please try again.');
      }
    }, 450);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices(prev => {
        return {
          BTC: prev.BTC + (Math.random() - 0.5) * 800,
          ETH: prev.ETH + (Math.random() - 0.5) * 80,
          BNB: prev.BNB + (Math.random() - 0.5) * 10,
          XRP: prev.XRP + (Math.random() - 0.5) * 0.05,
          ADA: prev.ADA + (Math.random() - 0.5) * 0.02,
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    alerts.forEach(alert => {
      if (!alert.active) return;
      const currentPrice = alert.coin === 'BTC' ? livePrices.BTC : livePrices.ETH;
      const triggered = 
        (alert.condition === 'above' && currentPrice >= alert.target) ||
        (alert.condition === 'below' && currentPrice <= alert.target);
        
      if (triggered) {
        setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, active: false } : a));
        setToasts(prev => [...prev, { ...alert, currentPrice, toastId: Date.now() + Math.random() }]);
      }
    });
  }, [livePrices, alerts]);

  const handleAddAlert = () => {
    if (!newAlertTarget) return;
    const newAlert = {
      id: Date.now(),
      coin: newAlertCoin,
      target: parseFloat(newAlertTarget),
      condition: newAlertCondition,
      active: true
    };
    setAlerts([newAlert, ...alerts]);
    setNewAlertTarget('');
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const dismissToast = (toastId: number) => {
    setToasts(prev => prev.filter(t => t.toastId !== toastId));
  };
  
  const triggerSpike = () => {
    setLivePrices(prev => ({
        BTC: prev.BTC + 3500,
        ETH: prev.ETH - 200
    }));
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notifications */}
      <div className="fixed top-20 sm:top-24 left-4 right-4 sm:left-auto sm:right-6 z-50 flex flex-col gap-2.5 sm:w-80 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.toastId}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-card border border-emerald-500 rounded-xl p-3.5 sm:p-4 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-start gap-3 w-full relative overflow-hidden pointer-events-auto"
            >
              <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none"></div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 relative z-10">
                <BellRing size={16} className="animate-pulse" />
              </div>
              <div className="flex-1 relative z-10 min-w-0">
                <h4 className="text-sm font-bold text-foreground">Target Reached!</h4>
                <p className="text-xs text-foreground/70 mt-0.5 leading-snug">
                  {toast.coin} {toast.condition === 'above' ? 'crossed above' : 'dropped below'} <span className="font-bold text-foreground">${toast.target.toLocaleString()}</span>
                </p>
                <p className="text-[11px] font-mono font-bold text-emerald-500 mt-1.5 bg-emerald-500/10 inline-block px-2 py-0.5 rounded">
                  Current: ${toast.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <button onClick={() => dismissToast(toast.toastId)} className="text-foreground/40 hover:text-foreground relative z-10 bg-background/50 rounded-full p-1 shrink-0">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Crypto Trading</h2>
          <p className="text-xs sm:text-sm text-foreground/50">Market overview & portfolio</p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
          <button 
            id="crypto-header-trade-btn"
            onClick={() => {
              const el = document.getElementById('quick-trade-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                const input = document.getElementById('quick-trade-pay-input');
                if (input) input.focus();
              }
            }} 
            className="flex-1 sm:flex-initial text-center justify-center bg-primary text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Activity size={14} />
            <span>Buy / Sell</span>
          </button>
          <button 
            id="crypto-header-deposit-btn"
            onClick={() => setActiveModal('deposit')} 
            className="flex-1 sm:flex-initial text-center justify-center bg-card border border-border px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-white/5 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <QrCode size={14} />
            <span>Deposit</span>
          </button>
          <button 
            onClick={() => setIsWithdrawModalOpen(true)} 
            className="flex-1 sm:flex-initial text-center justify-center bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <ArrowDownToLine size={14} className="text-amber-400" />
            <span>Request Withdrawal</span>
          </button>
        </div>
      </div>

      {/* Segregated Balance Architecture Banner */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/25 shrink-0">
            <Coins size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Segregated Account Architecture
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Balances Isolated
              </span>
            </div>
            <p className="text-xs text-foreground/50 mt-0.5">
              Digital asset custody is maintained strictly isolated from standard fiat bank credit under Swiss FINMA standards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
          {/* Crypto Balance */}
          <div className="bg-foreground/5 px-4 py-2 rounded-xl border border-border text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
              <Coins size={11} /> Crypto Balance
            </p>
            <p className="text-base sm:text-lg font-mono font-black text-foreground">
              ${cryptoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[9px] text-foreground/40 font-semibold">Min. Withdrawal $100</p>
          </div>

          {/* Bank Credit Balance */}
          <div className="bg-foreground/5 px-4 py-2 rounded-xl border border-border text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <Wallet size={11} /> Bank Credit Balance
            </p>
            <p className="text-base sm:text-lg font-mono font-black text-foreground">
              ${bankCreditBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[9px] text-foreground/40 font-semibold">Fiat Checking & Credit</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {/* BTC Card */}
          <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-5 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] sm:text-xs text-foreground/50 font-bold tracking-wider sm:tracking-widest uppercase">Bitcoin</p>
                  <h3 className="text-lg sm:text-2xl font-mono mt-0.5 sm:mt-1">BTC</h3>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-sm sm:text-base">₿</div>
            </div>
            <div className="mt-3 sm:mt-4">
              <p className="text-base sm:text-xl font-bold truncate">{livePrices.BTC.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
              <p className="text-xs sm:text-sm text-emerald-500 flex items-center mt-1"><ArrowUpRight size={13} className="mr-0.5 shrink-0"/> +4.2%</p>
            </div>
          </div>

          {/* ETH Card */}
          <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-5 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] sm:text-xs text-foreground/50 font-bold tracking-wider sm:tracking-widest uppercase">Ethereum</p>
                  <h3 className="text-lg sm:text-2xl font-mono mt-0.5 sm:mt-1">ETH</h3>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm sm:text-base">Ξ</div>
            </div>
            <div className="mt-3 sm:mt-4">
              <p className="text-base sm:text-xl font-bold truncate">{livePrices.ETH.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
              <p className="text-xs sm:text-sm text-rose-500 flex items-center mt-1"><ArrowDownRight size={13} className="mr-0.5 shrink-0"/> -1.1%</p>
            </div>
          </div>

          {/* BNB Card */}
          <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-5 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] sm:text-xs text-foreground/50 font-bold tracking-wider sm:tracking-widest uppercase">Binance</p>
                  <h3 className="text-lg sm:text-2xl font-mono mt-0.5 sm:mt-1">BNB</h3>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold text-sm sm:text-base">B</div>
            </div>
            <div className="mt-3 sm:mt-4">
              <p className="text-base sm:text-xl font-bold truncate">{livePrices.BNB.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
              <p className="text-xs sm:text-sm text-emerald-500 flex items-center mt-1"><ArrowUpRight size={13} className="mr-0.5 shrink-0"/> +2.8%</p>
            </div>
          </div>

          {/* XRP Card */}
          <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-5 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] sm:text-xs text-foreground/50 font-bold tracking-wider sm:tracking-widest uppercase">Ripple</p>
                  <h3 className="text-lg sm:text-2xl font-mono mt-0.5 sm:mt-1">XRP</h3>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-sm sm:text-base">X</div>
            </div>
            <div className="mt-3 sm:mt-4">
              <p className="text-base sm:text-xl font-bold truncate">{livePrices.XRP.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
              <p className="text-xs sm:text-sm text-emerald-500 flex items-center mt-1"><ArrowUpRight size={13} className="mr-0.5 shrink-0"/> +5.1%</p>
            </div>
          </div>

          {/* ADA Card */}
          <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-5 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] sm:text-xs text-foreground/50 font-bold tracking-wider sm:tracking-widest uppercase">Cardano</p>
                  <h3 className="text-lg sm:text-2xl font-mono mt-0.5 sm:mt-1">ADA</h3>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold text-sm sm:text-base">A</div>
            </div>
            <div className="mt-3 sm:mt-4">
              <p className="text-base sm:text-xl font-bold truncate">{livePrices.ADA.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 })}</p>
              <p className="text-xs sm:text-sm text-rose-500 flex items-center mt-1"><ArrowDownRight size={13} className="mr-0.5 shrink-0"/> -0.5%</p>
            </div>
          </div>

          {/* Portfolio Card - Full width on small phones, 1 column on larger */}
          <div className="col-span-2 sm:col-span-1 xl:col-span-1 bg-gradient-to-br from-[#0f172a] to-[#111c35] rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-500/30 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 text-7xl sm:text-8xl select-none pointer-events-none">💎</div>
            <div className="flex justify-between items-start">
              <p className="text-[10px] sm:text-xs text-emerald-400 font-bold tracking-wider sm:tracking-widest uppercase">Crypto Portfolio</p>
              <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">Min $100</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2 text-white font-mono">
              ${cryptoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-white/50 mt-0.5">Segregated from Bank Credit</p>
            <div className="mt-3 sm:mt-4 flex justify-between items-end">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <ArrowDownToLine size={13} /> Withdraw
                </button>
                <Coins className="text-emerald-400/50" size={18} />
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 sm:mb-6">
              <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest text-foreground/50">BTC/USD Performance</h3>
              <div className="flex space-x-1.5">
                <button className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-primary text-white shadow-xs">1D</button>
                <button className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-border text-foreground/50 hover:text-foreground">1W</button>
                <button className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-border text-foreground/50 hover:text-foreground">1M</button>
              </div>
            </div>
            <div className="h-[210px] sm:h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }} dy={8} />
                  <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div id="quick-trade-section" className="bg-card border border-border rounded-2xl p-4 sm:p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-foreground/70 flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                <span>Quick Trade</span>
              </h3>
              <div className="flex items-center gap-1.5 bg-background border border-border px-2.5 py-1 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-foreground">
                  1 {tradeCoin} = ${currentRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
              {/* Buy / Sell Toggle Tabs */}
              <div className="flex bg-background border border-border rounded-xl p-1 gap-1">
                <button 
                  id="quick-trade-buy-tab"
                  type="button"
                  onClick={() => handleToggleTradeType('buy')}
                  className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    tradeType === 'buy'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'text-foreground/50 hover:text-foreground'
                  }`}
                >
                  Buy
                </button>
                <button 
                  id="quick-trade-sell-tab"
                  type="button"
                  onClick={() => handleToggleTradeType('sell')}
                  className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    tradeType === 'sell'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'text-foreground/50 hover:text-foreground'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Coin selection chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                {(['BTC', 'ETH', 'BNB', 'XRP', 'ADA'] as const).map(coin => (
                  <button
                    key={coin}
                    type="button"
                    onClick={() => handleSelectCoin(coin)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all shrink-0 ${
                      tradeCoin === coin
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-background border border-border text-foreground/60 hover:text-foreground hover:bg-card'
                    }`}
                  >
                    {coin}
                  </button>
                ))}
              </div>

              {/* Pay With Input */}
              <div>
                <div className="flex justify-between items-center mb-1 text-[10px] sm:text-xs text-foreground/60 font-bold uppercase">
                  <span>Pay with</span>
                  {tradeType === 'buy' ? (
                    <span className="text-[11px] font-mono text-foreground/50">
                      Avail: ${(currentUser?.accounts?.[0]?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-foreground/50">
                      Avail: {currentUser?.investorWallets?.btc || '0.2304'} {tradeCoin}
                    </span>
                  )}
                </div>
                <div className="flex bg-background border border-border rounded-xl p-2.5 items-center gap-2 focus-within:border-primary transition-colors">
                  <input 
                    id="quick-trade-pay-input"
                    type="number" 
                    step="any"
                    min="0"
                    placeholder="0.00" 
                    className="bg-transparent flex-1 outline-none font-mono text-base sm:text-lg text-foreground min-w-0" 
                    value={payAmount}
                    onChange={(e) => handlePayAmountChange(e.target.value)}
                  />
                  <span className="text-xs sm:text-sm font-bold bg-card px-2.5 sm:px-3 py-1 rounded-lg border border-border text-foreground shrink-0 font-mono">
                    {tradeType === 'buy' ? 'USD' : tradeCoin}
                  </span>
                </div>
                
                {/* Quick Presets for Pay */}
                <div className="flex items-center gap-1.5 mt-2">
                  {tradeType === 'buy' ? (
                    <>
                      {[1000, 5000, 10000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handlePayAmountChange(String(amt))}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-card border border-border hover:border-primary/50 text-foreground/70 hover:text-foreground transition-all"
                        >
                          ${amt.toLocaleString()}
                        </button>
                      ))}
                      {currentUser?.accounts?.[0]?.balance ? (
                        <button
                          type="button"
                          onClick={() => handlePayAmountChange(String(currentUser.accounts[0].balance))}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all ml-auto"
                        >
                          Max
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {['0.01', '0.05', '0.1'].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handlePayAmountChange(amt)}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-card border border-border hover:border-primary/50 text-foreground/70 hover:text-foreground transition-all"
                        >
                          {amt} {tradeCoin}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Swapper Icon */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  type="button"
                  onClick={() => handleToggleTradeType(tradeType === 'buy' ? 'sell' : 'buy')}
                  className="w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground hover:scale-105 transition-all shadow-sm active:scale-95"
                  title="Switch Buy/Sell"
                >
                  <ArrowLeftRight size={14} className="rotate-90" />
                </button>
              </div>

              {/* Receive Input */}
              <div>
                <label className="text-[10px] sm:text-xs text-foreground/60 font-bold uppercase mb-1 block">
                  Receive
                </label>
                <div className="flex bg-background border border-border rounded-xl p-2.5 items-center gap-2 focus-within:border-primary transition-colors">
                  <input 
                    id="quick-trade-receive-input"
                    type="number" 
                    step="any"
                    min="0"
                    placeholder="0.00" 
                    className="bg-transparent flex-1 outline-none font-mono text-base sm:text-lg text-foreground min-w-0" 
                    value={receiveAmount}
                    onChange={(e) => handleReceiveAmountChange(e.target.value)}
                  />
                  <span className="text-xs sm:text-sm font-bold bg-card px-2.5 sm:px-3 py-1 rounded-lg border border-border text-foreground shrink-0 font-mono">
                    {tradeType === 'buy' ? tradeCoin : 'USD'}
                  </span>
                </div>
              </div>

              {/* Regulatory Notice: Buying & selling cannot be allowed without admin approval */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-amber-500 text-[11px] leading-relaxed">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Admin Approval Required:</strong> Under Swiss digital asset custody regulations, all crypto buy & sell orders must be validated and authorized by an administrator before settlement.
                </span>
              </div>

              {tradeError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-medium">
                  {tradeError}
                </div>
              )}
              
              <div className="mt-auto pt-2">
                <div className="flex justify-between text-xs text-foreground/60 mb-3">
                  <span>Exchange Rate</span>
                  <span className="font-mono font-bold text-foreground">
                    1 {tradeCoin} = ${currentRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </span>
                </div>
                
                <button 
                  id="quick-trade-confirm-btn"
                  type="button"
                  disabled={isSubmittingOrder}
                  onClick={handleConfirmOrder}
                  className={`w-full font-bold py-3 rounded-xl transition-all text-xs sm:text-sm shadow-md active:scale-98 flex items-center justify-center gap-2 ${
                    tradeType === 'buy'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
                      : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                  }`}
                >
                  {isSubmittingOrder ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Order for Approval...</span>
                    </>
                  ) : (
                    <span>Confirm {tradeType === 'buy' ? 'Buy' : 'Sell'} Order</span>
                  )}
                </button>
              </div>
            </div>
          </div>
      </div>

      {/* Price Alerts Section */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 sm:mb-6">
          <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest text-foreground/50 flex items-center gap-2">
            <Bell size={15} /> Market Price Alerts
          </h3>
          <button onClick={triggerSpike} className="w-full sm:w-auto justify-center flex items-center gap-1.5 text-xs font-bold bg-accent/10 text-accent px-3 py-1.5 rounded-xl border border-accent/20 hover:bg-accent/20 transition-colors">
            <Zap size={13} /> Simulate Market Spike
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="col-span-1 bg-background rounded-xl p-4 sm:p-5 border border-border">
             <h4 className="text-xs font-bold text-foreground mb-3 sm:mb-4">CREATE NEW ALERT</h4>
             <div className="space-y-3">
               <div className="grid grid-cols-2 gap-2">
                 <select 
                   className="bg-card border border-border rounded-xl p-2.5 text-xs sm:text-sm text-foreground outline-none focus:border-primary font-bold"
                   value={newAlertCoin}
                   onChange={e => setNewAlertCoin(e.target.value)}
                 >
                   <option value="BTC">BTC</option>
                   <option value="ETH">ETH</option>
                 </select>
                 <select 
                   className="bg-card border border-border rounded-xl p-2.5 text-xs sm:text-sm text-foreground outline-none focus:border-primary font-bold"
                   value={newAlertCondition}
                   onChange={e => setNewAlertCondition(e.target.value)}
                 >
                   <option value="above">Above</option>
                   <option value="below">Below</option>
                 </select>
               </div>
               <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 font-bold text-xs sm:text-sm">$</span>
                 <input 
                   type="number" 
                   className="w-full bg-card border border-border rounded-xl py-2.5 pl-7 sm:pl-8 pr-3 text-xs sm:text-sm font-mono text-foreground outline-none focus:border-primary"
                   placeholder="Target price..."
                   value={newAlertTarget}
                   onChange={e => setNewAlertTarget(e.target.value)}
                 />
               </div>
               <button 
                 onClick={handleAddAlert}
                 disabled={!newAlertTarget}
                 className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-black font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
               >
                 <Plus size={15} /> Set Alert
               </button>
             </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 space-y-2.5">
             {alerts.length === 0 ? (
               <div className="h-full flex items-center justify-center text-foreground/40 text-xs sm:text-sm font-medium border border-dashed border-border rounded-xl min-h-[140px] p-4 text-center">
                 No active price alerts set. Use the form to configure one.
               </div>
             ) : (
               alerts.map(alert => (
                 <div key={alert.id} className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border ${alert.active ? 'bg-background border-border' : 'bg-background/50 border-border/50 opacity-60'} transition-all gap-2`}>
                   <div className="flex items-center gap-3 min-w-0">
                     <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shrink-0 ${alert.coin === 'BTC' ? 'bg-orange-500/20 text-orange-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                       {alert.coin === 'BTC' ? '₿' : 'Ξ'}
                     </div>
                     <div className="min-w-0">
                       <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                         {alert.coin} {alert.condition === 'above' ? 'goes above' : 'drops below'} <span className="text-primary font-mono">${alert.target.toLocaleString()}</span>
                       </p>
                       <p className="text-[10px] text-foreground/50 uppercase tracking-wider mt-0.5 font-bold">
                         {alert.active ? 'Active Status' : 'Triggered & Logged'}
                       </p>
                     </div>
                   </div>
                   <button onClick={() => removeAlert(alert.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0">
                     <Trash2 size={15} />
                   </button>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>

      {/* Staking Calculator Section */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 sm:mb-6">
          <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest text-foreground/50 flex items-center gap-2">
            <Lock size={15} /> Staking Rewards Calculator
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-xl border border-emerald-500/20">
            <TrendingUp size={13} /> Earn Passive Yield
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          {/* Controls */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="text-[10px] sm:text-xs text-foreground/50 font-bold uppercase mb-2 block">Select Asset</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {Object.keys(stakingRates).map((coin) => (
                  <button 
                    key={coin}
                    onClick={() => setStakeCoin(coin)}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl border font-bold text-xs sm:text-sm transition-all ${stakeCoin === coin ? 'bg-background border-primary text-primary shadow-xs' : 'bg-background/50 border-border text-foreground/50 hover:border-foreground/30'}`}
                  >
                    <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[11px] sm:text-xs ${stakingRates[coin as keyof typeof stakingRates].bg} ${stakingRates[coin as keyof typeof stakingRates].color}`}>
                      {stakingRates[coin as keyof typeof stakingRates].symbol}
                    </span>
                    <span>{coin}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] sm:text-xs text-foreground/50 font-bold uppercase mb-2 block">Lock Period (Days)</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[30, 60, 90].map((days) => (
                  <button 
                    key={days}
                    onClick={() => setStakePeriod(days)}
                    className={`flex flex-col items-center justify-center gap-0.5 sm:gap-1 py-2 sm:py-3 rounded-xl border transition-all ${stakePeriod === days ? 'bg-background border-primary text-primary shadow-xs' : 'bg-background/50 border-border text-foreground/50 hover:border-foreground/30'}`}
                  >
                    <span className="font-bold text-base sm:text-lg">{days}</span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest font-bold opacity-70">
                      {stakingRates[stakeCoin as keyof typeof stakingRates][days as 30 | 60 | 90]}% APY
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] sm:text-xs text-foreground/50 font-bold uppercase mb-2 block">Stake Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-foreground/50 font-bold text-sm">{stakingRates[stakeCoin as keyof typeof stakingRates].symbol}</span>
                <input 
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-2.5 sm:py-3 pl-8 sm:pl-10 pr-4 font-mono text-base sm:text-lg text-foreground outline-none focus:border-primary"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="bg-background rounded-xl border border-border p-4 sm:p-6 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
               <Calculator size={100} />
             </div>
             
             <h4 className="text-[10px] sm:text-xs font-bold text-foreground/50 uppercase tracking-wider sm:tracking-widest mb-4 sm:mb-6">Projection Summary</h4>
             
             <div className="space-y-4 sm:space-y-6 relative z-10">
               <div className="flex justify-between items-end border-b border-border/50 pb-3 sm:pb-4">
                 <div>
                   <p className="text-[10px] sm:text-xs text-foreground/50 font-bold uppercase mb-1">Current APY</p>
                   <p className="text-2xl sm:text-3xl font-mono text-primary font-bold">{currentApy}%</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] sm:text-xs text-foreground/50 font-bold uppercase mb-1">Duration</p>
                   <p className="text-base sm:text-xl font-bold">{stakePeriod} Days</p>
                 </div>
               </div>
               
               <div className="flex justify-between items-end border-b border-border/50 pb-3 sm:pb-4">
                 <div>
                   <p className="text-[10px] sm:text-xs text-foreground/50 font-bold uppercase mb-1">Estimated Yield</p>
                   <p className="text-xl sm:text-2xl font-mono text-emerald-500 font-bold">
                     +{projectedYield.toFixed(4)} <span className="text-xs sm:text-sm">{stakeCoin}</span>
                   </p>
                 </div>
               </div>

               <div>
                 <p className="text-[10px] sm:text-xs text-foreground/50 font-bold uppercase mb-1">Total at Maturity</p>
                 <p className="text-2xl sm:text-4xl font-mono font-bold text-foreground truncate">
                   {totalReturn.toFixed(4)} <span className="text-base sm:text-xl text-foreground/50">{stakeCoin}</span>
                 </p>
               </div>
             </div>
             
             <button className="w-full mt-6 sm:mt-8 bg-primary hover:bg-primary/90 text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] text-xs sm:text-sm">
               Stake Now
             </button>
          </div>
        </div>
      </div>

      {/* Orders & Clearance Directorate */}
      <div id="crypto-history-section" className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-foreground">Digital Asset Clearance & Official Receipts</h3>
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck size={11} /> Admin Authorization Mandatory
              </span>
            </div>
            <p className="text-xs text-foreground/50 mt-0.5">
              All cryptocurrency purchases, sales, and withdrawals are subject to treasury compliance and require administrator sign-off prior to balance execution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-foreground/70 bg-background border border-border px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <ShieldAlert size={13} className="text-amber-500" />
              <span>Admin Limit: ${(adminSettings?.maxCryptoWithdrawalLimit || 25000).toLocaleString()} USD</span>
            </span>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              <ArrowDownToLine size={13} />
              <span>Request Withdrawal</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border/80">
          <button
            type="button"
            onClick={() => setHistoryTab('trades')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              historyTab === 'trades'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground/60 hover:text-foreground'
            }`}
          >
            <Activity size={14} />
            <span>Crypto Trade Orders (Buy / Sell)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
              {cryptoOrders.filter(o => !currentUser || currentUser.role === 'admin' || o.userId === currentUser.id).length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setHistoryTab('withdrawals')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              historyTab === 'withdrawals'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground/60 hover:text-foreground'
            }`}
          >
            <ArrowDownToLine size={14} />
            <span>Withdrawal Requests</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/10 text-foreground/70 font-mono">
              {cryptoWithdrawals.filter(w => !currentUser || currentUser.role === 'admin' || w.userId === currentUser.id).length}
            </span>
          </button>
        </div>

        {/* Tab 1: Crypto Trade Orders (Buy / Sell) */}
        {historyTab === 'trades' && (
          <div>
            {cryptoOrders.filter(o => !currentUser || currentUser.role === 'admin' || o.userId === currentUser.id).length === 0 ? (
              <div className="py-8 text-center bg-background/50 border border-dashed border-border rounded-xl space-y-2">
                <p className="text-xs text-foreground/50">No crypto buy or sell orders recorded yet.</p>
                <button
                  onClick={() => {
                    const el = document.getElementById('quick-trade-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Place your first trade order via Quick Trade
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background/80 text-foreground/50 font-bold uppercase text-[10px] tracking-wider border-b border-border">
                    <tr>
                      <th className="py-3 px-3">Order & Asset</th>
                      <th className="py-3 px-3">Amounts (Pay &lt;-&gt; Receive)</th>
                      <th className="py-3 px-3">Execution Rate</th>
                      <th className="py-3 px-3">Timestamp & Ref</th>
                      <th className="py-3 px-3">Approval Status</th>
                      <th className="py-3 px-3 text-right">Official Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {cryptoOrders
                      .filter(o => !currentUser || currentUser.role === 'admin' || o.userId === currentUser.id)
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-foreground/[0.02] transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                order.orderType === 'buy'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              }`}>
                                {order.orderType}
                              </span>
                              <span className="font-bold text-foreground font-mono text-sm">
                                {order.cryptoCurrency}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-foreground font-mono">
                              {order.cryptoAmount} {order.cryptoCurrency}
                            </div>
                            <div className="text-[11px] text-foreground/50 font-mono">
                              ${order.fiatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.fiatCurrency}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-foreground/70 font-mono">
                            1 {order.cryptoCurrency} = ${order.exchangeRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-foreground/60 whitespace-nowrap">
                            <div className="text-[11px] font-mono text-primary font-bold">
                              CT-{order.id.slice(-6).toUpperCase()}
                            </div>
                            <div className="text-[10px] text-foreground/50">
                              {new Date(order.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(order.requestDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            {order.status === 'approved' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 whitespace-nowrap">
                                <CheckCircle2 size={11} /> Approved &amp; Settled
                              </span>
                            ) : order.status === 'rejected' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-500 whitespace-nowrap">
                                <X size={11} /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-500 whitespace-nowrap">
                                <Clock size={11} className="animate-spin" /> Pending Admin Approval
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {order.status === 'approved' ? (
                              <button
                                onClick={() => setSelectedReceiptOrder(order)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/25 text-[11px] font-bold transition-all shadow-xs active:scale-95 whitespace-nowrap"
                              >
                                <FileText size={13} />
                                <span>View Settlement Receipt</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-foreground/40 italic">
                                Issued upon approval
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Withdrawal Requests */}
        {historyTab === 'withdrawals' && (
          <div>
            {cryptoWithdrawals.filter(w => !currentUser || currentUser.role === 'admin' || w.userId === currentUser.id).length === 0 ? (
              <div className="py-8 text-center bg-background/50 border border-dashed border-border rounded-xl space-y-2">
                <p className="text-xs text-foreground/50">No withdrawal requests placed yet.</p>
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Submit your first withdrawal request
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background/80 text-foreground/50 font-bold uppercase text-[10px] tracking-wider border-b border-border">
                    <tr>
                      <th className="py-3 px-3">Asset &amp; Amount</th>
                      <th className="py-3 px-3">Network &amp; Address</th>
                      <th className="py-3 px-3">Timestamp</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Official Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {cryptoWithdrawals
                      .filter(w => !currentUser || currentUser.role === 'admin' || w.userId === currentUser.id)
                      .map((w) => (
                        <tr key={w.id} className="hover:bg-foreground/[0.02] transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-foreground font-mono">
                              {w.cryptoAmount} {w.currency}
                            </div>
                            <div className="text-[11px] text-foreground/50 font-mono">
                              ${w.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                            </div>
                          </td>
                          <td className="py-3 px-3 max-w-[220px]">
                            <div className="font-semibold text-foreground text-[11px]">{w.network}</div>
                            <div className="font-mono text-[10px] text-foreground/50 truncate" title={w.walletAddress}>
                              {w.walletAddress}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-foreground/60 whitespace-nowrap">
                            <div className="text-[11px]">
                              {new Date(w.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="text-[10px] text-foreground/40 font-mono">
                              {new Date(w.requestDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            {w.status === 'approved' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 whitespace-nowrap">
                                <CheckCircle2 size={11} /> Approved
                              </span>
                            ) : w.status === 'rejected' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-500 whitespace-nowrap">
                                <X size={11} /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-500 whitespace-nowrap">
                                <Clock size={11} /> Pending Admin
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {w.status === 'approved' ? (
                              <button
                                onClick={() => setSelectedReceiptWithdrawal(w)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/25 text-[11px] font-bold transition-all shadow-xs active:scale-95 whitespace-nowrap"
                              >
                                <FileText size={13} />
                                <span>View Official Receipt</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-foreground/40 italic">
                                Generated on Approval
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <RequestWithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        defaultSource="crypto_portfolio"
      />

      {/* Withdrawal Receipt Modal */}
      <CryptoReceiptModal
        withdrawal={selectedReceiptWithdrawal}
        onClose={() => setSelectedReceiptWithdrawal(null)}
      />

      {/* Trade Order Receipt Modal */}
      <CryptoReceiptModal
        tradeOrder={selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
      />

      {/* Trade Order Confirmation & Pending Admin Notification Modal */}
      {tradeConfirmationModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-7 relative">
            <button 
              onClick={() => setTradeConfirmationModal(null)} 
              className="absolute top-5 right-5 text-foreground/50 hover:text-foreground p-1 rounded-full hover:bg-foreground/5"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto mb-4">
              <Clock size={28} className="animate-pulse" />
            </div>

            <h3 className="text-lg font-black text-center text-foreground uppercase tracking-wide">
              Order Placed • Awaiting Admin Approval
            </h3>

            <div className="mt-3 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-500 leading-relaxed text-center">
              <strong>Mandatory Authorization Notice:</strong> Under Swiss digital asset custody regulations, buying and selling of cryptocurrency cannot be allowed without administrator approval. Your order has been placed into the Treasury clearance queue and will settle immediately upon administrator authorization.
            </div>

            <div className="mt-4 p-4 bg-background border border-border rounded-2xl space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-foreground/50">Order Reference</span>
                <span className="font-mono font-bold text-foreground">CT-{tradeConfirmationModal.id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Order Type</span>
                <span className={`font-black uppercase ${tradeConfirmationModal.orderType === 'buy' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {tradeConfirmationModal.orderType} {tradeConfirmationModal.cryptoCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Crypto Amount</span>
                <span className="font-mono font-bold text-foreground">{tradeConfirmationModal.cryptoAmount} {tradeConfirmationModal.cryptoCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Fiat Value</span>
                <span className="font-mono font-bold text-foreground">${tradeConfirmationModal.fiatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Exchange Rate</span>
                <span className="font-mono font-bold text-foreground">1 {tradeConfirmationModal.cryptoCurrency} = ${tradeConfirmationModal.exchangeRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-foreground/50">Approval Status</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  <Clock size={12} /> Pending Admin Approval
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setTradeConfirmationModal(null);
                const historyEl = document.getElementById('crypto-history-section');
                if (historyEl) historyEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full mt-5 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 text-xs sm:text-sm transition-all shadow-md shadow-primary/20"
            >
              Track in Orders History
            </button>
          </div>
        </div>
      )}

      {/* Deposit Crypto Modal with Institutional Address */}
      <PaymentInstructionsModal
        isOpen={activeModal === 'deposit'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}