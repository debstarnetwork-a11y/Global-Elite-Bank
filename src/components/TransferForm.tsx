import { useState } from 'react';
import { X, Lock, AlertTriangle, CheckCircle, ArrowLeft, Mail, RefreshCw, KeyRound } from 'lucide-react';
import { useBank } from '../store';

export function TransferForm({ type, onClose, onSuccess }: { type: 'wire' | 'local' | 'internal' | null, onClose: () => void, onSuccess?: () => void }) {
  const { currentUser, adminSettings, createTransaction, sendMockEmail } = useBank();
  
  const [step, setStep] = useState<number | string>(1);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState({ name: '', account: '', bank: '', country: '', remarks: '' });
  
  // Individual codes
  const [currentCodeInput, setCurrentCodeInput] = useState('');
  
  const [pin, setPin] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSentFeedback, setOtpSentFeedback] = useState(false);
  const [error, setError] = useState('');
  
  if (!type || !currentUser) return null;
  const account = currentUser.accounts[0]; // Using primary account for simplicity
  

const handleNext = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!account || Number(amount) > account.balance) {
      setError('Insufficient funds.');
      return;
    }
    if (!recipient.name.trim()) {
      setError('Please fill in the Recipient Name.');
      return;
    }
    if (!recipient.account.trim()) {
      setError('Please fill in the Account Number / IBAN.');
      return;
    }
    if (type !== 'internal' && !recipient.bank.trim()) {
      setError('Please fill in the Bank Name.');
      return;
    }
    if (type === 'wire' && !recipient.country.trim()) {
      setError('Please fill in the Country.');
      return;
    }
    
    setError('');
    setStep('preview');
  };

  const getNextStep = (current: string | number): string | number => {
    const seq = ['code1', 'code2', 'code3', 'code4', 'code5'];
    const enabled = seq.filter(code => {
       if (code === 'code1') return adminSettings.requireCode1;
       if (code === 'code2') return adminSettings.requireCode2;
       if (code === 'code3') return adminSettings.requireCode3;
       if (code === 'code4') return adminSettings.requireCode4;
       if (code === 'code5') return adminSettings.requireCode5;
       return false;
    });

    if (current === 1 || current === 'preview') return 'pin';
    
    if (current === 'pin') {
        if (adminSettings.requireOtp) return 'otp';
        if (type === 'wire' && enabled.length > 0) return enabled[0];
        return 'success';
    }

    if (current === 'otp') {
        if (type === 'wire' && enabled.length > 0) return enabled[0];
        return 'success';
    }

    if (type !== 'wire') return 'success';

    const idx = enabled.indexOf(current as string);
    if (idx === -1 || idx === enabled.length - 1) return 'success';
    return enabled[idx + 1];
  };

  const getPrevStep = (current: string | number): string | number => {
    if (current === 'preview') return 1;
    if (current === 'pin') return 'preview';
    if (current === 'otp') return 'pin';
    if (current === 'success') return adminSettings.requireOtp ? 'otp' : 'pin';

    const seq = ['code1', 'code2', 'code3', 'code4', 'code5'];
    const enabled = seq.filter(code => {
       if (code === 'code1') return adminSettings.requireCode1;
       if (code === 'code2') return adminSettings.requireCode2;
       if (code === 'code3') return adminSettings.requireCode3;
       if (code === 'code4') return adminSettings.requireCode4;
       if (code === 'code5') return adminSettings.requireCode5;
       return false;
    });
    
    if (type !== 'wire' || enabled.length === 0) {
      return adminSettings.requireOtp ? 'otp' : 'pin';
    }

    const idx = enabled.indexOf(current as string);
    if (idx <= 0) {
      return adminSettings.requireOtp ? 'otp' : 'pin';
    }
    return enabled[idx - 1];
  };

  const generateAndSendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(code);
    setOtpInput('');
    setOtpSentFeedback(true);
    setTimeout(() => setOtpSentFeedback(false), 3500);

    sendMockEmail({
      to: currentUser.email,
      subject: `🔒 Transaction OTP Code: ${code} - Global Elite Bank`,
      body: `Dear ${currentUser.name},

You have initiated a ${type?.toUpperCase()} transfer of $${Number(amount).toLocaleString()} to ${recipient.name} (Account: ${recipient.account}${recipient.bank ? `, Bank: ${recipient.bank}` : ''}).

Your One-Time Password (OTP) authorization code is:

  >>>  ${code}  <<<

This code is valid for 10 minutes. Enter this code on the transfer confirmation screen to authorize and complete this transaction.

If you did not initiate this transaction, please notify Global Elite Bank Fraud Support immediately.

Warm regards,
Private Banking Security & Fraud Department
Global Elite Bank, Zurich, Switzerland`
    });
  };

  const verifyPin = () => {
    if (!account) return;
    if (pin !== account.pin) {
      setError('Invalid transaction PIN.');
      return;
    }
    setError('');
    
    const next = getNextStep('pin');
    setStep(next);

    if (next === 'otp') {
      generateAndSendOtp();
    } else if (next === 'success') {
      executeTransfer();
    }
  };

  const verifyOtp = () => {
    if (!otpInput.trim() || otpInput.trim() !== otpCode) {
      setError('Invalid OTP code. Please enter the 6-digit code sent to your email.');
      return;
    }
    setError('');
    const next = getNextStep('otp');
    setStep(next);
    if (next === 'success') {
      executeTransfer();
    }
  };

  const executeTransfer = () => {
    createTransaction({
      userId: currentUser.id,
      accountId: account.id,
      type: type === 'wire' ? 'transfer_wire' : type === 'local' ? 'transfer_local' : 'transfer_internal',
      amount: Number(amount),
      status: 'completed',
      recipientDetails: recipient
    });
  };

  const handleVerifySingleCode = (codeName: string) => {
    if (!account) return;
    const codeMap: Record<string, keyof typeof account.codes> = {
      'code1': 'cot',
      'code2': 'swift',
      'code3': 'imf',
      'code4': 'tax',
      'code5': 'aml'
    };
    const accountCodeKey = codeMap[codeName];
    const actualCode = account.codes[accountCodeKey];
    
    if (currentCodeInput !== actualCode) {
      const codeDisplayName = adminSettings[((codeName + 'Name') as keyof typeof adminSettings)] as string || codeName.toUpperCase();
      setError(`Invalid ${codeDisplayName} code. Please contact your account manager.`);
      return;
    }
    
    setError('');
    setCurrentCodeInput('');
    const next = getNextStep(codeName);
    setStep(next);
    
    if (next === 'success') {
      executeTransfer();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
          <button 
            id="transfer-form-move-back-btn"
            onClick={step === 1 ? onClose : () => setStep(getPrevStep(step))} 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-background text-foreground border border-border hover:border-primary/50 transition-colors"
            title="Move back"
          >
            <ArrowLeft size={14} />
            <span>Move Back</span>
          </button>
          {step !== 'success' && (
            <h2 className="text-base font-bold text-foreground capitalize">{type} Transfer</h2>
          )}
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-rose-500 text-sm">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Amount</label>
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground"
                placeholder="0.00"
              />
              <p className="text-xs text-foreground/50 mt-1">Available: ${account?.balance.toLocaleString()}</p>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Recipient Name</label>
              <input 
                type="text" 
                value={recipient.name} 
                onChange={e => setRecipient({...recipient, name: e.target.value})}
                className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Account Number / IBAN</label>
              <input 
                type="text" 
                value={recipient.account} 
                onChange={e => setRecipient({...recipient, account: e.target.value})}
                className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground"
              />
            </div>
            
            {type !== 'internal' && (
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Bank Name</label>
                <input 
                  type="text" 
                  value={recipient.bank} 
                  onChange={e => setRecipient({...recipient, bank: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground"
                />
              </div>
            )}
            
            {type === 'wire' && (
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Country</label>
                <input 
                  type="text" 
                  value={recipient.country} 
                  onChange={e => setRecipient({...recipient, country: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Purpose of Transfer / Remarks</label>
              <input 
                type="text" 
                value={recipient.remarks} 
                onChange={e => setRecipient({...recipient, remarks: e.target.value})}
                className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground"
                placeholder="e.g. Invoice payment, Family support"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 bg-background border border-border text-foreground font-bold py-3 rounded-xl hover:border-foreground/30 transition-colors">
                Cancel
              </button>
              <button onClick={handleNext} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Review
              </button>
            </div>
          </div>
        )}


        {step === 'preview' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground text-center mb-4">Confirm Details</h3>
            <div className="bg-background border border-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-foreground/50 uppercase font-bold">Amount</span>
                <span className="text-sm font-mono font-bold">${Number(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-foreground/50 uppercase font-bold">Recipient</span>
                <span className="text-sm font-bold">{recipient.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-foreground/50 uppercase font-bold">Account / IBAN</span>
                <span className="text-sm font-bold">{recipient.account}</span>
              </div>
              {type !== 'internal' && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground/50 uppercase font-bold">Bank Name</span>
                  <span className="text-sm font-bold">{recipient.bank}</span>
                </div>
              )}
              {type === 'wire' && recipient.country && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground/50 uppercase font-bold">Country</span>
                  <span className="text-sm font-bold">{recipient.country}</span>
                </div>
              )}
              {recipient.remarks && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground/50 uppercase font-bold">Remarks</span>
                  <span className="text-sm font-bold truncate max-w-[150px]" title={recipient.remarks}>{recipient.remarks}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 bg-background border border-border text-foreground font-bold py-3 rounded-xl hover:border-foreground/30 transition-colors">
                Edit
              </button>
              <button onClick={() => setStep(getNextStep('preview'))} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Confirm
              </button>
            </div>
          </div>
        )}

                {/* --- WIRE CODES SEQUENCE --- */}
        {['code1', 'code2', 'code3', 'code4', 'code5'].includes(step as string) && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-bold text-lg text-foreground uppercase tracking-widest">{adminSettings[(step + 'Name') as keyof typeof adminSettings] as string || 'Clearance'}</h3>
            <p className="text-sm text-foreground/70 mb-6 whitespace-pre-line">{adminSettings[(step + 'Message') as keyof typeof adminSettings] as string}</p>
            
            <div className="text-left">
              <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">{adminSettings[(step + 'Name') as keyof typeof adminSettings] as string}</label>
              <input 
                type="text" 
                value={currentCodeInput} 
                onChange={e => setCurrentCodeInput(e.target.value)}
                className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono uppercase"
                placeholder="Enter Code"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setStep(getPrevStep(step))} 
                className="flex-1 bg-background border border-border text-foreground font-bold py-3 rounded-xl hover:border-foreground/30 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => {
                  handleVerifySingleCode(step as string);
                }} 
                className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {step === 'pin' && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h3 className="font-bold text-lg text-foreground">Transaction Authorization</h3>
            <p className="text-sm text-foreground/70">Enter your 4-digit transaction PIN to confirm the transfer of ${Number(amount).toLocaleString()} to {recipient.name}.</p>
            
            <div className="pt-4">
              <input 
                type="password" 
                maxLength={4}
                value={pin} 
                onChange={e => setPin(e.target.value)}
                className="w-32 mx-auto text-center tracking-[1em] text-2xl bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono"
                placeholder="••••"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(getPrevStep('pin'))} className="flex-1 bg-background border border-border text-foreground font-bold py-3 rounded-xl hover:border-foreground/30 transition-colors">
                Back
              </button>
              <button onClick={verifyPin} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Confirm Transfer
              </button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Mail size={32} />
            </div>
            <h3 className="font-bold text-lg text-foreground">One-Time Password (OTP)</h3>
            <p className="text-xs text-foreground/70">
              A 6-digit transaction verification OTP was automatically sent to <strong className="text-foreground font-mono">{currentUser.email}</strong>.
            </p>

            {otpSentFeedback && (
              <div className="py-1.5 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle size={14} /> New OTP code sent to your email
              </div>
            )}

            <div className="pt-2 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest">Enter 6-Digit Code</label>
                <button
                  type="button"
                  onClick={generateAndSendOtp}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} /> Resend OTP
                </button>
              </div>
              <input 
                type="text" 
                maxLength={6}
                value={otpInput} 
                onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.5em] text-2xl bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground font-mono font-bold"
                placeholder="••••••"
                autoFocus
              />
              <p className="text-[11px] text-foreground/50 mt-2 text-center">
                This verification is required by bank payment security settings.
              </p>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(getPrevStep('otp'))} className="flex-1 bg-background border border-border text-foreground font-bold py-3 rounded-xl hover:border-foreground/30 transition-colors">
                Back
              </button>
              <button onClick={verifyOtp} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Verify OTP
              </button>
            </div>
          </div>
        )}
        {step === 'success' && (
          <div className="space-y-4 text-center py-6">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h3 className="font-bold text-2xl text-foreground">Transfer Successful!</h3>
            <p className="text-sm text-foreground/70 mb-8 max-w-xs mx-auto">Your transfer of ${Number(amount).toLocaleString()} has been processed and is now complete.</p>
            
            <button onClick={() => { onClose(); if (onSuccess) onSuccess(); }} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
              View Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
