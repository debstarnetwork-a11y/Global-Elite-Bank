const fs = require('fs');

// 1. UPDATE PlaceholderViews.tsx
let content1 = fs.readFileSync('src/components/PlaceholderViews.tsx', 'utf8');
if (!content1.includes('ArrowLeft')) {
   content1 = content1.replace('import { CreditCard', 'import { CreditCard, ArrowLeft');
}
const startIdx1 = content1.indexOf('export function CardsView() {');
const endIdx1 = content1.indexOf('export function AnalyticsView() {');
const newCardsView = `export function CardsView() {
  const { currentUser, adminSettings, virtualCards, createVirtualCard, updateBalance, createTransaction, updateVirtualCardStatus } = useBank();
  const [showNumber, setShowNumber] = useState<Record<string, boolean>>({});
  const [applying, setApplying] = useState<string | null>(null);

  const myCards = virtualCards.filter(c => c.userId === currentUser?.id);
  const canViewFull = currentUser?.role === 'admin' || currentUser?.showFullCardDetails;

  const CARD_TIERS = [
    { id: 'standard', name: 'Standard', network: 'visa', price: 500, color: 'from-blue-700 via-blue-600 to-blue-500', textColor: 'text-white' },
    { id: 'gold', name: 'Gold', network: 'mastercard', price: 1000, color: 'from-yellow-500 via-yellow-400 to-yellow-300', textColor: 'text-gray-900' },
    { id: 'platinum', name: 'Platinum', network: 'visa', price: 2500, color: 'from-gray-300 via-gray-200 to-gray-100', textColor: 'text-gray-900' },
    { id: 'black', name: 'Global Elite Black', network: 'mastercard', price: 5000, color: 'from-gray-900 via-gray-800 to-black', textColor: 'text-white' }
  ];

  const renderNetworkLogo = (network: string, textColor: string) => {
    if (network === 'mastercard') {
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#EB001B] rounded-full opacity-90 z-10"></div>
          <div className="w-8 h-8 bg-[#F79E1B] rounded-full opacity-90 -ml-4 z-0"></div>
        </div>
      );
    }
    return (
      <div className={\`font-black italic text-2xl tracking-tighter drop-shadow-lg uppercase \${textColor}\`}>
        VISA
      </div>
    );
  };

  const handleApply = (tierId: string) => {
    if (!currentUser) return;
    const tier = CARD_TIERS.find(t => t.id === tierId);
    if (!tier) return;
    
    const account = currentUser.accounts?.[0];
    if (!account) return alert('No account found');
    
    if (account.balance < tier.price) {
      return alert(\`Insufficient balance. You need $\${tier.price.toLocaleString()} to apply for the \${tier.name} card.\`);
    }

    setApplying(tierId);
    setTimeout(() => {
      updateBalance(currentUser.id, account.id, account.balance - tier.price);
      
      createTransaction({
        userId: currentUser.id,
        accountId: account.id,
        amount: tier.price,
        type: 'withdrawal',
        description: \`\${tier.name} Card Issuance Fee\`,
        status: 'completed'
      });

      createVirtualCard({
        userId: currentUser.id,
        cardNumber: \`4532\${Math.floor(Math.random() * 9000 + 1000)}\${Math.floor(Math.random() * 9000 + 1000)}\${Math.floor(Math.random() * 9000 + 1000)}\`,
        expiry: \`\${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/29\`,
        cvv: String(Math.floor(Math.random() * 900 + 100)),
        status: 'pending',
        type: 'virtual',
        tier: tier.id as any,
        network: tier.network as any,
        price: tier.price
      });
      
      setApplying(null);
    }, 1000);
  };

  const toggleNumber = (cardId: string) => {
    if (currentUser?.role === 'admin') {
      setShowNumber(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    } else {
      alert('Only admin can authorize viewing full card details.');
    }
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4 mb-2">
         <button className="p-2 bg-card border border-border rounded-lg hover:bg-background transition-colors">
           <ArrowLeft size={20} className="text-foreground/70" />
         </button>
         <h2 className="text-2xl font-bold text-foreground">Card Offerings & Management</h2>
       </div>
       <p className="text-foreground/60 mb-8 max-w-2xl">
         Explore our exclusive tier-based virtual cards. Select and instantly issue a card to your portfolio.
       </p>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {CARD_TIERS.map(tier => {
           const ownedCard = myCards.find(c => c.tier === tier.id);
           const isApplying = applying === tier.id;

           return (
             <div key={tier.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between w-full mb-6">
                  <h3 className="text-lg font-bold">{tier.name} Tier</h3>
                  {ownedCard ? (
                    <span className={\`px-2 py-1 text-xs font-bold uppercase rounded \${ownedCard.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : ownedCard.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}\`}>
                      {ownedCard.status}
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-bold uppercase rounded bg-foreground/10 text-foreground/60">
                      Unissued
                    </span>
                  )}
                </div>

                <div className={\`relative w-full aspect-[1.586/1] bg-gradient-to-tr \${tier.color} \${tier.textColor} rounded-2xl p-6 flex flex-col justify-between shadow-2xl shadow-primary/20 border border-white/10 overflow-hidden group hover:scale-[1.02] transition-transform duration-300\`}>
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                    {tier.name}
                  </div>

                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-3">
                      {adminSettings?.websiteLogo ? (
                        <img src={adminSettings.websiteLogo} alt="Bank Logo" className={\`h-8 object-contain \${tier.textColor === 'text-white' ? 'brightness-0 invert' : ''}\`} crossOrigin="anonymous" />
                      ) : null}
                      <div className="font-bold text-xl tracking-tighter">
                        GEB <span className="font-light opacity-50 text-xs tracking-normal block -mt-1">GLOBAL ELITE BANK</span>
                      </div>
                    </div>
                    <Wifi className="opacity-80 rotate-90" size={24} />
                  </div>

                  <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 relative z-10 opacity-90 mt-2 mb-1 flex items-center justify-center overflow-hidden">
                     <div className="w-full h-[1px] bg-black/20 absolute top-1/2"></div>
                     <div className="w-[1px] h-full bg-black/20 absolute left-1/3"></div>
                     <div className="w-[1px] h-full bg-black/20 absolute right-1/3"></div>
                  </div>

                  <div className="relative z-10 mb-2">
                    <p className="font-mono text-lg sm:text-xl tracking-[0.15em] sm:tracking-[0.2em] drop-shadow-md">
                      {ownedCard ? (showNumber[ownedCard.id] && canViewFull ? ownedCard.cardNumber.match(/.{1,4}/g)?.join(' ') : \`•••• •••• •••• \${ownedCard.cardNumber.slice(-4)}\`) : '•••• •••• •••• ••••'}
                    </p>
                  </div>

                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1">Cardholder</p>
                      <p className="font-bold tracking-widest text-xs uppercase">{currentUser?.name || 'User'}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1">Valid Thru</p>
                      <p className="font-mono tracking-widest text-xs">{ownedCard ? ownedCard.expiry : 'MM/29'}</p>
                      {ownedCard && showNumber[ownedCard.id] && canViewFull && (
                        <>
                          <p className="opacity-50 text-[10px] uppercase tracking-widest mb-0.5 mt-1">CVV</p>
                          <p className="font-mono tracking-widest text-xs">{ownedCard.cvv}</p>
                        </>
                      )}
                    </div>
                    {renderNetworkLogo(tier.network, tier.textColor)}
                  </div>
                </div>

                <div className="w-full mt-6">
                  {ownedCard ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateVirtualCardStatus(ownedCard.id, ownedCard.status === 'frozen' ? 'active' : 'frozen')}
                        className={\`flex-1 px-4 py-2 text-white rounded-lg text-sm font-bold transition-colors shadow-sm \${ownedCard.status === 'frozen' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}\`}
                      >
                        {ownedCard.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                      </button>
                      <button onClick={() => toggleNumber(ownedCard.id)} className="flex-1 px-4 py-2 border border-border bg-background rounded-lg text-sm font-bold hover:border-primary/50 transition-colors">
                        {showNumber[ownedCard.id] && canViewFull ? 'Hide' : 'View'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(tier.id)}
                      disabled={isApplying}
                      className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isApplying ? 'Processing...' : \`Pay & Issue Card ($\${tier.price.toLocaleString()})\`}
                    </button>
                  )}
                </div>
             </div>
           );
         })}
       </div>
    </div>
  );
}
\n`;
content1 = content1.slice(0, startIdx1) + newCardsView + content1.slice(endIdx1);
fs.writeFileSync('src/components/PlaceholderViews.tsx', content1);

// 2. UPDATE AdminModules.tsx
let content2 = fs.readFileSync('src/components/AdminModules.tsx', 'utf8');
const startIdx2 = content2.indexOf('export function AdminVirtualCards');
const endIdx2 = content2.indexOf('export function AdminEmailServices');
const newAdminCards = `export function AdminVirtualCards({ filter }: { filter?: 'all' | 'pending' }) {
  const { virtualCards, updateVirtualCardStatus, users, adminSettings, createVirtualCard } = useBank();
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const filtered = virtualCards.filter(c => {
    if (filter === 'pending') return c.status === 'pending';
    return true;
  });

  const exportCardAsPNG = async (cardId: string, cardholderName: string) => {
    const cardElement = document.getElementById(\`virtual-card-\${cardId}\`);
    if (cardElement) {
      try {
        const canvas = await html2canvas(cardElement, {
          backgroundColor: null,
          scale: 3,
          useCORS: true,
          allowTaint: false,
        });
        const link = document.createElement('a');
        link.download = \`GEB_Card_\${cardholderName.replace(/\\s+/g, '_')}.png\`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error('Failed to export card image:', err);
      }
    }
  };

  const CARD_TIERS = [
    { id: 'standard', name: 'Standard', network: 'visa', color: 'from-blue-700 via-blue-600 to-blue-500', textColor: 'text-white' },
    { id: 'gold', name: 'Gold', network: 'mastercard', color: 'from-yellow-500 via-yellow-400 to-yellow-300', textColor: 'text-gray-900' },
    { id: 'platinum', name: 'Platinum', network: 'visa', color: 'from-gray-300 via-gray-200 to-gray-100', textColor: 'text-gray-900' },
    { id: 'black', name: 'Global Elite Black', network: 'mastercard', color: 'from-gray-900 via-gray-800 to-black', textColor: 'text-white' }
  ];

  const renderNetworkLogo = (network: string, textColor: string) => {
    if (network === 'mastercard') {
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#EB001B] rounded-full opacity-90 z-10"></div>
          <div className="w-8 h-8 bg-[#F79E1B] rounded-full opacity-90 -ml-4 z-0"></div>
        </div>
      );
    }
    return (
      <div className={\`font-black italic text-2xl tracking-tighter drop-shadow-lg uppercase \${textColor}\`}>
        VISA
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {filter === 'pending' ? 'Pending Card Applications' : 'All Virtual Cards'}
      </h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-8 text-center flex flex-col items-center justify-center">
          {filtered.length === 0 && <p className="text-foreground/50 mb-4">No cards found</p>}
          {virtualCards.length === 0 && (
            <button 
              onClick={() => {
                const demoUser = users.find(u => u.role !== 'admin');
                if (!demoUser) return alert('No regular users found to assign cards to.');
                createVirtualCard({
                  userId: demoUser.id,
                  cardNumber: '4532123456789012',
                  expiry: '12/29',
                  cvv: String(Math.floor(Math.random() * 900 + 100)),
                  status: 'active',
                  type: 'virtual',
                  tier: 'standard',
                  network: 'visa',
                  price: 500
                });
                createVirtualCard({
                  userId: demoUser.id,
                  cardNumber: '5412987654321098',
                  expiry: '09/29',
                  cvv: String(Math.floor(Math.random() * 900 + 100)),
                  status: 'pending',
                  type: 'virtual',
                  tier: 'black',
                  network: 'mastercard',
                  price: 5000
                });
              }}
              className="px-6 py-2 bg-primary/20 text-primary font-bold rounded-lg hover:bg-primary/30 transition-colors"
            >
              Load Sample Cards
            </button>
          )}
        </div>
        
        {filtered.length > 0 && (
          <table className="w-full text-left">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">User</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Card Number</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Tier / Network</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Status</th>
                <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(card => {
                const user = users.find(u => u.id === card.userId);
                const tierInfo = CARD_TIERS.find(t => t.id === card.tier) || CARD_TIERS[0];
                return (
                  <tr key={card.id}>
                    <td className="p-4 font-bold">{user?.name || card.userId}</td>
                    <td className="p-4 font-mono font-bold tracking-widest text-sm">•••• •••• •••• {card.cardNumber.slice(-4)}</td>
                    <td className="p-4 uppercase text-xs font-bold text-foreground/70">{tierInfo.name} • {tierInfo.network}</td>
                    <td className="p-4">
                      <span className={\`px-2 py-1 text-xs font-bold uppercase rounded \${card.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : card.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}\`}>
                        {card.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => setSelectedCard({ card, user, tierInfo })} className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded hover:bg-indigo-500/20 text-xs font-bold">
                        View & Print
                      </button>
                      {card.status === 'pending' ? (
                        <button onClick={() => updateVirtualCardStatus(card.id, 'active')} className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20 text-xs font-bold">Approve</button>
                      ) : card.status === 'active' ? (
                        <button onClick={() => updateVirtualCardStatus(card.id, 'frozen')} className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20 text-xs font-bold">Freeze</button>
                      ) : (
                        <button onClick={() => updateVirtualCardStatus(card.id, 'active')} className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20 text-xs font-bold">Unfreeze</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedCard && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedCard(null)}>
          <div className="bg-card border border-border p-8 rounded-2xl shadow-2xl relative max-w-lg w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-foreground/50 hover:text-foreground" onClick={() => setSelectedCard(null)}>
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-6">Card Management</h3>
            
            <div 
              id={\`virtual-card-\${selectedCard.card.id}\`}
              className={\`relative w-full aspect-[1.586/1] bg-gradient-to-tr \${selectedCard.tierInfo.color} \${selectedCard.tierInfo.textColor} rounded-2xl p-6 flex flex-col justify-between shadow-xl border border-white/10 overflow-hidden\`}
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                {selectedCard.tierInfo.name}
              </div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                  {adminSettings?.websiteLogo ? (
                    <img src={adminSettings.websiteLogo} alt="Bank Logo" className={\`h-8 object-contain \${selectedCard.tierInfo.textColor === 'text-white' ? 'brightness-0 invert' : ''}\`} crossOrigin="anonymous" />
                  ) : null}
                  <div className="font-bold text-xl tracking-tighter">
                    GEB <span className="font-light opacity-50 text-xs tracking-normal block -mt-1">GLOBAL ELITE BANK</span>
                  </div>
                </div>
                <Wifi className="opacity-80 rotate-90" size={24} />
              </div>

              <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 relative z-10 opacity-90 mt-4 mb-2 flex items-center justify-center overflow-hidden">
                 <div className="w-full h-[1px] bg-black/20 absolute top-1/2"></div>
                 <div className="w-[1px] h-full bg-black/20 absolute left-1/3"></div>
                 <div className="w-[1px] h-full bg-black/20 absolute right-1/3"></div>
              </div>

              <div className="relative z-10 mb-4 mt-2">
                <p className="font-mono text-xl tracking-[0.2em] drop-shadow-md">
                  {selectedCard.card.cardNumber.match(/.{1,4}/g)?.join(' ')}
                </p>
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div>
                  <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1">Cardholder</p>
                  <p className="font-bold tracking-widest text-sm uppercase">{selectedCard.user?.name || 'User'}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1">Valid Thru</p>
                  <p className="font-mono tracking-widest text-sm">{selectedCard.card.expiry}</p>
                </div>
                {renderNetworkLogo(selectedCard.tierInfo.network, selectedCard.tierInfo.textColor)}
              </div>
            </div>

            <div className="w-full mt-4 p-4 bg-background border border-border rounded-xl">
               <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">Secure Details</h4>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-bold">CVV Code</span>
                 <span className="font-mono text-sm">{selectedCard.card.cvv}</span>
               </div>
            </div>

            <button 
              onClick={() => exportCardAsPNG(selectedCard.card.id, selectedCard.user?.name || 'User')}
              className="mt-6 w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <ArrowDownToLine size={18} />
              Export as PNG (Print-Ready)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminVirtualCardSettings() {
  const { virtualCards, users } = useBank();
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-foreground">Card Settings & Complete Directory</h2>
       <p className="text-sm text-foreground/60 mb-6">Restricted View: Full PAN and CVV details are visible here for administrative configuration.</p>
       <div className="bg-card border border-border rounded-xl overflow-hidden">
         <table className="w-full text-left">
           <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">User</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Card Number</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Expiry</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">CVV</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Tier / Status</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-border">
             {virtualCards.map(card => {
               const user = users.find(u => u.id === card.userId);
               return (
                 <tr key={card.id}>
                   <td className="p-4 font-bold">{user?.name || card.userId}</td>
                   <td className="p-4 font-mono text-sm">{card.cardNumber}</td>
                   <td className="p-4 font-mono text-sm">{card.expiry}</td>
                   <td className="p-4 font-mono text-sm text-rose-500">{card.cvv}</td>
                   <td className="p-4 text-xs uppercase"><span className="font-bold">{card.tier || 'STANDARD'}</span> / {card.status}</td>
                 </tr>
               )
             })}
           </tbody>
         </table>
         {virtualCards.length === 0 && (
            <div className="p-8 text-center text-foreground/50">No cards issued yet.</div>
         )}
       </div>
    </div>
  )
}
\n`;
content2 = content2.slice(0, startIdx2) + newAdminCards + content2.slice(endIdx2);
fs.writeFileSync('src/components/AdminModules.tsx', content2);

// 3. UPDATE AdminDashboard.tsx
let content3 = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
if (!content3.includes('AdminVirtualCardSettings')) {
   content3 = content3.replace('AdminVirtualCards,', 'AdminVirtualCards, AdminVirtualCardSettings,');
}
content3 = content3.replace(
  /{currentView === 'virtual-cards-card-settings' && \([\s\S]*?<\/div>\s*\)}/m,
  `{currentView === 'virtual-cards-card-settings' && <AdminVirtualCardSettings />}`
);
fs.writeFileSync('src/components/AdminDashboard.tsx', content3);

console.log("ALL FILES UPDATED");
