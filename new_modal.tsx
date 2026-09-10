      {isUserModalOpen && currentActiveUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setIsUserModalOpen(false); setIsEditingUser(false); }}></div>
          <div className="relative w-full max-w-xl h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex justify-between items-start bg-background/50">
              <div>
                <h3 className="text-xl font-bold text-foreground">{currentActiveUser.name}</h3>
                <p className="text-sm font-mono text-foreground/50 mt-1">{currentActiveUser.id}</p>
              </div>
              <button onClick={() => { setIsUserModalOpen(false); setIsEditingUser(false); }} className="text-foreground/50 hover:text-foreground bg-white/5 p-2 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isEditingUser ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest border-b border-border pb-2">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Name</label>
                      <input type="text" value={editUserForm.name || ''} onChange={e => setEditUserForm({...editUserForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email</label>
                      <input type="email" value={editUserForm.email || ''} onChange={e => setEditUserForm({...editUserForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Password</label>
                      <input type="text" value={editUserForm.password || ''} onChange={e => setEditUserForm({...editUserForm, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Mobile</label>
                      <input type="text" value={editUserForm.mobile || ''} onChange={e => setEditUserForm({...editUserForm, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Status</label>
                      <select value={editUserForm.status || 'active'} onChange={e => setEditUserForm({...editUserForm, status: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="dormant">Dormant</option>
                        <option value="blocked">Blocked</option>
                        <option value="frozen">Frozen</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Date of Birth</label>
                      <input type="date" value={editUserForm.dob || ''} onChange={e => setEditUserForm({...editUserForm, dob: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</label>
                      <input type="text" value={editUserForm.nationality || ''} onChange={e => setEditUserForm({...editUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Occupation</label>
                      <input type="text" value={editUserForm.occupation || ''} onChange={e => setEditUserForm({...editUserForm, occupation: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Residential Address</label>
                      <input type="text" value={editUserForm.residentialAddress || ''} onChange={e => setEditUserForm({...editUserForm, residentialAddress: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest border-b border-border pb-2 mt-6">Account & Clearance Codes</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Number</label>
                      <input type="text" value={editUserForm.accounts?.[0]?.accountNumber || ''} onChange={e => {
                        const accs = [...(editUserForm.accounts || [])];
                        if (accs.length > 0) accs[0] = { ...accs[0], accountNumber: e.target.value };
                        setEditUserForm({...editUserForm, accounts: accs});
                      }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">IBAN</label>
                      <input type="text" value={editUserForm.accounts?.[0]?.iban || ''} onChange={e => {
                        const accs = [...(editUserForm.accounts || [])];
                        if (accs.length > 0) accs[0] = { ...accs[0], iban: e.target.value };
                        setEditUserForm({...editUserForm, accounts: accs});
                      }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">PIN</label>
                      <input type="text" value={editUserForm.accounts?.[0]?.pin || ''} onChange={e => {
                        const accs = [...(editUserForm.accounts || [])];
                        if (accs.length > 0) accs[0] = { ...accs[0], pin: e.target.value };
                        setEditUserForm({...editUserForm, accounts: accs});
                      }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">SWIFT Code</label>
                      <input type="text" value={editUserForm.accounts?.[0]?.codes?.swift || ''} onChange={e => {
                        const accs = [...(editUserForm.accounts || [])];
                        if (accs.length > 0) accs[0] = { ...accs[0], codes: { ...accs[0].codes, swift: e.target.value } };
                        setEditUserForm({...editUserForm, accounts: accs});
                      }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">COT Code</label>
                      <input type="text" value={editUserForm.accounts?.[0]?.codes?.cot || ''} onChange={e => {
                        const accs = [...(editUserForm.accounts || [])];
                        if (accs.length > 0) accs[0] = { ...accs[0], codes: { ...accs[0].codes, cot: e.target.value } };
                        setEditUserForm({...editUserForm, accounts: accs});
                      }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">TAX Code</label>
                      <input type="text" value={editUserForm.accounts?.[0]?.codes?.tax || ''} onChange={e => {
                        const accs = [...(editUserForm.accounts || [])];
                        if (accs.length > 0) accs[0] = { ...accs[0], codes: { ...accs[0].codes, tax: e.target.value } };
                        setEditUserForm({...editUserForm, accounts: accs});
                      }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">IMF Code</label>
                      <input type="text" value={editUserForm.accounts?.[0]?.codes?.imf || ''} onChange={e => {
                        const accs = [...(editUserForm.accounts || [])];
                        if (accs.length > 0) accs[0] = { ...accs[0], codes: { ...accs[0].codes, imf: e.target.value } };
                        setEditUserForm({...editUserForm, accounts: accs});
                      }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">AML Code</label>
                      <input type="text" value={editUserForm.accounts?.[0]?.codes?.aml || ''} onChange={e => {
                        const accs = [...(editUserForm.accounts || [])];
                        if (accs.length > 0) accs[0] = { ...accs[0], codes: { ...accs[0].codes, aml: e.target.value } };
                        setEditUserForm({...editUserForm, accounts: accs});
                      }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-border mt-6">
                    <button onClick={() => setIsEditingUser(false)} className="flex-1 px-4 py-2 bg-background border border-border text-foreground font-bold rounded-lg hover:bg-white/5">Cancel</button>
                    <button onClick={() => { adminUpdateUser(currentActiveUser.id, editUserForm); setIsEditingUser(false); showToast('User Updated', 'Details saved successfully'); }} className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">Save Changes</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <span className={`flex-1 text-center py-2 border rounded-lg text-xs font-bold uppercase tracking-widest ${currentActiveUser.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                      {currentActiveUser.status}
                    </span>
                    <span className="flex-1 text-center py-2 bg-white/5 text-foreground border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest">Status</span>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Personal & Contact Information</h4>
                    <div className="bg-background border border-border rounded-xl p-4 space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">Email</span>
                        <span className="font-mono text-foreground">{currentActiveUser.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">Mobile</span>
                        <span className="font-mono text-foreground">{currentActiveUser.mobile || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">DOB</span>
                        <span className="text-foreground">{currentActiveUser.dob || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">Nationality</span>
                        <span className="text-foreground">{currentActiveUser.nationality || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">Occupation</span>
                        <span className="text-foreground">{currentActiveUser.occupation || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-foreground/50 flex items-center gap-2">Address</span>
                        <span className="text-foreground text-right max-w-[60%]">{currentActiveUser.residentialAddress || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border">
                        <span className="text-foreground/50 flex items-center gap-2">Password</span>
                        <span className="font-mono text-foreground">{currentActiveUser.password || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Banking & Security Codes</h4>
                    <div className="bg-background border border-border rounded-xl p-4 space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">Account No.</span>
                        <span className="font-mono text-foreground">{currentActiveUser.accounts?.[0]?.accountNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">IBAN</span>
                        <span className="font-mono text-foreground">{currentActiveUser.accounts?.[0]?.iban || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">PIN</span>
                        <span className="font-mono text-foreground">{currentActiveUser.accounts?.[0]?.pin || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border">
                        <span className="text-foreground/50 flex items-center gap-2">SWIFT</span>
                        <span className="font-mono text-foreground">{currentActiveUser.accounts?.[0]?.codes?.swift || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">COT</span>
                        <span className="font-mono text-foreground">{currentActiveUser.accounts?.[0]?.codes?.cot || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">TAX</span>
                        <span className="font-mono text-foreground">{currentActiveUser.accounts?.[0]?.codes?.tax || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">IMF</span>
                        <span className="font-mono text-foreground">{currentActiveUser.accounts?.[0]?.codes?.imf || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2">AML</span>
                        <span className="font-mono text-foreground">{currentActiveUser.accounts?.[0]?.codes?.aml || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Financial Overview</h4>
                    <div className="bg-gradient-to-br from-emerald-500/10 to-primary/10 border border-border rounded-xl p-6 text-center">
                      <p className="text-xs text-foreground/70 uppercase tracking-widest mb-2 font-bold">Estimated Net Worth</p>
                      <p className="text-4xl font-bold text-foreground font-mono">{currentActiveUser.accounts?.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest flex justify-between items-center">
                      Manage Actions
                      <div className="relative group">
                        <button className="text-foreground/50 hover:text-foreground">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1">
                          <button onClick={() => { setIsEditingUser(true); setEditUserForm(currentActiveUser); }} className="w-full text-left px-3 py-2 text-sm font-bold text-foreground hover:bg-white/5 rounded-md">Edit Account</button>
                          <button onClick={() => { deleteUser(currentActiveUser.id); setIsUserModalOpen(false); showToast('User Deleted', 'Account removed successfully'); }} className="w-full text-left px-3 py-2 text-sm font-bold text-rose-500 hover:bg-rose-500/10 rounded-md">Delete Account</button>
                        </div>
                      </div>
                    </h4>
                    
                    <div className="space-y-4 bg-background border border-border rounded-xl p-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Status</label>
                        <select 
                          value={actionForm.status || currentActiveUser.status} 
                          onChange={e => setActionForm({...actionForm, status: e.target.value})} 
                          className="w-full bg-card border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="dormant">Dormant</option>
                          <option value="blocked">Blocked</option>
                          <option value="frozen">Frozen</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Financial Action</label>
                          <select 
                            value={actionForm.type} 
                            onChange={e => setActionForm({...actionForm, type: e.target.value})} 
                            className="w-full bg-card border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none"
                          >
                            <option value="Credit">Credit (+)</option>
                            <option value="Debit">Debit (-)</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Amount</label>
                          <input 
                            type="number" 
                            placeholder="0.00"
                            value={actionForm.amount}
                            onChange={e => setActionForm({...actionForm, amount: e.target.value})} 
                            className="w-full bg-card border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (actionForm.status) {
                            updateUserStatus(currentActiveUser.id, actionForm.status as any);
                          }
                          if (actionForm.amount) {
                            const amt = parseFloat(actionForm.amount);
                            const accountId = currentActiveUser.accounts[0].id;
                            const txnType = actionForm.type === 'Credit' ? 'deposit' : 'transfer_local';
                            createTransaction({
                              userId: currentActiveUser.id,
                              accountId: accountId,
                              type: txnType,
                              amount: amt,
                              status: 'completed',
                              recipientDetails: { note: 'Admin Adjustment' }
                            });
                          }
                          showToast('Success', 'Account updated successfully');
                          setActionForm({ status: '', type: 'Credit', amount: '' });
                        }} 
                        className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Update / Save
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
