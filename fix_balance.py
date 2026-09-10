import re

with open('src/components/BalanceCard.tsx', 'r') as f:
    content = f.read()

replacement = """
import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, TrendingUp, ChevronDown, Plus, Wallet } from 'lucide-react';
import { useBank } from '../store';

export function BalanceCard() {
  const { currentUser } = useBank();
  const [showBalance, setShowBalance] = useState(true);

  // Get current user's balance, default to 0
  const balance = currentUser?.accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
  const formattedBalance = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 relative overflow-hidden text-white shadow-lg">
      <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl font-bold pointer-events-none"><Wallet /></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-white/70 font-medium text-sm">Account Balance</h2>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-white/50 hover:text-white transition-colors"
            >
              {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20">
            <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
            <span>SECURED BY 2FA</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-white/50">$</span>
            <motion.h1 
              layout
              className="text-4xl md:text-5xl font-bold tracking-tight text-white"
            >
              {showBalance ? formattedBalance : '••••••••••'}
            </motion.h1>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open('src/components/BalanceCard.tsx', 'w') as f:
    f.write(replacement)
