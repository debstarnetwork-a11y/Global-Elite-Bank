import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# I want to change how activeUser gets its data.
# Instead of storing the full user object, maybe store just the ID, and compute activeUser.
# But since I'm lazy, I can just update activeUser with the latest from the `users` array in the render logic.

# Let's replace the `const handleAdminAction = ...` with a cleaner one that does not manually mutate `activeUser` local state since we can just let React re-render.
# Actually, I can just find `const [activeUser, setActiveUser] = useState<any>(null);`
# and add `const currentActiveUser = activeUser ? users.find(u => u.id === activeUser.id) : null;`
# and use `currentActiveUser` everywhere in the modal.

replacement = """
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const currentActiveUser = activeUserId ? users.find(u => u.id === activeUserId) : null;
  const [toastMessage, setToastMessage] = useState<{title: string, message: string} | null>(null);

  const openUserModal = (user: any) => {
    setActiveUserId(user.id);
    setIsUserModalOpen(true);
  };

  const showToast = (title: string, message: string) => {
    setToastMessage({ title, message });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };
  
  const handleAdminAction = (action: string) => {
    showToast('Action Processed', `${action} command executed`);
    if (!currentActiveUser) return;
    
    if (action === 'Freeze Account') {
      updateUserStatus(currentActiveUser.id, 'suspended');
    } else if (action === 'Activate Account') {
      updateUserStatus(currentActiveUser.id, 'active');
    } else if (action === 'Block Account') {
      updateUserStatus(currentActiveUser.id, 'blocked');
    } else if (action === 'Make Dormant') {
      updateUserStatus(currentActiveUser.id, 'dormant');
    } else if (action === 'Delete User') {
      deleteUser(currentActiveUser.id);
      setIsUserModalOpen(false);
    } else if (action === 'Credit Account ($50k)' && currentActiveUser.accounts.length > 0) {
      createTransaction({
        userId: currentActiveUser.id,
        accountId: currentActiveUser.accounts[0].id,
        type: 'deposit',
        amount: 50000,
        status: 'completed'
      });
    } else if (action === 'Debit Account ($10k)' && currentActiveUser.accounts.length > 0) {
      createTransaction({
        userId: currentActiveUser.id,
        accountId: currentActiveUser.accounts[0].id,
        type: 'transfer_wire',
        amount: 10000,
        status: 'completed'
      });
    } else if (action === 'Approve Loan ($100k)' && currentActiveUser.accounts.length > 0) {
      createTransaction({
        userId: currentActiveUser.id,
        accountId: currentActiveUser.accounts[0].id,
        type: 'deposit',
        amount: 100000,
        status: 'completed'
      });
    } else if (action === 'Make Last Txn Pending') {
      const userTxns = transactions.filter(t => t.userId === currentActiveUser.id);
      if (userTxns.length > 0) {
        updateTransactionStatus(userTxns[0].id, 'pending');
      } else {
        showToast('Error', 'No transactions found for this user');
      }
    }
  };
"""

content = re.sub(r'const \[activeUser, setActiveUser\] = useState<any>\(null\);[\s\S]*?\};', replacement.strip(), content)

# Now we must replace all `activeUser` references in the modal with `currentActiveUser`
# First, the check `{isUserModalOpen && activeUser && (` -> `{isUserModalOpen && currentActiveUser && (`
content = content.replace('{isUserModalOpen && activeUser && (', '{isUserModalOpen && currentActiveUser && (')
# Now replace activeUser with currentActiveUser
content = content.replace('activeUser.', 'currentActiveUser.')
content = content.replace('activeUser?.', 'currentActiveUser?.')

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
