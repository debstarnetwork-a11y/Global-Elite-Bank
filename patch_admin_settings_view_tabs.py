import re

with open('src/components/AdminSettingsView.tsx', 'r') as f:
    content = f.read()

# Replace the under development part with the specific components for preference, login, theme
new_tabs_content = """

        {activeTab === 'preference' && (
          <div className="space-y-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Preference Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Contact Email</label>
                <input type="email" value={adminSettings.preferenceContactEmail as string || ''} onChange={e => updateAdminSettings({ preferenceContactEmail: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Website Currency</label>
                <input type="text" value={adminSettings.websiteCurrency as string || ''} onChange={e => updateAdminSettings({ websiteCurrency: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Homepage URL (Redirect)</label>
                <input type="url" value={adminSettings.homepageUrl as string || ''} onChange={e => updateAdminSettings({ homepageUrl: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" placeholder="eg https://myhomepage.com" />
                <p className="text-xs text-foreground/50 mt-1">If you use a custom homepage and you want all requests to be redirected to that page, please enter the URL here. If empty, the system will use our default homepage/webpages</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <h4 className="font-bold text-foreground">KYC(Verification)</h4>
                  <p className="text-xs text-foreground/50 mt-1">if turned on, Users will need to submit required documents to get verified before they can place a withdrawal request.</p>
                </div>
                <button onClick={() => updateAdminSettings({ requireKycWithdrawal: !adminSettings.requireKycWithdrawal })} className={`shrink-0 w-12 h-6 rounded-full transition-colors relative ${adminSettings.requireKycWithdrawal ? 'bg-primary' : 'bg-foreground/20'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings.requireKycWithdrawal ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <h4 className="font-bold text-foreground">KYC(Verification) on Registraion</h4>
                  <p className="text-xs text-foreground/50 mt-1">If turned on, Users will have to go through the verification process upon registration, and they will not be allowed to carry out any operation on your system until they have been verified by the admin. Note that this will affect existing users who have not completed their KYC. After they have submitted an application, you will also need to verify the user from your end before they can proceed.</p>
                </div>
                <button onClick={() => updateAdminSettings({ requireKycRegistration: !adminSettings.requireKycRegistration })} className={`shrink-0 w-12 h-6 rounded-full transition-colors relative ${adminSettings.requireKycRegistration ? 'bg-primary' : 'bg-foreground/20'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings.requireKycRegistration ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <h4 className="font-bold text-foreground">Email Verification</h4>
                </div>
                <button onClick={() => updateAdminSettings({ requireEmailVerification: !adminSettings.requireEmailVerification })} className={`shrink-0 w-12 h-6 rounded-full transition-colors relative ${adminSettings.requireEmailVerification ? 'bg-primary' : 'bg-foreground/20'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings.requireEmailVerification ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'login' && (
          <div className="space-y-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Configuration</h3>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground border-b border-border pb-2">Mail Server</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email From</label>
                  <input type="email" value={adminSettings.emailFrom as string || ''} onChange={e => updateAdminSettings({ emailFrom: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email From Name</label>
                  <input type="text" value={adminSettings.emailFromName as string || ''} onChange={e => updateAdminSettings({ emailFromName: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground border-b border-border pb-2">Google Login Credentials</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Client ID</label>
                  <input type="text" value={adminSettings.googleClientId as string || ''} onChange={e => updateAdminSettings({ googleClientId: e.target.value })} placeholder="From console.cloud.google.com" className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Client Secret</label>
                  <input type="password" value={adminSettings.googleClientSecret as string || ''} onChange={e => updateAdminSettings({ googleClientSecret: e.target.value })} placeholder="From console.cloud.google.com" className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Redirect URL</label>
                  <input type="url" value={adminSettings.googleRedirectUrl as string || ''} onChange={e => updateAdminSettings({ googleRedirectUrl: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                  <p className="text-xs text-foreground/50 mt-1">Set this to your Valid OAuth Redirect URI in console.cloud.google.com. Be sure to replace 'yoursite.com' with your website URL</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground border-b border-border pb-2">Google Captcha Credentials</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Captcha Secret</label>
                  <input type="password" value={adminSettings.captchaSecret as string || ''} onChange={e => updateAdminSettings({ captchaSecret: e.target.value })} placeholder="From https://www.google.com/recaptcha/admin/create" className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Captcha Site-Key</label>
                  <input type="password" value={adminSettings.captchaSiteKey as string || ''} onChange={e => updateAdminSettings({ captchaSiteKey: e.target.value })} placeholder="From https://www.google.com/recaptcha/admin/create" className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Theme/Display</h3>
            <p className="text-sm text-foreground/60 mb-6">Website theme. Double-click to save. The current theme has a blue border.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['dark', 'light', 'midnight', 'ocean'].map(theme => (
                <div 
                  key={theme}
                  onDoubleClick={() => {
                    updateAdminSettings({ activeTheme: theme });
                    handleSave();
                  }}
                  className={`cursor-pointer border-2 rounded-xl p-4 overflow-hidden h-32 flex flex-col items-center justify-center transition-all ${
                    adminSettings.activeTheme === theme ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-foreground/30 bg-background/50'
                  }`}
                >
                  <div className="font-bold capitalize">{theme}</div>
                  <div className="text-xs text-foreground/50 mt-2">(Double-click to apply)</div>
                </div>
              ))}
            </div>
          </div>
        )}
"""

# Replace the "under development" block
under_dev_block_regex = r"\{activeTab !== 'website' && activeTab !== 'transfer' && \([\s\S]*?\}\)"
content = re.sub(under_dev_block_regex, new_tabs_content.strip(), content)

with open('src/components/AdminSettingsView.tsx', 'w') as f:
    f.write(content)
