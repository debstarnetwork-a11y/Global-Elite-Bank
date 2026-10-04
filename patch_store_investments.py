import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Add interfaces
new_interfaces = """export interface BrokerWallets {
  btc: string;
  eth: string;
  usdt: string;
}

export interface InvestorWallets {
  btc: string;
  eth: string;
  usdt: string;
  balance: number;
}

export interface Investment {
  id: string;
  userId: string;
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDT' | string;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'matured' | 'withdrawn';
  txHash: string;
  profit?: number;
}

export interface Account {"""
content = content.replace("export interface Account {", new_interfaces)


# Add to User
content = content.replace("  residentialAddress?: string;", "  residentialAddress?: string;\n  investorWallets?: InvestorWallets;")


# Add to AdminSettings
content = content.replace("  contactAddress?: string;", "  contactAddress?: string;\n  brokerWallets?: BrokerWallets;")

# Add to BankContextType
content = content.replace("  contactInquiries: ContactInquiry[];", "  contactInquiries: ContactInquiry[];\n  investments: Investment[];\n  createInvestment: (inv: Omit<Investment, 'id' | 'startDate' | 'endDate' | 'status'>) => void;\n  updateInvestment: (id: string, updates: Partial<Investment>) => void;")


# Add to default AdminSettings
content = content.replace("contactAddress: '123 Elite Way, Wall Street, NY 10005, USA'", "contactAddress: '123 Elite Way, Wall Street, NY 10005, USA',\n  brokerWallets: { btc: 'bc1q...', eth: '0x...', usdt: '0x...' }")


# Add state to BankProvider
content = content.replace("const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);", "const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);\n  const [investments, setInvestments] = useState<Investment[]>([]);")


# Add sync effect (if there is one)
if "localStorage.setItem('bank_contact_inquiries'" in content:
    content = content.replace("localStorage.setItem('bank_contact_inquiries', JSON.stringify(contactInquiries));", "localStorage.setItem('bank_contact_inquiries', JSON.stringify(contactInquiries));\n    localStorage.setItem('bank_investments', JSON.stringify(investments));")
    
if "const storedContactInquiries = localStorage.getItem('bank_contact_inquiries');" in content:
    content = content.replace("const storedContactInquiries = localStorage.getItem('bank_contact_inquiries');", "const storedContactInquiries = localStorage.getItem('bank_contact_inquiries');\n      const storedInvestments = localStorage.getItem('bank_investments');\n      if (storedInvestments) setInvestments(JSON.parse(storedInvestments));")


# Add functions
new_functions = """
  const createInvestment = (inv: Omit<Investment, 'id' | 'startDate' | 'endDate' | 'status'>) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + inv.durationDays);
    
    const newInv: Investment = {
      ...inv,
      id: `inv-${Date.now()}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active'
    };
    setInvestments(prev => [newInv, ...prev]);
  };
  
  const updateInvestment = (id: string, updates: Partial<Investment>) => {
    setInvestments(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
  };
  
  const createTransaction ="""
content = content.replace("  const createTransaction =", new_functions)


# Add to context value
content = content.replace("contactInquiries, createContactInquiry", "contactInquiries, createContactInquiry, investments, createInvestment, updateInvestment")


with open('src/store.tsx', 'w') as f:
    f.write(content)

print("Patched store.tsx")
