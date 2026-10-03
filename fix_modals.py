import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Fix isUserModalOpen end
bad_user_modal_end = """                  <button onClick={() => handleAdminAction('Delete User')} className="py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 transition-colors col-span-2">Delete User</button>
              </div>
            </div>
          </div>
        </div>
      )}"""
good_user_modal_end = """                  <button onClick={() => handleAdminAction('Delete User')} className="py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 transition-colors col-span-2">Delete User</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}"""
content = content.replace(bad_user_modal_end, good_user_modal_end)

# Fix isAddUserModalOpen end
bad_add_user_end = """                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email</label>
                    <input type="email" value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                              <button onClick={submitNewUser} className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Create User
               </button>
            </div>
          </div>
        </div>
      )}"""
good_add_user_end = """                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email</label>
                    <input type="email" value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
               </div>
               <button onClick={submitNewUser} className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Create User
               </button>
            </div>
          </div>
        </div>
      )}"""
content = content.replace(bad_add_user_end, good_add_user_end)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
