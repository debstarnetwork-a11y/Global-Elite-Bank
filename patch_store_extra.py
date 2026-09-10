import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

types_patch = """export interface VirtualCard {
  id: string;
  userId: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  status: 'active' | 'frozen' | 'pending';
  type: 'virtual' | 'physical';
}

export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface UserApplication {
  id: string;
  name: string;
  email: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface GrantApplication {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}
"""

content = content.replace("export interface Transaction {", types_patch + "\nexport interface Transaction {")

state_interface_patch = """  users: User[];
  currentUser: User | null;
  transactions: Transaction[];
  virtualCards: VirtualCard[];
  loanApplications: LoanApplication[];
  userApplications: UserApplication[];
  grantApplications: GrantApplication[];"""

content = content.replace("  users: User[];\n  currentUser: User | null;\n  transactions: Transaction[];", state_interface_patch)

funcs_patch = """  updateTransactionStatus: (txId: string, status: 'pending' | 'completed' | 'failed') => void;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  createVirtualCard: (card: Omit<VirtualCard, 'id'>) => void;
  updateVirtualCardStatus: (cardId: string, status: VirtualCard['status']) => void;
  createLoanApplication: (loan: Omit<LoanApplication, 'id' | 'date'>) => void;
  updateLoanApplicationStatus: (loanId: string, status: LoanApplication['status']) => void;
  updateUserApplicationStatus: (appId: string, status: UserApplication['status']) => void;
  createGrantApplication: (grant: Omit<GrantApplication, 'id' | 'date'>) => void;
  updateGrantApplicationStatus: (grantId: string, status: GrantApplication['status']) => void;
}"""

content = content.replace("""  updateTransactionStatus: (txId: string, status: 'pending' | 'completed' | 'failed') => void;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
}""", funcs_patch)


state_init_patch = """  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([]);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [userApplications, setUserApplications] = useState<UserApplication[]>([]);
  const [grantApplications, setGrantApplications] = useState<GrantApplication[]>([]);"""

content = content.replace("  const [transactions, setTransactions] = useState<Transaction[]>([]);", state_init_patch)

state_funcs_patch = """  const updateAdminSettings = (newSettings: Partial<AdminSettings>) => setAdminSettings(prev => ({ ...prev, ...newSettings }));
  
  const createVirtualCard = (card: Omit<VirtualCard, 'id'>) => {
    const newCard: VirtualCard = { ...card, id: `card-${Date.now()}` };
    setVirtualCards(prev => [newCard, ...prev]);
  };
  
  const updateVirtualCardStatus = (cardId: string, status: VirtualCard['status']) => {
    setVirtualCards(prev => prev.map(c => c.id === cardId ? { ...c, status } : c));
  };

  const createLoanApplication = (loan: Omit<LoanApplication, 'id' | 'date'>) => {
    const newLoan: LoanApplication = { ...loan, id: `loan-${Date.now()}`, date: new Date().toISOString() };
    setLoanApplications(prev => [newLoan, ...prev]);
  };

  const updateLoanApplicationStatus = (loanId: string, status: LoanApplication['status']) => {
    setLoanApplications(prev => prev.map(l => l.id === loanId ? { ...l, status } : l));
  };

  const updateUserApplicationStatus = (appId: string, status: UserApplication['status']) => {
    setUserApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  };

  const createGrantApplication = (grant: Omit<GrantApplication, 'id' | 'date'>) => {
    const newGrant: GrantApplication = { ...grant, id: `grant-${Date.now()}`, date: new Date().toISOString() };
    setGrantApplications(prev => [newGrant, ...prev]);
  };

  const updateGrantApplicationStatus = (grantId: string, status: GrantApplication['status']) => {
    setGrantApplications(prev => prev.map(g => g.id === grantId ? { ...g, status } : g));
  };"""

content = content.replace("  const createTransaction = (txn: Omit<Transaction, 'id' | 'date'>) => {", state_funcs_patch + "\n\n  const createTransaction = (txn: Omit<Transaction, 'id' | 'date'>) => {")

ret_patch = """    updateTransactionStatus,
    updateAdminSettings,
    virtualCards,
    createVirtualCard,
    updateVirtualCardStatus,
    loanApplications,
    createLoanApplication,
    updateLoanApplicationStatus,
    userApplications,
    updateUserApplicationStatus,
    grantApplications,
    createGrantApplication,
    updateGrantApplicationStatus
  };"""

content = content.replace("""    updateTransactionStatus,
    updateAdminSettings: (newSettings) => setAdminSettings(prev => ({ ...prev, ...newSettings }))
  };""", ret_patch)

with open('src/store.tsx', 'w') as f:
    f.write(content)
