
import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Eye, 
  EyeOff, 
  CreditCard, 
  Coins, 
  Wallet, 
  ArrowDownToLine, 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { useBank } from '../store';
import { RequestWithdrawalModal } from './RequestWithdrawalModal';
import { useLanguage } from '../context/LanguageContext';

interface BalanceCardProps {
  onNavigateView?: (view: string) => void;
}

export function BalanceCard({ onNavigateView }: BalanceCardProps) {
  const { currentUser } = useBank();
  const { t } = useLanguage();
  const [showBalance, setShowBalance] = useState(true);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Bank Credit Balance (Fiat Accounts / Checking / Credit lines only)
  const bankCreditBalance = currentUser?.accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
  const formattedBankCredit = bankCreditBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Crypto Portfolio & Investor Vault Balance (Strictly isolated from Bank Credit)
  const cryptoBalance = currentUser?.investorWallets?.balance || 0;
  const formattedCryptoBalance = cryptoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const primaryAccount = currentUser?.accounts?.[0];

  return (
    <div className="space-y-4">
      {/* Top Architecture Bar - Segregated, Independent Balances */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3.5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck size={17} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                {t('segregatedAccountArchitecture', 'Segregated Account Architecture')}
              </span>
              <button 
                type="button"
                onClick={() => setShowBalance(!showBalance)}
                className="text-foreground/40 hover:text-foreground p-0.5 rounded transition-colors"
                title={showBalance ? "Hide balances" : "Show balances"}
              >
                {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-[11px] text-foreground/50">
              {t('independentLedgersDesc', 'Bank credit and crypto assets are maintained in strictly independent ledgers.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{t('independentLedgers', 'INDEPENDENT LEDGERS')}</span>
          </div>
        </div>
      </div>

      {/* Dual Separated Balance Cards: Bank Credit Balance vs Crypto Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Bank Credit Balance Card */}
        <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary rounded-2xl p-5 sm:p-6 relative overflow-hidden text-white shadow-lg border border-primary/20 flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl font-bold pointer-events-none select-none">
            <CreditCard />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white">
                  <CreditCard size={15} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide">{t('bankCreditBalance', 'Bank Credit Balance')}</h3>
                  <p className="text-[10px] text-white/70">{t('fiatChecking', 'Fiat Checking & Credit Accounts')}</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/15 border border-white/20 text-white uppercase tracking-wider">
                {t('fiatCustody', 'Fiat Custody')}
              </span>
            </div>

            <div className="my-3">
              <span className="text-xs text-white/60 font-semibold uppercase tracking-wider">{t('availableCreditLine', 'Available Credit Line')}</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-semibold text-white/60">$</span>
                <motion.h2 
                  layout
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono"
                >
                  {showBalance ? formattedBankCredit : '••••••••'}
                </motion.h2>
                <span className="text-xs font-bold text-white/60 ml-1">USD</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="text-[11px] text-white/80 font-mono">
              {t('accountNumber', 'Acc: #')}{primaryAccount?.accountNumber || 'GEB-883921'}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{t('activeBankingCredit', 'Active Banking Credit')}</span>
            </div>
          </div>
        </div>

        {/* 2. Dedicated Crypto Balance Card (Separated from Bank Credit) */}
        <div className="bg-gradient-to-br from-[#0f172a] via-[#111c35] to-[#0a0f1d] rounded-2xl p-5 sm:p-6 relative overflow-hidden text-white shadow-lg border border-emerald-500/25 flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl font-bold text-emerald-400 pointer-events-none select-none">
            <Coins />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                  <Coins size={15} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide">{t('cryptoBalance', 'Crypto Balance')}</h3>
                  <p className="text-[10px] text-emerald-400/80">{t('digitalAssetVault', 'Digital Asset Vault & Investor Funds')}</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
                {t('isolatedCrypto', 'Isolated Crypto')}
              </span>
            </div>

            <div className="my-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60 font-semibold uppercase tracking-wider">{t('totalCryptoEquity', 'Total Crypto Equity')}</span>
                <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-bold">
                  {t('minWithdrawal', 'Min. Withdrawal $100')}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-semibold text-emerald-400/80">$</span>
                <motion.h2 
                  layout
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-400 font-mono"
                >
                  {showBalance ? formattedCryptoBalance : '••••••••'}
                </motion.h2>
                <span className="text-xs font-bold text-emerald-400/70 ml-1">USD</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 mt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <span className="text-[10px] text-white/50">
              {t('coldStorageSegregated', 'Cold Storage Segregated')}
            </span>
            <button
              type="button"
              onClick={() => setIsWithdrawOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all active:scale-95"
            >
              <ArrowDownToLine size={13} />
              <span>{t('withdrawCrypto', 'Withdraw Crypto')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      <RequestWithdrawalModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        defaultSource="investor"
      />
    </div>
  );
}
