import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# I will find the first `const handleAdminAction = ...` ending and then chop out the duplicate block.
# Actually I can just do a replace of the duplicate block.

bad_block = """  const showToast = (title: string, message: string) => {
    setToastMessage({ title, message });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };
    
  const handleAdminAction = (action: string) => {
    showToast('Action Processed', `${action} command executed for ${currentActiveUser?.name}`);
    if (action === 'Freeze Account' && activeUser) {
      updateUserStatus(currentActiveUser.id, 'suspended');
      setActiveUser({...activeUser, status: 'suspended'});
    } else if (action === 'Activate Account' && activeUser) {
      updateUserStatus(currentActiveUser.id, 'active');
      setActiveUser({...activeUser, status: 'active'});
    } else if (action === 'Block Account' && activeUser) {
      updateUserStatus(currentActiveUser.id, 'blocked');
      setActiveUser({...activeUser, status: 'blocked'});
    } else if (action === 'Make Dormant' && activeUser) {
      updateUserStatus(currentActiveUser.id, 'dormant');
      setActiveUser({...activeUser, status: 'dormant'});
    } else if (action === 'Delete User' && activeUser) {
      deleteUser(currentActiveUser.id);
      setIsUserModalOpen(false);
    } else if (action === 'Credit Account ($50k)' && activeUser && currentActiveUser.accounts.length > 0) {
      const amount = 50000;
      createTransaction({
        userId: currentActiveUser.id,
        accountId: currentActiveUser.accounts[0].id,
        type: 'deposit',
        amount: amount,
        status: 'completed'
      });
      const updatedUser = {...activeUser};
      updatedUser.accounts[0].balance += amount;
      setActiveUser(updatedUser);
    } else if (action === 'Debit Account ($10k)' && activeUser && currentActiveUser.accounts.length > 0) {
      const amount = 10000;
      createTransaction({
        userId: currentActiveUser.id,
        accountId: currentActiveUser.accounts[0].id,
        type: 'transfer_wire',
        amount: amount,
        status: 'completed'
      });
      const updatedUser = {...activeUser};
      updatedUser.accounts[0].balance -= amount;
      setActiveUser(updatedUser);
    } else if (action === 'Approve Loan ($100k)' && activeUser && currentActiveUser.accounts.length > 0) {
      const amount = 100000;
      createTransaction({
        userId: currentActiveUser.id,
        accountId: currentActiveUser.accounts[0].id,
        type: 'deposit',
        amount: amount,
        status: 'completed'
      });
      const updatedUser = {...activeUser};
      updatedUser.accounts[0].balance += amount;
      setActiveUser(updatedUser);
    } else if (action === 'Make Last Txn Pending' && activeUser) {
      const userTxns = transactions.filter(t => t.userId === currentActiveUser.id);
      if (userTxns.length > 0) {
        updateTransactionStatus(userTxns[0].id, 'pending');
      } else {
        showToast('Error', 'No transactions found for this user');
      }
    }
  };"""

# It's better to just use a regex to delete everything from the second `const showToast` to the end of the second `handleAdminAction` function.
# Or just rewrite the whole component cleanly. Since it's getting messy, I'll rewrite the start of AdminDashboard up to `const handleAddUser`.

