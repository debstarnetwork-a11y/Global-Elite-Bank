import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Edit User Form
old_edit_currency = """                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Currency</label>"""

new_edit_address_etc = """                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Country / Nationality</label>
                      <input type="text" value={editUserForm.country || editUserForm.nationality || ''} onChange={e => setEditUserForm({...editUserForm, country: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Residential Address</label>
                      <input type="text" value={editUserForm.residentialAddress || ''} onChange={e => setEditUserForm({...editUserForm, residentialAddress: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Profile Picture URL</label>
                      <input type="text" value={editUserForm.profilePicture || ''} onChange={e => setEditUserForm({...editUserForm, profilePicture: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Currency</label>"""

content = content.replace(old_edit_currency, new_edit_address_etc)


# Add User Form (in the modal further down)
old_add_currency = """                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Currency</label>"""

new_add_address_etc = """                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Country / Nationality</label>
                  <input type="text" value={newUserForm.nationality} onChange={e => setNewUserForm({...newUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Residential Address</label>
                  <input type="text" value={newUserForm.residentialAddress} onChange={e => setNewUserForm({...newUserForm, residentialAddress: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Profile Picture URL</label>
                  <input type="text" value={newUserForm.profilePicture || ''} onChange={e => setNewUserForm({...newUserForm, profilePicture: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Currency</label>"""

content = content.replace(old_add_currency, new_add_address_etc)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("Updated AdminDashboard forms with profile fields")
