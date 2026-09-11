import React, { useState, ChangeEvent } from 'react';
import { 
  Users, Activity, ShieldAlert, ArrowUpRight, ArrowDownLeft, TrendingUp, 
  Search, Filter, MoreHorizontal, CheckCircle, AlertTriangle, 
  Settings, Download, ChevronRight, ChevronLeft, Lock, Mail, X, Upload
, UserPlus, FileText, FilePlus, Repeat, Clock, CreditCard, Menu, Image as ImageIcon, Save, Plus, Trash, MessageSquare, ArrowLeft} from 'lucide-react';
import { useBank } from '../store';

import { AdminSettingsView } from './AdminSettingsView';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { validateNewPassword } from '../utils/passwordStrength';
import { 
  AdminApplications, AdminGrantApplications, AdminLoanApplications, 
  AdminTransactionsHistory, AdminVirtualCards, AdminVirtualCardSettings, AdminEmailServices, AdminAdministrators, AdminManageUsers, AdminContactInquiries, AdminInvestors
} from './AdminModules';

export function AdminDashboard() {
  const { users, adminUpdateUser, updateUserStatus, adminCreateUser, createTransaction, deleteUser, transactions, updateTransactionStatus, logout, adminSettings, updateAdminSettings, userApplications, updateUserApplicationStatus, currentUser } = useBank();
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const currentActiveUser = activeUserId ? users.find(u => u.id === activeUserId) : null;
  const [toastMessage, setToastMessage] = useState<{title: string, message: string} | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');

    const [isGeneralSettingsModalOpen, setIsGeneralSettingsModalOpen] = useState(false);
  const [isSystemSettingsModalOpen, setIsSystemSettingsModalOpen] = useState(false);
  const [actionForm, setActionForm] = useState({ status: '', type: 'Credit', amount: '' });
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editUserForm, setEditUserForm] = useState<any>({});
  const [newUserForm, setNewUserForm] = useState({
    name: '', email: '', mobile: '', currency: 'USD', accountType: 'Checking',
    accountNumber: '', btcWallet: '', pin: '', cot: '', swift: '', imf: '', tax: '', aml: '',
    dob: '', nationality: '', password: '', zipCode: '', occupation: '', residentialAddress: '',
    passportPhoto: ''
  });

  const handlePassportPhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File too large', 'Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setNewUserForm(prev => ({ ...prev, passportPhoto: base64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePassportPhotoInputPaste = (input: string) => {
    let cleanUrl = input.trim();
    // If HTML <img> tag was pasted, extract src attribute
    const srcMatch = cleanUrl.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      cleanUrl = srcMatch[1];
    }
    setNewUserForm(prev => ({ ...prev, passportPhoto: cleanUrl }));
  };

  const handleEditPassportPhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File too large', 'Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setEditUserForm(prev => ({ ...prev, profilePicture: base64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPassportPhotoInputPaste = (input: string) => {
    let cleanUrl = input.trim();
    const srcMatch = cleanUrl.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      cleanUrl = srcMatch[1];
    }
    setEditUserForm(prev => ({ ...prev, profilePicture: cleanUrl }));
  };

  const generateRandomCode = (prefix: string, length: number) => {
    return prefix + Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  };

  const showToast = (title: string, message: string) => {
    setToastMessage({ title, message });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenAddUser = () => {
    setNewUserForm({
      name: '', email: '', mobile: '', currency: 'USD', accountType: 'Checking',
      accountNumber: generateRandomCode('', 11),
      btcWallet: '', pin: generateRandomCode('', 4),
      cot: generateRandomCode('', 7), swift: generateRandomCode('', 7),
      imf: generateRandomCode('', 6), tax: generateRandomCode('GEB', 5),
      aml: generateRandomCode('AML', 5), dob: '', nationality: '', password: '', zipCode: '', occupation: '', residentialAddress: '',
      passportPhoto: ''
    });
    setIsAddUserModalOpen(true);
  };

  const handleOpenAddUserForApplicant = (app: any) => {
    setNewUserForm({
      name: app.name || '',
      email: app.email || '',
      mobile: app.mobile || app.phone || '+41 44 215 5000',
      currency: app.currency || 'USD',
      accountType: app.accountType || 'Checking',
      accountNumber: generateRandomCode('', 11),
      btcWallet: '',
      pin: generateRandomCode('', 4),
      cot: generateRandomCode('', 7),
      swift: generateRandomCode('', 7),
      imf: generateRandomCode('', 6),
      tax: generateRandomCode('GEB', 5),
      aml: generateRandomCode('AML', 5),
      dob: app.dob || '1985-06-15',
      nationality: app.country || app.nationality || 'Switzerland',
      password: app.password || 'SecurePass2026!',
      zipCode: app.zipCode || '8001',
      occupation: app.occupation || 'Private Investor / Executive',
      residentialAddress: app.residentialAddress || app.address || 'Bahnhofstrasse 45, 8001 Zurich',
      passportPhoto: app.profilePicture || app.passportPhoto || ''
    });
    setIsAddUserModalOpen(true);
  };

  const submitNewUser = () => {
    const requiredFields = ['name', 'email', 'password', 'mobile', 'dob', 'nationality', 'zipCode', 'occupation', 'residentialAddress', 'currency', 'accountType', 'accountNumber', 'pin', 'swift', 'cot', 'imf', 'tax', 'aml'];
    const missingField = requiredFields.find(field => !newUserForm[field as keyof typeof newUserForm]);
    
    if (missingField) {
       showToast('Error', 'Please fill out all fields before submitting');
       return;
    }

    const pwdCheck = validateNewPassword(newUserForm.password);
    if (!pwdCheck.valid) {
       showToast('Weak Password', pwdCheck.error || 'Password must be at least 6 characters long with a mix of characters');
       return;
    }

    const trimmedAccNumber = newUserForm.accountNumber.trim();
    const accExists = users
      .filter(u => u.role !== 'admin')
      .flatMap(u => u.accounts || [])
      .some(a => a.accountNumber?.trim() === trimmedAccNumber);

    if (accExists) {
      showToast('Duplicate Account', `Account number ${trimmedAccNumber} already belongs to an existing client.`);
      return;
    }

    adminCreateUser({
      name: newUserForm.name,
      email: newUserForm.email,
      password: newUserForm.password || 'password123',
      role: 'user',
      status: 'inactive',
      showFullCardDetails: false,
      mobile: newUserForm.mobile,
      currency: newUserForm.currency,
      btcWallet: newUserForm.btcWallet,
      dob: newUserForm.dob,
      nationality: newUserForm.nationality,
      country: newUserForm.nationality,
      zipCode: newUserForm.zipCode,
      occupation: newUserForm.occupation,
      residentialAddress: newUserForm.residentialAddress,
      profilePicture: newUserForm.passportPhoto || (newUserForm as any).profilePicture || '',
      accounts: [{
        id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: newUserForm.accountType as 'Checking' | 'Savings' | 'Business',
        accountNumber: trimmedAccNumber,
        iban: `CH93 0000 0000 ${trimmedAccNumber.substring(0, 4)}`,
        balance: 0,
        pin: newUserForm.pin,
        codes: {
          swift: newUserForm.swift,
          cot: newUserForm.cot,
          tax: newUserForm.tax,
          imf: newUserForm.imf,
          aml: newUserForm.aml
        }
      }]
    });

    // Mark matching applicant application as approved if one exists
    const matchingApp = userApplications.find(a => a.email.trim().toLowerCase() === newUserForm.email.trim().toLowerCase());
    if (matchingApp && matchingApp.status !== 'approved') {
      updateUserApplicationStatus(matchingApp.id, 'approved');
    }

    setIsAddUserModalOpen(false);
    showToast('Success', 'Bank account provisioned successfully');
  };

  const openUserModal = (user: any) => {
    setActiveUserId(user.id);
    setIsUserModalOpen(true);
  };

  const copyUserDetails = (user: any) => {
    const balance = user.accounts?.reduce((sum: number, acc: any) => sum + acc.balance, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00';
    const creationTs = user.id.startsWith('user-') ? parseInt(user.id.replace('user-', '')) : Date.now();
    const registeredDate = new Date(creationTs).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
    });
    const kycStatus = user.status === 'suspended' || user.status === 'blocked' ? 'Pending' : 'Verified';
    
    const details = `${user.name}
 
Fiat Balance
${balance}

Bitcoin Balance
0.00000000 BTC

Account Limit
$300,000

Grant Limit
$0

Loans
No Loan

KYC
${kycStatus}
USER INFORMATION
Fullname
${user.name}
Email Address
${user.email}
Mobile Number
${user.mobile || ''}
Zip / Postal Code
${user.zipCode || ''}
Occupation
${user.occupation || ''}
Date of Birth
${user.dob || ''}
Residential Address
${user.residentialAddress || ''}
Nationality
${user.nationality || ''}
Account Type
${user.accounts?.[0]?.type || 'Checking'}
Currency
${user.currency || 'USD'}
Account Number
${user.accounts?.[0]?.accountNumber || ''}
Bitcoin Wallet Address
${user.btcWallet || ''}
4 Digit Transaction Pin
${user.accounts?.[0]?.pin || ''}

COT Code
${user.accounts?.[0]?.codes?.cot || ''}
SWIFT-SEC Code
${user.accounts?.[0]?.codes?.swift || ''}
IMF Clearance Code
${user.accounts?.[0]?.codes?.imf || ''}
TAX Code
${user.accounts?.[0]?.codes?.tax || ''}
AML-PASS Code
${user.accounts?.[0]?.codes?.aml || ''}
Date of birth
${user.dob || ''}
Nationality
${user.nationality || ''}
Registered
${registeredDate}
All Rights Reserved © Global Elite
 2026`;
    navigator.clipboard.writeText(details);
    showToast('Copied to Clipboard', 'User details have been copied');
  };


  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'manage-users', label: 'Manage Users', icon: Users },
    { id: 'investors', label: 'Investors Management', icon: TrendingUp },
    { id: 'grant-applications', label: 'Grant Applications', icon: FileText, subItems: ['All Applications', 'Processing', 'Approved', 'Rejected', 'Disbursed'] },
    { id: 'new-user-apps', label: 'New User Application(s)', icon: FilePlus },
    { id: 'contact-inquiries', label: 'Contact Inquiries', icon: MessageSquare },
    { id: 'transfer-txns', label: 'Transfer Transactions', icon: Repeat },
    { id: 'txn-history', label: 'Transaction History', icon: Clock },
    { id: 'user-deposits', label: 'Users Deposits', icon: Download },
    { id: 'loan-apps', label: 'Loan Applications', icon: FileText },
    { id: 'virtual-cards', label: 'Virtual Cards', icon: CreditCard, subItems: ['All Cards', 'Pending Applications', 'Card Settings'] },
    { id: 'email-services', label: 'Gallery & Email Services', icon: Mail },
    { id: 'administrators', label: 'Administrator(s)', icon: ShieldAlert },
  ];

  const renderSidebarItem = (item: any) => {
    const isActive = currentView === item.id;
    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (item.id === 'create-user') {
              handleOpenAddUser();
            } else {
              setCurrentView(item.id);
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            isActive ? 'bg-primary text-white' : 'text-foreground/70 hover:bg-white/5 hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon size={18} className={isActive ? 'text-white' : 'text-foreground/50'} />
            <span>{item.label}</span>
          </div>
        </button>
        {item.subItems && (
          <div className="pl-10 mt-1 space-y-1">
            {item.subItems.map((sub: string) => (
              <button 
                key={sub} 
                onClick={() => setCurrentView(`${item.id}-${sub.toLowerCase().replace(' ', '-')}`)}
                className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  currentView === `${item.id}-${sub.toLowerCase().replace(' ', '-')}` 
                    ? 'text-primary bg-primary/10' 
                    : 'text-foreground/50 hover:text-foreground hover:bg-white/5'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>
    );
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
    }
  };

  // Filter clients: STRICT REQUIREMENT:
  // A new applicant whether rejected or approved CANNOT be allowed to appear here
  // until bank account has been created for him. Avoid duplicates of accounts in this list.
  const validDirectoryClients = users.filter(u => {
    if (u.role === 'admin') return false;
    // Must have at least one valid bank account created
    if (!u.accounts || !Array.isArray(u.accounts) || u.accounts.length === 0) return false;
    return u.accounts.some(acc => Boolean(acc?.accountNumber && acc.accountNumber.trim().length > 0));
  });

  // Deduplicate clients and accounts to avoid duplicate accounts in this list
  const dirSeenEmails = new Set<string>();
  const dirSeenAccountNumbers = new Set<string>();
  const uniqueDirectoryClients = validDirectoryClients.filter(c => {
    const emailKey = (c.email || '').trim().toLowerCase();
    if (emailKey && dirSeenEmails.has(emailKey)) return false;
    if (emailKey) dirSeenEmails.add(emailKey);

    const primaryAcc = c.accounts?.[0]?.accountNumber?.trim();
    if (primaryAcc && dirSeenAccountNumbers.has(primaryAcc)) return false;
    if (primaryAcc) dirSeenAccountNumbers.add(primaryAcc);

    return true;
  });

  const displayedDirectoryClients = uniqueDirectoryClients.filter(c => {
    const term = clientSearchTerm.toLowerCase().trim();
    if (!term) return true;
    const accNum = c.accounts?.[0]?.accountNumber?.toLowerCase() || '';
    return c.name.toLowerCase().includes(term) ||
           c.email.toLowerCase().includes(term) ||
           c.id.toLowerCase().includes(term) ||
           accNum.includes(term);
  });

  return (
    <>
    <div className="flex h-screen bg-background text-foreground overflow-hidden w-full absolute inset-0 z-[100]">
      {/* Sidebar - Desktop */}
      <div className="w-64 bg-card border-r border-border overflow-y-auto flex-col h-full shrink-0 hidden lg:flex">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <img
            src={adminSettings?.logoUrl || 'https://i.ibb.co/G3NmLY1j/GEB-logo.png'}
            alt="Bank Logo"
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://i.ibb.co/G3NmLY1j/GEB-logo.png';
            }}
          />
          <h1 className="text-xl font-bold text-foreground">Admin</h1>
        </div>
        <div className="flex-1 py-4 flex flex-col px-3">
          {navItems.map(renderSidebarItem)}
        </div>
      </div>
      
      {/* Sidebar - Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-64 bg-card h-full flex flex-col border-r border-border shadow-2xl animate-in slide-in-from-left">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={adminSettings?.logoUrl || 'https://i.ibb.co/G3NmLY1j/GEB-logo.png'}
                  alt="Bank Logo"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://i.ibb.co/G3NmLY1j/GEB-logo.png';
                  }}
                />
                <h1 className="text-xl font-bold text-foreground">Admin</h1>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-foreground/50 hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 py-4 overflow-y-auto px-3">
              {navItems.map(renderSidebarItem)}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="p-4 border-b border-border bg-card flex items-center justify-between lg:hidden shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-foreground/70 hover:text-foreground rounded-lg hover:bg-white/5">
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold">Admin Portal</h1>
          <div className="w-8"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {currentView === 'dashboard' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Admin Portal</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
              <ShieldAlert size={13} />
              <span>Admin: {currentUser?.email || 'mizbryo@gmail.com'}</span>
            </span>
          </div>
          <p className="text-sm text-foreground/60 mt-0.5">System overview, crypto management, and client directory console.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => { window.location.pathname = '/'; }} className="flex items-center gap-1.5 px-3.5 py-2 bg-foreground/5 border border-border text-foreground/80 rounded-lg text-sm font-bold hover:bg-foreground/10 transition-colors">
            <ArrowLeft size={16} /> Exit to App
          </button>
          <button onClick={() => setCurrentView('contact-inquiries')} className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-lg text-sm font-bold hover:bg-purple-500/20 transition-colors">
            <MessageSquare size={16} /> Contact Inquiries
          </button>
          <button onClick={() => setCurrentView('settings')} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg text-sm font-bold hover:bg-blue-500/20 transition-colors">
            <Settings size={16} /> App Settings
          </button>
          <button onClick={handleOpenAddUser} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-sm font-bold hover:bg-emerald-500/20 transition-colors">
            <Users size={16} /> Add New User
          </button>
          <button onClick={() => { logout(); window.location.pathname = '/'; }} className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg text-sm font-bold hover:bg-rose-500/20 transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total AUM', value: '$4.2B', trend: '+2.4%', icon: Activity, color: 'text-emerald-500' },
          { label: 'Active Clients', value: '1,248', trend: '+12', icon: Users, color: 'text-primary' },
          { label: 'Pending KYC', value: '34', trend: '-5', icon: ShieldAlert, color: 'text-amber-500' },
          { label: 'Flagged Txns', value: '7', trend: 'Requires Action', icon: AlertTriangle, color: 'text-rose-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.color === 'text-rose-500' ? 'text-rose-500 bg-rose-500/10' : 'text-emerald-500 bg-emerald-500/10'} px-2 py-1 rounded`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground font-mono">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Client Management Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-background/50">
          <h3 className="font-bold text-foreground">Client Directory</h3>
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input 
                type="text" 
                placeholder="Search ID, Name, Email, Account #..." 
                value={clientSearchTerm}
                onChange={e => setClientSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-primary outline-none text-foreground font-medium"
              />
            </div>
            <button className="px-4 py-2.5 bg-background border border-border rounded-lg text-foreground hover:border-primary/50 transition-colors flex items-center gap-2 font-bold text-sm">
              <Filter size={16} /> <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-background/80 border-b border-border">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50">Client Info</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50">Status & Tier</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50">Total Balance</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50">KYC & Risk</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-border">
              {displayedDirectoryClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground/50">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users size={28} className="text-foreground/30 mb-1" />
                      <p className="font-semibold text-foreground/70">No client accounts found</p>
                      <p className="text-xs text-foreground/40 max-w-sm">
                        New applicants (whether rejected or approved) will not appear here until a bank account has been created for them.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedDirectoryClients.map((user) => {
                  const balance = user.accounts?.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00';
                  return (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center font-bold text-foreground shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{user.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-foreground/50 font-mono mt-0.5">
                              <span>{user.id}</span>
                              <span>•</span>
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className="inline-block px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-foreground/70 uppercase">
                            Status
                          </span>
                          <div className="flex items-center gap-1">
                            {user.status === 'active' ? <CheckCircle size={12} className="text-emerald-500" /> : <AlertTriangle size={12} className="text-rose-500" />}
                            <span className={`text-[10px] font-bold uppercase ${user.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {user.status}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm font-medium text-foreground">{balance}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${user.status !== 'suspended' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                          <span className="text-xs font-medium text-foreground/70">Verified</span>
                        </div>
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
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
                            <button onClick={() => { openUserModal(user); setIsEditingUser(true); setEditUserForm(user); }} className="w-full text-left px-3 py-2 text-sm font-bold text-foreground hover:bg-white/5 rounded-md">Edit</button>
                            <button onClick={() => copyUserDetails(user)} className="w-full text-left px-3 py-2 text-sm font-bold text-foreground hover:bg-white/5 rounded-md">Copy Details</button>
                            <button onClick={() => { deleteUser(user.id); showToast('User Deleted', 'Account removed successfully'); }} className="w-full text-left px-3 py-2 text-sm font-bold text-rose-500 hover:bg-rose-500/10 rounded-md">Delete</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      
            {/* User Details Slide-over Modal */}
      {isUserModalOpen && currentActiveUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setIsUserModalOpen(false); setIsEditingUser(false); }}></div>
          <div className="relative w-full max-w-xl h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex justify-between items-center bg-background/50 gap-3">
              <div className="flex items-center gap-3">
                <button
                  id="user-modal-back-btn"
                  onClick={() => { setIsUserModalOpen(false); setIsEditingUser(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-background text-foreground border border-border hover:border-primary/50 transition-colors shadow-sm"
                  title="Move back"
                >
                  <ArrowLeft size={15} />
                  <span>Move Back</span>
                </button>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{currentActiveUser.name}</h3>
                  <p className="text-sm font-mono text-foreground/50 mt-1">{currentActiveUser.id}</p>
                </div>
              </div>
              <button onClick={() => { setIsUserModalOpen(false); setIsEditingUser(false); }} className="text-foreground/50 hover:text-foreground bg-white/5 p-2 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isEditingUser ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-foreground border-b border-border pb-2 uppercase tracking-widest">USER INFORMATION</h4>
                    
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Fullname</label>
                      <input type="text" value={editUserForm.name || ''} onChange={e => setEditUserForm({...editUserForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email Address</label>
                      <input type="email" value={editUserForm.email || ''} onChange={e => setEditUserForm({...editUserForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-foreground/50 uppercase">Account Password</label>
                        <span className="text-[10px] font-bold text-primary">Always visible to Admin</span>
                      </div>
                      <input 
                        type="text" 
                        value={editUserForm.password || ''} 
                        onChange={e => setEditUserForm({...editUserForm, password: e.target.value})} 
                        className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none font-mono text-foreground" 
                        placeholder="Enter client password" 
                      />
                      <p className="text-[10px] text-foreground/50 mt-1">Client uses this password to log in. Always visible to administrators.</p>
                      <div className="mt-2">
                        <PasswordStrengthMeter password={editUserForm.password || ''} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Mobile Number</label>
                      <input type="text" value={editUserForm.mobile || ''} onChange={e => setEditUserForm({...editUserForm, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Country / Nationality</label>
                      <input type="text" value={editUserForm.country || editUserForm.nationality || ''} onChange={e => setEditUserForm({...editUserForm, country: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Residential Address</label>
                      <input type="text" value={editUserForm.residentialAddress || ''} onChange={e => setEditUserForm({...editUserForm, residentialAddress: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                    </div>
                    {/* Passport / ID Document / Profile Photo */}
                    <div className="bg-background/80 border border-border rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground/80 uppercase flex items-center gap-1.5">
                          <ImageIcon size={14} className="text-primary" />
                          Client Passport / ID Photo
                        </label>
                        <span className="text-[10px] text-foreground/50">Upload file or paste HTML/URL</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        {editUserForm.profilePicture ? (
                          <div className="relative group shrink-0">
                            <img 
                              src={editUserForm.profilePicture} 
                              alt="Client Passport" 
                              className="w-20 h-24 object-cover rounded-lg border-2 border-primary/50 shadow-md"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setEditUserForm(prev => ({ ...prev, profilePicture: '' }))}
                              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600 transition-colors"
                              title="Remove Photo"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-20 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-foreground/40 shrink-0 bg-background/50">
                            <ImageIcon size={24} className="mb-1 opacity-50" />
                            <span className="text-[9px] uppercase font-bold">No Photo</span>
                          </div>
                        )}

                        <div className="flex-1 w-full space-y-2">
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">
                              <Upload size={14} />
                              <span>Upload File</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleEditPassportPhotoFileChange} 
                                className="hidden" 
                              />
                            </label>
                            <span className="text-xs text-foreground/40">or paste URL / HTML below:</span>
                          </div>
                          <input 
                            type="text" 
                            value={editUserForm.profilePicture || ''} 
                            onChange={e => handleEditPassportPhotoInputPaste(e.target.value)} 
                            placeholder='Paste image URL or <img src="..." />'
                            className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground focus:border-primary outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Currency</label>
                      <select value={editUserForm.currency || 'USD'} onChange={e => setEditUserForm({...editUserForm, currency: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="AUD">AUD (A$)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Number</label>
                      <input type="text" value={editUserForm.accounts?.[0]?.accountNumber || ''} onChange={e => {
                        const accs = [...(editUserForm.accounts || [])];
                        if (accs.length > 0) accs[0] = { ...accs[0], accountNumber: e.target.value };
                        setEditUserForm({...editUserForm, accounts: accs});
                      }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-foreground/50 uppercase">Bitcoin Wallet Address</label>
                        <button
                          type="button"
                          onClick={() => {
                            adminUpdateUser(currentActiveUser.id, { btcWallet: editUserForm.btcWallet });
                            showToast('Crypto Wallet Saved', 'Client Bitcoin wallet address updated');
                          }}
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Quick Save Wallet
                        </button>
                      </div>
                      <input type="text" value={editUserForm.btcWallet || ''} onChange={e => setEditUserForm({...editUserForm, btcWallet: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none font-mono" placeholder="Enter client Bitcoin wallet address" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-foreground/50 uppercase">4 Digit Transaction Pin</label>
                        <button
                          type="button"
                          onClick={() => {
                            const newPin = generateRandomCode('', 4);
                            const accs = [...(editUserForm.accounts || [])];
                            if (accs.length > 0) accs[0] = { ...accs[0], pin: newPin };
                            setEditUserForm({ ...editUserForm, accounts: accs, pin: newPin });
                          }}
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Generate New PIN
                        </button>
                      </div>
                      <input 
                        type="text" 
                        maxLength={4} 
                        value={editUserForm.accounts?.[0]?.pin || editUserForm.pin || ''} 
                        onChange={e => {
                          const val = e.target.value;
                          const accs = [...(editUserForm.accounts || [])];
                          if (accs.length > 0) accs[0] = { ...accs[0], pin: val };
                          setEditUserForm({...editUserForm, accounts: accs, pin: val});
                        }} 
                        className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" 
                        placeholder="e.g. 1234"
                      />
                    </div>

                    <div className="pt-4 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">COT Code</label>
                        <input type="text" value={editUserForm.accounts?.[0]?.codes?.cot || ''} onChange={e => {
                          const accs = [...(editUserForm.accounts || [])];
                          if (accs.length > 0) accs[0] = { ...accs[0], codes: { ...accs[0].codes, cot: e.target.value } };
                          setEditUserForm({...editUserForm, accounts: accs});
                        }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">SWIFT-SEC Code</label>
                        <input type="text" value={editUserForm.accounts?.[0]?.codes?.swift || ''} onChange={e => {
                          const accs = [...(editUserForm.accounts || [])];
                          if (accs.length > 0) accs[0] = { ...accs[0], codes: { ...accs[0].codes, swift: e.target.value } };
                          setEditUserForm({...editUserForm, accounts: accs});
                        }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">IMF Clearance Code</label>
                        <input type="text" value={editUserForm.accounts?.[0]?.codes?.imf || ''} onChange={e => {
                          const accs = [...(editUserForm.accounts || [])];
                          if (accs.length > 0) accs[0] = { ...accs[0], codes: { ...accs[0].codes, imf: e.target.value } };
                          setEditUserForm({...editUserForm, accounts: accs});
                        }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">TAX Code</label>
                        <input type="text" value={editUserForm.accounts?.[0]?.codes?.tax || ''} onChange={e => {
                          const accs = [...(editUserForm.accounts || [])];
                          if (accs.length > 0) accs[0] = { ...accs[0], codes: { ...accs[0].codes, tax: e.target.value } };
                          setEditUserForm({...editUserForm, accounts: accs});
                        }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">AML-PASS Code</label>
                        <input type="text" value={editUserForm.accounts?.[0]?.codes?.aml || ''} onChange={e => {
                          const accs = [...(editUserForm.accounts || [])];
                          if (accs.length > 0) accs[0] = { ...accs[0], codes: { ...accs[0].codes, aml: e.target.value } };
                          setEditUserForm({...editUserForm, accounts: accs});
                        }} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" />
                      </div>
                    </div>

                    <div className="pt-4 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Date of birth</label>
                        <input type="date" value={editUserForm.dob || ''} onChange={e => setEditUserForm({...editUserForm, dob: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</label>
                        <select value={editUserForm.nationality || ''} onChange={e => setEditUserForm({...editUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none">
                          <option value="">Select Nationality...</option>
                          <option value="Afghanistan">Afghanistan</option>
                          <option value="Albania">Albania</option>
                          <option value="Algeria">Algeria</option>
                          <option value="Andorra">Andorra</option>
                          <option value="Angola">Angola</option>
                          <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                          <option value="Argentina">Argentina</option>
                          <option value="Armenia">Armenia</option>
                          <option value="Australia">Australia</option>
                          <option value="Austria">Austria</option>
                          <option value="Azerbaijan">Azerbaijan</option>
                          <option value="Bahamas">Bahamas</option>
                          <option value="Bahrain">Bahrain</option>
                          <option value="Bangladesh">Bangladesh</option>
                          <option value="Barbados">Barbados</option>
                          <option value="Belarus">Belarus</option>
                          <option value="Belgium">Belgium</option>
                          <option value="Belize">Belize</option>
                          <option value="Benin">Benin</option>
                          <option value="Bhutan">Bhutan</option>
                          <option value="Bolivia">Bolivia</option>
                          <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                          <option value="Botswana">Botswana</option>
                          <option value="Brazil">Brazil</option>
                          <option value="Brunei">Brunei</option>
                          <option value="Bulgaria">Bulgaria</option>
                          <option value="Burkina Faso">Burkina Faso</option>
                          <option value="Burundi">Burundi</option>
                          <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                          <option value="Cabo Verde">Cabo Verde</option>
                          <option value="Cambodia">Cambodia</option>
                          <option value="Cameroon">Cameroon</option>
                          <option value="Canada">Canada</option>
                          <option value="Central African Republic">Central African Republic</option>
                          <option value="Chad">Chad</option>
                          <option value="Chile">Chile</option>
                          <option value="China">China</option>
                          <option value="Colombia">Colombia</option>
                          <option value="Comoros">Comoros</option>
                          <option value="Congo (Congo-Brazzaville)">Congo (Congo-Brazzaville)</option>
                          <option value="Costa Rica">Costa Rica</option>
                          <option value="Croatia">Croatia</option>
                          <option value="Cuba">Cuba</option>
                          <option value="Cyprus">Cyprus</option>
                          <option value="Czechia (Czech Republic)">Czechia (Czech Republic)</option>
                          <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
                          <option value="Denmark">Denmark</option>
                          <option value="Djibouti">Djibouti</option>
                          <option value="Dominica">Dominica</option>
                          <option value="Dominican Republic">Dominican Republic</option>
                          <option value="Ecuador">Ecuador</option>
                          <option value="Egypt">Egypt</option>
                          <option value="El Salvador">El Salvador</option>
                          <option value="Equatorial Guinea">Equatorial Guinea</option>
                          <option value="Eritrea">Eritrea</option>
                          <option value="Estonia">Estonia</option>
                          <option value="Eswatini (fmr. 'Swaziland')">Eswatini (fmr. 'Swaziland')</option>
                          <option value="Ethiopia">Ethiopia</option>
                          <option value="Fiji">Fiji</option>
                          <option value="Finland">Finland</option>
                          <option value="France">France</option>
                          <option value="Gabon">Gabon</option>
                          <option value="Gambia">Gambia</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Germany">Germany</option>
                          <option value="Ghana">Ghana</option>
                          <option value="Greece">Greece</option>
                          <option value="Grenada">Grenada</option>
                          <option value="Guatemala">Guatemala</option>
                          <option value="Guinea">Guinea</option>
                          <option value="Guinea-Bissau">Guinea-Bissau</option>
                          <option value="Guyana">Guyana</option>
                          <option value="Haiti">Haiti</option>
                          <option value="Holy See">Holy See</option>
                          <option value="Honduras">Honduras</option>
                          <option value="Hungary">Hungary</option>
                          <option value="Iceland">Iceland</option>
                          <option value="India">India</option>
                          <option value="Indonesia">Indonesia</option>
                          <option value="Iran">Iran</option>
                          <option value="Iraq">Iraq</option>
                          <option value="Ireland">Ireland</option>
                          <option value="Israel">Israel</option>
                          <option value="Italy">Italy</option>
                          <option value="Jamaica">Jamaica</option>
                          <option value="Japan">Japan</option>
                          <option value="Jordan">Jordan</option>
                          <option value="Kazakhstan">Kazakhstan</option>
                          <option value="Kenya">Kenya</option>
                          <option value="Kiribati">Kiribati</option>
                          <option value="Kuwait">Kuwait</option>
                          <option value="Kyrgyzstan">Kyrgyzstan</option>
                          <option value="Laos">Laos</option>
                          <option value="Latvia">Latvia</option>
                          <option value="Lebanon">Lebanon</option>
                          <option value="Lesotho">Lesotho</option>
                          <option value="Liberia">Liberia</option>
                          <option value="Libya">Libya</option>
                          <option value="Liechtenstein">Liechtenstein</option>
                          <option value="Lithuania">Lithuania</option>
                          <option value="Luxembourg">Luxembourg</option>
                          <option value="Madagascar">Madagascar</option>
                          <option value="Malawi">Malawi</option>
                          <option value="Malaysia">Malaysia</option>
                          <option value="Maldives">Maldives</option>
                          <option value="Mali">Mali</option>
                          <option value="Malta">Malta</option>
                          <option value="Marshall Islands">Marshall Islands</option>
                          <option value="Mauritania">Mauritania</option>
                          <option value="Mauritius">Mauritius</option>
                          <option value="Mexico">Mexico</option>
                          <option value="Micronesia">Micronesia</option>
                          <option value="Moldova">Moldova</option>
                          <option value="Monaco">Monaco</option>
                          <option value="Mongolia">Mongolia</option>
                          <option value="Montenegro">Montenegro</option>
                          <option value="Morocco">Morocco</option>
                          <option value="Mozambique">Mozambique</option>
                          <option value="Myanmar (formerly Burma)">Myanmar (formerly Burma)</option>
                          <option value="Namibia">Namibia</option>
                          <option value="Nauru">Nauru</option>
                          <option value="Nepal">Nepal</option>
                          <option value="Netherlands">Netherlands</option>
                          <option value="New Zealand">New Zealand</option>
                          <option value="Nicaragua">Nicaragua</option>
                          <option value="Niger">Niger</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="North Korea">North Korea</option>
                          <option value="North Macedonia">North Macedonia</option>
                          <option value="Norway">Norway</option>
                          <option value="Oman">Oman</option>
                          <option value="Pakistan">Pakistan</option>
                          <option value="Palau">Palau</option>
                          <option value="Palestine State">Palestine State</option>
                          <option value="Panama">Panama</option>
                          <option value="Papua New Guinea">Papua New Guinea</option>
                          <option value="Paraguay">Paraguay</option>
                          <option value="Peru">Peru</option>
                          <option value="Philippines">Philippines</option>
                          <option value="Poland">Poland</option>
                          <option value="Portugal">Portugal</option>
                          <option value="Qatar">Qatar</option>
                          <option value="Romania">Romania</option>
                          <option value="Russia">Russia</option>
                          <option value="Rwanda">Rwanda</option>
                          <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                          <option value="Saint Lucia">Saint Lucia</option>
                          <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                          <option value="Samoa">Samoa</option>
                          <option value="San Marino">San Marino</option>
                          <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                          <option value="Saudi Arabia">Saudi Arabia</option>
                          <option value="Senegal">Senegal</option>
                          <option value="Serbia">Serbia</option>
                          <option value="Seychelles">Seychelles</option>
                          <option value="Sierra Leone">Sierra Leone</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Slovakia">Slovakia</option>
                          <option value="Slovenia">Slovenia</option>
                          <option value="Solomon Islands">Solomon Islands</option>
                          <option value="Somalia">Somalia</option>
                          <option value="South Africa">South Africa</option>
                          <option value="South Korea">South Korea</option>
                          <option value="South Sudan">South Sudan</option>
                          <option value="Spain">Spain</option>
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="Sudan">Sudan</option>
                          <option value="Suriname">Suriname</option>
                          <option value="Sweden">Sweden</option>
                          <option value="Switzerland">Switzerland</option>
                          <option value="Syria">Syria</option>
                          <option value="Tajikistan">Tajikistan</option>
                          <option value="Tanzania">Tanzania</option>
                          <option value="Thailand">Thailand</option>
                          <option value="Timor-Leste">Timor-Leste</option>
                          <option value="Togo">Togo</option>
                          <option value="Tonga">Tonga</option>
                          <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                          <option value="Tunisia">Tunisia</option>
                          <option value="Turkey">Turkey</option>
                          <option value="Turkmenistan">Turkmenistan</option>
                          <option value="Tuvalu">Tuvalu</option>
                          <option value="Uganda">Uganda</option>
                          <option value="Ukraine">Ukraine</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                          <option value="Uruguay">Uruguay</option>
                          <option value="Uzbekistan">Uzbekistan</option>
                          <option value="Vanuatu">Vanuatu</option>
                          <option value="Venezuela">Venezuela</option>
                          <option value="Vietnam">Vietnam</option>
                          <option value="Yemen">Yemen</option>
                          <option value="Zambia">Zambia</option>
                          <option value="Zimbabwe">Zimbabwe</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-border mt-6">
                    <button onClick={() => setIsEditingUser(false)} className="flex-1 px-4 py-2 bg-background border border-border text-foreground font-bold rounded-lg hover:bg-white/5">Cancel</button>
                    <button onClick={() => { 
                      if (currentActiveUser && editUserForm.password && editUserForm.password !== currentActiveUser.password) {
                        const pwdCheck = validateNewPassword(editUserForm.password);
                        if (!pwdCheck.valid) {
                          showToast('Weak Password', pwdCheck.error || 'Password must be at least 6 characters long with a mix of characters.');
                          return;
                        }
                      }
                      const finalPin = editUserForm.pin || editUserForm.accounts?.[0]?.pin || generateRandomCode('', 4);
                      const updatedAccounts = (editUserForm.accounts || []).map((a: any, idx: number) => {
                        if (idx === 0) return { ...a, pin: finalPin };
                        return a;
                      });
                      adminUpdateUser(currentActiveUser.id, {
                        ...editUserForm,
                        pin: finalPin,
                        accounts: updatedAccounts.length > 0 ? updatedAccounts : [{
                          id: `acc-${Date.now()}`,
                          accountNumber: generateRandomCode('', 11),
                          type: 'Checking',
                          iban: '',
                          balance: 0,
                          pin: finalPin,
                          codes: { swift: '', cot: '', tax: '', imf: '', aml: '' }
                        }]
                      }); 
                      setIsEditingUser(false); 
                      showToast('User Updated', 'Details saved successfully'); 
                    }} className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">Save Changes</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <h4 className="text-sm font-bold text-foreground uppercase tracking-widest">USER INFORMATION</h4>
                      <div className="relative group">
                        <button className="text-foreground/50 hover:text-foreground bg-white/5 p-1 rounded">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1">
                          <button onClick={() => { setIsEditingUser(true); setEditUserForm(currentActiveUser); }} className="w-full text-left px-3 py-2 text-sm font-bold text-foreground hover:bg-white/5 rounded-md">Edit Account</button>
                          <button onClick={() => { deleteUser(currentActiveUser.id); setIsUserModalOpen(false); showToast('User Deleted', 'Account removed successfully'); }} className="w-full text-left px-3 py-2 text-sm font-bold text-rose-500 hover:bg-rose-500/10 rounded-md">Delete Account</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">Fullname</div>
                        <div className="text-sm text-foreground">{currentActiveUser.name || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">Email Address</div>
                        <div className="text-sm text-foreground">{currentActiveUser.email || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-bold text-foreground/50 uppercase">Account Password</div>
                          <span className="text-[10px] font-bold text-primary">Always visible to Admin</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 select-all">
                            {currentActiveUser.password || 'password123'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">Mobile Number</div>
                        <div className="text-sm text-foreground">{currentActiveUser.mobile || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">Currency</div>
                        <div className="text-sm text-foreground">{currentActiveUser.currency || 'USD'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">Account Number</div>
                        <div className="text-sm font-mono text-foreground">{currentActiveUser.accounts?.[0]?.accountNumber || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-bold text-foreground/50 uppercase">Bitcoin Wallet Address</div>
                          <button 
                            onClick={() => { setIsEditingUser(true); setEditUserForm(currentActiveUser); }}
                            className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                          >
                            Edit Wallet
                          </button>
                        </div>
                        <div className="text-sm font-mono text-foreground break-all bg-background/50 p-2 rounded-lg border border-border/50">{currentActiveUser.btcWallet || 'No wallet assigned'}</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-bold text-foreground/50 uppercase">4 Digit Transaction Pin</div>
                          <button
                            onClick={() => {
                              const newPin = generateRandomCode('', 4);
                              const accs = (currentActiveUser.accounts || []).map((a, idx) => idx === 0 ? { ...a, pin: newPin } : a);
                              adminUpdateUser(currentActiveUser.id, { pin: newPin, accounts: accs });
                              showToast('PIN Generated', `Transaction PIN updated to ${newPin}`);
                            }}
                            className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                          >
                            Generate PIN
                          </button>
                        </div>
                        <div className="text-sm font-mono text-foreground font-bold tracking-widest">{currentActiveUser.accounts?.[0]?.pin || currentActiveUser.pin || '1234'}</div>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">COT Code</div>
                        <div className="text-sm font-mono text-foreground">{currentActiveUser.accounts?.[0]?.codes?.cot || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">SWIFT-SEC Code</div>
                        <div className="text-sm font-mono text-foreground">{currentActiveUser.accounts?.[0]?.codes?.swift || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">IMF Clearance Code</div>
                        <div className="text-sm font-mono text-foreground">{currentActiveUser.accounts?.[0]?.codes?.imf || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">TAX Code</div>
                        <div className="text-sm font-mono text-foreground">{currentActiveUser.accounts?.[0]?.codes?.tax || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">AML-PASS Code</div>
                        <div className="text-sm font-mono text-foreground">{currentActiveUser.accounts?.[0]?.codes?.aml || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">Date of birth</div>
                        <div className="text-sm text-foreground">{currentActiveUser.dob || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</div>
                        <div className="text-sm text-foreground">{currentActiveUser.nationality || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground/50 uppercase mb-1">Registered</div>
                        <div className="text-sm text-foreground">{new Date(currentActiveUser.id.startsWith('user-') ? parseInt(currentActiveUser.id.replace('user-', '')) : Date.now()).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-border">
                    <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest flex justify-between items-center">
                      Financial Overview
                    </h4>
                    <div className="bg-gradient-to-br from-emerald-500/10 to-primary/10 border border-border rounded-xl p-6 text-center">
                      <p className="text-xs text-foreground/70 uppercase tracking-widest mb-2 font-bold">Estimated Net Worth</p>
                      <p className="text-4xl font-bold text-foreground font-mono">{currentActiveUser.accounts?.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
                      Manage Actions
                    </h4>
                    
                    <div className="space-y-4 bg-background border border-border rounded-xl p-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Status</label>
                        <select 
                          value={currentActiveUser.status} 
                          onChange={e => {
                            const newStatus = e.target.value as any;
                            updateUserStatus(currentActiveUser.id, newStatus);
                            showToast('Success', `Account status updated to ${newStatus}`);
                          }} 
                          className="w-full bg-card border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="dormant">Dormant</option>
                          <option value="blocked">Blocked</option>
                          <option value="frozen">Frozen</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Financial Action</label>
                          <select 
                            value={actionForm.type} 
                            onChange={e => setActionForm({...actionForm, type: e.target.value})} 
                            className="w-full bg-card border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none"
                          >
                            <option value="Credit">Credit (+)</option>
                            <option value="Debit">Debit (-)</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Amount</label>
                          <input 
                            type="number" 
                            placeholder="0.00"
                            value={actionForm.amount}
                            onChange={e => setActionForm({...actionForm, amount: e.target.value})} 
                            className="w-full bg-card border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
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
                        }} 
                        className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Update / Save
                      </button>
                    </div>
                  </div>
                </div>
              )}            </div>
          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAddUserModalOpen(false)}></div>
          <div className="relative w-full max-w-xl h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex justify-between items-center bg-background/50 gap-3">
              <div className="flex items-center gap-3">
                <button
                  id="add-user-modal-back-btn"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-background text-foreground border border-border hover:border-primary/50 transition-colors shadow-sm"
                  title="Move back"
                >
                  <ArrowLeft size={15} />
                  <span>Move Back</span>
                </button>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Create New Client</h3>
                </div>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-foreground/50 hover:text-foreground bg-white/5 p-2 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Full Name</label>
                  <input type="text" value={newUserForm.name} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email Address</label>
                  <input type="email" value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-foreground/50 uppercase">Account Password</label>
                    <span className="text-[10px] font-bold text-primary">Always visible to Admin</span>
                  </div>
                  <input 
                    type="text" 
                    value={newUserForm.password} 
                    onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} 
                    className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" 
                    placeholder="Enter client password"
                  />
                  <p className="text-[10px] text-foreground/50 mt-1">Client uses this password to log in. Visible to administrators.</p>
                  <div className="mt-2">
                    <PasswordStrengthMeter password={newUserForm.password} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Mobile Number</label>
                  <input type="text" value={newUserForm.mobile} onChange={e => setNewUserForm({...newUserForm, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Date of Birth</label>
                  <input type="date" value={newUserForm.dob} onChange={e => setNewUserForm({...newUserForm, dob: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</label>
                  <select value={newUserForm.nationality} onChange={e => setNewUserForm({...newUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                    <option value="">Select Nationality</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Brunei">Brunei</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Cabo Verde">Cabo Verde</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Central African Republic">Central African Republic</option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo (Congo-Brazzaville)">Congo (Congo-Brazzaville)</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czechia (Czech Republic)">Czechia (Czech Republic)</option>
                    <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">Dominican Republic</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Eswatini (fmr. 'Swaziland')">Eswatini (fmr. 'Swaziland')</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Greece">Greece</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bissau">Guinea-Bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Holy See">Holy See</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Laos">Laos</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldova">Moldova</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar (formerly Burma)">Myanmar (formerly Burma)</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="North Korea">North Korea</option>
                    <option value="North Macedonia">North Macedonia</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Palestine State">Palestine State</option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                    <option value="Saint Lucia">Saint Lucia</option>
                    <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Marino">San Marino</option>
                    <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Korea">South Korea</option>
                    <option value="South Sudan">South Sudan</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Timor-Leste">Timor-Leste</option>
                    <option value="Togo">Togo</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Zip Code</label>
                  <input type="text" value={newUserForm.zipCode} onChange={e => setNewUserForm({...newUserForm, zipCode: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Occupation</label>
                  <input type="text" value={newUserForm.occupation} onChange={e => setNewUserForm({...newUserForm, occupation: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Residential Address</label>
                  <input type="text" value={newUserForm.residentialAddress} onChange={e => setNewUserForm({...newUserForm, residentialAddress: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                
                {/* Passport / ID Document / Profile Photo */}
                <div className="bg-background/80 border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground/80 uppercase flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-primary" />
                      Client Passport / ID Photo
                    </label>
                    <span className="text-[10px] text-foreground/50">Upload file or paste HTML/URL</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {newUserForm.passportPhoto ? (
                      <div className="relative group shrink-0">
                        <img 
                          src={newUserForm.passportPhoto} 
                          alt="Client Passport" 
                          className="w-20 h-24 object-cover rounded-lg border-2 border-primary/50 shadow-md"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setNewUserForm(prev => ({ ...prev, passportPhoto: '' }))}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600 transition-colors"
                          title="Remove Photo"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-foreground/40 shrink-0 bg-background/50">
                        <ImageIcon size={24} className="mb-1 opacity-50" />
                        <span className="text-[9px] uppercase font-bold">No Photo</span>
                      </div>
                    )}

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">
                          <Upload size={14} />
                          <span>Upload File</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handlePassportPhotoFileChange} 
                            className="hidden" 
                          />
                        </label>
                        <span className="text-xs text-foreground/40">or paste URL / HTML below:</span>
                      </div>
                      <input 
                        type="text" 
                        value={newUserForm.passportPhoto} 
                        onChange={e => handlePassportPhotoInputPaste(e.target.value)} 
                        placeholder='Paste image URL or <img src="..." />'
                        className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground focus:border-primary outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Currency</label>
                    <select value={newUserForm.currency} onChange={e => setNewUserForm({...newUserForm, currency: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CHF">CHF (₣)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Type</label>
                    <select value={newUserForm.accountType} onChange={e => setNewUserForm({...newUserForm, accountType: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>
                
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest border-b border-border pb-2 mt-4">Generated Banking Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Number</label>
                    <input type="text" value={newUserForm.accountNumber} onChange={e => setNewUserForm({...newUserForm, accountNumber: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">4 Digit Transaction Pin</label>
                    <input type="text" value={newUserForm.pin} onChange={e => setNewUserForm({...newUserForm, pin: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">SWIFT-SEC Code</label>
                    <input type="text" value={newUserForm.swift} onChange={e => setNewUserForm({...newUserForm, swift: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">COT Code</label>
                    <input type="text" value={newUserForm.cot} onChange={e => setNewUserForm({...newUserForm, cot: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">IMF Clearance Code</label>
                    <input type="text" value={newUserForm.imf} onChange={e => setNewUserForm({...newUserForm, imf: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">TAX Code</label>
                    <input type="text" value={newUserForm.tax} onChange={e => setNewUserForm({...newUserForm, tax: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">AML-PASS Code</label>
                    <input type="text" value={newUserForm.aml} onChange={e => setNewUserForm({...newUserForm, aml: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setIsAddUserModalOpen(false)} 
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground/70 font-bold hover:text-foreground text-sm flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Move Back</span>
                </button>
                <button onClick={submitNewUser} className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-md">
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* General Admin Settings Modal */}
            </div>
          ) : null}
          
      {/* Module Router */}
      {currentView === 'investors' && <AdminInvestors />}
      {currentView === 'manage-users' && <AdminManageUsers onManageUser={(id) => { setActiveUserId(id); setIsUserModalOpen(true); }} />}
      {currentView === 'new-user-apps' && <AdminApplications onOpenAccountCreation={handleOpenAddUserForApplicant} />}
      {currentView === 'contact-inquiries' && <AdminContactInquiries />}
      {currentView === 'grant-applications-all-applications' && <AdminGrantApplications filter="all" />}
      {currentView === 'grant-applications-processing' && <AdminGrantApplications filter="processing" />}
      {currentView === 'grant-applications-approved' && <AdminGrantApplications filter="approved" />}
      {currentView === 'grant-applications-rejected' && <AdminGrantApplications filter="rejected" />}
      {currentView === 'grant-applications-disbursed' && <AdminGrantApplications filter="disbursed" />}
      {currentView === 'grant-applications' && <AdminGrantApplications filter="all" />}
      {currentView === 'loan-apps' && <AdminLoanApplications />}
      {currentView === 'txn-history' && <AdminTransactionsHistory />}
      {currentView === 'transfer-txns' && <AdminTransactionsHistory filter="transfers" />}
      {currentView === 'user-deposits' && <AdminTransactionsHistory filter="deposits" />}
      {currentView === 'virtual-cards-all-cards' && <AdminVirtualCards />}
      {currentView === 'virtual-cards-pending-applications' && <AdminVirtualCards filter="pending" />}
      {currentView === 'email-services' && <AdminEmailServices />}
      {currentView === 'administrators' && <AdminAdministrators />}
      
      {/* Catch-all for truly unimplemented ones */}
      {currentView === 'virtual-cards' && <AdminVirtualCards />}
      {currentView === 'virtual-cards-card-settings' && <AdminVirtualCardSettings />}

      {currentView === 'settings' && <AdminSettingsView />}
      
      </div> {/* Close wrapper for views */}
      </div> {/* Close Main Content overflow container */}
      
      {/* Modals are kept outside the main scroll container but inside the component to render on top */}
      {/* System Settings Modal */}
      {isSystemSettingsModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setIsSystemSettingsModalOpen(false); }}
        >
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b border-border bg-background/50 flex justify-between items-center sticky top-0 z-10 gap-3">
              <div className="flex items-center gap-3">
                <button
                  id="system-settings-back-btn"
                  onClick={() => setIsSystemSettingsModalOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-background text-foreground border border-border hover:border-primary/50 transition-colors shadow-sm"
                  title="Move back"
                >
                  <ArrowLeft size={15} />
                  <span>Move Back</span>
                </button>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">System Settings</h2>
              </div>
              <button onClick={() => setIsSystemSettingsModalOpen(false)} className="text-foreground/50 hover:text-foreground p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Security Codes */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest border-b border-border pb-2">Wire Transfer Clearance</h4>
                <div className="space-y-3">
                  {['requireCot', 'requireSwift', 'requireImf', 'requireTax', 'requireAml'].map((settingKey) => {
                    const key = settingKey as keyof typeof adminSettings;
                    const label = settingKey.replace('require', '').toUpperCase() + ' Code Requirement';
                    return (
                      <div key={settingKey} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                        <span className="text-sm font-bold text-foreground">{label}</span>
                        <button 
                          onClick={() => {
                            updateAdminSettings({ [settingKey]: !adminSettings[key] });
                            showToast('Settings Updated', `${label} is now ${!adminSettings[key] ? 'Enabled' : 'Disabled'}`);
                          }}
                          className={`w-12 h-6 rounded-full relative transition-colors ${adminSettings[key] ? 'bg-emerald-500' : 'bg-foreground/20'}`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${adminSettings[key] ? 'translate-x-6' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Email Users */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest border-b border-border pb-2">Send Emails</h4>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Message Subject</label>
                  <input type="text" className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none mb-3" placeholder="Subject..." />
                  
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Message Body</label>
                  <textarea className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none h-24 mb-3" placeholder="Type your email message..."></textarea>
                  
                  <button onClick={() => showToast('Email Sent', 'Your message has been sent to all users')} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                    <Mail size={16} /> Send to All Users
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-border bg-background/50 flex justify-start">
              <button
                onClick={() => setIsSystemSettingsModalOpen(false)}
                className="px-4 py-2 bg-foreground/10 text-foreground font-bold rounded-xl hover:bg-foreground/20 transition-colors text-sm flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Move Back</span>
              </button>
            </div>
          </div>
        </div>
      )}

      

      {/* Dynamic Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-card border border-primary/30 shadow-lg shadow-primary/10 rounded-xl p-4 flex items-start gap-3 w-80">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <CheckCircle size={16} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-foreground">{toastMessage.title}</h4>
              <p className="text-xs text-foreground/60 mt-0.5">{toastMessage.message}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-foreground/40 hover:text-foreground"><X size={14} /></button>
          </div>
        </div>
      )}
      </div> {/* Close main wrapper flex container */}
    </>
  );
}
