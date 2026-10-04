import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add adminCreateUser to destructuring
content = content.replace(
    'const { users, updateUserStatus, register, createTransaction, deleteUser, transactions, updateTransactionStatus, logout } = useBank();',
    'const { users, updateUserStatus, register, adminCreateUser, createTransaction, deleteUser, transactions, updateTransactionStatus, logout } = useBank();'
)

replacement = """
  const generateRandomCode = (prefix: string, length: number) => {
    return prefix + Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  };

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '', email: '', mobile: '', currency: 'USD', accountNumber: '',
    btcWallet: '', pin: '', cot: '', swift: '', imf: '', tax: '', aml: '',
    dob: '', nationality: ''
  });

  const handleOpenAddUser = () => {
    setNewUserForm({
      name: '', email: '', mobile: '', currency: 'USD', 
      accountNumber: generateRandomCode('', 11),
      btcWallet: '', pin: generateRandomCode('', 4),
      cot: generateRandomCode('', 7), swift: generateRandomCode('', 7),
      imf: generateRandomCode('', 6), tax: generateRandomCode('GEB', 5),
      aml: generateRandomCode('AML', 5), dob: '', nationality: ''
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
      password: 'password123',
      role: 'user',
      status: 'active',
      showFullCardDetails: false,
      mobile: newUserForm.mobile,
      currency: newUserForm.currency,
      btcWallet: newUserForm.btcWallet,
      dob: newUserForm.dob,
      nationality: newUserForm.nationality,
      accounts: [{
        id: `acc-${Date.now()}`,
        type: 'Checking',
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
"""

content = re.sub(r'  const handleAddUser = \(\) => \{[\s\S]*?\};', replacement.strip(), content)

content = content.replace('onClick={handleAddUser}', 'onClick={handleOpenAddUser}')


add_user_modal_jsx = """
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAddUserModalOpen(false)}></div>
          <div className="relative w-full max-w-lg h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex justify-between items-start bg-background/50">
              <div>
                <h3 className="text-xl font-bold text-foreground">Create New Client</h3>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-foreground/50 hover:text-foreground bg-white/5 p-2 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Fullname</label>
                    <input type="text" value={newUserForm.name} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email</label>
                    <input type="email" value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Mobile</label>
                    <input type="text" value={newUserForm.mobile} onChange={e => setNewUserForm({...newUserForm, mobile: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Currency</label>
                    <input type="text" value={newUserForm.currency} onChange={e => setNewUserForm({...newUserForm, currency: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Number</label>
                    <input type="text" value={newUserForm.accountNumber} onChange={e => setNewUserForm({...newUserForm, accountNumber: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">BTC Wallet</label>
                    <input type="text" value={newUserForm.btcWallet} onChange={e => setNewUserForm({...newUserForm, btcWallet: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Txn PIN</label>
                    <input type="text" value={newUserForm.pin} onChange={e => setNewUserForm({...newUserForm, pin: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">COT Code</label>
                    <input type="text" value={newUserForm.cot} onChange={e => setNewUserForm({...newUserForm, cot: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">SWIFT-SEC</label>
                    <input type="text" value={newUserForm.swift} onChange={e => setNewUserForm({...newUserForm, swift: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">IMF Code</label>
                    <input type="text" value={newUserForm.imf} onChange={e => setNewUserForm({...newUserForm, imf: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">TAX Code</label>
                    <input type="text" value={newUserForm.tax} onChange={e => setNewUserForm({...newUserForm, tax: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">AML-PASS</label>
                    <input type="text" value={newUserForm.aml} onChange={e => setNewUserForm({...newUserForm, aml: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Date of Birth</label>
                    <input type="date" value={newUserForm.dob} onChange={e => setNewUserForm({...newUserForm, dob: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</label>
                    <input type="text" value={newUserForm.nationality} onChange={e => setNewUserForm({...newUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
               </div>
               
               <button onClick={submitNewUser} className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Create User
               </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace('{/* Dynamic Toast Notification */}', add_user_modal_jsx + '\n      {/* Dynamic Toast Notification */}')

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
