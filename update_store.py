import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Update AdminSettings
content = content.replace(
    'interface AdminSettings {\n  alertThreshold: number;\n  requireWireCodes: boolean;\n}',
    '''interface AdminSettings {
  alertThreshold: number;
  requireWireCodes: boolean;
  requireCot: boolean;
  requireSwift: boolean;
  requireImf: boolean;
  requireTax: boolean;
  requireAml: boolean;
}'''
)

# Update AdminSettings initialization
content = content.replace(
    '''  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    alertThreshold: 10000,
    requireWireCodes: true
  });''',
    '''  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    alertThreshold: 10000,
    requireWireCodes: true,
    requireCot: true,
    requireSwift: true,
    requireImf: true,
    requireTax: true,
    requireAml: true
  });'''
)

# Update User interface
content = content.replace(
    '''export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  status: UserStatus;
  accounts: Account[];
  showFullCardDetails: boolean;
}''',
    '''export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  status: UserStatus;
  accounts: Account[];
  showFullCardDetails: boolean;
  mobile?: string;
  currency?: string;
  btcWallet?: string;
  dob?: string;
  nationality?: string;
}'''
)

# Add adminCreateUser to Context type
content = content.replace(
    '''  register: (name: string, email: string, password?: string) => void;''',
    '''  register: (name: string, email: string, password?: string) => void;
  adminCreateUser: (user: Omit<User, "id">) => void;'''
)

# Add adminCreateUser function
admin_create_user_fn = '''
  const adminCreateUser = (userData: Omit<User, "id">) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
  };
'''

content = content.replace(
    '''  const register = (name: string, email: string, password?: string) => {''',
    admin_create_user_fn + '\n  const register = (name: string, email: string, password?: string) => {'
)

# Add adminCreateUser to Provider value
content = content.replace(
    '''login, logout, register, updateUserStatus,''',
    '''login, logout, register, adminCreateUser, updateUserStatus,'''
)

with open('src/store.tsx', 'w') as f:
    f.write(content)

