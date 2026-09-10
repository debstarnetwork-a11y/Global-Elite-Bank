import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add createTransaction and deleteUser to useBank()
content = content.replace("const { users, updateUserStatus, register } = useBank();", "const { users, updateUserStatus, register, createTransaction, deleteUser } = useBank();")

# Update handleAdminAction
replacement_actions = """
  const handleAdminAction = (action: string) => {
    showToast('Action Processed', `${action} command executed for ${activeUser?.name}`);
    if (action === 'Freeze Account' && activeUser) {
      updateUserStatus(activeUser.id, 'suspended');
      setActiveUser({...activeUser, status: 'suspended'});
    } else if (action === 'Activate Account' && activeUser) {
      updateUserStatus(activeUser.id, 'active');
      setActiveUser({...activeUser, status: 'active'});
    } else if (action === 'Block Account' && activeUser) {
      updateUserStatus(activeUser.id, 'blocked');
      setActiveUser({...activeUser, status: 'blocked'});
    } else if (action === 'Make Dormant' && activeUser) {
      updateUserStatus(activeUser.id, 'dormant');
      setActiveUser({...activeUser, status: 'dormant'});
    } else if (action === 'Delete User' && activeUser) {
      deleteUser(activeUser.id);
      setIsUserModalOpen(false);
    } else if (action === 'Credit Account ($50k)' && activeUser && activeUser.accounts.length > 0) {
      const amount = 50000;
      createTransaction({
        userId: activeUser.id,
        accountId: activeUser.accounts[0].id,
        type: 'deposit',
        amount: amount,
        status: 'completed'
      });
      const updatedUser = {...activeUser};
      updatedUser.accounts[0].balance += amount;
      setActiveUser(updatedUser);
    } else if (action === 'Debit Account ($10k)' && activeUser && activeUser.accounts.length > 0) {
      const amount = 10000;
      createTransaction({
        userId: activeUser.id,
        accountId: activeUser.accounts[0].id,
        type: 'transfer_wire',
        amount: amount,
        status: 'completed'
      });
      const updatedUser = {...activeUser};
      updatedUser.accounts[0].balance -= amount;
      setActiveUser(updatedUser);
    } else if (action === 'Approve Loan ($100k)' && activeUser && activeUser.accounts.length > 0) {
      const amount = 100000;
      createTransaction({
        userId: activeUser.id,
        accountId: activeUser.accounts[0].id,
        type: 'deposit',
        amount: amount,
        status: 'completed'
      });
      const updatedUser = {...activeUser};
      updatedUser.accounts[0].balance += amount;
      setActiveUser(updatedUser);
    }
  };
"""

content = re.sub(r'const handleAdminAction = \(action: string\) => \{[\s\S]*?\};', replacement_actions, content)

# Update Modal actions UI
modal_actions = """
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleAdminAction('Credit Account ($50k)')} className="py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-sm font-bold text-emerald-500 transition-colors">Credit $50k</button>
                  <button onClick={() => handleAdminAction('Debit Account ($10k)')} className="py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-sm font-bold text-rose-500 transition-colors">Debit $10k</button>
                  <button onClick={() => handleAdminAction('Approve Loan ($100k)')} className="py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-sm font-bold text-blue-500 transition-colors">Approve Loan</button>
                  <button onClick={() => handleAdminAction('Activate Account')} className="py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-sm font-bold text-emerald-500 transition-colors">Activate</button>
                  <button onClick={() => handleAdminAction('Freeze Account')} className="py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-sm font-bold text-rose-500 transition-colors">Freeze</button>
                  <button onClick={() => handleAdminAction('Block Account')} className="py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-sm font-bold text-rose-500 transition-colors">Block</button>
                  <button onClick={() => handleAdminAction('Make Dormant')} className="py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-sm font-bold text-amber-500 transition-colors">Make Dormant</button>
                  <button onClick={() => handleAdminAction('Delete User')} className="py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 transition-colors">Delete User</button>
                </div>
"""

content = re.sub(r'<div className="grid grid-cols-2 gap-3">[\s\S]*?</div>', modal_actions, content)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
