with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

import re

# We will just redefine navItems inside the component, and remove the global one.
content = re.sub(r'const navItems = \[[\s\S]*?\];', '', content)

replacement = """
export function Sidebar({ currentView, setCurrentView, onLogout }: { currentView: string; setCurrentView: (v: string) => void; onLogout: () => void }) {
  const { currentUser } = useBank();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'Dashboard' },
    { icon: History, label: 'Transactions', id: 'History' },
    { icon: Bitcoin, label: 'Crypto', id: 'Crypto' },
    { icon: CreditCard, label: 'Cards', id: 'Cards' },
    { icon: BarChart3, label: 'Analytics', id: 'Analytics' },
    { icon: ShieldCheck, label: 'Security', id: 'Security' },
  ];
  
  // Only add admin to sidebar if logged in as admin AND on /admin path
  if (currentUser?.role === 'admin' && typeof window !== 'undefined' && window.location.pathname === '/admin') {
    navItems.push({ icon: ShieldAlert, label: 'Admin', id: 'Admin' });
  }

  // Force view to admin if on /admin path and role is admin
  useEffect(() => {
     if (currentUser?.role === 'admin' && typeof window !== 'undefined' && window.location.pathname === '/admin' && currentView !== 'Admin') {
         setCurrentView('Admin');
     }
  }, [currentUser, currentView, setCurrentView]);

"""

content = re.sub(r'export function Sidebar[\s\S]*?\{', replacement, content, count=1)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
