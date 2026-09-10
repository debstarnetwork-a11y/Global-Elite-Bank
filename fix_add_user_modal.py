import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# I will find the Add New User Modal completely and replace it
add_new_user_modal = """      {/* Add New User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAddUserModalOpen(false)}></div>
          <div className="relative w-full max-w-xl h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex justify-between items-start bg-background/50">
              <div>
                <h3 className="text-xl font-bold text-foreground">Create New Client</h3>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-foreground/50 hover:text-foreground bg-white/5 p-2 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Full Name</label>
                  <input type="text" value={newUserForm.name} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email Address</label>
                  <input type="email" value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Password</label>
                  <input type="text" value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Mobile Number</label>
                  <input type="text" value={newUserForm.mobile} onChange={e => setNewUserForm({...newUserForm, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Date of Birth</label>
                  <input type="date" value={newUserForm.dob} onChange={e => setNewUserForm({...newUserForm, dob: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</label>
                  <input type="text" value={newUserForm.nationality} onChange={e => setNewUserForm({...newUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Zip Code</label>
                  <input type="text" value={newUserForm.zipCode} onChange={e => setNewUserForm({...newUserForm, zipCode: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Occupation</label>
                  <input type="text" value={newUserForm.occupation} onChange={e => setNewUserForm({...newUserForm, occupation: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Residential Address</label>
                  <input type="text" value={newUserForm.residentialAddress} onChange={e => setNewUserForm({...newUserForm, residentialAddress: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Currency</label>
                    <select value={newUserForm.currency} onChange={e => setNewUserForm({...newUserForm, currency: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CHF">CHF (₣)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Type</label>
                    <select value={newUserForm.accountType} onChange={e => setNewUserForm({...newUserForm, accountType: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>
                
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest border-b border-border pb-2 mt-4">Generated Banking Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Number</label>
                    <input type="text" value={newUserForm.accountNumber} onChange={e => setNewUserForm({...newUserForm, accountNumber: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">4 Digit Transaction Pin</label>
                    <input type="text" value={newUserForm.pin} onChange={e => setNewUserForm({...newUserForm, pin: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">SWIFT-SEC Code</label>
                    <input type="text" value={newUserForm.swift} onChange={e => setNewUserForm({...newUserForm, swift: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">COT Code</label>
                    <input type="text" value={newUserForm.cot} onChange={e => setNewUserForm({...newUserForm, cot: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">IMF Clearance Code</label>
                    <input type="text" value={newUserForm.imf} onChange={e => setNewUserForm({...newUserForm, imf: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">TAX Code</label>
                    <input type="text" value={newUserForm.tax} onChange={e => setNewUserForm({...newUserForm, tax: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">AML-PASS Code</label>
                    <input type="text" value={newUserForm.aml} onChange={e => setNewUserForm({...newUserForm, aml: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                </div>
              </div>
              <button onClick={submitNewUser} className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}"""

# Replace anything from {/* Add New User Modal */} up to the first {/* General Admin Settings Modal */}
content = re.sub(r'\{\/\* Add New User Modal \*\/\}.*?(?=\{\/\* General Admin Settings Modal \*\/)', add_new_user_modal + '\n      ', content, flags=re.DOTALL)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)

