import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Add currentView state and imports for the settings view
imports_patch = """import { AdminSettingsView } from './AdminSettingsView';\n\nexport function AdminDashboard() {"""
content = content.replace("export function AdminDashboard() {", imports_patch)

state_patch = """  const [toastMessage, setToastMessage] = useState<{title: string, message: string} | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);"""
content = content.replace("  const [toastMessage, setToastMessage] = useState<{title: string, message: string} | null>(null);", state_patch)

# 2. Add navItems definition
nav_items = """
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'manage-users', label: 'Manage Users', icon: Users },
    { id: 'grant-applications', label: 'Grant Applications', icon: FileText },
    { id: 'create-user', label: 'Create New user', icon: UserPlus },
    { id: 'new-user-apps', label: 'New User Application(s)', icon: FilePlus },
    { id: 'transfer-txns', label: 'Transfer Transactions', icon: Repeat },
    { id: 'txn-history', label: 'Transaction History', icon: Clock },
    { id: 'user-deposits', label: 'Users Deposits', icon: Download },
    { id: 'loan-apps', label: 'Loan Applications', icon: FileText },
    { id: 'virtual-cards', label: 'Virtual Cards', icon: CreditCard, subItems: ['All Cards', 'Pending Applications', 'Card Settings'] },
    { id: 'email-services', label: 'Email Services', icon: Mail },
    { id: 'administrators', label: 'Administrator(s)', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderSidebarItem = (item: any) => {
    const isActive = currentView === item.id;
    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (item.id === 'create-user') {
              handleOpenAddUser();
            } else {
              setCurrentView(item.id);
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            isActive ? 'bg-primary text-white' : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon size={18} className={isActive ? 'text-white' : 'text-foreground/50'} />
            <span>{item.label}</span>
          </div>
        </button>
        {item.subItems && (
          <div className="pl-10 mt-1 space-y-1">
            {item.subItems.map((sub: string) => (
              <button key={sub} className="w-full text-left px-3 py-1.5 text-xs font-bold text-foreground/50 hover:text-foreground hover:bg-white/5 rounded-md transition-colors">
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
"""

content = content.replace("  const handleAdminAction = (action: string) => {", nav_items + "\n  const handleAdminAction = (action: string) => {")

# 3. Replace the return statement
old_return = """  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">"""

new_return = """  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden w-full absolute inset-0 z-[100]">
      {/* Sidebar - Desktop */}
      <div className="w-64 bg-card border-r border-border overflow-y-auto flex-col h-full shrink-0 hidden lg:flex">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <ShieldAlert className="text-primary" size={24} />
          <h1 className="text-xl font-bold text-foreground">Admin</h1>
        </div>
        <div className="flex-1 py-4 flex flex-col px-3">
          {navItems.map(renderSidebarItem)}
        </div>
      </div>
      
      {/* Sidebar - Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-64 bg-card h-full flex flex-col border-r border-border shadow-2xl animate-in slide-in-from-left">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-primary" size={24} />
                <h1 className="text-xl font-bold text-foreground">Admin</h1>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-foreground/50 hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 py-4 overflow-y-auto px-3">
              {navItems.map(renderSidebarItem)}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="p-4 border-b border-border bg-card flex items-center justify-between lg:hidden shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-foreground/70 hover:text-foreground rounded-lg hover:bg-white/5">
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold">Admin Portal</h1>
          <div className="w-8"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {currentView === 'dashboard' || currentView === 'manage-users' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">"""

content = content.replace(old_return, new_return)

# 4. We need to close the wrapping divs at the bottom of the component
old_end = """      {/* System Settings Modal */}"""

new_end = """      {/* Other Views Placeholder */}
      {currentView !== 'dashboard' && currentView !== 'manage-users' && currentView !== 'settings' && (
        <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
          <Activity size={48} className="mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2 text-foreground">Module Under Construction</h3>
          <p className="text-sm max-w-md text-center">The {navItems.find(i => i.id === currentView)?.label} module is currently being developed and will be available in a future update.</p>
        </div>
      )}

      {currentView === 'settings' && <AdminSettingsView />}
      
      </div> {/* Close wrapper for views */}
      </div> {/* Close Main Content overflow container */}
      </div> {/* Close main wrapper flex container */}
      
      {/* Modals are kept outside the main scroll container but inside the component to render on top */}
      {/* System Settings Modal */}"""

content = content.replace(old_end, new_end)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
