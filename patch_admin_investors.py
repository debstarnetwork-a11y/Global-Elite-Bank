import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

# Replace the brokerWalletsForm initialization and handleSaveBrokerWallets
old_investors_head = """export function AdminInvestors() {
  const { adminSettings, updateAdminSettings, investments, updateInvestment, updateBalance, users, adminUpdateUser } = useBank();
  
  const [brokerWalletsForm, setBrokerWalletsForm] = useState(adminSettings.brokerWallets || { btc: '', eth: '', usdt: '' });
  
  const handleSaveBrokerWallets = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings({ brokerWallets: brokerWalletsForm });
    alert('Broker wallets updated successfully.');
  };"""

new_investors_head = """export function AdminInvestors() {
  const { adminSettings, updateAdminSettings, investments, updateInvestment, updateBalance, users, adminUpdateUser } = useBank();
  
  const [brokerWalletsForm, setBrokerWalletsForm] = useState(adminSettings.brokerWallets || { btc: '', eth: '', usdt: '', sol: '' });
  
  const handleSaveBrokerWallets = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings({ brokerWallets: brokerWalletsForm });
    alert('Broker wallets updated successfully.');
  };"""

content = content.replace(old_investors_head, new_investors_head)

# Also add sol to the form
old_usdt_input = """          <div>
             <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">USDT (TRC20) Wallet</label>
             <input type="text" value={brokerWalletsForm.usdt} onChange={e => setBrokerWalletsForm({...brokerWalletsForm, usdt: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono" />
          </div>"""

new_usdt_input = """          <div>
             <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">USDT (TRC20) Wallet</label>
             <input type="text" value={brokerWalletsForm.usdt} onChange={e => setBrokerWalletsForm({...brokerWalletsForm, usdt: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono" />
          </div>
          <div>
             <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">SOL (Solana) Wallet</label>
             <input type="text" value={brokerWalletsForm.sol} onChange={e => setBrokerWalletsForm({...brokerWalletsForm, sol: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono" />
          </div>"""

content = content.replace(old_usdt_input, new_usdt_input)

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)
print("Updated AdminInvestors broker wallets")
