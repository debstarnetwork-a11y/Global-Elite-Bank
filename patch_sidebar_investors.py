import re

with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

# Add TrendingUp to imports
content = content.replace("import { Home, History, Wallet, Settings, LogOut, ShieldAlert, CreditCard, BarChart2 } from 'lucide-react';", 
                          "import { Home, History, Wallet, Settings, LogOut, ShieldAlert, CreditCard, BarChart2, TrendingUp } from 'lucide-react';")

# Add Investors to navItems
nav_items = """  const navItems = [
    { icon: Home, label: 'Dashboard', id: 'Dashboard' },
    { icon: History, label: 'Transaction History', id: 'History' },
    { icon: Wallet, label: 'Crypto & FX', id: 'Crypto' },
    { icon: TrendingUp, label: 'Investors Wallet', id: 'Investors' },
    { icon: CreditCard, label: 'Virtual Cards', id: 'Cards' },
    { icon: BarChart2, label: 'Analytics', id: 'Analytics' },
    { icon: Settings, label: 'Settings', id: 'Settings' },
  ];"""
  
content = re.sub(r"const navItems = \[.*?\];", nav_items, content, flags=re.DOTALL)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
print("Added Investors to Sidebar")
