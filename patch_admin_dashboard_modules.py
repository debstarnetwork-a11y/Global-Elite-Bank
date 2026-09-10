import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Add imports for the new modules
old_import = """import { AdminSettingsView } from './AdminSettingsView';"""
new_import = """import { AdminSettingsView } from './AdminSettingsView';
import { 
  AdminApplications, AdminGrantApplications, AdminLoanApplications, 
  AdminTransactionsHistory, AdminVirtualCards, AdminEmailServices, AdminAdministrators 
} from './AdminModules';"""

content = content.replace(old_import, new_import)

# 2. Add subItems routing handling for currentView
# we need to make sure the sidebar buttons for subItems actually set the view
nav_sidebar_old = """        {item.subItems && (
          <div className="pl-10 mt-1 space-y-1">
            {item.subItems.map((sub: string) => (
              <button key={sub} className="w-full text-left px-3 py-1.5 text-xs font-bold text-foreground/50 hover:text-foreground hover:bg-white/5 rounded-md transition-colors">
                {sub}
              </button>
            ))}
          </div>
        )}"""

nav_sidebar_new = """        {item.subItems && (
          <div className="pl-10 mt-1 space-y-1">
            {item.subItems.map((sub: string) => (
              <button 
                key={sub} 
                onClick={() => setCurrentView(`${item.id}-${sub.toLowerCase().replace(' ', '-')}`)}
                className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  currentView === `${item.id}-${sub.toLowerCase().replace(' ', '-')}` 
                    ? 'text-primary bg-primary/10' 
                    : 'text-foreground/50 hover:text-foreground hover:bg-white/5'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}"""
content = content.replace(nav_sidebar_old, nav_sidebar_new)

# 3. Handle routing in the main container
# Find the exact placeholder block and replace it with a switch or a series of conditions
old_placeholder = """      {/* Other Views Placeholder */}
      {currentView !== 'dashboard' && currentView !== 'manage-users' && currentView !== 'settings' && (
        <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
          <Activity size={48} className="mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2 text-foreground">Module Under Construction</h3>
          <p className="text-sm max-w-md text-center">The {navItems.find(i => i.id === currentView)?.label} module is currently being developed and will be available in a future update.</p>
        </div>
      )}"""

new_router = """      {/* Module Router */}
      {currentView === 'new-user-apps' && <AdminApplications />}
      {currentView === 'grant-applications' && <AdminGrantApplications />}
      {currentView === 'loan-apps' && <AdminLoanApplications />}
      {currentView === 'txn-history' && <AdminTransactionsHistory />}
      {currentView === 'transfer-txns' && <AdminTransactionsHistory filter="transfers" />}
      {currentView === 'user-deposits' && <AdminTransactionsHistory filter="deposits" />}
      {currentView === 'virtual-cards-all-cards' && <AdminVirtualCards />}
      {currentView === 'virtual-cards-pending-applications' && <AdminVirtualCards filter="pending" />}
      {currentView === 'email-services' && <AdminEmailServices />}
      {currentView === 'administrators' && <AdminAdministrators />}
      
      {/* Catch-all for truly unimplemented ones */}
      {currentView === 'virtual-cards' && (
        <div className="p-8 text-center text-foreground/50">Please select a sub-category from the sidebar.</div>
      )}
      {currentView === 'virtual-cards-card-settings' && (
        <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
          <CreditCard size={48} className="mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2 text-foreground">Card Settings</h3>
          <p className="text-sm max-w-md text-center">Card configuration limits and issuing options will be available here.</p>
        </div>
      )}"""
content = content.replace(old_placeholder, new_router)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
