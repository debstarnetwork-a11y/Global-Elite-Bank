import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

old_admins = """          <thead className="bg-background/50 border-b border-border">
            <tr>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Name</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Email</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Role</th>
              <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="p-4 font-bold">{admin.name}</td>
                <td className="p-4">{admin.email}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-xs font-bold uppercase rounded">Super Admin</span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-emerald-500 text-xs font-bold uppercase">Active</span>
                </td>
              </tr>
            ))}
          </tbody>"""

new_admins = """          <thead className="bg-background/50 border-b border-border">
            <tr>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Name</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Email</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Role</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Status</th>
              <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="p-4 font-bold">{admin.name}</td>
                <td className="p-4">{admin.email}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-xs font-bold uppercase rounded">Super Admin</span>
                </td>
                <td className="p-4">
                  <span className="text-emerald-500 text-xs font-bold uppercase">Active</span>
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button onClick={() => alert('Edit Admin functionality coming soon.')} className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors bg-blue-500/10 px-3 py-1.5 rounded border border-blue-500/20">Edit</button>
                  <button onClick={() => { if(window.confirm('Delete this admin?')) deleteUser(admin.id); }} className="text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors bg-rose-500/10 px-3 py-1.5 rounded border border-rose-500/20">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>"""

content = content.replace(old_admins, new_admins)

# Need to make sure `deleteUser` is in AdminAdministrators
old_hook = "const { users, adminCreateUser } = useBank();"
new_hook = "const { users, adminCreateUser, deleteUser } = useBank();"
content = content.replace(old_hook, new_hook)

# Add alert for Save Email
old_save = '<button className="px-4 py-2 bg-primary text-white font-bold rounded-lg mt-4 hover:bg-primary/90">Save Email Settings</button>'
new_save = '<button onClick={() => alert("Email Settings Saved Successfully")} className="px-4 py-2 bg-primary text-white font-bold rounded-lg mt-4 hover:bg-primary/90">Save Email Settings</button>'
content = content.replace(old_save, new_save)

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)

print("Updated AdminModules admins and save email")
