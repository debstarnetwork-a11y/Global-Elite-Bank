import re

with open('src/components/RecentTransactions.tsx', 'r') as f:
    content = f.read()

replacement = """
import { Plane, ShoppingBag, Coffee, ArrowUpRight, ArrowDownLeft, Building, Download, RefreshCw } from 'lucide-react';
import { useBank } from '../store';

export function RecentTransactions() {
  const { transactions, currentUser } = useBank();
  
  // Get transactions specifically for this user
  const userTxns = transactions.filter(t => t.userId === currentUser?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Status'];
    const csvRows = [
      headers.join(','),
      ...userTxns.map(tx => {
        const date = `"${new Date(tx.date).toLocaleDateString()}"`;
        const description = `"${tx.type.replace('_', ' ').toUpperCase()}"`;
        const amount = `"${tx.amount.toFixed(2)}"`;
        const status = tx.status;
        return [date, description, amount, status].join(',');
      })
    ].join('\\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xs uppercase tracking-widest text-foreground/50">Recent Transactions</h3>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/50 hover:text-emerald-500 transition-colors bg-white/5 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-white/10 hover:border-emerald-500/20"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="space-y-4">
        {userTxns.length === 0 ? (
           <p className="text-sm text-foreground/50 text-center py-4">No recent transactions.</p>
        ) : (
          userTxns.map((tx) => {
            const isPositive = tx.type === 'deposit';
            return (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {tx.status === 'pending' ? <RefreshCw size={18} className="animate-spin" /> : (isPositive ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{tx.type.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-[10px] text-foreground/50 uppercase">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-foreground'}`}>
                    {isPositive ? '+' : '-'}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </p>
                  <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${tx.status === 'pending' ? 'text-amber-500' : 'text-emerald-500'}`}>{tx.status}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
"""

content = re.sub(r'import \{ Plane[\s\S]*?\} from \'lucide-react\';[\s\S]*?export function RecentTransactions\(\) \{[\s\S]*?\}', replacement.strip(), content)

with open('src/components/RecentTransactions.tsx', 'w') as f:
    f.write(content)

