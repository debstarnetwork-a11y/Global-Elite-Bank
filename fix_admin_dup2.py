import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# find everything up to `const handleAddUser`
parts = content.split('const handleAddUser = () => {')

correct_top = """import { useState } from 'react';
import { 
  Users, Activity, ShieldAlert, ArrowUpRight, ArrowDownLeft, 
  Search, Filter, MoreHorizontal, CheckCircle, AlertTriangle, 
  Settings, Download, ChevronRight, ChevronLeft, Lock, Mail, X 
} from 'lucide-react';
import { useBank } from '../store';

export function AdminDashboard() {
  const { users, updateUserStatus, register, createTransaction, deleteUser, transactions, updateTransactionStatus, logout } = useBank();
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
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

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(correct_top + 'const handleAddUser = () => {' + parts[1])
