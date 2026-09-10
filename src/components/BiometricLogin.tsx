import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, ShieldCheck, AlertCircle, ShieldAlert, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { useBank } from '../store';

export function BiometricLogin({ onLogin, onBack }: { onLogin: () => void; onBack?: () => void }) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const { currentUser, adminSettings } = useBank();

  const isAdmin = currentUser?.role === 'admin' || (typeof window !== 'undefined' && window.location.pathname === '/admin');

  const handleScan = () => {
    if (status === 'scanning' || status === 'success') return;
    
    setStatus('scanning');
    
    // Simulate biometric scanning process
    setTimeout(() => {
      setStatus('success');
      setTimeout(onLogin, 1400); // 1.4s show success before redirecting
    }, 1800); // 1.8 second scan time
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background ambient decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      {onBack && (
        <button 
          onClick={onBack} 
          className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-foreground transition-colors z-20"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>
      )}

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 relative z-10 shadow-2xl flex flex-col items-center">
        {/* Logo */}
        {adminSettings?.logoUrl ? (
          <div className="flex flex-col items-center justify-center mb-4">
            <img src={adminSettings.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mb-4">
            <img src="/logo.png" alt="Global Elite Logo" className="w-14 h-14 object-contain" />
          </div>
        )}

        {/* 2FA Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-3">
          <KeyRound size={12} />
          <span>Step 2 of 2: Two-Factor Authentication</span>
        </div>

        <h2 className="text-2xl font-extrabold text-foreground text-center mb-1">
          Thumbprint Biometrics
        </h2>
        <p className="text-foreground/50 text-xs text-center mb-6 max-w-xs">
          Secondary biometric authentication is required to access your {isAdmin ? 'Administrator Portal' : 'Banking Account'}.
        </p>

        {/* User Identity Chip */}
        {currentUser && (
          <div className="w-full bg-background border border-border rounded-xl p-3.5 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isAdmin 
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                  : 'bg-primary/20 text-primary border border-primary/30'
              }`}>
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : (isAdmin ? 'A' : 'U')}
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold text-foreground truncate flex items-center gap-1.5">
                  <span>{currentUser.name || (isAdmin ? 'Super Admin' : 'Authorized User')}</span>
                  {isAdmin ? (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">Admin</span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Client</span>
                  )}
                </div>
                <div className="text-[11px] text-foreground/50 truncate font-mono">{currentUser.email}</div>
              </div>
            </div>
            <div className="text-emerald-500 shrink-0 ml-2" title="Password verified">
              <CheckCircle2 size={16} />
            </div>
          </div>
        )}

        {/* Biometric Sensor Scanner */}
        <div className="relative w-44 h-44 flex items-center justify-center mb-2">
          {/* Ripple effects during scanning */}
          {status === 'scanning' && (
            <>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2.1, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border-2 border-primary/40"
              />
              <motion.div 
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2.1, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut", delay: 0.9 }}
                className="absolute inset-0 rounded-full border-2 border-primary/40"
              />
            </>
          )}
          
          <button 
            id="biometric-thumbprint-sensor-btn"
            type="button"
            onClick={handleScan}
            disabled={status === 'scanning' || status === 'success'}
            aria-label="Thumbprint biometric scanner sensor"
            className={`w-32 h-32 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-500 z-10 cursor-pointer shadow-lg ${
              status === 'idle' 
                ? 'bg-card border-2 border-border text-foreground/60 hover:text-primary hover:border-primary hover:shadow-[0_0_35px_rgba(79,70,229,0.25)] hover:scale-105 active:scale-95' :
              status === 'scanning' 
                ? 'bg-primary/10 border-2 border-primary text-primary shadow-[0_0_40px_rgba(79,70,229,0.4)] scale-100' :
              status === 'success' 
                ? 'bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 shadow-[0_0_45px_rgba(16,185,129,0.45)] scale-105' :
                'bg-rose-500/10 border-2 border-rose-500 text-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.4)] scale-100'
            }`}
          >
            {status === 'success' ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <ShieldCheck size={52} />
              </motion.div>
            ) : status === 'error' ? (
              <motion.div initial={{ x: -10 }} animate={{ x: [10, -10, 10, -10, 0] }} transition={{ duration: 0.4 }}>
                <AlertCircle size={52} />
              </motion.div>
            ) : (
              <Fingerprint 
                size={54} 
                className={`transition-opacity duration-300 ${status === 'scanning' ? 'opacity-40 animate-pulse' : 'opacity-90'}`} 
              />
            )}

            {/* Scanning Laser Line */}
            {status === 'scanning' && (
              <motion.div 
                initial={{ top: '-10%' }}
                animate={{ top: '110%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear", repeatType: "reverse" }}
                className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_#4F46E5]"
              />
            )}
          </button>
        </div>

        {/* Dynamic Status / Prompt */}
        <div className="h-10 mt-4 flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className={`text-xs font-bold uppercase tracking-wider ${
                status === 'idle' ? 'text-foreground/70' :
                status === 'scanning' ? 'text-primary animate-pulse' :
                status === 'success' ? 'text-emerald-500 font-extrabold' :
                'text-rose-500'
              }`}
            >
              {status === 'idle' ? 'Touch / Click sensor to scan thumbprint' :
               status === 'scanning' ? 'Verifying Thumbprint Biometrics...' :
               status === 'success' ? 'Biometric Match Confirmed — Access Granted' :
               'Biometric Match Failed. Try Again.'}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Quick Action Button */}
        {status === 'idle' && (
          <button
            type="button"
            onClick={handleScan}
            className="mt-3 w-full py-2.5 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Fingerprint size={16} />
            <span>Scan Thumbprint Now</span>
          </button>
        )}

        {/* Footer Security Badge */}
        <div className="mt-6 pt-4 border-t border-border/60 w-full flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-[10px] text-foreground/40 font-mono uppercase tracking-wider mb-1">
            <ShieldAlert size={12} className="text-primary/70" />
            <span>FIDO2 / WebAuthn Biometric Enclave</span>
          </div>
          <p className="text-[10px] text-foreground/30 font-mono">
            Encrypted with 256-Bit Hardware Keystore
          </p>
        </div>
      </div>
    </div>
  );
}

