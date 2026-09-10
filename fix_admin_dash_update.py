import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

old_action_block = """                  <button 
                    onClick={() => {
                      if (actionForm.status) {
                        updateUserStatus(currentActiveUser.id, actionForm.status as any);
                      }
                      if (actionForm.amount) {
                        const amt = parseFloat(actionForm.amount);
                        const accountId = currentActiveUser.accounts[0].id;
                        createTransaction(accountId, actionForm.type.toLowerCase() as any, amt, 'Admin Adjustment');
                      }
                      showToast('Success', 'Account updated successfully');
                      setActionForm({ status: '', type: 'Credit', amount: '' });
                    }} """

new_action_block = """                  <button 
                    onClick={() => {
                      if (actionForm.status) {
                        updateUserStatus(currentActiveUser.id, actionForm.status as any);
                      }
                      if (actionForm.amount) {
                        const amt = parseFloat(actionForm.amount);
                        const accountId = currentActiveUser.accounts[0].id;
                        const txnType = actionForm.type === 'Credit' ? 'deposit' : 'transfer_local';
                        createTransaction({
                          userId: currentActiveUser.id,
                          accountId: accountId,
                          type: txnType,
                          amount: amt,
                          status: 'completed',
                          recipientDetails: { note: 'Admin Adjustment' }
                        });
                      }
                      showToast('Success', 'Account updated successfully');
                      setActionForm({ status: '', type: 'Credit', amount: '' });
                    }} """

content = content.replace(old_action_block, new_action_block)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
