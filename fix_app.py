import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove the Contact Card for Elite Clients
content = re.sub(
    r'\{/\* Contact Card for Elite Clients \*/\}[\s\S]*?</div>\s*</div>\s*</div>',
    '</div>\n              </div>',
    content
)

# Update App routing logic
replacement_app_start = """
export default function App() {
  const [appRoute, setAppRoute] = useState<'landing' | 'login' | 'register' | 'biometric' | 'dashboard' | 'admin'>('landing');
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
    return <SignInView onBack={() => { window.location.pathname = '/'; setAppRoute('landing'); }} onSuccess={() => {
      if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
         setAppRoute('admin');
      } else {
         setAppRoute('biometric');
      }
    }} />;
  }

  if (appRoute === 'register') {
    return <SignUpView onBack={() => setAppRoute('landing')} onSuccess={() => setAppRoute('biometric')} />;
  }

  if (appRoute === 'biometric') {
    return <BiometricLogin onLogin={() => setAppRoute('dashboard')} />;
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
"""

content = re.sub(r'export default function App\(\) \{[\s\S]*?return \(', replacement_app_start.strip(), content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

