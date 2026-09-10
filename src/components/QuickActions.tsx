import { ArrowRightLeft, ArrowDownToLine, RefreshCcw, Landmark, Globe, Building, ArrowLeftRight, X, ArrowLeft } from 'lucide-react';
import { useBank } from '../store';
import { useState } from 'react';
import { TransferForm } from './TransferForm';
import { PaymentInstructionsModal } from './PaymentInstructionsModal';
import { useLanguage } from '../context/LanguageContext';


export function QuickActions({ setCurrentView }: { setCurrentView?: (v: string) => void }) {
  const { adminSettings } = useBank();
  const { t } = useLanguage();
  const [showTransferOptions, setShowTransferOptions] = useState(false);
  const [showDepositOptions, setShowDepositOptions] = useState(false);
  const [transferType, setTransferType] = useState<'wire' | 'local' | 'internal' | null>(null);

  const actions = [
    { id: 'deposit', icon: ArrowDownToLine, label: t('deposit', 'Deposit'), desc: t('addFunds', 'Add funds'), color: 'from-secondary to-purple-600', shadow: 'shadow-secondary/20' },
    { id: 'transfer', icon: ArrowRightLeft, label: t('transfer', 'Transfer'), desc: t('toAnyAccount', 'To any account'), color: 'from-primary to-blue-600', shadow: 'shadow-primary/20' },
    { id: 'exchange', icon: RefreshCcw, label: t('exchange', 'Exchange'), desc: t('realTimeFx', 'Real-time FX'), color: 'from-accent to-orange-500', shadow: 'shadow-accent/20' },
    { id: 'vaults', icon: Landmark, label: t('vaults', 'Vaults'), desc: t('earnYield', 'Earn 4.5% APY'), color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button 
              key={i}
              onClick={() => {
                if (action.id === 'transfer') setShowTransferOptions(true);
                if (action.id === 'deposit') setShowDepositOptions(true);
              }}
              className="group flex flex-col items-start p-5 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all hover:shadow-md text-left relative"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${action.color} text-white mb-4 shadow-lg ${action.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-foreground">{action.label}</h3>
              <p className="text-xs text-foreground/50 mt-1">{action.desc}</p>
            </button>
          );
        })}
      </div>

      <PaymentInstructionsModal
        isOpen={showDepositOptions}
        onClose={() => setShowDepositOptions(false)}
      />

      {showTransferOptions && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowTransferOptions(false); }}
        >
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6 border-b border-border/40 pb-3">
              <button
                id="transfer-options-back-btn"
                onClick={() => setShowTransferOptions(false)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-background text-foreground border border-border hover:border-primary/50 transition-colors"
                title="Move back"
              >
                <ArrowLeft size={14} />
                <span>Move Back</span>
              </button>
              <h2 className="text-lg font-bold text-foreground">Transfer Options</h2>
              <button onClick={() => setShowTransferOptions(false)} className="text-foreground/50 hover:text-foreground p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <button onClick={() => { setShowTransferOptions(false); setTransferType('wire'); }} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors text-left group">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">Wire Transfer</p>
                  <p className="text-xs text-foreground/50">International cross-border transfer</p>
                </div>
              </button>
              
              <button onClick={() => { setShowTransferOptions(false); setTransferType('local'); }} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors text-left group">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">Local Transfer</p>
                  <p className="text-xs text-foreground/50">Domestic bank-to-bank transfer</p>
                </div>
              </button>

              <button onClick={() => { setShowTransferOptions(false); setTransferType('internal'); }} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors text-left group">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowLeftRight size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">Internal Transfer</p>
                  <p className="text-xs text-foreground/50">Between Global Elite accounts</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      {transferType && (
        <TransferForm type={transferType} onClose={() => setTransferType(null)} onSuccess={() => setCurrentView?.('Receipts')} />
      )}
    </>
  );
}
