import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add adminSettings to useBank
content = content.replace(
    'const { users, updateUserStatus, register, adminCreateUser, createTransaction, deleteUser, transactions, updateTransactionStatus, logout } = useBank();',
    'const { users, updateUserStatus, adminCreateUser, createTransaction, deleteUser, transactions, updateTransactionStatus, logout, adminSettings, updateAdminSettings } = useBank();'
)

# Add state for settings modal
content = content.replace(
    'const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);',
    'const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);\n  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);'
)

# Add Settings button to header
header_btn = """
          <button onClick={() => setIsSettingsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg text-sm font-bold hover:bg-blue-500/20 transition-colors">
            <Settings size={16} /> Global Settings
          </button>
          <button onClick={handleOpenAddUser}
"""
content = content.replace('<button onClick={handleOpenAddUser}', header_btn)


# Add Settings Modal JSX
settings_modal = """
      {/* Admin Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsSettingsModalOpen(false)} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-foreground mb-6">System Security Settings</h2>
            
            <p className="text-sm text-foreground/70 mb-4">Toggle required clearance codes globally for all International/Wire transfers.</p>
            
            <div className="space-y-3">
               {['requireCot', 'requireSwift', 'requireImf', 'requireTax', 'requireAml'].map((settingKey) => {
                  const key = settingKey as keyof typeof adminSettings;
                  const label = settingKey.replace('require', '').toUpperCase() + ' Code Requirement';
                  return (
                    <div key={settingKey} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                      <span className="text-sm font-bold text-foreground">{label}</span>
                      <button 
                        onClick={() => {
                          updateAdminSettings({ [settingKey]: !adminSettings[key] });
                          showToast('Settings Updated', `${label} is now ${!adminSettings[key] ? 'Enabled' : 'Disabled'}`);
                        }}
                        className={`w-12 h-6 rounded-full relative transition-colors ${adminSettings[key] ? 'bg-emerald-500' : 'bg-foreground/20'}`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${adminSettings[key] ? 'translate-x-6' : ''}`} />
                      </button>
                    </div>
                  );
               })}
            </div>
          </div>
        </div>
      )}
"""

content = content.replace('{/* Dynamic Toast Notification */}', settings_modal + '\n      {/* Dynamic Toast Notification */}')

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
