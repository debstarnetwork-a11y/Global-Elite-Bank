with open('src/store.tsx', 'r') as f:
    content = f.read()

content = content.replace("  adminPassword?: string;\n}", "  adminPassword?: string;\n  contactEmail?: string;\n  contactPhone?: string;\n  contactAddress?: string;\n}")

old_admin_settings = """  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    alertThreshold: 50000,
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
new_admin_settings = """  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    alertThreshold: 50000,
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
    contactAddress: '123 Banking Street, Financial District'
  });"""
content = content.replace(old_admin_settings, new_admin_settings)

with open('src/store.tsx', 'w') as f:
    f.write(content)
