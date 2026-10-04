import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# We need to target the `<div className="flex-1 overflow-y-auto p-6 space-y-4">` block up to `<button onClick={submitNewUser}`
pattern = r'(<div className="flex-1 overflow-y-auto p-6 space-y-4">)[\s\S]*?(<button onClick=\{submitNewUser\})'

clean_form_jsx = """\\1
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Fullname</label>
                    <input type="text" value={newUserForm.name} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email</label>
                    <input type="email" value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Password</label>
                    <input type="text" value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" placeholder="Default: password123" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Mobile</label>
                    <input type="text" value={newUserForm.mobile} onChange={e => setNewUserForm({...newUserForm, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Currency</label>
                    <select value={newUserForm.currency} onChange={e => setNewUserForm({...newUserForm, currency: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="AED">AED - Emirati Dirham</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Type</label>
                    <select value={newUserForm.accountType} onChange={e => setNewUserForm({...newUserForm, accountType: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                      <option value="Checking">Checking Account</option>
                      <option value="Savings">Savings Account</option>
                      <option value="Business">Business Account</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Number</label>
                    <input type="text" value={newUserForm.accountNumber} onChange={e => setNewUserForm({...newUserForm, accountNumber: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">BTC Wallet</label>
                    <input type="text" value={newUserForm.btcWallet} onChange={e => setNewUserForm({...newUserForm, btcWallet: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Txn PIN</label>
                    <input type="text" value={newUserForm.pin} onChange={e => setNewUserForm({...newUserForm, pin: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">COT Code</label>
                    <input type="text" value={newUserForm.cot} onChange={e => setNewUserForm({...newUserForm, cot: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">SWIFT-SEC</label>
                    <input type="text" value={newUserForm.swift} onChange={e => setNewUserForm({...newUserForm, swift: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">IMF Code</label>
                    <input type="text" value={newUserForm.imf} onChange={e => setNewUserForm({...newUserForm, imf: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">TAX Code</label>
                    <input type="text" value={newUserForm.tax} onChange={e => setNewUserForm({...newUserForm, tax: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">AML-PASS</label>
                    <input type="text" value={newUserForm.aml} onChange={e => setNewUserForm({...newUserForm, aml: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Date of Birth</label>
                    <input type="date" value={newUserForm.dob} onChange={e => setNewUserForm({...newUserForm, dob: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</label>
                    <select value={newUserForm.nationality} onChange={e => setNewUserForm({...newUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                      <option value="">Select Country</option>
                      {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Switzerland', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Japan', 'South Korea', 'Singapore', 'United Arab Emirates', 'Saudi Arabia', 'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Nigeria', 'Kenya', 'India', 'China'].map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Zip / Postal Code</label>
                    <input type="text" value={newUserForm.zipCode} onChange={e => setNewUserForm({...newUserForm, zipCode: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Occupation</label>
                    <input type="text" value={newUserForm.occupation} onChange={e => setNewUserForm({...newUserForm, occupation: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
               </div>
               
               \\2"""

new_content = re.sub(pattern, clean_form_jsx, content)

# I should also fix the other duplicated bug inside the Settings modal. Let's see if the settings modal also got corrupted:
# `               {['requireCot', 'requireSwift', 'requireImf', 'requireTax', 'requireAml'].map((settingKey) => {`
# Ah wait, I can just rewrite the Settings Modal block as well if needed. But let's check it first.

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(new_content)
