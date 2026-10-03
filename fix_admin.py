import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Update newUserForm state
content = content.replace(
    """  const [newUserForm, setNewUserForm] = useState({
    name: '', email: '', mobile: '', currency: 'USD', accountNumber: '', accountType: 'Checking',
    btcWallet: '', pin: '', cot: '', swift: '', imf: '', tax: '', aml: '',
    dob: '', nationality: ''
  });""",
    """  const [newUserForm, setNewUserForm] = useState({
    name: '', email: '', mobile: '', currency: 'USD', accountNumber: '', accountType: 'Checking',
    btcWallet: '', pin: '', cot: '', swift: '', imf: '', tax: '', aml: '',
    dob: '', nationality: '', password: '', zipCode: '', occupation: ''
  });"""
)

# 2. Update handleOpenAddUser
content = content.replace(
    """  const handleOpenAddUser = () => {
    setNewUserForm({
      name: '', email: '', mobile: '', currency: 'USD', accountType: 'Checking',
      accountNumber: generateRandomCode('', 11),
      btcWallet: '', pin: generateRandomCode('', 4),
      cot: generateRandomCode('', 7), swift: generateRandomCode('', 7),
      imf: generateRandomCode('', 6), tax: generateRandomCode('GEB', 5),
      aml: generateRandomCode('AML', 5), dob: '', nationality: ''
    });""",
    """  const handleOpenAddUser = () => {
    setNewUserForm({
      name: '', email: '', mobile: '', currency: 'USD', accountType: 'Checking',
      accountNumber: generateRandomCode('', 11),
      btcWallet: '', pin: generateRandomCode('', 4),
      cot: generateRandomCode('', 7), swift: generateRandomCode('', 7),
      imf: generateRandomCode('', 6), tax: generateRandomCode('GEB', 5),
      aml: generateRandomCode('AML', 5), dob: '', nationality: '', password: '', zipCode: '', occupation: ''
    });"""
)

# 3. Update adminCreateUser call
content = content.replace(
    """    adminCreateUser({
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
      nationality: newUserForm.nationality,""",
    """    adminCreateUser({
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
      occupation: newUserForm.occupation,"""
)


# 4. Replace currency input with select
currency_input = """                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Currency</label>
                    <input type="text" value={newUserForm.currency} onChange={e => setNewUserForm({...newUserForm, currency: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>"""

currency_select = """                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Currency</label>
                    <select value={newUserForm.currency} onChange={e => setNewUserForm({...newUserForm, currency: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="AED">AED - Emirati Dirham</option>
                    </select>
                  </div>"""
content = content.replace(currency_input, currency_select)

# 5. Replace nationality input with select
nationality_input = """                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</label>
                    <input type="text" value={newUserForm.nationality} onChange={e => setNewUserForm({...newUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>"""

nationality_select = """                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</label>
                    <select value={newUserForm.nationality} onChange={e => setNewUserForm({...newUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                      <option value="">Select Country</option>
                      {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Switzerland', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Japan', 'South Korea', 'Singapore', 'United Arab Emirates', 'Saudi Arabia', 'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Nigeria', 'Kenya', 'India', 'China'].map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>"""
content = content.replace(nationality_input, nationality_select)

# 6. Add Password, Zip Code, and Occupation fields
new_fields = """                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Password</label>
                    <input type="text" value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" placeholder="Default: password123" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Zip / Postal Code</label>
                    <input type="text" value={newUserForm.zipCode} onChange={e => setNewUserForm({...newUserForm, zipCode: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Occupation</label>
                    <input type="text" value={newUserForm.occupation} onChange={e => setNewUserForm({...newUserForm, occupation: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
               </div>"""
content = content.replace('               </div>', new_fields)


with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
