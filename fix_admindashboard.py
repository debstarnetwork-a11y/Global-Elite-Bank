import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Replace mockUsers with context users
replacement_start = """
export function AdminDashboard() {
  const { users, updateUserStatus, register } = useBank();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
"""
content = content.replace("export function AdminDashboard() {", replacement_start)

# Filter out the admin user for the table
table_users_replacement = """
            <tbody className="divide-y divide-border">
              {users.filter(u => u.role !== 'admin').map((user) => {
                const balance = user.accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                return (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
"""
content = re.sub(r'<tbody className="divide-y divide-border">[\s\S]*?\{mockUsers\.map\(\(user\) => \{', table_users_replacement, content)

# Update references to user properties in the map function
content = content.replace("{user.tier}", "Premium")
content = content.replace("user.status === 'Active'", "user.status === 'active'")
content = content.replace("{user.status}", "{user.status}")
content = content.replace("{user.balance}", "{balance}")
content = content.replace("{user.kyc}", "Verified")
content = content.replace("{user.risk === 'Low'", "{user.status !== 'suspended'")

# Update actions in handleAdminAction
handle_admin_replacement = """
  const handleAdminAction = (action: string) => {
    showToast('Action Processed', `${action} command executed for ${activeUser?.name}`);
    if (action === 'Freeze Account' && activeUser) {
      updateUserStatus(activeUser.id, 'suspended');
      setActiveUser({...activeUser, status: 'suspended'});
    } else if (action === 'Activate Account' && activeUser) {
      updateUserStatus(activeUser.id, 'active');
      setActiveUser({...activeUser, status: 'active'});
    }
  };

  const handleAddUser = () => {
    register(`New User ${Math.floor(Math.random() * 1000)}`, `user${Math.floor(Math.random() * 1000)}@example.com`);
    showToast('Success', 'New user added successfully');
  };
"""
content = re.sub(r'const handleAdminAction = \(action: string\) => \{[\s\S]*?\};', handle_admin_replacement, content)

# Add "Add New User" button next to "System Settings"
add_user_btn_replacement = """
          <button onClick={handleAddUser} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-sm font-bold hover:bg-emerald-500/20 transition-colors">
            <Users size={16} /> Add New User
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-bold text-foreground hover:border-primary/50 transition-colors">
"""
content = content.replace('<button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-bold text-foreground hover:border-primary/50 transition-colors">', add_user_btn_replacement)

# Update modal references
content = content.replace("activeUser.status === 'Active'", "activeUser.status === 'active'")

# Adjust the freeze button logic in the modal
modal_actions = """
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleAdminAction('Edit Profile')} className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-foreground transition-colors">Edit Profile</button>
                  <button onClick={() => handleAdminAction('View Txns')} className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-foreground transition-colors">View Txns</button>
                  <button onClick={() => handleAdminAction('Generate Slip')} className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-foreground transition-colors">Generate Slip</button>
                  {activeUser.status === 'suspended' ? (
                     <button onClick={() => handleAdminAction('Activate Account')} className="py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-sm font-bold text-emerald-500 transition-colors">Activate Acc</button>
                  ) : (
                     <button onClick={() => handleAdminAction('Freeze Account')} className="py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-sm font-bold text-rose-500 transition-colors">Freeze Acc</button>
                  )}
                </div>
"""
content = re.sub(r'<div className="grid grid-cols-2 gap-3">[\s\S]*?</div>', modal_actions, content)


with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
