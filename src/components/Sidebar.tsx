import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useBank } from '../store';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowRightLeft, 
  BarChart3, 
  ShieldCheck, 
  User, 
  Settings,
  LogOut,
  Building2,
  Bitcoin,
  FileText,
  ShieldAlert,
  History,
  Home,
  Wallet,
  BarChart2,
  TrendingUp
} from 'lucide-react';




export function Sidebar({ currentView, setCurrentView, onLogout }: { currentView: string; setCurrentView: (v: string) => void; onLogout: () => void }) {
  const { currentUser, adminSettings } = useBank();
  const { t } = useLanguage();
  
    const navItems = [
    { icon: Home, label: t('dashboard', 'Dashboard'), id: 'Dashboard' },
    { icon: History, label: t('transactionHistory', 'Transaction History'), id: 'History' },
    { icon: Wallet, label: t('cryptoFx', 'Crypto & FX'), id: 'Crypto' },
    { icon: TrendingUp, label: t('investorsWallet', 'Investors Wallet'), id: 'Investors' },
    { icon: CreditCard, label: t('virtualCards', 'Virtual Cards'), id: 'Cards' },
    { icon: FileText, label: t('loansGrants', 'Loans & Grants'), id: 'LoansGrants' },
    { icon: BarChart2, label: t('analytics', 'Analytics'), id: 'Analytics' },
    { icon: Settings, label: t('settings', 'Settings'), id: 'Settings' },
  ];
  
  // Add admin to sidebar whenever logged in as admin
  if (currentUser?.role === 'admin') {
    navItems.push({ icon: ShieldAlert, label: t('adminPortal', 'Admin Portal'), id: 'Admin' });
  }

  // Force view to admin if on /admin path and role is admin
  useEffect(() => {
     const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase().replace(/\/+$/, '') : '';
     if (currentUser?.role === 'admin' && (path === '/admin' || path.endsWith('/admin')) && currentView !== 'Admin') {
         setCurrentView('Admin');
     }
  }, [currentUser, currentView, setCurrentView]);

  return (
    <div className="w-64 h-screen bg-background border-r border-border hidden md:flex flex-col sticky top-0 p-6 space-y-8">
      <div className="flex items-center space-x-3">
        <img
          src={adminSettings?.logoUrl || 'https://i.ibb.co/G3NmLY1j/GEB-logo.png'}
          alt="Bank Logo"
          className="w-10 h-10 object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://i.ibb.co/G3NmLY1j/GEB-logo.png';
          }}
        />
        <div className="leading-tight">
          <h1 className="font-bold text-sm tracking-tight uppercase text-foreground">{adminSettings?.websiteName || 'Global Elite Bank'}</h1>
          <p className="text-[10px] text-foreground/50 font-medium"></p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={index}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive 
                  ? 'bg-white/5 border border-white/10 text-foreground' 
                  : 'text-foreground/50 hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon size={20} className={isActive ? 'opacity-80' : ''} />
              {item.label}
            </button>
          );
        })}
      </nav>



      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2 mt-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shrink-0">
        <LogOut size={14} /> {t('logout', 'Logout')}
      </button>
    </div>
  );
}
