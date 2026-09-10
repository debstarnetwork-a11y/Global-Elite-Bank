import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

new_module = """

export function AdminInvestors() {
  const { adminSettings, updateAdminSettings, investments, updateInvestment, updateBalance, users, adminUpdateUser } = useBank();
  
  const [brokerWalletsForm, setBrokerWalletsForm] = useState(adminSettings.brokerWallets || { btc: '', eth: '', usdt: '' });
  
  const handleSaveBrokerWallets = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings({ brokerWallets: brokerWalletsForm });
    alert('Broker wallets updated successfully.');
  };

  const handleApproveInvestment = (invId: string) => {
    updateInvestment(invId, { status: 'active' });
  };
  
  const handleRejectInvestment = (invId: string) => {
    updateInvestment(invId, { status: 'withdrawn' }); // Custom logic could be added
  };
  
  const handleMatureInvestment = (inv: any) => {
    const profitInput = prompt("Enter the PROFIT AMOUNT (ROI) to add for this investment:", "0");
    if (profitInput === null || isNaN(Number(profitInput))) return;
    const profitAmount = Number(profitInput);
    
    const payoutDest = prompt("Type '1' to send Profit + Principal to User's Fiat Account.\\nType '2' to send to their GEB Investor Crypto Wallet balance.", "1");
    
    if (payoutDest === '1') {
      const user = users.find(u => u.id === inv.userId);
      if (user && user.accounts.length > 0) {
        updateBalance(inv.userId, user.accounts[0].id, inv.amount + profitAmount);
        updateInvestment(inv.id, { status: 'matured', profit: profitAmount });
        alert('Funds successfully sent to User Fiat Account.');
      }
    } else if (payoutDest === '2') {
      const user = users.find(u => u.id === inv.userId);
      if (user) {
        const currentBal = user.investorWallets?.balance || 0;
        adminUpdateUser(inv.userId, { 
          investorWallets: { ...user.investorWallets, balance: currentBal + inv.amount + profitAmount } as any
        });
        updateInvestment(inv.id, { status: 'matured', profit: profitAmount });
        alert('Funds successfully sent to Investor Crypto Wallet Balance.');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Broker Wallets Settings */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Global Elite Bank Broker Wallets</h3>
        <p className="text-sm text-foreground/60 mb-6">These are the wallets where users will deposit their crypto for investment.</p>
        <form onSubmit={handleSaveBrokerWallets} className="space-y-4">
          <div>
             <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">BTC Wallet</label>
             <input type="text" value={brokerWalletsForm.btc} onChange={e => setBrokerWalletsForm({...brokerWalletsForm, btc: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono" />
          </div>
          <div>
             <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">ETH Wallet</label>
             <input type="text" value={brokerWalletsForm.eth} onChange={e => setBrokerWalletsForm({...brokerWalletsForm, eth: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono" />
          </div>
          <div>
             <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">USDT (TRC20) Wallet</label>
             <input type="text" value={brokerWalletsForm.usdt} onChange={e => setBrokerWalletsForm({...brokerWalletsForm, usdt: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono" />
          </div>
          <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-xl hover:bg-primary/90 transition-colors">
            Save Broker Wallets
          </button>
        </form>
      </div>

      {/* Active & Pending Investments */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Manage User Investments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-background/50 border-b border-border text-foreground/50 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">User ID</th>
                <th className="px-6 py-4 font-medium">Amount / Curr</th>
                <th className="px-6 py-4 font-medium">Tx Hash</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {investments.map(inv => {
                const user = users.find(u => u.id === inv.userId);
                return (
                  <tr key={inv.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{user?.name || 'Unknown User'}</div>
                      <div className="text-xs text-foreground/60">{inv.userId}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {inv.amount.toLocaleString()} {inv.currency}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-foreground/60 max-w-[150px] truncate" title={inv.txHash}>
                      {inv.txHash}
                    </td>
                    <td className="px-6 py-4 text-foreground/80">
                      {inv.durationDays} days<br/>
                      <span className="text-[10px] opacity-70">End: {new Date(inv.endDate).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                        inv.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        inv.status === 'matured' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {inv.status === 'active' && (
                        <button onClick={() => handleMatureInvestment(inv)} className="bg-primary text-white text-xs font-bold px-3 py-1 rounded hover:bg-primary/90 transition-colors">
                          Mature / Add Profit
                        </button>
                      )}
                      {inv.status !== 'matured' && inv.status !== 'withdrawn' && (
                        <button onClick={() => handleRejectInvestment(inv.id)} className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold px-3 py-1 rounded hover:bg-rose-500 hover:text-white transition-colors">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {investments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-foreground/50 italic">
                    No investments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"""

content = content + new_module

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)

print("Added AdminInvestors to AdminModules")
