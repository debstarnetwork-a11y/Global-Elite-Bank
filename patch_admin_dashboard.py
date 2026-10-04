import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# The profile picture input looks like this:
# <input type="text" value={editUserForm.profilePicture || ''} onChange={e => setEditUserForm({...editUserForm, profilePicture: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />

old_admin_input = """<input type="text" value={editUserForm.profilePicture || ''} onChange={e => setEditUserForm({...editUserForm, profilePicture: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />"""

new_admin_input = """<input type="text" value={editUserForm.profilePicture || ''} onChange={e => {
                        let val = e.target.value;
                        const imgMatch = val.match(/<img[^>]+src=["']([^"']+)["']/i);
                        if (imgMatch) val = imgMatch[1];
                        setEditUserForm({...editUserForm, profilePicture: val});
                      }} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" placeholder="Paste image URL or HTML tag..." />"""

content = content.replace(old_admin_input, new_admin_input)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
print("Updated AdminDashboard")
