with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write("""import { useState } from 'react';
import { 
  Users, Activity, ShieldAlert, ArrowUpRight, ArrowDownLeft, 
  Search, Filter, MoreHorizontal, CheckCircle, AlertTriangle, 
  Settings, Download, ChevronRight, ChevronLeft, Lock, Mail, X, Upload
} from 'lucide-react';
import { useBank } from '../store';

export function AdminDashboard() {
  const { users, updateUserStatus, adminCreateUser, createTransaction, deleteUser, transactions, updateTransactionStatus, logout, adminSettings, updateAdminSettings } = useBank();
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const currentActiveUser = activeUserId ? users.find(u => u.id === activeUserId) : null;
  const [toastMessage, setToastMessage] = useState<{title: string, message: string} | null>(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '', email: '', mobile: '', currency: 'USD', accountType: 'Checking',
    accountNumber: '', btcWallet: '', pin: '', cot: '', swift: '', imf: '', tax: '', aml: '',
    dob: '', nationality: '', password: '', zipCode: '', occupation: '', residentialAddress: ''
  });

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
      aml: generateRandomCode('AML', 5), dob: '', nationality: '', password: '', zipCode: '', occupation: '', residentialAddress: ''
    });
    setIsAddUserModalOpen(true);
  };

  const submitNewUser = () => {
    if (!newUserForm.name || !newUserForm.email) {
       showToast('Error', 'Name and Email are required');
       return;
    }
    adminCreateUser({
      name: newUserForm.name,
      email: newUserForm.email,
      password: newUserForm.password || 'password123',
      role: 'user',
      status: 'active',
      showFullCardDetails: false,
      mobile: newUserForm.mobile,
      currency: newUserForm.currency,
      btcWallet: newUserForm.btcWallet,
      dob: newUserForm.dob,
      nationality: newUserForm.nationality,
      zipCode: newUserForm.zipCode,
      occupation: newUserForm.occupation,
      residentialAddress: newUserForm.residentialAddress,
      accounts: [{
        id: `acc-${Date.now()}`,
        type: newUserForm.accountType as 'Checking' | 'Savings' | 'Business',
        accountNumber: newUserForm.accountNumber,
        iban: `CH93 0000 0000 ${newUserForm.accountNumber.substring(0, 4)}`,
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
    setIsAddUserModalOpen(false);
    showToast('Success', 'User created successfully');
  };

  const openUserModal = (user: any) => {
    setActiveUserId(user.id);
    setIsUserModalOpen(true);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Admin Portal</h2>
          <p className="text-sm text-foreground/60">System overview and client management console.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsSettingsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg text-sm font-bold hover:bg-blue-500/20 transition-colors">
            <Settings size={16} /> General Settings
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
                placeholder="Search ID, Name, Email..." 
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
              {users.filter(u => u.role !== 'admin').map((user) => {
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
                          Premium
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
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => openUserModal(user)}
                        className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors mr-4 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20"
                      >
                        Manage
                      </button>
                      <button className="text-foreground/50 hover:text-foreground transition-colors inline-flex align-middle">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Slide-over Modal */}
      {isUserModalOpen && currentActiveUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)}></div>
          <div className="relative w-full max-w-md h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex justify-between items-start bg-background/50">
              <div>
                <h3 className="text-xl font-bold text-foreground">{currentActiveUser.name}</h3>
                <p className="text-sm font-mono text-foreground/50 mt-1">{currentActiveUser.id}</p>
              </div>
              <button onClick={() => setIsUserModalOpen(false)} className="text-foreground/50 hover:text-foreground bg-white/5 p-2 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex gap-2">
                <span className={`flex-1 text-center py-2 border rounded-lg text-xs font-bold uppercase tracking-widest ${currentActiveUser.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                  {currentActiveUser.status}
                </span>
                <span className="flex-1 text-center py-2 bg-white/5 text-foreground border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest">Premium</span>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Contact Information</h4>
                <div className="bg-background border border-border rounded-xl p-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50 flex items-center gap-2"><Mail size={14}/> Email</span>
                    <span className="font-mono text-foreground">{currentActiveUser.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50 flex items-center gap-2"><Lock size={14}/> Password</span>
                    <span className="font-mono text-foreground">{currentActiveUser.password || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50 flex items-center gap-2"><Lock size={14}/> Joined</span>
                    <span className="text-foreground">Recent</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Financial Overview</h4>
                <div className="bg-gradient-to-br from-emerald-500/10 to-primary/10 border border-border rounded-xl p-6 text-center">
                  <p className="text-xs text-foreground/70 uppercase tracking-widest mb-2 font-bold">Estimated Net Worth</p>
                  <p className="text-4xl font-bold text-foreground font-mono">{currentActiveUser.accounts?.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Admin Actions</h4>
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
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add New User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAddUserModalOpen(false)}></div>
          <div className="relative w-full max-w-xl h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex justify-between items-start bg-background/50">
              <div>
                <h3 className="text-xl font-bold text-foreground">Create New Client</h3>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-foreground/50 hover:text-foreground bg-white/5 p-2 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Fullname</label>
                  <input type="text" value={newUserForm.name} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email</label>
                  <input type="email" value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Password</label>
                  <input type="text" value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" placeholder="Default: password123" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Mobile</label>
                  <input type="text" value={newUserForm.mobile} onChange={e => setNewUserForm({...newUserForm, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Occupation</label>
                  <input type="text" value={newUserForm.occupation} onChange={e => setNewUserForm({...newUserForm, occupation: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Zip / Postal Code</label>
                  <input type="text" value={newUserForm.zipCode} onChange={e => setNewUserForm({...newUserForm, zipCode: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Date of Birth</label>
                  <input type="date" value={newUserForm.dob} onChange={e => setNewUserForm({...newUserForm, dob: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Residential Address</label>
                  <input type="text" value={newUserForm.residentialAddress} onChange={e => setNewUserForm({...newUserForm, residentialAddress: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</label>
                  <select value={newUserForm.nationality} onChange={e => setNewUserForm({...newUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                    <option value="">Select Country</option>
                    {[
                      'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 
                      'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 
                      'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 
                      'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 
                      'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 
                      'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 
                      'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 
                      'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 
                      'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 
                      'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 
                      'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 
                      'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (formerly Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 
                      'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 
                      'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 
                      'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 
                      'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 
                      'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 
                      'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 
                      'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 
                      'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
                    ].map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-border mt-6">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-4">Initial Account Setup</h4>
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
              </div>
              <button onClick={submitNewUser} className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* General Admin Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border bg-background/50 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-foreground">General Settings</h2>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-foreground/50 hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Appearance */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest border-b border-border pb-2">Appearance</h4>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Logo Link (URL)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={adminSettings.logoUrl || ''} 
                      onChange={e => updateAdminSettings({ logoUrl: e.target.value })}
                      className="flex-1 bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" 
                      placeholder="https://..."
                    />
                    <button 
                      onClick={() => showToast('Logo Updated', 'New logo link saved successfully')}
                      className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Admin Access Credentials */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest border-b border-border pb-2">Admin Portal Access</h4>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Admin Email</label>
                  <input 
                    type="email" 
                    value={adminSettings.adminEmail || ''} 
                    onChange={e => updateAdminSettings({ adminEmail: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Admin Password</label>
                  <input 
                    type="text" 
                    value={adminSettings.adminPassword || ''} 
                    onChange={e => updateAdminSettings({ adminPassword: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" 
                  />
                </div>
              </div>

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
    </div>
  );
}
""")
