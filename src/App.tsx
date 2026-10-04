/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useBank } from './store';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CurrencyConverter } from './components/CurrencyConverter';
import { BalanceCard } from './components/BalanceCard';
import { QuickActions } from './components/QuickActions';
import { SpendingChart } from './components/SpendingChart';
import { RecentTransactions } from './components/RecentTransactions';
import { TransactionHistory } from './components/TransactionHistory';
import { InvestorsWallet } from './components/InvestorsWallet';
import { CryptoDashboard } from './components/CryptoDashboard';
import { TransferSlip } from './components/TransferSlip';
import { AdminDashboard } from './components/AdminDashboard';
import { BiometricLogin } from './components/BiometricLogin';
import { LandingPage } from './components/LandingPage';
import { LoansGrantsView } from './components/LoansGrantsView';
import { CardsView, AnalyticsView } from './components/PlaceholderViews';
import { SettingsView } from './components/UserSettings';
import { SignInView, SignUpView } from './components/AuthViews';
import { PaymentInstructionsModal } from './components/PaymentInstructionsModal';
import { AppleGiftCardModal } from './components/AppleGiftCardModal';
import { Banknote, ArrowDownToLine, Sparkles, ShoppingBag } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

export default function App() {

  const { adminSettings, currentUser, setCurrentUser, users, logout, loginAsAdmin } = useBank();
  const { t } = useLanguage();
  const [showAutoInstructions, setShowAutoInstructions] = useState(false);
  const [showAppleCardModal, setShowAppleCardModal] = useState(false);

  const isCurrentPathAdmin = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    const href = window.location.href.toLowerCase();
    return (
      path === '/admin' ||
      path === '/admin/' ||
      path.endsWith('/admin') ||
      path.endsWith('/admin/') ||
      hash === '#/admin' ||
      hash === '#admin' ||
      hash.startsWith('#/admin') ||
      search.includes('admin=true') ||
      search.includes('route=admin') ||
      search.includes('view=admin') ||
      href.includes('/admin')
    );
  };

  const isCurrentPathDashboard = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path === '/dashboard' ||
      path === '/dashboard/' ||
      path.startsWith('/dashboard') ||
      hash === '#/dashboard' ||
      hash === '#dashboard' ||
      hash.startsWith('#/dashboard') ||
      search.includes('route=dashboard') ||
      search.includes('view=dashboard')
    );
  };

  const [appRoute, setAppRoute] = useState<'landing' | 'login' | 'register' | 'biometric' | 'dashboard' | 'admin'>(() => {
    if (isCurrentPathAdmin()) {
      if (typeof window !== 'undefined' && window.sessionStorage.getItem('geb_admin_session_auth') === 'true') {
        return 'admin';
      }
      return 'login';
    }
    if (isCurrentPathDashboard()) {
      return 'dashboard';
    }
    return 'landing';
  });
  const [currentView, setCurrentView] = useState<'Dashboard' | string>(() => {
    if (isCurrentPathAdmin()) {
      if (typeof window !== 'undefined' && window.sessionStorage.getItem('geb_admin_session_auth') === 'true') {
        return 'Admin';
      }
      return 'Dashboard';
    }
    return 'Dashboard';
  });

  // Automatically load DEB STAR when viewing dashboard if no client is selected or if admin switches to client dashboard
  useEffect(() => {
    if (appRoute === 'dashboard') {
      if (!currentUser || currentUser.role === 'admin' || !currentUser.accounts || currentUser.accounts.length === 0 || !currentUser.accounts[0]?.accountNumber) {
        const debStar = users.find(u => (u.email || '').toLowerCase() === 'debstarnetwork@gmail.com') || users.find(u => u.role !== 'admin');
        if (debStar) {
          setCurrentUser(debStar);
        }
      }
    }
  }, [appRoute, currentUser, users, setCurrentUser]);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      const hasSeenModal = localStorage.getItem(`geb_seen_deposit_modal_${currentUser.id}`);
      const isNewPending = currentUser.newAccountPromptPending;
      const primaryAccount = currentUser.accounts?.[0];
      const hasAccountSeen = primaryAccount?.accountNumber ? localStorage.getItem(`geb_seen_deposit_modal_${primaryAccount.accountNumber}`) : null;
      
      // If newly opened or not yet viewed, automatically show the payment instructions
      if (isNewPending || (!hasSeenModal && !hasAccountSeen)) {
        setShowAutoInstructions(true);
      }
    }
  }, [currentUser?.id, currentUser?.newAccountPromptPending]);
  
  useEffect(() => {
    if (adminSettings?.activeTheme) {
      document.documentElement.className = adminSettings.activeTheme;
    }
  }, [adminSettings?.activeTheme]);

  // Ensure admin interface enforces full login & biometrics before access
  useEffect(() => {
    const handleUrlRouteSync = () => {
      if (isCurrentPathAdmin()) {
        const isAuthed = typeof window !== 'undefined' && window.sessionStorage.getItem('geb_admin_session_auth') === 'true' && currentUser?.role === 'admin';
        if (!isAuthed) {
          setAppRoute('login');
        } else {
          setAppRoute('admin');
          setCurrentView('Admin');
        }
      } else if (isCurrentPathDashboard()) {
        setAppRoute('dashboard');
        setCurrentView('Dashboard');
      }
    };

    handleUrlRouteSync();
    window.addEventListener('popstate', handleUrlRouteSync);
    window.addEventListener('hashchange', handleUrlRouteSync);
    return () => {
      window.removeEventListener('popstate', handleUrlRouteSync);
      window.removeEventListener('hashchange', handleUrlRouteSync);
    };
  }, [currentUser?.role]);

  if (appRoute === 'landing') {
    return <LandingPage onLogin={() => setAppRoute('login')} onRegister={() => setAppRoute('register')} />;
  }

  if (appRoute === 'login') {
    return <SignInView onBack={() => { window.location.pathname = '/'; setAppRoute('landing'); }} onSuccess={(authenticatedUser?: any) => {
      const user = authenticatedUser || currentUser;
      if (user?.role === 'admin') {
         if (typeof window !== 'undefined') {
           window.sessionStorage.setItem('geb_admin_session_auth', 'true');
         }
         setAppRoute('admin');
         setCurrentView('Admin');
      } else {
         setAppRoute('dashboard');
         setCurrentView('Dashboard');
      }
    }} />;
  }

  if (appRoute === 'register') {
    return <SignUpView onBack={() => setAppRoute('landing')} onSuccess={() => setAppRoute('landing')} />;
  }

  if (appRoute === 'biometric') {
    return <BiometricLogin onLogin={() => {
      if (currentUser?.role === 'admin' || isCurrentPathAdmin()) {
        setAppRoute('admin');
      } else {
        setAppRoute('dashboard');
      }
    }} onBack={() => setAppRoute('login')} />;
  }
  
  if (appRoute === 'admin') {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 p-4 md:p-8">
           <AdminDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={() => { logout(); window.location.pathname = '/'; setAppRoute('landing'); }} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onNavigateView={setCurrentView} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentView === 'Dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {currentUser?.role === 'admin' && (
                    <div className="bg-gradient-to-r from-purple-500/10 via-primary/10 to-purple-500/10 border border-purple-500/25 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                          ADM
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">Logged in as Administrator</p>
                          <p className="text-[11px] text-foreground/60">Switch to client account to view full portfolio, balances & transactions.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const deb = users.find(u => (u.email || '').toLowerCase() === 'debstarnetwork@gmail.com');
                            if (deb) setCurrentUser(deb);
                          }}
                          className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-xs"
                        >
                          View DEB STAR Portfolio ($100,000)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentView('Admin')}
                          className="px-3 py-1.5 bg-card border border-border text-foreground text-xs font-bold rounded-lg hover:bg-foreground/5 transition-colors"
                        >
                          Admin Console →
                        </button>
                      </div>
                    </div>
                  )}

                  {currentUser?.role !== 'admin' && (
                    <div className="bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 border border-primary/25 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
                          <Banknote size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm sm:text-base text-foreground">
                              {t('officialInstructions', 'Official Account Payment & Deposit Instructions')}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                              {t('accountNumber', 'Account #')}{currentUser.accounts?.[0]?.accountNumber || 'Active'}
                            </span>
                          </div>
                          <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
                            Official bank wire details, Apple Gift Cards (Buy & Redeem directly with debit/credit card), institutional crypto deposit wallets (BTC, ETH, USDT, SOL), and PayPal instructions configured for your account.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowAppleCardModal(true)}
                          className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold hover:opacity-90 transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <span className="text-sm font-bold"></span>
                          <span>Apple Gift Card</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAutoInstructions(true)}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <ArrowDownToLine size={14} />
                          <span>{t('viewPaymentDetails', 'View Payment Details')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                  <BalanceCard />
                  <QuickActions setCurrentView={setCurrentView} />
                  <SpendingChart />
                  <CurrencyConverter />
                </div>
                <div className="lg:col-span-1">
                  <RecentTransactions />
                  
                  </div>
              </div>
            )}
            {currentView === 'History' && <TransactionHistory />}
            {currentView === 'Crypto' && <CryptoDashboard />}
            {currentView === 'Investors' && <InvestorsWallet />}
            {currentView === 'LoansGrants' && <LoansGrantsView />}
            {currentView === 'Receipts' && <TransferSlip />}
            {currentView === 'Admin' && <AdminDashboard />}
            {currentView === 'Cards' && <CardsView />}
            {currentView === 'Analytics' && <AnalyticsView />}
            {currentView === 'Settings' && <SettingsView />}
          </div>
        </main>
      </div>

      <PaymentInstructionsModal
        isOpen={showAutoInstructions}
        onClose={() => setShowAutoInstructions(false)}
        isNewAccountNotice={Boolean(currentUser?.newAccountPromptPending || !localStorage.getItem(`geb_seen_deposit_modal_${currentUser?.id}`))}
      />

      <AppleGiftCardModal
        isOpen={showAppleCardModal}
        onClose={() => setShowAppleCardModal(false)}
      />
    </div>
  );
}
