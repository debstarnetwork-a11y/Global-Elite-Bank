import React, { useState, useMemo } from 'react';
import { 
  Investment, 
  User 
} from '../store';
import { getTierForDuration } from './ProjectedRoiChart';
import { 
  History, 
  TrendingUp, 
  ArrowDownToLine, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Coins, 
  ArrowUpRight, 
  ShieldCheck, 
  FileText, 
  X, 
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface InvestmentHistoryViewProps {
  investments: Investment[];
  currentUser: User;
  onOpenStakeModal?: () => void;
  onSeedSampleCompleted?: () => void;
}

export function InvestmentHistoryView({
  investments,
  currentUser,
  onOpenStakeModal,
  onSeedSampleCompleted
}: InvestmentHistoryViewProps) {
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'matured' | 'withdrawn'>('all');
  const [sortBy, setSortBy] = useState<'maturity-desc' | 'maturity-asc' | 'profit-desc' | 'amount-desc'>('maturity-desc');
  const [activeReceipt, setActiveReceipt] = useState<Investment | null>(null);

  // Filter completed investments for current user
  const completedInvestments = useMemo(() => {
    return investments.filter(inv => {
      const isMine = inv.userId === currentUser.id;
      const isCompleted = inv.status === 'matured' || inv.status === 'withdrawn';
      return isMine && isCompleted;
    });
  }, [investments, currentUser.id]);

  // Helper to get realized profit (uses recorded profit or calculated tier profit)
  const getRealizedProfit = (inv: Investment): number => {
    if (inv.profit !== undefined && inv.profit !== null) {
      return Number(inv.profit);
    }
    const tier = getTierForDuration(inv.durationDays);
    return +(inv.amount * (tier.totalRoiPercent / 100)).toFixed(4);
  };

  // Helper to get realized ROI percent
  const getRealizedRoiPercent = (inv: Investment): number => {
    const profit = getRealizedProfit(inv);
    if (inv.amount <= 0) return 0;
    return +((profit / inv.amount) * 100).toFixed(1);
  };

  // Summary Metrics calculations
  const summaryMetrics = useMemo(() => {
    let totalProfitUsdEst = 0;
    let totalPrincipalReturned = 0;
    let totalStakes = completedInvestments.length;

    completedInvestments.forEach(inv => {
      const profit = getRealizedProfit(inv);
      totalPrincipalReturned += inv.amount;
      totalProfitUsdEst += profit;
    });

    const avgRoi = totalStakes > 0
      ? +(completedInvestments.reduce((acc, inv) => acc + getRealizedRoiPercent(inv), 0) / totalStakes).toFixed(1)
      : 0;

    return {
      totalProfitUsdEst,
      totalPrincipalReturned,
      totalStakes,
      avgRoi
    };
  }, [completedInvestments]);

  // Filtered & Sorted items
  const filteredInvestments = useMemo(() => {
    return completedInvestments.filter(inv => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        inv.id.toLowerCase().includes(q) || 
        inv.currency.toLowerCase().includes(q) || 
        inv.txHash.toLowerCase().includes(q);

      // Currency
      const matchesCurrency = selectedCurrency === 'all' || inv.currency.toUpperCase() === selectedCurrency.toUpperCase();

      // Status
      const matchesStatus = selectedStatus === 'all' || inv.status === selectedStatus;

      return matchesSearch && matchesCurrency && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'maturity-desc') {
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      }
      if (sortBy === 'maturity-asc') {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      }
      if (sortBy === 'profit-desc') {
        return getRealizedProfit(b) - getRealizedProfit(a);
      }
      if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      return 0;
    });
  }, [completedInvestments, searchQuery, selectedCurrency, selectedStatus, sortBy]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(text);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const exportCSV = () => {
    if (completedInvestments.length === 0) return;
    const headers = ['Stake ID', 'Asset', 'Principal Amount', 'Duration (Days)', 'Stake Date', 'Maturity Date', 'Realized Profit', 'Total Payout', 'Status', 'Tx Hash'];
    const rows = completedInvestments.map(inv => [
      inv.id,
      inv.currency,
      inv.amount,
      inv.durationDays,
      new Date(inv.startDate).toLocaleDateString(),
      new Date(inv.endDate).toLocaleDateString(),
      getRealizedProfit(inv),
      inv.amount + getRealizedProfit(inv),
      inv.status,
      inv.txHash
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GEB_Investment_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAssetBadgeColor = (currency: string) => {
    switch (currency.toUpperCase()) {
      case 'BTC': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'ETH': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'USDT': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'SOL': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const getAssetSymbol = (currency: string) => {
    switch (currency.toUpperCase()) {
      case 'BTC': return '₿';
      case 'ETH': return 'Ξ';
      case 'USDT': return '₮';
      case 'SOL': return '◎';
      default: return '$';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <History className="text-primary shrink-0" size={22} />
            <span className="leading-tight">Investment History & Completed Stakes</span>
          </h2>
          <p className="text-xs sm:text-sm text-foreground/60 mt-1">
            Comprehensive audit ledger of matured capital, realized returns, and completed cryptographic stakes.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {completedInvestments.length > 0 && (
            <button
              type="button"
              onClick={exportCSV}
              className="flex-1 sm:flex-initial justify-center bg-card hover:bg-background border border-border text-foreground text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          )}

          {onOpenStakeModal && (
            <button
              type="button"
              onClick={onOpenStakeModal}
              className="flex-1 sm:flex-initial justify-center bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-sm"
            >
              <ArrowDownToLine size={14} />
              <span>New Stake</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards for Completed Stakes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-5 relative overflow-hidden shadow-xs">
          <div className="flex justify-between items-start mb-1.5 sm:mb-2">
            <span className="text-[9px] sm:text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
              Realized Profit
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <TrendingUp size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-500 truncate">
            +${summaryMetrics.totalProfitUsdEst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] sm:text-xs text-foreground/60 mt-0.5 sm:mt-1 block font-medium truncate">
            Across {summaryMetrics.totalStakes} stakes
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-5 relative overflow-hidden shadow-xs">
          <div className="flex justify-between items-start mb-1.5 sm:mb-2">
            <span className="text-[9px] sm:text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
              Principal Returned
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Coins size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-foreground truncate">
            {summaryMetrics.totalPrincipalReturned.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] sm:text-xs text-foreground/60 mt-0.5 sm:mt-1 block font-medium truncate">
            100% Capital protected
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-5 relative overflow-hidden shadow-xs">
          <div className="flex justify-between items-start mb-1.5 sm:mb-2">
            <span className="text-[9px] sm:text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
              Avg Realized ROI
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-amber-500">
            +{summaryMetrics.avgRoi}%
          </div>
          <span className="text-[10px] sm:text-xs text-foreground/60 mt-0.5 sm:mt-1 block font-medium truncate">
            Across durations
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-5 relative overflow-hidden shadow-xs">
          <div className="flex justify-between items-start mb-1.5 sm:mb-2">
            <span className="text-[9px] sm:text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
              Reliability
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-indigo-400">
            100%
          </div>
          <span className="text-[10px] sm:text-xs text-foreground/60 mt-0.5 sm:mt-1 block font-medium truncate">
            Swiss clearance rate
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Search by ID, asset, or TxHash..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground focus:border-primary outline-none"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Asset filter buttons */}
          <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border overflow-x-auto no-scrollbar">
            {(['all', 'USDT', 'BTC', 'ETH', 'SOL'] as const).map(curr => (
              <button
                key={curr}
                type="button"
                onClick={() => setSelectedCurrency(curr)}
                className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-colors shrink-0 text-center ${
                  selectedCurrency === curr 
                    ? 'bg-primary text-white shadow-xs' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* Status & Sort Dropdowns */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="bg-background border border-border rounded-xl px-2.5 py-2 text-xs font-bold text-foreground focus:border-primary outline-none cursor-pointer truncate"
            >
              <option value="all">All Statuses</option>
              <option value="matured">Matured</option>
              <option value="withdrawn">Withdrawn</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-background border border-border rounded-xl px-2.5 py-2 text-xs font-bold text-foreground focus:border-primary outline-none cursor-pointer truncate"
            >
              <option value="maturity-desc">Newest First</option>
              <option value="maturity-asc">Oldest First</option>
              <option value="profit-desc">Highest Profit</option>
              <option value="amount-desc">Highest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Detailed Investment History Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {filteredInvestments.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 bg-foreground/5 text-foreground/40 rounded-2xl flex items-center justify-center mx-auto">
              <History size={28} />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">No Completed Investments Found</h4>
              <p className="text-xs text-foreground/60 max-w-md mx-auto mt-1">
                {completedInvestments.length === 0
                  ? 'You do not have any past matured stakes yet. When an active stake reaches its maturity date, it will appear here with full realized profits.'
                  : 'No records match your selected filter criteria. Try adjusting your search query or filters.'}
              </p>
            </div>
            {completedInvestments.length === 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {onOpenStakeModal && (
                  <button
                    type="button"
                    onClick={onOpenStakeModal}
                    className="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <ArrowDownToLine size={14} />
                    <span>Create First Stake</span>
                  </button>
                )}
                {onSeedSampleCompleted && (
                  <button
                    type="button"
                    onClick={onSeedSampleCompleted}
                    className="bg-card hover:bg-background border border-border text-foreground text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Load Demo Completed Stakes</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card-Based List (Visible on < md screens) */}
            <div className="block md:hidden divide-y divide-border">
              {filteredInvestments.map(inv => {
                const profit = getRealizedProfit(inv);
                const roiPercent = getRealizedRoiPercent(inv);
                const totalReturned = +(inv.amount + profit).toFixed(4);
                const startDateObj = new Date(inv.startDate);
                const endDateObj = new Date(inv.endDate);

                return (
                  <div key={inv.id} className="p-4 space-y-3 hover:bg-background/30 transition-colors">
                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border shrink-0 ${getAssetBadgeColor(inv.currency)}`}>
                          {getAssetSymbol(inv.currency)}
                        </span>
                        <div>
                          <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                            <span>{inv.currency} Stake</span>
                            <span className="text-[10px] text-foreground/50 font-normal">({inv.durationDays} Days)</span>
                          </div>
                          <span className="text-[10px] font-mono text-foreground/50 block">
                            ID: {inv.id.slice(0, 10)}...
                          </span>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                        inv.status === 'matured'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        <CheckCircle2 size={10} />
                        <span>{inv.status}</span>
                      </span>
                    </div>

                    {/* Financial Metrics Grid */}
                    <div className="bg-background/60 rounded-xl p-3 border border-border/70 grid grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <span className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider block">
                          Principal Staked
                        </span>
                        <span className="font-bold text-foreground text-sm font-mono mt-0.5 block">
                          {inv.amount.toLocaleString()} {inv.currency}
                        </span>
                        {inv.reinvestedFromProfit && (
                          <span className="text-[9px] text-purple-400 font-bold block mt-0.5">
                            ✦ Reinvested from Profit
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] text-emerald-500/90 font-bold uppercase tracking-wider block">
                          Realized Profit
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="font-bold text-emerald-500 font-mono text-sm">
                            +{profit.toLocaleString()} {inv.currency}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                            +{roiPercent}%
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/40">
                        <span className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider block">
                          Maturity Date
                        </span>
                        <span className="font-medium text-foreground text-xs mt-0.5 flex items-center gap-1">
                          <Calendar size={11} className="text-primary" />
                          <span>{endDateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </span>
                      </div>

                      <div className="pt-2 border-t border-border/40">
                        <span className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider block">
                          Total Returned
                        </span>
                        <span className="font-black text-foreground text-xs font-mono mt-0.5 block">
                          {totalReturned.toLocaleString()} {inv.currency}
                        </span>
                      </div>
                    </div>

                    {/* Cryptographic Proof & Receipt Button */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-lg border border-border max-w-[170px] min-w-0">
                        <span className="font-mono text-[10px] text-foreground/60 truncate flex-1">
                          {inv.txHash}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(inv.txHash)}
                          title="Copy Hash"
                          className="text-foreground/50 hover:text-foreground p-0.5 shrink-0"
                        >
                          {copiedTx === inv.txHash ? (
                            <Check size={11} className="text-emerald-500" />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveReceipt(inv)}
                        className="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-xs shrink-0"
                      >
                        <FileText size={12} />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Full Table (Visible on >= md screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-background/70 border-b border-border text-foreground/50 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 lg:px-6 py-4">Asset & Stake</th>
                    <th className="px-5 lg:px-6 py-4">Principal Staked</th>
                    <th className="px-5 lg:px-6 py-4">Stake Date</th>
                    <th className="px-5 lg:px-6 py-4">Maturity Date</th>
                    <th className="px-5 lg:px-6 py-4">Profit Realized</th>
                    <th className="px-5 lg:px-6 py-4">Total Returned</th>
                    <th className="px-5 lg:px-6 py-4">Tx Proof</th>
                    <th className="px-5 lg:px-6 py-4">Status</th>
                    <th className="px-5 lg:px-6 py-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInvestments.map(inv => {
                    const profit = getRealizedProfit(inv);
                    const roiPercent = getRealizedRoiPercent(inv);
                    const totalReturned = +(inv.amount + profit).toFixed(4);
                    const startDateObj = new Date(inv.startDate);
                    const endDateObj = new Date(inv.endDate);

                    return (
                      <tr key={inv.id} className="hover:bg-background/40 transition-colors">
                        {/* Asset & Stake Details */}
                        <td className="px-5 lg:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm border ${getAssetBadgeColor(inv.currency)}`}>
                              {getAssetSymbol(inv.currency)}
                            </span>
                            <div>
                              <div className="font-bold text-foreground flex items-center gap-1.5">
                                <span>{inv.currency} Stake</span>
                                <span className="text-[10px] text-foreground/50 font-normal">({inv.durationDays}d)</span>
                              </div>
                              <span className="text-[10px] font-mono text-foreground/50">
                                ID: {inv.id.slice(0, 10)}...
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Principal Staked */}
                        <td className="px-5 lg:px-6 py-4">
                          <div className="font-bold text-foreground">
                            {inv.amount.toLocaleString()} {inv.currency}
                          </div>
                          <span className="text-[10px] text-foreground/50 block">
                            {inv.reinvestedFromProfit ? 'Reinvested Profit Capital' : 'Initial Capital'}
                          </span>
                          {inv.reinvestedFromProfit && (
                            <span className="text-[9px] text-purple-400 font-bold block mt-0.5">
                              ✦ Reinvested
                            </span>
                          )}
                        </td>

                        {/* Stake Date */}
                        <td className="px-5 lg:px-6 py-4">
                          <div className="text-foreground text-xs font-medium">
                            {startDateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                          <span className="text-[10px] text-foreground/50">
                            {startDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {/* Maturity Date */}
                        <td className="px-5 lg:px-6 py-4">
                          <div className="text-foreground font-bold text-xs flex items-center gap-1.5">
                            <Calendar size={13} className="text-primary" />
                            <span>{endDateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                          <span className="text-[10px] text-emerald-500/80 font-medium block mt-0.5">
                            Matured ({inv.durationDays} Days Completed)
                          </span>
                        </td>

                        {/* Total Profit Realized */}
                        <td className="px-5 lg:px-6 py-4">
                          <div className="font-bold text-emerald-500 text-sm flex items-center gap-1">
                            <span>+{profit.toLocaleString()} {inv.currency}</span>
                          </div>
                          <span className="inline-block text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded mt-0.5">
                            +{roiPercent}% Realized ROI
                          </span>
                        </td>

                        {/* Total Returned Payout */}
                        <td className="px-5 lg:px-6 py-4">
                          <div className="font-black text-foreground">
                            {totalReturned.toLocaleString()} {inv.currency}
                          </div>
                          <span className="text-[10px] text-foreground/50 block">
                            Principal + Realized Profit
                          </span>
                        </td>

                        {/* Tx Proof */}
                        <td className="px-5 lg:px-6 py-4">
                          <div className="flex items-center gap-1.5 bg-background p-1.5 rounded-lg border border-border max-w-[140px]">
                            <span className="font-mono text-[11px] text-foreground/70 truncate flex-1">
                              {inv.txHash}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(inv.txHash)}
                              title="Copy Hash"
                              className="text-foreground/50 hover:text-foreground p-0.5"
                            >
                              {copiedTx === inv.txHash ? (
                                <Check size={12} className="text-emerald-500" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 lg:px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            inv.status === 'matured'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            <CheckCircle2 size={11} />
                            <span>{inv.status}</span>
                          </span>
                        </td>

                        {/* Action: Receipt */}
                        <td className="px-5 lg:px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveReceipt(inv)}
                            className="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ml-auto shadow-xs"
                          >
                            <FileText size={13} />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Official Settlement Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-150 overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground p-1.5 rounded-full hover:bg-foreground/5 transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto pr-1 -mr-1 space-y-4">
              {/* Swiss Bank Seal & Header */}
              <div className="text-center pb-4 border-b border-border/70 space-y-1">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-1.5 border border-primary/20">
                  <ShieldCheck size={24} />
                </div>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase block">
                  Swiss Wealth Clearance Certificate
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                  Investment Settlement & Maturity Receipt
                </h3>
                <p className="text-[11px] sm:text-xs text-foreground/60 font-mono">
                  Ref: GEB-SETTLE-{activeReceipt.id.slice(0, 12).toUpperCase()}
                </p>
              </div>

              {/* Certificate Details */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-foreground/60">Beneficiary</span>
                  <span className="font-bold text-foreground">{currentUser.name}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-foreground/60">Asset & Pool</span>
                  <span className="font-bold text-foreground">
                    {activeReceipt.currency} Institutional Forex Pool
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-foreground/60">Staked Principal</span>
                  <span className="font-mono font-bold text-foreground">
                    {activeReceipt.amount.toLocaleString()} {activeReceipt.currency}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-foreground/60">Stake Start Date</span>
                  <span className="font-medium text-foreground">
                    {new Date(activeReceipt.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-foreground/60 font-bold">Maturity Date</span>
                  <span className="font-bold text-primary">
                    {new Date(activeReceipt.endDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-foreground/60">Duration Held</span>
                  <span className="font-bold text-foreground">
                    {activeReceipt.durationDays} Days (Completed)
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 bg-emerald-500/10 border border-emerald-500/20 px-3 rounded-xl">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                      Total Profit Realized
                    </span>
                    <span className="text-[11px] text-foreground/60">
                      +{getRealizedRoiPercent(activeReceipt)}% Yield
                    </span>
                  </div>
                  <span className="font-mono font-black text-emerald-500 text-sm sm:text-base">
                    +{getRealizedProfit(activeReceipt).toLocaleString()} {activeReceipt.currency}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 bg-background border border-border px-3 rounded-xl">
                  <span className="font-bold text-foreground text-xs">Total Returned Capital</span>
                  <span className="font-mono font-black text-foreground text-sm sm:text-base">
                    {(activeReceipt.amount + getRealizedProfit(activeReceipt)).toLocaleString()} {activeReceipt.currency}
                  </span>
                </div>

                <div className="py-1">
                  <span className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">
                    Settlement Blockchain Hash
                  </span>
                  <p className="font-mono text-[10px] sm:text-[11px] text-foreground/80 break-all bg-background p-2 rounded-lg border border-border select-all">
                    {activeReceipt.txHash}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3.5 mt-2 border-t border-border/70 flex gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 bg-background hover:bg-card border border-border text-foreground font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download size={13} />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl text-xs hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
