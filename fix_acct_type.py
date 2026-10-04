import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add accountType to newUserForm state
content = content.replace(
    '''  const [newUserForm, setNewUserForm] = useState({
    name: '', email: '', mobile: '', currency: 'USD', accountNumber: '',
    btcWallet: '', pin: '', cot: '', swift: '', imf: '', tax: '', aml: '',
    dob: '', nationality: ''
  });''',
    '''  const [newUserForm, setNewUserForm] = useState({
    name: '', email: '', mobile: '', currency: 'USD', accountNumber: '', accountType: 'Checking',
    btcWallet: '', pin: '', cot: '', swift: '', imf: '', tax: '', aml: '',
    dob: '', nationality: ''
  });'''
)

# Reset it on handleOpenAddUser
content = content.replace(
    '''      name: '', email: '', mobile: '', currency: 'USD', 
      accountNumber: generateRandomCode('', 11),''',
    '''      name: '', email: '', mobile: '', currency: 'USD', accountType: 'Checking',
      accountNumber: generateRandomCode('', 11),'''
)

# Use it during user creation
content = content.replace(
    '''      accounts: [{
        id: `acc-${Date.now()}`,
        type: 'Checking',
        accountNumber: newUserForm.accountNumber,''',
    '''      accounts: [{
        id: `acc-${Date.now()}`,
        type: newUserForm.accountType as 'Checking' | 'Savings' | 'Business',
        accountNumber: newUserForm.accountNumber,'''
)

# Add dropdown in the form JSX
jsx_account_type = """
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Type</label>
                    <select value={newUserForm.accountType} onChange={e => setNewUserForm({...newUserForm, accountType: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                      <option value="Checking">Checking Account</option>
                      <option value="Savings">Savings Account</option>
                      <option value="Business">Business Account</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Number</label>
"""

content = content.replace(
    '''                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Account Number</label>''',
    jsx_account_type
)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
