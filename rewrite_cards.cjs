const fs = require('fs');
const content = fs.readFileSync('src/components/PlaceholderViews.tsx', 'utf8');

const replacement = `export function CardsView() {
  const { currentUser, adminSettings, virtualCards, createVirtualCard, updateBalance, createTransaction, updateVirtualCardStatus } = useBank();
  const [showNumber, setShowNumber] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('standard');
  const [applying, setApplying] = useState(false);
  
  const myCards = virtualCards.filter(c => c.userId === currentUser?.id);
  const canViewFull = currentUser?.role === 'admin' || currentUser?.showFullCardDetails;
  
  const CARD_TIERS = [
    { id: 'standard', name: 'Standard', network: 'visa', price: 500, color: 'from-blue-700 via-blue-600 to-blue-500', textColor: 'text-white' },
    { id: 'gold', name: 'Gold', network: 'mastercard', price: 1000, color: 'from-yellow-500 via-yellow-400 to-yellow-300', textColor: 'text-gray-900' },
    { id: 'platinum', name: 'Platinum', network: 'visa', price: 2500, color: 'from-gray-300 via-gray-200 to-gray-100', textColor: 'text-gray-900' },
    { id: 'black', name: 'Global Elite Black', network: 'mastercard', price: 5000, color: 'from-gray-900 via-gray-800 to-black', textColor: 'text-white' }
  ];

  const handleApply = () => {
    if (!currentUser) return;
    const tier = CARD_TIERS.find(t => t.id === selectedTier);
    if (!tier) return;
    
    const account = currentUser.accounts?.[0];
    if (!account) return alert('No account found');
    
    if (account.balance < tier.price) {
      return alert(\`Insufficient balance. You need $\${tier.price.toLocaleString()} to apply for the \${tier.name} card.\`);
    }

    setApplying(true);
    setTimeout(() => {
      // Deduct funds
      updateBalance(currentUser.id, account.id, account.balance - tier.price);
      
      // Create transaction record
      createTransaction({
        userId: currentUser.id,
        accountId: account.id,
        amount: tier.price,
        type: 'withdrawal',
        description: \`\${tier.name} Card Issuance Fee\`,
        status: 'completed'
      });

      // Create card
      createVirtualCard({
        userId: currentUser.id,
        cardNumber: \`4532\${Math.floor(Math.random() * 9000 + 1000)}\${Math.floor(Math.random() * 9000 + 1000)}\${Math.floor(Math.random() * 9000 + 1000)}\`,
        expiry: \`\${String(new Date().getMonth() + 1).padStart(2, '0')}/\${String(new Date().getFullYear() + 4).slice(-2)}\`,
        cvv: String(Math.floor(Math.random() * 900 + 100)),
        status: 'pending',
        type: 'virtual',
        tier: tier.id as any,
        network: tier.network as any,
        price: tier.price
      });
      
      setApplying(false);
      setShowApplication(false);
    }, 1000);
  };

  const handleToggle = () => {
    if (currentUser?.role === 'admin') {
      setShowNumber(!showNumber);
    } else {
      alert('Only admin can authorize viewing full card details.');
    }
  };

  if (myCards.length === 0 && !showApplication) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <CreditCard size={48} className="text-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">No Virtual Cards</h2>
        <p className="text-foreground/60 max-w-md mb-8">You currently do not have any active virtual cards. Apply for one to get started with seamless online transactions.</p>
        <button onClick={() => setShowApplication(true)} className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Apply for a Card
        </button>
      </div>
    );
  }

  if (showApplication) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 min-h-[400px]">
        <h2 className="text-2xl font-bold text-foreground mb-6">Select Card Tier</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {CARD_TIERS.map(tier => (
            <div 
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={\`relative cursor-pointer rounded-2xl p-6 border-2 transition-all \${selectedTier === tier.id ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]' : 'border-border hover:border-primary/50'}\`}
            >
              <div className={\`w-full h-32 rounded-xl bg-gradient-to-tr \${tier.color} \${tier.textColor} p-4 flex flex-col justify-between mb-4 shadow-inner\`}>
                <div className="flex justify-between items-start">
                  <div className="font-bold tracking-tighter">GEB</div>
                  <Wifi className="rotate-90 opacity-80" size={16} />
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs uppercase tracking-widest">{tier.name}</div>
                  <div className="font-bold italic">{tier.network.toUpperCase()}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{tier.name}</h3>
                  <p className="text-sm text-foreground/60 capitalize">{tier.network} Network</p>
                </div>
                <div className="text-xl font-bold text-primary">$\${tier.price.toLocaleString()}</div>
              </div>
              {selectedTier === tier.id && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                  <Check size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleApply}
            disabled={applying}
            className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {applying ? 'Processing...' : 'Pay & Issue Card'}
          </button>
          <button 
            onClick={() => setShowApplication(false)}
            className="py-3 px-6 bg-foreground/10 text-foreground font-bold rounded-xl hover:bg-foreground/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {myCards.map((card, idx) => {
        const tier = CARD_TIERS.find(t => t.id === card.tier) || CARD_TIERS[0];
        return (
          <div key={card.id} className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full mb-8">
              <h2 className="text-2xl font-bold text-foreground">Virtual Card Management {myCards.length > 1 ? \`(#\${idx + 1})\` : ''}</h2>
              <span className={\`px-3 py-1 text-xs font-bold uppercase rounded \${card.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : card.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}\`}>
                {card.status}
              </span>
            </div>
            
            {/* Realistic Credit Card */}
            <div className={\`relative w-full max-w-sm aspect-[1.586/1] bg-gradient-to-tr \${tier.color} \${tier.textColor} rounded-2xl p-6 flex flex-col justify-between shadow-2xl shadow-primary/20 border border-white/10 overflow-hidden group hover:scale-[1.02] transition-transform duration-300\`}>
              
              {/* Decorative elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>
              
              {/* Top row */}
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                  {adminSettings?.websiteLogo ? (
                    <img src={adminSettings.websiteLogo} alt="Bank Logo" className={\`h-8 object-contain \${tier.textColor === 'text-white' ? 'brightness-0 invert' : ''}\`} />
                  ) : null}
                  <div className="font-bold text-xl tracking-tighter">
                    GEB <span className="font-light opacity-50 text-xs tracking-normal block -mt-1">GLOBAL ELITE BANK</span>
                  </div>
                </div>
                <Wifi className="opacity-80 rotate-90" size={24} />
              </div>

              {/* Chip */}
              <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 relative z-10 opacity-90 mt-4 mb-2 flex items-center justify-center overflow-hidden">
                 <div className="w-full h-[1px] bg-black/20 absolute top-1/2"></div>
                 <div className="w-[1px] h-full bg-black/20 absolute left-1/3"></div>
                 <div className="w-[1px] h-full bg-black/20 absolute right-1/3"></div>
              </div>

              {/* Number */}
              <div className="relative z-10 mb-4 mt-2">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xl tracking-[0.2em] drop-shadow-md">
                    {showNumber && canViewFull ? card.cardNumber.match(/.{1,4}/g)?.join(' ') : \`•••• •••• •••• \${card.cardNumber.slice(-4)}\`}
                  </p>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1">Cardholder</p>
                  <p className="font-bold tracking-widest text-sm uppercase">{currentUser?.name || 'User'}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1">Valid Thru</p>
                  <p className="font-mono tracking-widest text-sm">{card.expiry}</p>
                  {showNumber && canViewFull && (
                    <>
                      <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1 mt-1">CVV</p>
                      <p className="font-mono tracking-widest text-sm">{card.cvv}</p>
                    </>
                  )}
                </div>
                <div className="font-black italic text-2xl tracking-tighter drop-shadow-lg uppercase">
                  {card.network || 'VISA'}
                </div>
              </div>
            </div>
            
            {!canViewFull && (
              <p className="mt-4 text-xs text-foreground/50 text-center max-w-sm">Full card details are hidden for security. Contact your admin to reveal.</p>
            )}

            <div className="flex flex-wrap gap-4 justify-center mt-8 w-full max-w-md">
              <button 
                onClick={() => updateVirtualCardStatus(card.id, card.status === 'frozen' ? 'active' : 'frozen')} 
                className={\`flex-1 px-6 py-3 text-white rounded-xl font-bold transition-colors shadow-lg \${card.status === 'frozen' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'}\`}
              >
                {card.status === 'frozen' ? 'Unfreeze Card' : 'Freeze Card'}
              </button>
              <button onClick={handleToggle} className="flex-1 px-6 py-3 border border-border bg-card rounded-xl font-bold hover:border-primary/50 transition-colors">
                {showNumber && canViewFull ? 'Hide Details' : 'View Details'}
              </button>
            </div>
          </div>
        );
      })}
      
      {!showApplication && (
         <div className="flex justify-center">
            <button onClick={() => setShowApplication(true)} className="px-6 py-3 bg-foreground/5 border border-border text-foreground font-bold rounded-xl hover:bg-foreground/10 transition-colors flex items-center gap-2">
              <Plus size={20} />
              Apply for Another Card
            </button>
         </div>
      )}
    </div>
  );
}`;

const [startStr, endStr] = content.split(/export function CardsView\(\) \{[\s\S]*?\n\}\nexport function AnalyticsView/);
if (startStr !== undefined && endStr !== undefined) {
  fs.writeFileSync('src/components/PlaceholderViews.tsx', startStr + replacement + "\nexport function AnalyticsView" + endStr);
} else {
  console.log("Could not find CardsView correctly.");
}
