import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Add a helper function
helper_func = """
function getInitialState<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function BankProvider({ children }: { children: ReactNode }) {
"""

content = content.replace("export function BankProvider({ children }: { children: ReactNode }) {", helper_func)

# Replace the initializations
content = content.replace(
    "const [users, setUsers] = useState<User[]>([defaultAdmin]);",
    "const [users, setUsers] = useState<User[]>(() => getInitialState('bank_users', [defaultAdmin]));"
)

content = content.replace(
    "const [currentUser, setCurrentUser] = useState<User | null>(null);",
    "const [currentUser, setCurrentUser] = useState<User | null>(() => getInitialState('bank_currentUser', null));"
)

content = content.replace(
    "const [transactions, setTransactions] = useState<Transaction[]>([]);",
    "const [transactions, setTransactions] = useState<Transaction[]>(() => getInitialState('bank_transactions', []));"
)

content = content.replace(
    "const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([]);",
    "const [virtualCards, setVirtualCards] = useState<VirtualCard[]>(() => getInitialState('bank_virtualCards', []));"
)

content = content.replace(
    "const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);",
    "const [loanApplications, setLoanApplications] = useState<LoanApplication[]>(() => getInitialState('bank_loanApplications', []));"
)

content = content.replace(
    "const [userApplications, setUserApplications] = useState<UserApplication[]>([]);",
    "const [userApplications, setUserApplications] = useState<UserApplication[]>(() => getInitialState('bank_userApplications', []));"
)

content = content.replace(
    "const [grantApplications, setGrantApplications] = useState<GrantApplication[]>([]);",
    "const [grantApplications, setGrantApplications] = useState<GrantApplication[]>(() => getInitialState('bank_grantApplications', []));"
)

# For adminSettings, it's a huge object, we can replace the start of it
admin_settings_init = """const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getInitialState('bank_adminSettings', {"""
content = content.replace("const [adminSettings, setAdminSettings] = useState<AdminSettings>({", admin_settings_init)

# Now we need to add the closing parenthesis for adminSettings.
# We'll find `requireCot: true,` and we know it ends shortly after. Let's find `}}` after `adminPassword: '12345',`
# Actually, the object ends with `});`

content = content.replace(
    """    whatsappNumber: '+1 234 567 8900',
    tidioId: '',
    timezone: 'UTC',
    installationType: 'Standard',
    smsEnabled: true
  });""",
    """    whatsappNumber: '+1 234 567 8900',
    tidioId: '',
    timezone: 'UTC',
    installationType: 'Standard',
    smsEnabled: true
  }));"""
)

# Add the useEffects to save state changes
use_effects = """
  useEffect(() => { window.localStorage.setItem('bank_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { window.localStorage.setItem('bank_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { window.localStorage.setItem('bank_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { window.localStorage.setItem('bank_virtualCards', JSON.stringify(virtualCards)); }, [virtualCards]);
  useEffect(() => { window.localStorage.setItem('bank_loanApplications', JSON.stringify(loanApplications)); }, [loanApplications]);
  useEffect(() => { window.localStorage.setItem('bank_userApplications', JSON.stringify(userApplications)); }, [userApplications]);
  useEffect(() => { window.localStorage.setItem('bank_grantApplications', JSON.stringify(grantApplications)); }, [grantApplications]);
  useEffect(() => { window.localStorage.setItem('bank_adminSettings', JSON.stringify(adminSettings)); }, [adminSettings]);
"""

content = content.replace("  const login = (email: string, pass: string) => {", use_effects + "\n  const login = (email: string, pass: string) => {")

with open('src/store.tsx', 'w') as f:
    f.write(content)

