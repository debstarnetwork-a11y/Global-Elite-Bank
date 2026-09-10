import { useState } from 'react';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Calendar, FileText } from 'lucide-react';
import { useBank } from '../store';
import { TransferSlip } from './TransferSlip';


export function TransactionHistory() {
  const { transactions, currentUser , adminSettings } = useBank();
  const [selectedTx, setSelectedTx] = useState<any>(null);
  
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine real transactions and mock ones for display if the list is empty or to populate
  const displayTransactions = transactions.length > 0 ? transactions : [];

  // Assuming `transactions` is from context. If it's empty, we might want to show empty state,
  // but to ensure the user has history, let's make sure our context provides some. 
  // Wait, I will use `transactions` from `useBank` and let it filter naturally.

  const filteredTransactions = transactions.filter((tx) => {
    if (tx.userId !== currentUser?.id) return false;
    const typeMatch = filterType === 'all' || tx.type.includes(filterType);
    const statusMatch = filterStatus === 'all' || tx.status === filterStatus;
    
    // Simple search by recipient or ID
    const searchMatch = !searchQuery || 
      (tx.recipientDetails?.name && tx.recipientDetails.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Date filtering (very simple implementation)
    let dateMatch = true;
    if (dateRange !== 'all') {
      const txDate = new Date(tx.date);
      const now = new Date();
      if (dateRange === '30days') {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        dateMatch = txDate >= thirtyDaysAgo;
      } else if (dateRange === '90days') {
        const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
        dateMatch = txDate >= ninetyDaysAgo;
      }
    }

    // Only show user's transactions
    const userMatch = tx.userId === currentUser?.id;

    return userMatch && typeMatch && statusMatch && searchMatch && dateMatch;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'Reference ID', 'Type', 'Amount', 'Status', 'Recipient'];
    const csvRows = [
      headers.join(','),
      ...filteredTransactions.map(tx => {
        const date = `"${new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}"`;
        const ref = `"${tx.id}"`;
        const type = `"${tx.type.replace('transfer_', '')}"`;
        const amount = `"${tx.amount.toFixed(2)}"`;
        const status = `"${tx.status}"`;
        const recipient = `"${tx.recipientDetails?.name || 'N/A'}"`;
        return [date, ref, type, amount, status, recipient].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'detailed_transactions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
          <p className="text-sm text-foreground/60">View, filter, and export your complete transaction records.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors font-bold text-sm"
        >
          <Download size={16} /> Export Statement
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-2">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search ref or name..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:border-primary outline-none text-foreground"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-2">Transaction Type</label>
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-foreground appearance-none"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="transfer">Transfers</option>
            <option value="wire">Wire Transfers</option>
          </select>
        </div>
        
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-2">Status</label>
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-foreground appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-2">Time Period</label>
          <select 
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none text-foreground appearance-none"
          >
            <option value="all">All Time</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-foreground/30 mb-4 border border-border">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">No Transactions Found</h3>
            <p className="text-foreground/50 text-sm max-w-sm mx-auto">There are no transactions matching your current filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50">Date / Ref</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50">Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50">Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50 text-right">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.map((tx) => {
                  const isDeposit = tx.type === 'deposit';
                  return (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-foreground font-medium">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                          <span className="text-[10px] text-foreground/50 font-mono mt-1">{tx.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDeposit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {isDeposit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{tx.recipientDetails?.name || 'Account Deposit'}</p>
                            <p className="text-[10px] text-foreground/50">{tx.recipientDetails?.account ? `AC: ${tx.recipientDetails.account}` : 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-background border border-border px-2 py-1 rounded">
                          {tx.type.replace('transfer_', '')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-bold ${isDeposit ? 'text-emerald-400' : 'text-foreground'}`}>
                          {isDeposit ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                          ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                            tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                            'bg-rose-500/10 text-rose-500 border border-rose-500/20'}
                        `}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedTx && currentUser && (
        <TransferSlip 
          onClose={() => setSelectedTx(null)}
          transaction={{
            reference: selectedTx.id,
            date: selectedTx.date,
            rawDate: selectedTx.date,
            type: selectedTx.type.toUpperCase(),
            rawType: selectedTx.type,
            sender: {
              name: currentUser.name,
              account: currentUser.accounts[0]?.accountNumber || '',
              bank: adminSettings?.websiteName || 'Global Elite Bank',
              iban: currentUser.accounts[0]?.iban || '',
              country: "Switzerland"
            },
            recipient: {
              name: selectedTx.recipientDetails?.name || 'Verified Beneficiary',
              account: selectedTx.recipientDetails?.account || '',
              bank: selectedTx.recipientDetails?.bank || adminSettings?.websiteName || 'Global Elite Bank',
              country: selectedTx.recipientDetails?.country || 'Switzerland',
              remarks: selectedTx.recipientDetails?.remarks || ''
            },
            amount: selectedTx.amount,
            currency: '$',
            fee: 0,
            status: selectedTx.status.toUpperCase() as any
          }}
        />
      )}
    </div>
  );
}
