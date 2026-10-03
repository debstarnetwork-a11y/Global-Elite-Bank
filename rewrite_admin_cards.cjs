const fs = require('fs');
let content = fs.readFileSync('src/components/AdminModules.tsx', 'utf8');

const startIdx = content.indexOf('export function AdminVirtualCards');
const endIdx = content.indexOf('export function AdminEmailServices');

if (startIdx !== -1 && endIdx !== -1) {
  const startStr = content.slice(0, startIdx);
  const endStr = content.slice(endIdx);
  
  const replacement = `export function AdminVirtualCards({ filter }: { filter?: 'all' | 'pending' }) {
  const { virtualCards, updateVirtualCardStatus, users, adminSettings } = useBank();
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {filter === 'pending' ? 'Pending Card Applications' : 'All Virtual Cards'}
      </h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-foreground/50">No cards found</div>
        ) : (
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
                    <td className="p-4 font-mono font-bold tracking-widest text-sm">{card.cardNumber}</td>
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
                  <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1 mt-1">CVV</p>
                  <p className="font-mono tracking-widest text-sm">{selectedCard.card.cvv}</p>
                </div>
                <div className="font-black italic text-2xl tracking-tighter drop-shadow-lg uppercase">
                  {selectedCard.tierInfo.network || 'VISA'}
                </div>
              </div>
            </div>

            <button 
              onClick={() => exportCardAsPNG(selectedCard.card.id, selectedCard.user?.name || 'User')}
              className="mt-8 w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 flex items-center justify-center gap-2"
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

`;

  fs.writeFileSync('src/components/AdminModules.tsx', startStr + replacement + endStr);
  console.log("Success");
} else {
  console.log("Failed to find boundaries");
}
