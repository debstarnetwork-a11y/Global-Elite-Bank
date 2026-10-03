import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Change route handling in App.tsx
app_comp_replacement = """
export default function App() {
  const [appRoute, setAppRoute] = useState<'landing' | 'login' | 'register' | 'biometric' | 'dashboard'>('landing');
  const [currentView, setCurrentView] = useState('Dashboard');

  // Check URL on mount to force admin route if necessary
  if (typeof window !== 'undefined') {
    const isAdminPath = window.location.pathname === '/admin';
    if (isAdminPath && appRoute === 'landing') {
      // Force login view for admin path if just landed
      setAppRoute('login');
    }
  }

  if (appRoute === 'landing') {
    return <LandingPage onLogin={() => setAppRoute('login')} onRegister={() => setAppRoute('register')} />;
  }
  if (appRoute === 'login') {
    return <SignInView onBack={() => { window.location.pathname = '/'; setAppRoute('landing'); }} onSuccess={() => setAppRoute('biometric')} />;
  }
  if (appRoute === 'register') {
    return <SignUpView onBack={() => setAppRoute('landing')} onSuccess={() => setAppRoute('biometric')} />;
  }
  if (appRoute === 'biometric') {
    return <BiometricLogin onLogin={() => setAppRoute('dashboard')} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={() => { window.location.pathname = '/'; setAppRoute('landing'); }} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentView === 'Dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <BalanceCard />
                  <QuickActions setCurrentView={setCurrentView} />
                  <SpendingChart />
                  <CurrencyConverter />
                </div>
                <div className="lg:col-span-1">
                  <RecentTransactions />
                  
                  {/* Contact Card for Elite Clients */}
                  <div className="mt-6 bg-background border border-accent/30 rounded-2xl p-6 flex flex-col justify-center text-center space-y-4 shadow-sm">
                    <div className="mx-auto w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center text-2xl">
                      ☎
                    </div>
                    <h4 className="text-sm font-bold text-foreground">Direct Concierge Access</h4>
                    <p className="text-[10px] text-foreground/50 px-4 leading-relaxed">
                      Your personal Swiss relationship manager is currently available for secure consultation.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {currentView === 'History' && <TransactionHistory />}
            {currentView === 'Crypto' && <CryptoDashboard />}
            {currentView === 'Receipts' && <TransferSlip />}
            {currentView === 'Admin' && <AdminDashboard />}
            {currentView === 'Cards' && <CardsView />}
            {currentView === 'Analytics' && <AnalyticsView />}
            {currentView === 'Security' && <SecurityView />}
          </div>
        </main>
      </div>
    </div>
  );
}
"""

content = re.sub(r'export default function App\(\) \{[\s\S]*?\}\n', app_comp_replacement, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
