import React, { useState } from 'react';
import { useBank } from '../store';
import { Lock, FileText, CheckCircle, Clock, XCircle, DollarSign, Building2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export function LoansGrantsView() {
  const { currentUser, investments, loanApplications, grantApplications, createLoanApplication, createGrantApplication } = useBank();
  
  const [activeTab, setActiveTab] = useState<'loan' | 'grant'>('loan');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Calculate cumulative investments
  const userInvestments = investments.filter(inv => inv.userId === currentUser?.id && (inv.status === 'active' || inv.status === 'matured'));
  const cumulativeInvestments = userInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const ELIGIBILITY_THRESHOLD = 10000;
  const isEligible = cumulativeInvestments >= ELIGIBILITY_THRESHOLD;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !amount || !purpose) return;

    if (activeTab === 'loan') {
      createLoanApplication({
        userId: currentUser.id,
        amount: parseFloat(amount),
        purpose,
        status: 'pending'
      });
    } else {
      createGrantApplication({
        userId: currentUser.id,
        amount: parseFloat(amount),
        purpose,
        status: 'pending'
      });
    }

    setSubmitted(true);
    setAmount('');
    setPurpose('');
    
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const myLoans = loanApplications.filter(l => l.userId === currentUser?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const myGrants = grantApplications.filter(g => g.userId === currentUser?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-serif flex items-center gap-3">
        <Building2 className="text-primary" />
        Credit & Grants Portal
      </h1>
      
      {!isEligible && (
        <div className="bg-card border border-border rounded-2xl p-6 text-center max-w-3xl mx-auto shadow-xl relative overflow-hidden mb-6">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex shrink-0 items-center justify-center shadow-inner shadow-rose-500/20">
              <Lock size={28} />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2 font-serif">Eligibility Requirements Not Met</h2>
              <p className="text-foreground/70 text-sm mb-4">
                To unlock the Global Elite Credit & Grants portal, clients must maintain a minimum cumulative investment portfolio of <strong className="text-foreground font-mono">${ELIGIBILITY_THRESHOLD.toLocaleString()}</strong> in institutional stakes.
              </p>
              
              <div className="bg-background rounded-xl p-4 border border-border relative overflow-hidden">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-foreground/70 uppercase tracking-widest">Current Portfolio</span>
                  <span className="text-lg font-bold font-mono">${cumulativeInvestments.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden mb-2 shadow-inner">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                    style={{ width: `${Math.min((cumulativeInvestments / ELIGIBILITY_THRESHOLD) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12" />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-foreground/50 font-mono">
                  <span>$0</span>
                  <span>Target: ${ELIGIBILITY_THRESHOLD.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {!isEligible && (
              <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[2px] flex items-center justify-center">
                 <div className="bg-card border border-border shadow-2xl rounded-2xl p-4 flex flex-col items-center">
                   <Lock className="text-rose-500 mb-2" size={24} />
                   <p className="text-sm font-bold text-foreground">Portal Locked</p>
                 </div>
              </div>
            )}
            <div className="flex p-1 bg-background rounded-xl border border-border mb-6">
              <button
                onClick={() => setActiveTab('loan')}
                disabled={!isEligible}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'loan' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                Apply for Loan
              </button>
              <button
                onClick={() => setActiveTab('grant')}
                disabled={!isEligible}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'grant' ? 'bg-card shadow-sm text-foreground' : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                Apply for Grant
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 block">Requested Amount (USD)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="text-foreground/50" size={18} />
                  </div>
                  <input
                    type="number"
                    required
                    disabled={!isEligible}
                    min="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-foreground font-mono focus:border-primary outline-none transition-colors disabled:opacity-50"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 block">Purpose of {activeTab === 'loan' ? 'Loan' : 'Grant'}</label>
                <textarea
                  required
                  disabled={!isEligible}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:border-primary outline-none transition-colors min-h-[120px] resize-none disabled:opacity-50"
                  placeholder={`Describe how these funds will be utilized...`}
                />
              </div>

              <button
                type="submit"
                disabled={submitted || !isEligible}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {submitted ? (
                  <><CheckCircle size={18} /> Application Submitted Successfully</>
                ) : (
                  <>Submit {activeTab === 'loan' ? 'Loan' : 'Grant'} Application <ChevronRight size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl h-full flex flex-col relative overflow-hidden">
            <h3 className="text-lg font-bold text-foreground mb-4 font-serif">Application History</h3>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {activeTab === 'loan' && myLoans.length === 0 && (
                <div className="text-center text-foreground/50 text-sm py-8 bg-background rounded-xl border border-border border-dashed">No past loan applications</div>
              )}
              {activeTab === 'grant' && myGrants.length === 0 && (
                <div className="text-center text-foreground/50 text-sm py-8 bg-background rounded-xl border border-border border-dashed">No past grant applications</div>
              )}

              {activeTab === 'loan' && myLoans.map(loan => (
                <div key={loan.id} className="bg-background border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono font-bold text-foreground">${loan.amount.toLocaleString()}</div>
                    <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      loan.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      loan.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {loan.status === 'approved' ? <CheckCircle size={10} /> : loan.status === 'rejected' ? <XCircle size={10} /> : <Clock size={10} />}
                      {loan.status}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 line-clamp-2">{loan.purpose}</p>
                  <p className="text-[10px] text-foreground/40 mt-3 font-mono">{new Date(loan.date).toLocaleDateString()}</p>
                </div>
              ))}

              {activeTab === 'grant' && myGrants.map(grant => (
                <div key={grant.id} className="bg-background border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono font-bold text-emerald-500">${grant.amount.toLocaleString()}</div>
                    <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      grant.status === 'approved' || grant.status === 'disbursed' ? 'bg-emerald-500/10 text-emerald-500' :
                      grant.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {grant.status === 'approved' || grant.status === 'disbursed' ? <CheckCircle size={10} /> : grant.status === 'rejected' ? <XCircle size={10} /> : <Clock size={10} />}
                      {grant.status}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70 line-clamp-2">{grant.purpose}</p>
                  <p className="text-[10px] text-foreground/40 mt-3 font-mono">{new Date(grant.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
