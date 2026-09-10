import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add transactions and updateTransactionStatus to useBank()
content = content.replace("const { users, updateUserStatus, register, createTransaction, deleteUser } = useBank();", "const { users, updateUserStatus, register, createTransaction, deleteUser, transactions, updateTransactionStatus } = useBank();")

# Update handleAdminAction to add Make Pending
pending_logic = """
    } else if (action === 'Make Last Txn Pending' && activeUser) {
      const userTxns = transactions.filter(t => t.userId === activeUser.id);
      if (userTxns.length > 0) {
        updateTransactionStatus(userTxns[0].id, 'pending');
      } else {
        showToast('Error', 'No transactions found for this user');
      }
    }
  };
"""
content = re.sub(r'\} else if \(action === \'Approve Loan \(\$100k\)\'[\s\S]*?\};\n  \};', "} else if (action === 'Approve Loan ($100k)' && activeUser && activeUser.accounts.length > 0) {\n      const amount = 100000;\n      createTransaction({\n        userId: activeUser.id,\n        accountId: activeUser.accounts[0].id,\n        type: 'deposit',\n        amount: amount,\n        status: 'completed'\n      });\n      const updatedUser = {...activeUser};\n      updatedUser.accounts[0].balance += amount;\n      setActiveUser(updatedUser);\n" + pending_logic, content)


# Add button to Modal UI
modal_actions = """
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleAdminAction('Credit Account ($50k)')} className="py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-sm font-bold text-emerald-500 transition-colors">Credit $50k</button>
                  <button onClick={() => handleAdminAction('Debit Account ($10k)')} className="py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-sm font-bold text-rose-500 transition-colors">Debit $10k</button>
                  <button onClick={() => handleAdminAction('Approve Loan ($100k)')} className="py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-sm font-bold text-blue-500 transition-colors">Approve Loan</button>
                  <button onClick={() => handleAdminAction('Make Last Txn Pending')} className="py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-sm font-bold text-amber-500 transition-colors">Set Txn Pending</button>
                  <button onClick={() => handleAdminAction('Activate Account')} className="py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-sm font-bold text-emerald-500 transition-colors">Activate</button>
                  <button onClick={() => handleAdminAction('Freeze Account')} className="py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-sm font-bold text-rose-500 transition-colors">Freeze</button>
                  <button onClick={() => handleAdminAction('Block Account')} className="py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-sm font-bold text-rose-500 transition-colors">Block</button>
                  <button onClick={() => handleAdminAction('Make Dormant')} className="py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-sm font-bold text-amber-500 transition-colors">Make Dormant</button>
                  <button onClick={() => handleAdminAction('Delete User')} className="py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 transition-colors col-span-2">Delete User</button>
                </div>
"""

content = re.sub(r'<div className="grid grid-cols-2 gap-3">[\s\S]*?</div>', modal_actions, content)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
