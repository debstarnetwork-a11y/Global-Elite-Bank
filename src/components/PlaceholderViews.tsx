import { CreditCard, ArrowLeft, ShieldCheck, BarChart3, Settings, Wifi, Eye, Lock, Plus, Check, X, Copy, Bitcoin } from 'lucide-react';
import { useState } from 'react';
import { useBank } from '../store';

export function CardsView() {
  const { currentUser, adminSettings, virtualCards, createVirtualCard, updateBalance, createTransaction, updateVirtualCardStatus } = useBank();
  const [showNumber, setShowNumber] = useState<Record<string, boolean>>({});
  const [applying, setApplying] = useState<string | null>(null);
  const [cryptoTier, setCryptoTier] = useState<any | null>(null);

  const myCards = virtualCards.filter(c => c.userId === currentUser?.id);
  const canViewFull = currentUser?.role === 'admin';

  const CARD_TIERS = [
    { id: 'standard', name: 'Standard', network: 'visa', price: 500, color: 'from-blue-700 via-blue-600 to-blue-500', textColor: 'text-white' },
    { id: 'gold', name: 'Gold', network: 'mastercard', price: 1000, color: 'from-yellow-500 via-yellow-400 to-yellow-300', textColor: 'text-gray-900' },
    { id: 'platinum', name: 'Platinum', network: 'visa', price: 2500, color: 'from-gray-300 via-gray-200 to-gray-100', textColor: 'text-gray-900' },
    { id: 'black', name: 'Global Elite Black (Mastercard)', network: 'mastercard', price: 5000, color: 'from-gray-900 via-gray-800 to-black', textColor: 'text-white' },
    { id: 'black_visa', name: 'Global Elite Black (Visa)', network: 'visa', price: 5000, color: 'from-gray-900 via-gray-800 to-black', textColor: 'text-white' }
  ];

  const renderNetworkLogo = (network: string, textColor: string) => {
    if (network === 'mastercard') {
      return (
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#EB001B] rounded-full opacity-90 z-10"></div>
            <div className="w-8 h-8 bg-[#F79E1B] rounded-full opacity-90 -ml-4 z-0"></div>
          </div>
          <span className={`text-[8px] font-bold tracking-widest mt-0.5 lowercase ${textColor}`}>mastercard</span>
        </div>
      );
    }
    return (
      <div className={`font-black italic text-2xl tracking-tighter drop-shadow-lg uppercase ${textColor}`}>
        VISA
      </div>
    );
  };

  const handleApply = (tierId: string) => {
    if (!currentUser) return;
    const tier = CARD_TIERS.find(t => t.id === tierId);
    if (!tier) return;
    
    setCryptoTier(tier);
  };

  const confirmCryptoPayment = () => {
    if (!currentUser || !cryptoTier) return;
    
    const account = currentUser.accounts?.[0];
    if (!account) return alert('No account found');

    setApplying(cryptoTier.id);
    
    setTimeout(() => {
      createTransaction({
        userId: currentUser.id,
        accountId: account.id,
        amount: cryptoTier.price,
        type: 'withdrawal',
        description: `${cryptoTier.name} Card Issuance Fee (Crypto Payment Pending Verification)`,
        status: 'pending'
      });

      createVirtualCard({
        userId: currentUser.id,
        cardNumber: `4532${Math.floor(Math.random() * 9000 + 1000)}${Math.floor(Math.random() * 9000 + 1000)}${Math.floor(Math.random() * 9000 + 1000)}`,
        expiry: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/29`,
        cvv: String(Math.floor(Math.random() * 900 + 100)),
        status: 'pending',
        type: 'virtual',
        tier: cryptoTier.id as any,
        network: cryptoTier.network as any,
        price: cryptoTier.price
      });
      
      setApplying(null);
      setCryptoTier(null);
      alert('Card application submitted! It is pending admin approval after your Bitcoin payment is verified.');
    }, 1500);
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
                    <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${ownedCard.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : ownedCard.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {ownedCard.status}
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-bold uppercase rounded bg-foreground/10 text-foreground/60">
                      Unissued
                    </span>
                  )}
                </div>

                <div className={`relative w-full aspect-[1.586/1] bg-gradient-to-tr ${tier.color} ${tier.textColor} rounded-2xl p-6 flex flex-col justify-between shadow-2xl shadow-primary/20 border border-white/10 overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] opacity-60 w-full text-center">
                    {tier.name.replace(' (Mastercard)', '').replace(' (Visa)', '')}
                  </div>

                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-3">
                      {adminSettings?.websiteLogo ? (
                        <img src={adminSettings.websiteLogo} alt="Bank Logo" className={`h-8 object-contain ${tier.textColor === 'text-white' ? 'brightness-0 invert' : ''}`} crossOrigin="anonymous" />
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
                      {ownedCard && ownedCard.status !== 'pending' ? (showNumber[ownedCard.id] && canViewFull ? ownedCard.cardNumber.match(/.{1,4}/g)?.join(' ') : `•••• •••• •••• ${ownedCard.cardNumber.slice(-4)}`) : '•••• •••• •••• ••••'}
                    </p>
                  </div>

                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1">Cardholder</p>
                      <p className="font-bold tracking-widest text-xs uppercase">{currentUser?.name || 'User'}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1">Valid Thru</p>
                      <p className="font-mono tracking-widest text-xs">{ownedCard && ownedCard.status !== 'pending' ? ownedCard.expiry : 'MM/29'}</p>
                      {ownedCard && ownedCard.status !== 'pending' && showNumber[ownedCard.id] && canViewFull && (
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
                    ownedCard.status === 'pending' ? (
                      <div className="w-full text-center p-3 bg-amber-500/10 text-amber-500 rounded-lg text-sm font-bold border border-amber-500/20">
                        Pending Admin Approval
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateVirtualCardStatus(ownedCard.id, ownedCard.status === 'frozen' ? 'active' : 'frozen')}
                          className={`flex-1 px-4 py-2 text-white rounded-lg text-sm font-bold transition-colors shadow-sm ${ownedCard.status === 'frozen' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}`}
                        >
                          {ownedCard.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                        </button>
                        {currentUser?.role === 'admin' ? (
                          <button onClick={() => toggleNumber(ownedCard.id)} className="flex-1 px-4 py-2 border border-border bg-background rounded-lg text-sm font-bold hover:border-primary/50 transition-colors">
                            {showNumber[ownedCard.id] ? 'Hide' : 'View'}
                          </button>
                        ) : (
                          <div className="flex-1 px-2 py-1 bg-foreground/5 rounded-lg text-[10px] text-foreground/60 text-center flex items-center justify-center font-medium leading-tight border border-border">
                            Full details hidden. Contact admin.
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <button
                      onClick={() => handleApply(tier.id)}
                      disabled={isApplying}
                      className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isApplying ? 'Processing...' : `Pay & Issue Card ($${tier.price.toLocaleString()})`}
                    </button>
                  )}
                </div>
             </div>
           );
         })}
       </div>

       {cryptoTier && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden relative">
             <button onClick={() => setCryptoTier(null)} className="absolute top-4 right-4 p-2 bg-background/50 rounded-full hover:bg-background transition-colors z-10">
               <X size={20} className="text-foreground/70" />
             </button>
             
             <div className="p-8 text-center border-b border-border bg-gradient-to-br from-indigo-500/10 to-transparent">
               <div className="w-16 h-16 bg-[#F7931A]/20 text-[#F7931A] rounded-full flex items-center justify-center mx-auto mb-4">
                 <Bitcoin size={32} />
               </div>
               <h3 className="text-2xl font-bold mb-2">Bitcoin Payment</h3>
               <p className="text-foreground/70 text-sm">Send the exact amount below to complete your {cryptoTier.name} application.</p>
             </div>

             <div className="p-8 space-y-6">
                <div className="text-center">
                  <span className="text-sm font-bold text-foreground/50 uppercase tracking-widest block mb-1">Amount Due</span>
                  <div className="text-3xl font-black">${cryptoTier.price.toLocaleString()} <span className="text-sm font-normal text-foreground/50">USD in BTC</span></div>
                </div>

                <div className="bg-background border border-border p-4 rounded-xl relative group">
                  <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest block mb-2">BTC Deposit Address</span>
                  <div className="font-mono text-sm break-all">1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2</div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2');
                      alert('Address copied to clipboard!');
                    }}
                    className="absolute top-1/2 -translate-y-1/2 right-4 p-2 bg-primary/10 text-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20"
                  >
                    <Copy size={16} />
                  </button>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl text-sm font-medium text-center">
                  Payment verification takes 1-3 network confirmations. Once verified, an admin will activate your card.
                </div>

                <button 
                  onClick={confirmCryptoPayment}
                  disabled={applying === cryptoTier.id}
                  className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {applying === cryptoTier.id ? 'Processing...' : 'I Have Made the Payment'}
                </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}

export function AnalyticsView() {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
        <BarChart3 size={32} />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Wealth Analytics</h2>
      <p className="text-foreground/60 max-w-md">Advanced portfolio charting, tax-loss harvesting projections, and institutional-grade risk metrics are currently syncing with your accounts.</p>
    </div>
  );
}

export function SecurityView() {
  const { changePassword } = useBank();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setIsError(true);
      return;
    }
    if (newPassword.length < 4) {
      setMessage('Password must be at least 4 characters');
      setIsError(true);
      return;
    }
    
    const success = changePassword(currentPassword, newPassword);
    if (success) {
      setMessage('Password changed successfully');
      setIsError(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage('Current password is incorrect');
      setIsError(true);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Security Center</h2>
        <p className="text-foreground/60 max-w-md">Your account is secured by AES-256 encryption and biometric validation. No active threats detected.</p>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <div className="p-4 border border-border rounded-xl bg-background flex items-center justify-between">
            <span className="text-sm font-bold">2FA Status</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">ACTIVE</span>
          </div>
          <div className="p-4 border border-border rounded-xl bg-background flex items-center justify-between">
            <span className="text-sm font-bold">Biometrics</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">ENROLLED</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Lock size={20} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Change Password</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2">Current Password</label>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-primary outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2">New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-primary outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2">Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-primary outline-none" 
              required 
            />
          </div>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm font-bold ${isError ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
              {message}
            </div>
          )}

          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors mt-2">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}