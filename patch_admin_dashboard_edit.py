import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Replace Premium with Status
content = content.replace(
"""<span className="inline-block px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-foreground/70 uppercase">
                          Premium
                        </span>""",
"""<span className="inline-block px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-foreground/70 uppercase">
                          Status
                        </span>"""
)

content = content.replace(
"""<span className="flex-1 text-center py-2 bg-white/5 text-foreground border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest">Premium</span>""",
"""<span className="flex-1 text-center py-2 bg-white/5 text-foreground border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest">Status</span>"""
)

# Add isEditing state
content = content.replace(
"""  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);""",
"""  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editUserForm, setEditUserForm] = useState<any>({});"""
)

# Bring adminUpdateUser in destructuring
content = content.replace(
"""  const { users, updateUserStatus, adminCreateUser, createTransaction, deleteUser, transactions, updateTransactionStatus, logout, adminSettings, updateAdminSettings } = useBank();""",
"""  const { users, adminUpdateUser, updateUserStatus, adminCreateUser, createTransaction, deleteUser, transactions, updateTransactionStatus, logout, adminSettings, updateAdminSettings } = useBank();"""
)

# Bind 'Edit' button inside user list
content = content.replace(
"""<button onClick={() => openUserModal(user)} className="w-full text-left px-3 py-2 text-sm font-bold text-foreground hover:bg-white/5 rounded-md">Edit</button>""",
"""<button onClick={() => { openUserModal(user); setIsEditingUser(true); setEditUserForm(user); }} className="w-full text-left px-3 py-2 text-sm font-bold text-foreground hover:bg-white/5 rounded-md">Edit</button>"""
)

# Bind 'Edit Account' inside user modal
content = content.replace(
"""<button className="w-full text-left px-3 py-2 text-sm font-bold text-foreground hover:bg-white/5 rounded-md">Edit Account</button>""",
"""<button onClick={() => { setIsEditingUser(true); setEditUserForm(currentActiveUser); }} className="w-full text-left px-3 py-2 text-sm font-bold text-foreground hover:bg-white/5 rounded-md">Edit Account</button>"""
)

# Handle close user modal correctly
content = content.replace(
"""<button onClick={() => setIsUserModalOpen(false)} className="text-foreground/50 hover:text-foreground bg-white/5 p-2 rounded-full transition-colors">""",
"""<button onClick={() => { setIsUserModalOpen(false); setIsEditingUser(false); }} className="text-foreground/50 hover:text-foreground bg-white/5 p-2 rounded-full transition-colors">"""
)

# Handle background click close correctly
content = content.replace(
"""<div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)}></div>""",
"""<div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setIsUserModalOpen(false); setIsEditingUser(false); }}></div>"""
)


# Replace the content of the user modal
modal_content = """
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isEditingUser ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Name</label>
                    <input type="text" value={editUserForm.name || ''} onChange={e => setEditUserForm({...editUserForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email</label>
                    <input type="email" value={editUserForm.email || ''} onChange={e => setEditUserForm({...editUserForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Password</label>
                    <input type="text" value={editUserForm.password || ''} onChange={e => setEditUserForm({...editUserForm, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Mobile</label>
                    <input type="text" value={editUserForm.mobile || ''} onChange={e => setEditUserForm({...editUserForm, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Status</label>
                    <select value={editUserForm.status || 'active'} onChange={e => setEditUserForm({...editUserForm, status: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="dormant">Dormant</option>
                      <option value="blocked">Blocked</option>
                      <option value="frozen">Frozen</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
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
                    <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Contact Information</h4>
                    <div className="bg-background border border-border rounded-xl p-4 space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2"><Mail size={14}/> Email</span>
                        <span className="font-mono text-foreground">{currentActiveUser.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2"><Lock size={14}/> Password</span>
                        <span className="font-mono text-foreground">{currentActiveUser.password || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground/50 flex items-center gap-2"><Lock size={14}/> Joined</span>
                        <span className="text-foreground">Recent</span>
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
"""

content = re.sub(r'<div className="flex-1 overflow-y-auto p-6 space-y-6">.*?</h4>', modal_content, content, flags=re.DOTALL)


with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)

