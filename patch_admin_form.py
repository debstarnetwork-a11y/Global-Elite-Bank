with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

old_end_of_form = """                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Type</label>
                    <select value={newUserForm.accountType} onChange={e => setNewUserForm({...newUserForm, accountType: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>
              </div>
              <button onClick={submitNewUser} className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">"""

new_end_of_form = """                  <div>
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
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Card PIN</label>
                    <input type="text" value={newUserForm.pin} onChange={e => setNewUserForm({...newUserForm, pin: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">SWIFT Code</label>
                    <input type="text" value={newUserForm.swift} onChange={e => setNewUserForm({...newUserForm, swift: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">COT Code</label>
                    <input type="text" value={newUserForm.cot} onChange={e => setNewUserForm({...newUserForm, cot: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">IMF Code</label>
                    <input type="text" value={newUserForm.imf} onChange={e => setNewUserForm({...newUserForm, imf: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">TAX Code</label>
                    <input type="text" value={newUserForm.tax} onChange={e => setNewUserForm({...newUserForm, tax: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">AML Code</label>
                    <input type="text" value={newUserForm.aml} onChange={e => setNewUserForm({...newUserForm, aml: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                </div>
              </div>
              <button onClick={submitNewUser} className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">"""

content = content.replace(old_end_of_form, new_end_of_form)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
