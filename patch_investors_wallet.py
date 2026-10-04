import re

with open('src/components/InvestorsWallet.tsx', 'r') as f:
    content = f.read()

# Add SOL to the user wallet form
old_usdt_user_input = """            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Your USDT (TRC20) Wallet</label>
              <input type="text" value={walletsForm.usdt} onChange={e => setWalletsForm({...walletsForm, usdt: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono" placeholder="T..." />
            </div>"""

new_usdt_user_input = """            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Your USDT (TRC20) Wallet</label>
              <input type="text" value={walletsForm.usdt} onChange={e => setWalletsForm({...walletsForm, usdt: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono" placeholder="T..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Your SOL (Solana) Wallet</label>
              <input type="text" value={walletsForm.sol || ''} onChange={e => setWalletsForm({...walletsForm, sol: e.target.value})} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono" placeholder="Solana Address..." />
            </div>"""

content = content.replace(old_usdt_user_input, new_usdt_user_input)

# Update broker wallets array and add QR code
old_broker_wallets = """                {['BTC', 'ETH', 'USDT'].map(currency => {
                  const key = currency.toLowerCase() as 'btc'|'eth'|'usdt';
                  const address = adminSettings?.brokerWallets?.[key] || 'Wallet address not set by Admin';
                  
                  return (
                    <div key={currency} className="bg-background border border-border rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-foreground">{currency} Wallet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-mono text-foreground/60 truncate flex-1">{address}</p>
                        <button onClick={() => copyToClipboard(address, currency)} className="p-2 hover:bg-foreground/5 rounded-lg text-foreground/50 transition-colors shrink-0">
                          {copied === currency ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  );
                })}"""

new_broker_wallets = """                {['BTC', 'ETH', 'USDT', 'SOL'].map(currency => {
                  const key = currency.toLowerCase() as 'btc'|'eth'|'usdt'|'sol';
                  const address = adminSettings?.brokerWallets?.[key] || 'Wallet address not set by Admin';
                  const hasAddress = adminSettings?.brokerWallets?.[key] && adminSettings.brokerWallets[key].trim().length > 0;
                  
                  return (
                    <div key={currency} className="bg-background border border-border rounded-xl p-4 flex gap-4 items-center">
                      {hasAddress && (
                         <div className="w-16 h-16 shrink-0 bg-white p-1 rounded border border-border">
                           <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(address)}`} alt={`${currency} QR`} className="w-full h-full object-contain" />
                         </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm text-foreground">{currency} Wallet</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-mono text-foreground/60 truncate flex-1">{address}</p>
                          <button onClick={() => copyToClipboard(address, currency)} className="p-2 hover:bg-foreground/5 rounded-lg text-foreground/50 transition-colors shrink-0">
                            {copied === currency ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}"""

content = content.replace(old_broker_wallets, new_broker_wallets)

# Update stake form select
old_select = """                    <select 
                      value={stakeCurrency} 
                      onChange={e => setStakeCurrency(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-sm text-foreground font-bold"
                    >
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                      <option value="USDT">USDT</option>
                    </select>"""

new_select = """                    <select 
                      value={stakeCurrency} 
                      onChange={e => setStakeCurrency(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-sm text-foreground font-bold"
                    >
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                      <option value="USDT">USDT</option>
                      <option value="SOL">SOL</option>
                    </select>"""

content = content.replace(old_select, new_select)

with open('src/components/InvestorsWallet.tsx', 'w') as f:
    f.write(content)
print("Updated InvestorsWallet.tsx")
