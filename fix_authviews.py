import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

replacement_signin = """
import { useState } from 'react';
import { useBank } from '../store';
import { ArrowRight, ShieldCheck, Mail, Lock, User } from 'lucide-react';

export function SignInView({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {
  const { login } = useBank();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      onSuccess();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <button onClick={onBack} className="absolute top-8 left-8 text-sm font-bold text-foreground/50 hover:text-foreground transition-colors">
        ← Back to Home
      </button>
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 relative z-10 shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] mb-6 mx-auto">
          <span className="font-bold text-xl">G</span>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground text-center mb-2">Welcome Back</h2>
        <p className="text-foreground/50 text-sm text-center mb-8">Enter your credentials to access your portfolio.</p>
        <form className="space-y-4" onSubmit={handleLogin}>
          {error && <p className="text-rose-500 text-sm text-center">{error}</p>}
          <div>
            <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="admin@globalelite.com" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="••••••••" />
            </div>
          </div>
          <div className="flex justify-end mb-6">
            <a href="#" className="text-xs font-bold text-primary hover:text-primary/80">Forgot Password?</a>
          </div>
          
          <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            Continue to Biometrics <ArrowRight size={16} />
          </button>
        </form>
"""

content = re.sub(r'import \{ ArrowRight, ShieldCheck, Mail, Lock, User \} from \'lucide-react\';\nexport function SignInView[\s\S]*?<\/form>', replacement_signin, content)

replacement_signup = """
export function SignUpView({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {
  const { register, login } = useBank();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, password);
    login(email, password);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <button onClick={onBack} className="absolute top-8 left-8 text-sm font-bold text-foreground/50 hover:text-foreground transition-colors">
        ← Back to Home
      </button>
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 relative z-10 shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] mb-6 mx-auto">
          <span className="font-bold text-xl">G</span>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground text-center mb-2">Apply for Membership</h2>
        <p className="text-foreground/50 text-sm text-center mb-8">Join the world's most exclusive banking network.</p>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="Alexander von Drachen" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="alexander@example.com" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="••••••••" />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-foreground text-background font-bold py-3.5 rounded-xl hover:bg-foreground/90 transition-all mt-6">
            Submit Application
          </button>
        </form>
"""

content = re.sub(r'export function SignUpView[\s\S]*?<\/form>', replacement_signup, content)

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)

