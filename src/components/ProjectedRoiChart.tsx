import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine, 
  ReferenceDot 
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  Coins, 
  Calendar, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { Investment } from '../store';

export interface StakingTierConfig {
  durationDays: number;
  label: string;
  totalRoiPercent: number;
  dailyRate: number;
  tierName: string;
}

export const STAKING_TIERS: Record<number, StakingTierConfig> = {
  3: { durationDays: 3, label: '3 Days', totalRoiPercent: 4.5, dailyRate: 1.5, tierName: 'Rapid Liquidity' },
  4: { durationDays: 4, label: '4 Days', totalRoiPercent: 6.4, dailyRate: 1.6, tierName: 'Short Alpha' },
  7: { durationDays: 7, label: '1 Week', totalRoiPercent: 12.0, dailyRate: 1.71, tierName: 'High-Yield Alpha' },
  14: { durationDays: 14, label: '2 Weeks', totalRoiPercent: 26.0, dailyRate: 1.86, tierName: 'Forex Quant Pool' },
  30: { durationDays: 30, label: '1 Month', totalRoiPercent: 62.0, dailyRate: 2.07, tierName: 'Institutional Vault' },
  90: { durationDays: 90, label: '3 Months', totalRoiPercent: 215.0, dailyRate: 2.39, tierName: 'Executive Sovereign' },
};

export function getTierForDuration(days: number): StakingTierConfig {
  if (STAKING_TIERS[days]) return STAKING_TIERS[days];
  // Linear approximation if custom
  const daily = days <= 7 ? 1.7 : days <= 30 ? 2.0 : 2.4;
  return {
    durationDays: days,
    label: `${days} Days`,
    totalRoiPercent: +(daily * days).toFixed(1),
    dailyRate: daily,
    tierName: 'Custom Term'
  };
}

interface ProjectedRoiChartProps {
  activeInvestments: Investment[];
  onOpenStakeModal?: (preset?: { currency?: string; duration?: number; amount?: number }) => void;
  selectedStakeId?: string | null;
  onSelectStakeId?: (id: string | null) => void;
}

interface ChartPoint {
  dayNumber: number;
  dayLabel: string;
  dateLabel: string;
  totalValue: number;
  profit: number;
  roiPercent: number;
  isElapsed: boolean;
  isToday: boolean;
  statusText: string;
}

export function ProjectedRoiChart({ 
  activeInvestments, 
  onOpenStakeModal,
  selectedStakeId,
  onSelectStakeId
}: ProjectedRoiChartProps) {
  // Selected stake state: either an active stake ID, or 'simulator' mode
  const [internalSelectedId, setInternalSelectedId] = useState<string>(() => {
    return activeInvestments[0]?.id || 'simulator';
  });

  const activeId = selectedStakeId !== undefined ? (selectedStakeId || 'simulator') : internalSelectedId;
  const setActiveId = (id: string) => {
    setInternalSelectedId(id);
    if (onSelectStakeId) onSelectStakeId(id === 'simulator' ? null : id);
  };

  // View metric mode: 'value' (total balance in currency), 'profit' (net profit), or 'roi' (percent)
  const [metricMode, setMetricMode] = useState<'value' | 'profit' | 'roi'>('value');

  // Simulator state when testing prospective investment parameters
  const [simCurrency, setSimCurrency] = useState<'BTC' | 'ETH' | 'USDT' | 'SOL'>('USDT');
  const [simAmount, setSimAmount] = useState<number>(5000);
  const [simDuration, setSimDuration] = useState<number>(14);

  // Sync selection if activeInvestments changes
  React.useEffect(() => {
    if (activeInvestments.length > 0 && activeId === 'simulator' && selectedStakeId === undefined) {
      setActiveId(activeInvestments[0].id);
    }
  }, [activeInvestments.length]);

  const selectedInvestment = useMemo(() => {
    if (activeId === 'simulator') return null;
    return activeInvestments.find(inv => inv.id === activeId) || null;
  }, [activeId, activeInvestments]);

  // Determine current working parameters
  const currentAsset = selectedInvestment ? selectedInvestment.currency : simCurrency;
  const currentPrincipal = selectedInvestment ? selectedInvestment.amount : (simAmount || 1000);
  const currentDurationDays = selectedInvestment ? selectedInvestment.durationDays : simDuration;
  const tierConfig = getTierForDuration(currentDurationDays);

  const totalExpectedRoiPercent = tierConfig.totalRoiPercent;
  const totalProjectedProfit = +(currentPrincipal * (totalExpectedRoiPercent / 100)).toFixed(4);
  const totalProjectedValue = +(currentPrincipal + totalProjectedProfit).toFixed(4);

  // Calculate timeline details if real stake
  const { startDate, endDate, elapsedDays, currentProgressPct, isMatured } = useMemo(() => {
    if (!selectedInvestment) {
      const start = new Date();
      const end = new Date(start.getTime() + currentDurationDays * 86400000);
      return {
        startDate: start,
        endDate: end,
        elapsedDays: 0,
        currentProgressPct: 0,
        isMatured: false,
      };
    }
    const start = new Date(selectedInvestment.startDate);
    const end = new Date(selectedInvestment.endDate);
    const now = new Date();
    const totalMs = end.getTime() - start.getTime();
    const elapsedMs = Math.max(0, now.getTime() - start.getTime());
    const elapsed = Math.min(currentDurationDays, Math.floor(elapsedMs / (1000 * 60 * 60 * 24)));
    const pct = totalMs > 0 ? Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100)) : 0;
    return {
      startDate: start,
      endDate: end,
      elapsedDays: elapsed,
      currentProgressPct: Math.floor(pct),
      isMatured: now.getTime() >= end.getTime()
    };
  }, [selectedInvestment, currentDurationDays]);

  // Generate chart data points across chosen duration
  const chartData: ChartPoint[] = useMemo(() => {
    const points: ChartPoint[] = [];
    const totalDays = Math.max(1, currentDurationDays);

    // Number of steps: daily for ≤ 14 days; sampled for longer durations
    let step = 1;
    if (totalDays > 30) step = 5;
    else if (totalDays > 14) step = 2;

    const dayIndexes: number[] = [];
    for (let d = 0; d <= totalDays; d += step) {
      dayIndexes.push(d);
    }
    if (dayIndexes[dayIndexes.length - 1] !== totalDays) {
      dayIndexes.push(totalDays);
    }

    dayIndexes.forEach((d) => {
      const progressFraction = d / totalDays;
      // Compounded institutional accrual curve: slight exponential curve
      // (1 + r)^t normalized to hit totalExpectedRoiPercent at d = totalDays
      const dailyYieldFraction = Math.pow(1 + (totalExpectedRoiPercent / 100), progressFraction) - 1;
      const pointRoiPercent = +(dailyYieldFraction * 100).toFixed(2);
      const pointProfit = +(currentPrincipal * (pointRoiPercent / 100)).toFixed(4);
      const pointTotal = +(currentPrincipal + pointProfit).toFixed(4);

      const pointDate = new Date(startDate.getTime() + d * 86400000);
      const dateLabel = pointDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const dayLabel = d === 0 ? 'Day 0' : d === totalDays ? `Day ${d} (Mat.)` : `Day ${d}`;

      const isElapsed = selectedInvestment ? d <= elapsedDays : false;
      const isToday = selectedInvestment ? d === elapsedDays : d === 0;

      let statusText = 'Projected';
      if (selectedInvestment) {
        if (d < elapsedDays) statusText = 'Accrued';
        else if (d === elapsedDays) statusText = 'Current Day';
        else statusText = 'Forecast';
      }

      points.push({
        dayNumber: d,
        dayLabel,
        dateLabel,
        totalValue: pointTotal,
        profit: pointProfit,
        roiPercent: pointRoiPercent,
        isElapsed,
        isToday,
        statusText,
      });
    });

    return points;
  }, [currentDurationDays, totalExpectedRoiPercent, currentPrincipal, startDate, selectedInvestment, elapsedDays]);

  // Current day data point for ReferenceDot
  const todayPoint = useMemo(() => {
    if (!selectedInvestment) return null;
    return chartData.find(p => p.isToday) || chartData[0];
  }, [chartData, selectedInvestment]);

  // Formatter for Y-Axis
  const formatYAxis = (val: number) => {
    if (metricMode === 'roi') return `+${val}%`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return `${val}`;
  };

  // Currency symbol helper
  const currencySymbol = useMemo(() => {
    switch (currentAsset) {
      case 'BTC': return '₿';
      case 'ETH': return 'Ξ';
      case 'USDT': return '₮';
      case 'SOL': return '◎';
      default: return '$';
    }
  }, [currentAsset]);

  // Current accrued ROI value
  const currentAccruedRoiPercent = selectedInvestment
    ? +(totalExpectedRoiPercent * (elapsedDays / currentDurationDays)).toFixed(2)
    : 0;
  const currentAccruedProfit = +(currentPrincipal * (currentAccruedRoiPercent / 100)).toFixed(4);

  return (
    <div id="geb-projected-roi-chart" className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden transition-all">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

      {/* Header Controls & Active Stakes Selector */}
      <div className="relative z-10 space-y-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/20">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Projected ROI Yield Trajectory
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {tierConfig.tierName}
                  </span>
                </h3>
                <p className="text-xs text-foreground/60">
                  {selectedInvestment 
                    ? `Visualizing yield accrual curve over the ${currentDurationDays}-day investment lifecycle for active stake.`
                    : 'Interactive ROI forecasting model based on GEB institutional algorithmic trading pools.'}
                </p>
              </div>
            </div>
          </div>

          {/* Metric View Toggle (Total Value, Net Profit, ROI %) */}
          <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setMetricMode('value')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metricMode === 'value'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-foreground/60 hover:text-foreground hover:bg-card/50'
              }`}
            >
              Total Value
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('profit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metricMode === 'profit'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-foreground/60 hover:text-foreground hover:bg-card/50'
              }`}
            >
              Net Profit
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('roi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metricMode === 'roi'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-foreground/60 hover:text-foreground hover:bg-card/50'
              }`}
            >
              ROI %
            </button>
          </div>
        </div>

        {/* Stake Tabs: Switch between Active Stakes or Simulator */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/40 mr-1 flex items-center gap-1">
            <Layers size={13} />
            Source:
          </span>

          {activeInvestments.map((inv, idx) => {
            const isSelected = activeId === inv.id;
            return (
              <button
                key={inv.id}
                type="button"
                onClick={() => setActiveId(inv.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-primary/15 text-primary border-primary shadow-xs'
                    : 'bg-background hover:bg-card/80 text-foreground/70 border-border'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">
                  {inv.currency.slice(0, 1)}
                </span>
                <span>
                  Stake #{idx + 1}: {inv.amount.toLocaleString()} {inv.currency}
                </span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({inv.durationDays}d)
                </span>
                {inv.status === 'active' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setActiveId('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              activeId === 'simulator'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500 shadow-xs'
                : 'bg-background hover:bg-card/80 text-foreground/60 border-border'
            }`}
          >
            <Sparkles size={13} className="text-emerald-400" />
            <span>ROI Simulator</span>
          </button>
        </div>

        {/* Simulator Controls if in simulator mode */}
        {activeId === 'simulator' && (
          <div className="bg-background/80 border border-emerald-500/30 rounded-xl p-3.5 flex flex-wrap items-center gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground/60">Asset:</span>
              <div className="flex gap-1">
                {(['USDT', 'BTC', 'ETH', 'SOL'] as const).map(curr => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setSimCurrency(curr)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      simCurrency === curr 
                        ? 'bg-emerald-500 text-white shadow-xs' 
                        : 'bg-card text-foreground/70 border border-border hover:text-foreground'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground/60">Amount:</span>
              <input
                type="number"
                min="1"
                step="any"
                value={simAmount}
                onChange={e => setSimAmount(Math.max(1, Number(e.target.value) || 0))}
                className="w-28 bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-foreground focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground/60">Duration:</span>
              <div className="flex gap-1">
                {([3, 4, 7, 14, 30, 90] as const).map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setSimDuration(days)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                      simDuration === days 
                        ? 'bg-emerald-500 text-white shadow-xs' 
                        : 'bg-card text-foreground/70 border border-border hover:text-foreground'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>

            {onOpenStakeModal && (
              <button
                type="button"
                onClick={() => onOpenStakeModal({ currency: simCurrency, duration: simDuration, amount: simAmount })}
                className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Stake This Duration</span>
                <ArrowUpRight size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-background/80 border border-border rounded-xl p-3">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest block mb-1">
            Initial Principal
          </span>
          <div className="text-base sm:text-lg font-black text-foreground flex items-baseline gap-1">
            <span>{currentPrincipal.toLocaleString()}</span>
            <span className="text-xs font-bold text-foreground/60">{currentAsset}</span>
          </div>
          <span className="text-[11px] text-foreground/50 mt-0.5 block">
            Day 0 Baseline
          </span>
        </div>

        <div className="bg-background/80 border border-border rounded-xl p-3">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest block mb-1">
            Target Net Yield
          </span>
          <div className="text-base sm:text-lg font-black text-emerald-400 flex items-baseline gap-1">
            <span>+{totalProjectedProfit.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-400/80">{currentAsset}</span>
          </div>
          <span className="text-[11px] text-emerald-500/90 font-semibold mt-0.5 block">
            +{totalExpectedRoiPercent}% Total ROI
          </span>
        </div>

        <div className="bg-background/80 border border-border rounded-xl p-3">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest block mb-1">
            Projected Maturation
          </span>
          <div className="text-base sm:text-lg font-black text-foreground flex items-baseline gap-1">
            <span>{totalProjectedValue.toLocaleString()}</span>
            <span className="text-xs font-bold text-foreground/60">{currentAsset}</span>
          </div>
          <span className="text-[11px] text-foreground/50 mt-0.5 block">
            ~{tierConfig.dailyRate}% Daily Accrual
          </span>
        </div>

        <div className="bg-background/80 border border-border rounded-xl p-3">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest block mb-1">
            Timeline Progress
          </span>
          <div className="text-base sm:text-lg font-black text-foreground flex items-baseline gap-1">
            <span>{selectedInvestment ? `${currentProgressPct}%` : '0%'}</span>
            <span className="text-xs font-medium text-foreground/60">
              ({selectedInvestment ? `${elapsedDays}/${currentDurationDays}d` : `${currentDurationDays}d`})
            </span>
          </div>
          <span className="text-[11px] text-foreground/50 mt-0.5 block truncate">
            {selectedInvestment 
              ? `${Math.max(0, currentDurationDays - elapsedDays)} days remaining`
              : `Matures in ${currentDurationDays} days`}
          </span>
        </div>
      </div>

      {/* Recharts Line Graph Canvas */}
      <div className="w-full h-72 sm:h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 15, right: 15, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="roiLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="roiAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.08)" 
              vertical={false} 
            />

            <XAxis 
              dataKey="dayLabel" 
              stroke="rgba(255, 255, 255, 0.4)" 
              tick={{ fontSize: 11, fill: 'currentColor' }} 
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
            />

            <YAxis 
              stroke="rgba(255, 255, 255, 0.4)" 
              tick={{ fontSize: 11, fill: 'currentColor' }} 
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
              tickFormatter={formatYAxis}
              domain={metricMode === 'roi' ? [0, 'dataMax + 5'] : ['dataMin - 1', 'dataMax + 1']}
            />

            <Tooltip 
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const pt = payload[0].payload as ChartPoint;
                return (
                  <div className="bg-card/95 backdrop-blur-md border border-border p-3.5 rounded-xl shadow-2xl text-xs space-y-2 min-w-[210px] animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between border-b border-border/80 pb-2">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <Calendar size={13} className="text-primary" />
                        <span>{pt.dateLabel}</span>
                        <span className="text-foreground/50 font-normal">({pt.dayLabel})</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        pt.statusText === 'Accrued' 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                          : pt.statusText === 'Current Day'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-primary/15 text-primary border-primary/30'
                      }`}>
                        {pt.statusText}
                      </span>
                    </div>

                    <div className="space-y-1 pt-0.5">
                      <div className="flex justify-between items-center text-foreground/70">
                        <span>Projected Balance:</span>
                        <span className="font-mono font-bold text-foreground">
                          {pt.totalValue.toLocaleString()} {currentAsset}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-foreground/70">
                        <span>Cumulative Net Yield:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          +{pt.profit.toLocaleString()} {currentAsset}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-foreground/70">
                        <span>ROI Rate:</span>
                        <span className="font-mono font-bold text-amber-400">
                          +{pt.roiPercent}%
                        </span>
                      </div>
                    </div>

                    {pt.isToday && (
                      <div className="mt-1 pt-1.5 border-t border-border/50 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                        <Clock size={11} />
                        <span>Current timeline location</span>
                      </div>
                    )}
                  </div>
                );
              }}
            />

            {/* Principal Baseline Line */}
            {metricMode === 'value' && (
              <ReferenceLine 
                y={currentPrincipal} 
                stroke="rgba(255, 255, 255, 0.25)" 
                strokeDasharray="4 4" 
                label={{ 
                  value: `Principal (${currentPrincipal} ${currentAsset})`, 
                  position: 'insideTopLeft', 
                  fill: 'rgba(255, 255, 255, 0.4)', 
                  fontSize: 10 
                }} 
              />
            )}

            {/* Current Day Reference Line if active stake */}
            {selectedInvestment && todayPoint && (
              <ReferenceLine 
                x={todayPoint.dayLabel} 
                stroke="#f59e0b" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Today', 
                  position: 'insideTop', 
                  fill: '#f59e0b', 
                  fontSize: 11,
                  fontWeight: 'bold'
                }} 
              />
            )}

            {/* Smooth projected yield curve */}
            <Line
              type="monotone"
              dataKey={metricMode === 'value' ? 'totalValue' : metricMode === 'profit' ? 'profit' : 'roiPercent'}
              stroke="url(#roiLineGradient)"
              strokeWidth={3}
              dot={{ r: 3, fill: '#10b981', stroke: '#ffffff', strokeWidth: 1.5 }}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
              animationDuration={800}
            />

            {/* ReferenceDot at current position */}
            {selectedInvestment && todayPoint && (
              <ReferenceDot
                x={todayPoint.dayLabel}
                y={metricMode === 'value' ? todayPoint.totalValue : metricMode === 'profit' ? todayPoint.profit : todayPoint.roiPercent}
                r={7}
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Details: Yield tiers & Guarantee Disclaimer */}
      <div className="mt-4 pt-4 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-foreground/60">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span>
            Traded by GEB Institutional Forex & Arbitrage Desks. Principal protected with automated Swiss risk hedging.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-foreground/50">
          <span>Target APY: <strong className="text-foreground">{(tierConfig.dailyRate * 365).toFixed(0)}%</strong></span>
          <span>•</span>
          <span>Term: <strong className="text-foreground">{currentDurationDays} Days</strong></span>
        </div>
      </div>
    </div>
  );
}
