import re

with open('src/components/AdminSettingsView.tsx', 'r') as f:
    content = f.read()

placeholder = """      {/* Other Tabs Placeholder */}
      {activeTab !== 'website' && (
        <div className="flex flex-col items-center justify-center py-20 text-foreground/50 border border-border rounded-xl bg-card">
          <Activity size={48} className="mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2 text-foreground">{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
          <p className="text-sm max-w-md text-center">This section is currently under development.</p>
        </div>
      )}"""

new_tabs = """      {/* Transfer Codes Tab */}
      {activeTab === 'transfer' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-foreground">Transfer Codes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Require COT Code</label>
              <select className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Require IMF Code</label>
              <select className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Require Tax Code</label>
              <select className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Require AML-PASS Code</label>
              <select className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <button className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">Save Settings</button>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preference' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-foreground">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
              <div>
                <h4 className="font-bold text-foreground">Email Notifications</h4>
                <p className="text-xs text-foreground/50">Send emails for login and transfers</p>
              </div>
              <div className="w-12 h-6 bg-primary/20 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
              <div>
                <h4 className="font-bold text-foreground">SMS Notifications</h4>
                <p className="text-xs text-foreground/50">Send SMS for OTP and alerts</p>
              </div>
              <div className="w-12 h-6 bg-foreground/10 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-foreground/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email / Google Login Tab */}
      {activeTab === 'login' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-foreground">Email/Google Login & Captcha</h3>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Google OAuth Client ID</label>
              <input type="text" className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" placeholder="Enter Google Client ID" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Google OAuth Secret</label>
              <input type="password" className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" placeholder="Enter Google Secret" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">reCaptcha Site Key</label>
              <input type="text" className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" placeholder="Enter reCaptcha Key" />
            </div>
            <button className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">Save Integrations</button>
          </div>
        </div>
      )}

      {/* Theme/Display Tab */}
      {activeTab === 'theme' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-foreground">Theme/Display Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Primary Color (Hex)</label>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-600 border border-border"></div>
                <input type="text" className="flex-1 bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" defaultValue="#2563EB" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Default Theme Mode</label>
              <select className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none">
                <option value="system">System Default</option>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
          </div>
          <button className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">Apply Theme</button>
        </div>
      )}"""

content = content.replace(placeholder, new_tabs)

with open('src/components/AdminSettingsView.tsx', 'w') as f:
    f.write(content)
