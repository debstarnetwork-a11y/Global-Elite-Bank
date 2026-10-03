import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

old_defaults = """  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    alertThreshold: 10000,
    requireWireCodes: true,
    requireCot: true,
    requireSwift: true,
    requireImf: true,
    requireTax: true,
    requireAml: true,
    logoUrl: '',
    adminEmail: 'mizbrymo@gmail.com',
    adminPassword: '12345'
  });"""

new_defaults = """  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    alertThreshold: 10000,
    requireWireCodes: true,
    requireCot: true,
    requireSwift: true,
    requireImf: true,
    requireTax: true,
    requireAml: true,
    logoUrl: '',
    adminEmail: 'mizbrymo@gmail.com',
    adminPassword: '12345',
    contactEmail: 'support@bank.com',
    contactPhone: '+1 (555) 000-0000',
    contactAddress: '109, Feldgüetliweg Meilen Bezirk Meilen Zurich 8706 Switzerland',
    websiteName: 'WB CREDIT UNION',
    websiteTitle: 'Welcome to Global Elite Bank',
    websiteKeywords: 'online bank',
    websiteUrl: 'https://wbcu.net',
    whatsappNumber: '+1 (207) 613-1332',
    tidioId: '',
    timezone: 'Pacific/Wallis',
    installationType: 'Main-Domain',
    smsEnabled: true,
    faviconUrl: '',
    paymentMethods: [
      { id: '1', name: 'Credit Card', type: 'currency', usedFor: 'both', status: 'enabled' },
      { id: '2', name: 'BUSD', type: 'crypto', usedFor: 'withdrawal', status: 'disabled' },
      { id: '3', name: 'USDT', type: 'crypto', usedFor: 'both', status: 'enabled' },
      { id: '4', name: 'Bank Transfer', type: 'currency', usedFor: 'both', status: 'enabled' },
      { id: '5', name: 'Paypal', type: 'currency', usedFor: 'both', status: 'enabled' },
      { id: '6', name: 'Litecoin', type: 'crypto', usedFor: 'both', status: 'disabled' },
      { id: '7', name: 'Ethereum', type: 'crypto', usedFor: 'withdrawal', status: 'disabled' },
      { id: '8', name: 'Bitcoin', type: 'crypto', usedFor: 'both', status: 'enabled' }
    ]
  });"""

content = content.replace(old_defaults, new_defaults)

# add updateAdminSettings to context type
old_ctx = """  updateTransactionStatus: (txId: string, status: 'pending' | 'completed' | 'failed') => void;
}"""
new_ctx = """  updateTransactionStatus: (txId: string, status: 'pending' | 'completed' | 'failed') => void;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
}"""
content = content.replace(old_ctx, new_ctx)

old_ret = """    updateTransactionStatus
  };

  return (
    <BankContext.Provider value={value}>"""
new_ret = """    updateTransactionStatus,
    updateAdminSettings: (newSettings) => setAdminSettings(prev => ({ ...prev, ...newSettings }))
  };

  return (
    <BankContext.Provider value={value}>"""
content = content.replace(old_ret, new_ret)

with open('src/store.tsx', 'w') as f:
    f.write(content)
