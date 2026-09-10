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
import { Banknote, ArrowDownToLine, Sparkles } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

export default function App() {

  const { adminSettings, currentUser, logout, loginAsAdmin } = useBank();
  const { t } = useLanguage();
  const [showAutoInstructions, setShowAutoInstructions] = useState(false);

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

  const [appRoute, setAppRoute] = useState<'landing' | 'login' | 'register' | 'biometric' | 'dashboard' | 'admin'>(() => {
    if (isCurrentPathAdmin()) {
      return 'admin';
    }
    return 'landing';
  });
  const [currentView, setCurrentView] = useState<'Dashboard' | string>(() => {
    if (isCurrentPathAdmin()) {
      return 'Admin';
    }
    return 'Dashboard';
  });

  // Enforce admin login whenever /admin is accessed
  useEffect(() => {
    const handleUrlRouteSync = () => {
      if (isCurrentPathAdmin()) {
        if (currentUser?.role !== 'admin') {
          setAppRoute('login');
        } else {
          setAppRoute('admin');
          setCurrentView('Admin');
        }
      }
    };

    handleUrlRouteSync();
    window.addEventListener('popstate', handleUrlRouteSync);
    window.addEventListener('hashchange', handleUrlRouteSync);
    return () => {
      window.removeEventListener('popstate', handleUrlRouteSync);
      window.removeEventListener('hashchange', handleUrlRouteSync);
    };
  }, [currentUser?.role, loginAsAdmin]);

  if (appRoute === 'landing') {
    return <LandingPage onLogin={() => setAppRoute('login')} onRegister={() => setAppRoute('register')} />;
  }

  if (appRoute === 'login') {
    return <SignInView onBack={() => { window.location.pathname = '/'; setAppRoute('landing'); }} onSuccess={(authenticatedUser?: any) => {
      const user = authenticatedUser || currentUser;
      if (isCurrentPathAdmin() || user?.role === 'admin') {
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
                            Official bank wire details, crypto deposit wallets (BTC, ETH, USDT, SOL), and PayPal instructions configured for your account.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowAutoInstructions(true)}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
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
    </div>
  );
}
