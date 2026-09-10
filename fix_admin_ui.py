import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Remove mockUsers
content = re.sub(r'const mockUsers = \[[\s\S]*?\];', '', content)

# Add logout logic to AdminDashboard
if 'const { users,' in content:
    content = content.replace(
        "const { users, updateUserStatus, register, createTransaction, deleteUser, transactions, updateTransactionStatus } = useBank();",
        "const { users, updateUserStatus, register, createTransaction, deleteUser, transactions, updateTransactionStatus, logout } = useBank();"
    )

header_html = """
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Command Center</h2>
          <p className="text-sm text-foreground/60">System overview and client management console.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAddUser} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-sm font-bold hover:bg-emerald-500/20 transition-colors">
            <Users size={16} /> Add New User
          </button>
          <button onClick={() => { logout(); window.location.pathname = '/'; }} className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg text-sm font-bold hover:bg-rose-500/20 transition-colors">
            Logout
          </button>
        </div>
      </div>
"""

content = re.sub(r'<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">[\s\S]*?</div>\s*</div>\s*\{/\* Top Stats \*/\}', header_html.strip() + '\n      {/* Top Stats */}', content)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
