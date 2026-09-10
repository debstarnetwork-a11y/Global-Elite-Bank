import React, { useState, useEffect } from 'react';
import { useBank, Investment, InvestorWallets, DEFAULT_BROKER_WALLETS, CryptoWithdrawalRequest } from '../store';
import { 
  Wallet, 
  TrendingUp, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowDownToLine, 
  Landmark, 
  X,
  QrCode,
  Maximize2,
  Download,
  AlertCircle,
  History,
  ArrowUpRight,
  FileText,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Lock,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ProjectedRoiChart } from './ProjectedRoiChart';
import { InvestmentHistoryView } from './InvestmentHistoryView';
import { RequestWithdrawalModal } from './RequestWithdrawalModal';
import { CryptoReceiptModal } from './CryptoReceiptModal';
import { ReinvestProfitModal } from './ReinvestProfitModal';

interface QrModalState {
  currency: string;
  name: string;
  network: string;
  badge: string;
  address: string;
  memo: string;
  symbol: string;
  iconBg: string;
  qrImageUrl?: string;
}

const BROKER_ASSETS = [
  {
    key: 'btc' as const,
    qrKey: 'btcQr' as const,
    currency: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin Native (SegWit)',
    badge: 'BTC Mainnet',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    iconBg: 'bg-amber-500 text-white',
    symbol: '₿',
    confirmations: '3 network confirmations',
    memo: 'Send only Bitcoin (BTC) to this deposit address. 3 network confirmations required for automated clearing.',
  },
  {
    key: 'eth' as const,
    qrKey: 'ethQr' as const,
    currency: 'ETH',
    name: 'Ethereum',
    network: 'Ethereum (ERC-20)',
    badge: 'ERC-20',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    iconBg: 'bg-indigo-600 text-white',
    symbol: 'Ξ',
    confirmations: '12 network confirmations',
    memo: 'Send only Ethereum (ETH) to this deposit address via the ERC-20 network. Smart contract transactions supported.',
  },
  {
    key: 'usdt' as const,
    qrKey: 'usdtQr' as const,
    currency: 'USDT',
    name: 'Tether USD',
    network: 'Tron Network (TRC-20)',
    badge: 'TRC-20',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    iconBg: 'bg-emerald-600 text-white',
    symbol: '₮',
    confirmations: '19 network confirmations',
    memo: 'Send only USDT via the Tron (TRC-20) network. Transfers sent via other networks cannot be recovered.',
  },
  {
    key: 'sol' as const,
    qrKey: 'solQr' as const,
    currency: 'SOL',
    name: 'Solana',
    network: 'Solana Network (SPL)',
    badge: 'Solana SPL',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    iconBg: 'bg-purple-600 text-white',
    symbol: '◎',
    confirmations: 'Instant sub-second finality',
    memo: 'Send only Solana (SOL) or verified SPL tokens to this deposit address. Sub-second confirmations with minimal network fees.',
  },
];

export function InvestorsWallet() {
  const { currentUser, adminUpdateUser, adminSettings, investments, createInvestment, cryptoWithdrawals } = useBank();
  
  const [copied, setCopied] = useState<string | null>(null);
  const [activeQrModal, setActiveQrModal] = useState<QrModalState | null>(null);
  const [qrFormat, setQrFormat] = useState<'address' | 'uri'>('address');
  const [qrMode, setQrMode] = useState<'image' | 'code'>('image');

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
  
  // Wallet setup form
  const [isSettingUpWallets, setIsSettingUpWallets] = useState(false);
  const [walletsForm, setWalletsForm] = useState<InvestorWallets>(currentUser?.investorWallets || { btc: '', eth: '', usdt: '', sol: '', balance: 0 });

  // Withdrawal & Reinvestment modals and receipts
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isReinvestModalOpen, setIsReinvestModalOpen] = useState(false);
  const [selectedReceiptWithdrawal, setSelectedReceiptWithdrawal] = useState<CryptoWithdrawalRequest | null>(null);

  useEffect(() => {
    if (currentUser?.investorWallets) {
      setWalletsForm(currentUser.investorWallets);
    }
  }, [currentUser?.investorWallets]);
  
  // Stake Form
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeCurrency, setStakeCurrency] = useState('BTC');
  const [stakeDuration, setStakeDuration] = useState(7); // default 7 days
  const [stakeTxHash, setStakeTxHash] = useState('');
  const [showStakeForm, setShowStakeForm] = useState(false);
  const [selectedChartStakeId, setSelectedChartStakeId] = useState<string | null>(null);
  const [activeWalletTab, setActiveWalletTab] = useState<'overview' | 'history' | 'withdrawals'>('overview');
  
  if (!currentUser) return null;
  
  const myInvestments = investments.filter(inv => inv.userId === currentUser.id);
  const activeInvestments = myInvestments.filter(inv => inv.status === 'active' || inv.status === 'pending');
  const maturedInvestments = myInvestments.filter(inv => inv.status === 'matured');
  const withdrawnInvestments = myInvestments.filter(inv => inv.status === 'withdrawn');
  const myWithdrawals = cryptoWithdrawals.filter(w => w.userId === currentUser.id);

  const handleSeedSampleCompletedStakes = () => {
    if (!currentUser) return;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Sample 1: BTC 7-day stake that matured 5 days ago
    createInvestment({
      userId: currentUser.id,
      amount: 0.85,
      currency: 'BTC',
      durationDays: 7,
      startDate: new Date(now - (12 * oneDay)).toISOString(),
      endDate: new Date(now - (5 * oneDay)).toISOString(),
      status: 'matured',
      txHash: '0x8f3c7a912b4e5d601a2389cd45e678bf129038475628192a83746501928374ef',
      profit: 0.102
    } as any);

    // Sample 2: USDT 14-day stake that matured 2 days ago
    createInvestment({
      userId: currentUser.id,
      amount: 15000,
      currency: 'USDT',
      durationDays: 14,
      startDate: new Date(now - (16 * oneDay)).toISOString(),
      endDate: new Date(now - (2 * oneDay)).toISOString(),
      status: 'matured',
      txHash: '0x3a92b81029c746e5102948576dbeac91823746501928374ef819283746501928',
      profit: 3900
    } as any);

    // Sample 3: ETH 30-day stake that matured 10 days ago
    createInvestment({
      userId: currentUser.id,
      amount: 4.5,
      currency: 'ETH',
      durationDays: 30,
      startDate: new Date(now - (40 * oneDay)).toISOString(),
      endDate: new Date(now - (10 * oneDay)).toISOString(),
      status: 'matured',
      txHash: '0x5c72e901827364b1928374ef819283746501928374ef8f3c7a912b4e5d601a23',
      profit: 2.79
    } as any);
  };

  const handleOpenStakeModal = (preset?: { currency?: string; duration?: number; amount?: number }) => {
    if (preset?.currency) setStakeCurrency(preset.currency);
    if (preset?.duration) setStakeDuration(preset.duration);
    if (preset?.amount) setStakeAmount(String(preset.amount));
    setShowStakeForm(true);
  };
  
  const [walletToast, setWalletToast] = useState<string | null>(null);

  const openManageWallets = () => {
    if (currentUser?.investorWallets) {
      setWalletsForm(currentUser.investorWallets);
    }
    setIsSettingUpWallets(true);
  };

  const handleSaveWallets = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    adminUpdateUser(currentUser.id, { investorWallets: walletsForm });
    setIsSettingUpWallets(false);
    setWalletToast('Receiving payout wallet addresses updated successfully.');
    setTimeout(() => setWalletToast(null), 4000);
  };

  const handlePasteToWallet = async (currency: 'btc' | 'eth' | 'usdt' | 'sol') => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setWalletsForm(prev => ({ ...prev, [currency]: text.trim() }));
      }
    } catch {
      // Clipboard read not permitted in this context
    }
  };

  const handleClearWallet = (currency: 'btc' | 'eth' | 'usdt' | 'sol') => {
    setWalletsForm(prev => ({ ...prev, [currency]: '' }));
  };
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
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
    const svg = document.getElementById(`geb-qr-${currency}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `GEB-Broker-${currency}-QR.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };
  
  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stakeAmount || !stakeTxHash) return;
    
    createInvestment({
      userId: currentUser.id,
      amount: Number(stakeAmount),
      currency: stakeCurrency,
      durationDays: stakeDuration,
      txHash: stakeTxHash
    });
    
    setStakeAmount('');
    setStakeTxHash('');
    setShowStakeForm(false);
  };

  const calculateProgress = (inv: Investment) => {
    const start = new Date(inv.startDate).getTime();
    const end = new Date(inv.endDate).getTime();
    const now = new Date().getTime();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    return ((now - start) / (end - start)) * 100;
  };
  
  const getDaysRemaining = (inv: Investment) => {
    const end = new Date(inv.endDate).getTime();
    const now = new Date().getTime();
    if (now >= end) return 0;
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };
  
  const needsWalletSetup = !currentUser.investorWallets?.btc && !currentUser.investorWallets?.eth && !currentUser.investorWallets?.usdt;

  const currentStakeKey = stakeCurrency.toLowerCase() as 'btc'|'eth'|'usdt'|'sol';
  const currentStakeBrokerAddress = adminSettings?.brokerWallets?.[currentStakeKey] || DEFAULT_BROKER_WALLETS[currentStakeKey];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">GEB Investors Wallet</h2>
          <p className="text-sm text-foreground/60">Securely stake your crypto for guaranteed ROI traded by our GEB Forex Experts.</p>
        </div>
        <button onClick={() => handleOpenStakeModal()} className="bg-primary text-white font-bold px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <ArrowDownToLine size={18} />
          Stake & Invest
        </button>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 bg-card border border-border rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar shadow-xs">
        <button
          type="button"
          onClick={() => setActiveWalletTab('overview')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeWalletTab === 'overview'
              ? 'bg-primary text-white shadow-xs'
              : 'text-foreground/70 hover:text-foreground hover:bg-background'
          }`}
        >
          <TrendingUp size={14} className="shrink-0" />
          <span>Active Stakes & Portfolio</span>
          {activeInvestments.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
              activeWalletTab === 'overview' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
            }`}>
              {activeInvestments.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveWalletTab('history')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeWalletTab === 'history'
              ? 'bg-primary text-white shadow-xs'
              : 'text-foreground/70 hover:text-foreground hover:bg-background'
          }`}
        >
          <History size={14} className="shrink-0" />
          <span>Investment History</span>
          {(maturedInvestments.length + withdrawnInvestments.length) > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
              activeWalletTab === 'history' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-500'
            }`}>
              {maturedInvestments.length + withdrawnInvestments.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveWalletTab('withdrawals')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeWalletTab === 'withdrawals'
              ? 'bg-primary text-white shadow-xs'
              : 'text-foreground/70 hover:text-foreground hover:bg-background'
          }`}
        >
          <FileText size={14} className="shrink-0" />
          <span>Withdrawals & Receipts</span>
          {myWithdrawals.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
              activeWalletTab === 'withdrawals' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
            }`}>
              {myWithdrawals.length}
            </span>
          )}
        </button>
      </div>
      
      {activeWalletTab === 'history' ? (
        <InvestmentHistoryView
          investments={investments}
          currentUser={currentUser}
          onOpenStakeModal={() => handleOpenStakeModal()}
          onSeedSampleCompleted={handleSeedSampleCompletedStakes}
        />
      ) : activeWalletTab === 'withdrawals' ? (
        <div className="space-y-6">
          {/* Top Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Settled Withdrawals</span>
              <p className="text-xl sm:text-2xl font-black font-mono text-emerald-500 mt-1">
                ${myWithdrawals.filter(w => w.status === 'approved').reduce((acc, w) => acc + w.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                {myWithdrawals.filter(w => w.status === 'approved').length} cleared & receipted
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Pending Admin Clearance</span>
              <p className="text-xl sm:text-2xl font-black font-mono text-amber-500 mt-1">
                ${myWithdrawals.filter(w => w.status === 'pending').reduce((acc, w) => acc + w.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                {myWithdrawals.filter(w => w.status === 'pending').length} request awaiting review
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Admin Policy Ceiling</span>
                  <ShieldAlert size={14} className="text-amber-500" />
                </div>
                <p className="text-xl sm:text-2xl font-black font-mono text-foreground mt-1">
                  ${(adminSettings?.maxCryptoWithdrawalLimit || 25000).toLocaleString()} <span className="text-xs font-normal text-foreground/50">USD</span>
                </p>
              </div>
              <p className="text-[11px] text-foreground/50 mt-1">
                Max allowable per single withdrawal request
              </p>
            </div>
          </div>

          {/* Withdrawals List & Receipts Card */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">Withdrawal Requests Ledger</h3>
                  <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                    Automatic Cryptographic Receipts
                  </span>
                </div>
                <p className="text-xs text-foreground/50 mt-0.5">
                  Official cryptographic receipts with SHA-256 seal and download capabilities are generated automatically upon admin approval.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-2 active:scale-95"
              >
                <ArrowDownToLine size={14} />
                <span>Request New Withdrawal</span>
              </button>
            </div>

            {myWithdrawals.length === 0 ? (
              <div className="py-12 text-center bg-background/50 border border-dashed border-border rounded-2xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">No Withdrawal Requests Yet</h4>
                  <p className="text-xs text-foreground/50 mt-1 max-w-sm mx-auto">
                    You can submit a withdrawal request from your available investor profits at any time (up to ${(adminSettings?.maxCryptoWithdrawalLimit || 25000).toLocaleString()} USD).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Submit First Withdrawal Request
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background/80 text-foreground/50 font-bold uppercase text-[10px] tracking-wider border-b border-border">
                    <tr>
                      <th className="py-3 px-3">Receipt / Ref</th>
                      <th className="py-3 px-3">Amount & Asset</th>
                      <th className="py-3 px-3">Target Address</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Official Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {myWithdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-foreground/[0.02] transition-colors">
                        <td className="py-3.5 px-3">
                          <span className="font-mono font-bold text-foreground text-xs">
                            {w.receiptNumber || w.id}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-foreground font-mono">
                            {w.cryptoAmount} {w.currency}
                          </div>
                          <div className="text-[11px] text-foreground/50 font-mono">
                            ${w.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                          </div>
                        </td>
                        <td className="py-3.5 px-3 max-w-[200px]">
                          <div className="font-semibold text-foreground text-[11px]">{w.network}</div>
                          <div className="font-mono text-[10px] text-foreground/50 truncate" title={w.walletAddress}>
                            {w.walletAddress}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-foreground/60 whitespace-nowrap">
                          <div>{new Date(w.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div className="text-[10px] text-foreground/40 font-mono">
                            {new Date(w.requestDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
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
                        <td className="py-3.5 px-3 text-right">
                          {w.status === 'approved' ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReceiptWithdrawal(w)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/25 text-[11px] font-bold transition-all shadow-xs active:scale-95 whitespace-nowrap"
                            >
                              <FileText size={13} />
                              <span>View Official Receipt</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-foreground/40 italic">
                              Generated upon Approval
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
        </div>
      ) : (
        <>
          {needsWalletSetup && (
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Wallet size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">Receiving Payout Wallets Needed</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                      Action Recommended
                    </span>
                  </div>
                  <p className="text-xs text-foreground/65 mt-0.5">
                    You haven't configured your payout wallets yet. Add your personal BTC, ETH, USDT, or SOL addresses to receive automated profit withdrawals.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openManageWallets}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer flex items-center gap-2"
              >
                <Wallet size={14} />
                <span>Setup Wallets Now</span>
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Wallet Balance */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-primary" size={24} />
                    <span className="font-bold tracking-widest uppercase text-xs opacity-70">GEB Investors Wallet Balance</span>
                  </div>
                  <ShieldCheck className="opacity-50" size={24} />
                </div>
                
                <div>
                  <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                    ${(currentUser.investorWallets?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <p className="text-sm opacity-70">
                    Realized Profit Balance. Principal capital is locked until the admin-approved fixed duration expires.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={openManageWallets} 
                    className="text-xs font-bold bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs"
                    title="Configure receiving payout wallet addresses"
                  >
                    <Wallet size={14} className="shrink-0" />
                    <span>Manage Wallets</span>
                  </button>
                  <button 
                    onClick={() => setIsWithdrawModalOpen(true)} 
                    className="text-xs font-bold bg-primary hover:bg-primary/90 px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-primary/20 active:scale-95"
                  >
                    <ArrowDownToLine size={14} />
                    <span>Request Withdrawal</span>
                  </button>
                  <button 
                    onClick={() => setIsReinvestModalOpen(true)} 
                    className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/25 active:scale-95"
                    title="Reinvest available profit into new fixed-duration stakes"
                  >
                    <RefreshCw size={14} />
                    <span>Reinvest Profit</span>
                  </button>
                  <div className="ml-auto flex items-center gap-1.5 text-[11px] bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg opacity-80">
                    <ShieldAlert size={12} className="text-amber-400" />
                    <span>Admin Cap: ${(adminSettings?.maxCryptoWithdrawalLimit || 25000).toLocaleString()} USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Broker Wallets with QR Code Generation */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Landmark className="text-primary" size={20} />
                    GEB Broker Wallets
                  </h3>
                  <p className="text-xs text-foreground/60 mt-1">Scan QR code or copy address to deposit funds for automated trading & staking.</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full font-medium self-start sm:self-auto">
                  <QrCode size={13} />
                  <span>Scannable QR Codes</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {currentUser?.btcWallet && (
                  <div className="bg-gradient-to-r from-amber-500/10 via-background to-amber-500/5 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <button
                      type="button"
                      onClick={() => setActiveQrModal({
                        currency: 'BTC (Dedicated)',
                        name: 'Dedicated Client Bitcoin Wallet',
                        network: 'Bitcoin Mainnet',
                        badge: 'Assigned Dedicated Address',
                        address: currentUser.btcWallet!,
                        memo: 'Send BTC directly to your dedicated personal custodial cold-storage address. Automatically clears to your account balance.',
                        symbol: '₿',
                        iconBg: 'bg-amber-500 text-white'
                      })}
                      title="Click to expand QR Code"
                      className="w-16 h-16 shrink-0 bg-white p-1 rounded-xl border border-border/80 shadow-xs flex items-center justify-center cursor-pointer group/qr relative hover:scale-105 transition-transform"
                    >
                      <QRCodeSVG value={currentUser.btcWallet.trim()} size={54} level="M" includeMargin={true} />
                      <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover/qr:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Maximize2 size={16} />
                      </div>
                    </button>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs bg-amber-500 text-white">
                            ₿
                          </span>
                          <span className="font-bold text-sm text-foreground">Dedicated Client Bitcoin Wallet</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-amber-500 bg-amber-500/10 border-amber-500/20">
                          Personal Assigned
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-card/70 p-2 rounded-xl border border-border">
                        <p className="text-xs font-mono text-foreground/80 truncate flex-1 select-all">{currentUser.btcWallet}</p>
                        <div className="flex items-center gap-1 shrink-0">
                          <button 
                            onClick={() => copyToClipboard(currentUser.btcWallet!, 'user-btc')} 
                            title="Copy Address"
                            className="p-1.5 hover:bg-background rounded-lg text-foreground/60 hover:text-foreground transition-colors"
                          >
                            {copied === 'user-btc' ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                          </button>
                          <button 
                            onClick={() => {
                              setActiveQrModal({
                                currency: 'BTC (Dedicated)',
                                name: 'Dedicated Client Bitcoin Wallet',
                                network: 'Bitcoin Mainnet',
                                badge: 'Assigned Dedicated Address',
                                address: currentUser.btcWallet!.trim(),
                                memo: 'Send BTC directly to your dedicated personal custodial cold-storage address. Automatically clears to your account balance.',
                                symbol: '₿',
                                iconBg: 'bg-amber-500 text-white'
                              });
                              setQrFormat('address');
                            }}
                            title="Show QR Code"
                            className="p-1.5 hover:bg-background rounded-lg text-foreground/60 hover:text-foreground transition-colors"
                          >
                            <QrCode size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {BROKER_ASSETS.map(asset => {
                  const address = (adminSettings?.brokerWallets?.[asset.key] || DEFAULT_BROKER_WALLETS[asset.key]).trim();
                  const qrImageUrl = (adminSettings?.brokerWallets?.[asset.qrKey] || DEFAULT_BROKER_WALLETS[asset.qrKey] || '').trim();
                  
                  return (
                    <div key={asset.currency} className="bg-background border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:border-primary/40 transition-all">
                      {/* Embedded Scannable QR Code Frame */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveQrModal({
                            currency: asset.currency,
                            name: asset.name,
                            network: asset.network,
                            badge: asset.badge,
                            address,
                            memo: asset.memo,
                            symbol: asset.symbol,
                            iconBg: asset.iconBg,
                            qrImageUrl
                          });
                          setQrMode('image');
                          setQrFormat('address');
                        }}
                        title="Click to expand QR Code"
                        className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white p-1 rounded-xl border border-border/80 shadow-xs flex items-center justify-center cursor-pointer group/qr relative hover:scale-105 transition-transform overflow-hidden"
                      >
                        {qrImageUrl ? (
                          <img 
                            src={qrImageUrl} 
                            alt={`${asset.name} Official QR Code`} 
                            className="w-full h-full object-contain rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <QRCodeSVG value={address} size={54} level="M" includeMargin={true} />
                        )}
                        <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover/qr:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Maximize2 size={16} />
                        </div>
                      </button>

                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${asset.iconBg}`}>
                              {asset.symbol}
                            </span>
                            <span className="font-bold text-sm text-foreground">{asset.name} ({asset.currency})</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${asset.color}`}>
                            {asset.badge}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-card/70 p-2 rounded-xl border border-border">
                          <p className="text-xs font-mono text-foreground/80 truncate flex-1 select-all">{address}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            <button 
                              onClick={() => copyToClipboard(address, asset.currency)} 
                              title="Copy Address"
                              className="p-1.5 hover:bg-background rounded-lg text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                            >
                              {copied === asset.currency ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                            </button>
                            <button 
                              onClick={() => {
                                setActiveQrModal({
                                  currency: asset.currency,
                                  name: asset.name,
                                  network: asset.network,
                                  badge: asset.badge,
                                  address,
                                  memo: asset.memo,
                                  symbol: asset.symbol,
                                  iconBg: asset.iconBg,
                                  qrImageUrl
                                });
                                setQrMode('image');
                                setQrFormat('address');
                              }}
                              title="Scan QR Code"
                              className="p-1.5 hover:bg-background rounded-lg text-primary hover:text-primary transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                            >
                              <QrCode size={15} />
                              <span className="hidden sm:inline">Scan QR</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Recharts Projected ROI Yield Trajectory Graph */}
          <div className="mt-8">
            <ProjectedRoiChart 
              activeInvestments={activeInvestments}
              selectedStakeId={selectedChartStakeId}
              onSelectStakeId={setSelectedChartStakeId}
              onOpenStakeModal={handleOpenStakeModal}
            />
          </div>

          {/* Active Investments */}
          {activeInvestments.length > 0 && (
            <div className="space-y-4 mt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Active Stakes</h3>
                  <p className="text-xs text-foreground/60">Manage your running stakes or inspect their projected maturation curves in the graph above.</p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                  {activeInvestments.length} Active {activeInvestments.length === 1 ? 'Stake' : 'Stakes'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeInvestments.map(inv => {
                  const isChartSelected = (selectedChartStakeId === inv.id) || (!selectedChartStakeId && activeInvestments[0]?.id === inv.id);
                  return (
                    <div 
                      key={inv.id} 
                      className={`bg-card border rounded-2xl p-6 relative overflow-hidden transition-all ${
                        isChartSelected 
                          ? 'border-primary shadow-lg ring-1 ring-primary/40' 
                          : 'border-border hover:border-border/80'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">{inv.currency} Stake</p>
                          <h4 className="font-bold text-xl text-foreground mt-1">{inv.amount.toLocaleString()} {inv.currency}</h4>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isChartSelected && (
                            <span className="bg-primary/15 text-primary border border-primary/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Graph Active
                            </span>
                          )}
                          <span className={`${inv.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'} border text-[10px] font-bold px-2 py-1 rounded uppercase`}>{inv.status}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mt-6">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-foreground/60 font-medium">Progress</span>
                            <span className="font-bold text-foreground">{Math.floor(calculateProgress(inv))}%</span>
                          </div>
                          <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${calculateProgress(inv)}%` }}></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-500 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                          <Lock size={14} className="text-amber-500 shrink-0" />
                          <div className="leading-tight">
                            <span className="font-bold">Principal Locked: {inv.durationDays} Days</span>
                            <span className="block text-[10px] text-amber-500/80 mt-0.5">
                              {inv.adminApprovedDuration ? '✓ Fixed Duration Approved by Admin' : '⏳ Duration Review Pending'}
                            </span>
                          </div>
                        </div>

                        {inv.reinvestedFromProfit && (
                          <div className="text-[10px] text-purple-400 font-bold flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-md">
                            <Sparkles size={11} />
                            <span>Reinvested from Realized Profit</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs font-medium text-foreground/60 bg-background p-2 rounded-lg border border-border">
                          <Clock size={14} className="text-primary" />
                          <span>{getDaysRemaining(inv)} days left until maturation</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedChartStakeId(inv.id);
                            const el = document.getElementById('geb-projected-roi-chart');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            isChartSelected 
                              ? 'bg-primary text-white shadow-xs' 
                              : 'bg-background hover:bg-card border border-border text-foreground/70 hover:text-foreground'
                          }`}
                        >
                          <TrendingUp size={14} />
                          <span>{isChartSelected ? 'Active in ROI Graph' : 'Inspect ROI Curve'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Quick Investment History Gateway Card */}
          <div className="bg-card border border-border rounded-2xl p-6 mt-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <History size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Completed Investment History Ledger</h3>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    {maturedInvestments.length + withdrawnInvestments.length > 0
                      ? `You have ${maturedInvestments.length + withdrawnInvestments.length} past completed stake${maturedInvestments.length + withdrawnInvestments.length === 1 ? '' : 's'} with verified realized profits and clearance receipts.`
                      : 'Review all past matured stakes, calculate total profit realized, export CSV reports, and inspect Swiss audit receipts.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveWalletTab('history')}
                className="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <span>View Full History ({maturedInvestments.length + withdrawnInvestments.length})</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* Quick Withdrawal History & Official Receipts Preview Card */}
          <div className="bg-card border border-border rounded-2xl p-6 mt-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">Withdrawal Requests & Official Receipts</h3>
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Automatic Receipts
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    {myWithdrawals.length > 0
                      ? `You have ${myWithdrawals.length} withdrawal request${myWithdrawals.length === 1 ? '' : 's'}. Approved requests automatically generate formal cryptographic settlement receipts.`
                      : `Submit withdrawal requests up to $${(adminSettings?.maxCryptoWithdrawalLimit || 25000).toLocaleString()} USD. Receipts are minted instantly upon admin approval.`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
                >
                  <ArrowDownToLine size={14} />
                  <span>Request Withdrawal</span>
                </button>
                {myWithdrawals.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveWalletTab('withdrawals')}
                    className="bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1"
                  >
                    <span>View All ({myWithdrawals.length})</span>
                    <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* High-Resolution QR Code Scan Modal */}
      {activeQrModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setActiveQrModal(null)}
        >
          <div 
            className="bg-card border border-border w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 text-center my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Navigation Bar with Back Arrow and Cancel Button */}
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-border/70">
              <button 
                type="button"
                onClick={() => setActiveQrModal(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer"
                title="Go back to wallet overview"
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
            
            <div className="flex items-center justify-center gap-2.5 mb-1">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${activeQrModal.iconBg}`}>
                {activeQrModal.symbol}
              </span>
              <h3 className="font-bold text-lg text-foreground">{activeQrModal.name}</h3>
            </div>
            
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <span className="text-[11px] font-semibold text-foreground/70 bg-background px-3 py-0.5 rounded-full border border-border">
                Network: <strong className="text-foreground">{activeQrModal.network}</strong>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Verified
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
                  id={`geb-qr-${activeQrModal.currency}`}
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
                  id={`geb-qr-${activeQrModal.currency}`}
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

            <p className="text-xs text-foreground/60 mb-2">Scan with your crypto wallet to send funds directly</p>

            {/* Address box with 1-click copy */}
            <div className="bg-background border border-border rounded-xl p-3 mb-4 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
                  {qrFormat === 'uri' && qrMode === 'code' ? 'Wallet URI Payload' : 'Deposit Address'}
                </span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">100% Cryptographic Match</span>
              </div>
              <p className="text-xs font-mono text-foreground font-semibold break-all leading-relaxed select-all">
                {activeQrModal.address}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
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

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-600 dark:text-amber-400 text-left flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{activeQrModal.memo}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stake Form Modal */}
      {showStakeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowStakeForm(false)} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-foreground mb-4">Create New Stake</h2>
            
            <form onSubmit={handleStake} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Currency</label>
                  <select value={stakeCurrency} onChange={e => setStakeCurrency(e.target.value)} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-bold">
                    <option value="BTC">BTC (Bitcoin)</option>
                    <option value="ETH">ETH (Ethereum)</option>
                    <option value="USDT">USDT (TRC20)</option>
                    <option value="SOL">SOL (Solana)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Amount</label>
                  <input required type="number" step="any" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono" placeholder="0.00" />
                </div>
              </div>

              {/* Embedded QR Code & Address for selected Currency */}
              <div className="bg-background border border-border rounded-xl p-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const matchedAsset = BROKER_ASSETS.find(a => a.currency === stakeCurrency) || BROKER_ASSETS[0];
                    setActiveQrModal({
                      currency: stakeCurrency,
                      name: matchedAsset.name,
                      network: matchedAsset.network,
                      badge: matchedAsset.badge,
                      address: currentStakeBrokerAddress.trim(),
                      memo: matchedAsset.memo,
                      symbol: matchedAsset.symbol,
                      iconBg: matchedAsset.iconBg
                    });
                    setQrFormat('address');
                  }}
                  title="Click to enlarge scannable QR Code"
                  className="w-14 h-14 shrink-0 bg-white p-1 rounded-lg border border-border shadow-xs flex items-center justify-center cursor-pointer hover:scale-105 transition-transform relative group/stakeqr"
                >
                  <QRCodeSVG value={currentStakeBrokerAddress.trim()} size={48} level="M" includeMargin={true} />
                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover/stakeqr:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <Maximize2 size={14} />
                  </div>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest block mb-0.5">GEB {stakeCurrency} Broker Address</span>
                    <button
                      type="button"
                      onClick={() => {
                        const matchedAsset = BROKER_ASSETS.find(a => a.currency === stakeCurrency) || BROKER_ASSETS[0];
                        setActiveQrModal({
                          currency: stakeCurrency,
                          name: matchedAsset.name,
                          network: matchedAsset.network,
                          badge: matchedAsset.badge,
                          address: currentStakeBrokerAddress.trim(),
                          memo: matchedAsset.memo,
                          symbol: matchedAsset.symbol,
                          iconBg: matchedAsset.iconBg
                        });
                        setQrFormat('address');
                      }}
                      className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <QrCode size={11} /> Enlarge QR
                    </button>
                  </div>
                  <p className="text-xs font-mono text-foreground truncate select-all">{currentStakeBrokerAddress}</p>
                  <button 
                    type="button" 
                    onClick={() => copyToClipboard(currentStakeBrokerAddress, `stake-${stakeCurrency}`)}
                    className="mt-1 text-xs text-primary font-bold flex items-center gap-1 hover:underline"
                  >
                    {copied === `stake-${stakeCurrency}` ? <><Check size={12} className="text-emerald-500" /> Copied!</> : <><Copy size={12} /> Copy Deposit Address</>}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Duration</label>
                <select value={stakeDuration} onChange={e => setStakeDuration(Number(e.target.value))} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-bold">
                  <option value={3}>3 Days</option>
                  <option value={4}>4 Days</option>
                  <option value={7}>1 Week</option>
                  <option value={14}>2 Weeks</option>
                  <option value={30}>1 Month</option>
                  <option value={90}>3 Months</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Transaction Hash (Proof)</label>
                <input required type="text" value={stakeTxHash} onChange={e => setStakeTxHash(e.target.value)} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono text-xs" placeholder="Paste your deposit TX hash here..." />
              </div>
              
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs text-primary font-medium">
                Please transfer the exact amount to the GEB Broker Wallet above before submitting this form. False claims will be rejected.
              </div>
              
              <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors mt-4">
                Confirm Stake
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <RequestWithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        defaultSource="investor"
      />

      <CryptoReceiptModal
        withdrawal={selectedReceiptWithdrawal}
        onClose={() => setSelectedReceiptWithdrawal(null)}
      />

      <ReinvestProfitModal
        isOpen={isReinvestModalOpen}
        onClose={() => setIsReinvestModalOpen(false)}
      />

      {/* Manage Payout Wallets Modal */}
      {isSettingUpWallets && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setIsSettingUpWallets(false)}
        >
          <div 
            className="bg-card border border-border w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Navigation Bar with Go Back & Close */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/70">
              <button 
                type="button"
                onClick={() => setIsSettingUpWallets(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer"
                title="Go back to wallet overview"
              >
                <ArrowLeft size={16} className="shrink-0" />
                <span>Go Back</span>
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Investor Portal</span>
              </div>

              <button 
                type="button"
                onClick={() => setIsSettingUpWallets(false)}
                className="flex items-center gap-1 text-xs font-semibold text-foreground/60 hover:text-foreground px-2.5 py-1 rounded-full hover:bg-foreground/5 transition-colors cursor-pointer"
                title="Close dialog"
              >
                <span>Cancel</span>
                <X size={16} />
              </button>
            </div>

            {/* Header */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Wallet size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Manage Payout Wallets</h3>
                <p className="text-xs text-foreground/60 mt-0.5">
                  Configure your personal receiving cryptocurrency addresses. Profit withdrawals and principal distributions are automatically dispatched to these destinations.
                </p>
              </div>
            </div>

            {/* Wallet Addresses Form */}
            <form onSubmit={handleSaveWallets} className="space-y-4">
              {/* Bitcoin (BTC) */}
              <div className="bg-background border border-border rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#F7931A] text-white flex items-center justify-center font-bold text-xs">₿</span>
                    <div>
                      <span className="text-xs font-bold text-foreground">Bitcoin (BTC)</span>
                      <span className="text-[10px] text-foreground/50 ml-1.5 font-medium">Native SegWit / Bech32</span>
                    </div>
                  </div>
                  {walletsForm.btc ? (
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Configured
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full">
                      Not set
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={walletsForm.btc || ""} 
                    onChange={e => setWalletsForm({ ...walletsForm, btc: e.target.value })} 
                    className="w-full bg-card border border-border rounded-xl px-3 py-2.5 pr-20 text-xs text-foreground font-mono focus:border-primary outline-none" 
                    placeholder="bc1q... or 1A1zP1eP..." 
                  />
                  <div className="absolute right-1.5 flex items-center gap-1">
                    {walletsForm.btc ? (
                      <button
                        type="button"
                        onClick={() => handleClearWallet('btc')}
                        className="px-2 py-1 text-foreground/40 hover:text-foreground text-[10px] font-semibold cursor-pointer"
                        title="Clear"
                      >
                        Clear
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePasteToWallet('btc')}
                        className="px-2 py-1 bg-secondary hover:bg-secondary/80 text-foreground text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                        title="Paste from clipboard"
                      >
                        Paste
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Ethereum (ETH) */}
              <div className="bg-background border border-border rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#627EEA] text-white flex items-center justify-center font-bold text-xs">Ξ</span>
                    <div>
                      <span className="text-xs font-bold text-foreground">Ethereum (ETH)</span>
                      <span className="text-[10px] text-foreground/50 ml-1.5 font-medium">ERC-20 Network</span>
                    </div>
                  </div>
                  {walletsForm.eth ? (
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Configured
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full">
                      Not set
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={walletsForm.eth || ""} 
                    onChange={e => setWalletsForm({ ...walletsForm, eth: e.target.value })} 
                    className="w-full bg-card border border-border rounded-xl px-3 py-2.5 pr-20 text-xs text-foreground font-mono focus:border-primary outline-none" 
                    placeholder="0x..." 
                  />
                  <div className="absolute right-1.5 flex items-center gap-1">
                    {walletsForm.eth ? (
                      <button
                        type="button"
                        onClick={() => handleClearWallet('eth')}
                        className="px-2 py-1 text-foreground/40 hover:text-foreground text-[10px] font-semibold cursor-pointer"
                        title="Clear"
                      >
                        Clear
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePasteToWallet('eth')}
                        className="px-2 py-1 bg-secondary hover:bg-secondary/80 text-foreground text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                        title="Paste from clipboard"
                      >
                        Paste
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tether USDT (TRC-20) */}
              <div className="bg-background border border-border rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#26A17B] text-white flex items-center justify-center font-bold text-xs">₮</span>
                    <div>
                      <span className="text-xs font-bold text-foreground">Tether USD (USDT)</span>
                      <span className="text-[10px] text-foreground/50 ml-1.5 font-medium">TRC-20 (TRON Network)</span>
                    </div>
                  </div>
                  {walletsForm.usdt ? (
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Configured
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full">
                      Not set
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={walletsForm.usdt || ""} 
                    onChange={e => setWalletsForm({ ...walletsForm, usdt: e.target.value })} 
                    className="w-full bg-card border border-border rounded-xl px-3 py-2.5 pr-20 text-xs text-foreground font-mono focus:border-primary outline-none" 
                    placeholder="T..." 
                  />
                  <div className="absolute right-1.5 flex items-center gap-1">
                    {walletsForm.usdt ? (
                      <button
                        type="button"
                        onClick={() => handleClearWallet('usdt')}
                        className="px-2 py-1 text-foreground/40 hover:text-foreground text-[10px] font-semibold cursor-pointer"
                        title="Clear"
                      >
                        Clear
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePasteToWallet('usdt')}
                        className="px-2 py-1 bg-secondary hover:bg-secondary/80 text-foreground text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                        title="Paste from clipboard"
                      >
                        Paste
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Solana (SOL) */}
              <div className="bg-background border border-border rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#14F195] text-black flex items-center justify-center font-bold text-xs">◎</span>
                    <div>
                      <span className="text-xs font-bold text-foreground">Solana (SOL)</span>
                      <span className="text-[10px] text-foreground/50 ml-1.5 font-medium">Solana SPL Network</span>
                    </div>
                  </div>
                  {walletsForm.sol ? (
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Configured
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full">
                      Not set
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={walletsForm.sol || ""} 
                    onChange={e => setWalletsForm({ ...walletsForm, sol: e.target.value })} 
                    className="w-full bg-card border border-border rounded-xl px-3 py-2.5 pr-20 text-xs text-foreground font-mono focus:border-primary outline-none" 
                    placeholder="Solana address..." 
                  />
                  <div className="absolute right-1.5 flex items-center gap-1">
                    {walletsForm.sol ? (
                      <button
                        type="button"
                        onClick={() => handleClearWallet('sol')}
                        className="px-2 py-1 text-foreground/40 hover:text-foreground text-[10px] font-semibold cursor-pointer"
                        title="Clear"
                      >
                        Clear
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePasteToWallet('sol')}
                        className="px-2 py-1 bg-secondary hover:bg-secondary/80 text-foreground text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                        title="Paste from clipboard"
                      >
                        Paste
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Security note */}
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-foreground/70">
                <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
                <span>
                  Payouts are strictly routed on the matching blockchain networks. Double check your receiving addresses before saving.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingUpWallets(false)}
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Save & Apply Wallets</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Success Toast */}
      {walletToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} />
          <span>{walletToast}</span>
        </div>
      )}
    </div>
  );
}
