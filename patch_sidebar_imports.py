import re

with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

# Add missing imports from lucide-react
# Let's replace the whole import block for lucide-react just to be safe
import_block = """import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowRightLeft, 
  BarChart3, 
  ShieldCheck, 
  User, 
  Settings,
  LogOut,
  Building2,
  Bitcoin,
  FileText,
  ShieldAlert,
  History,
  Home,
  Wallet,
  BarChart2,
  TrendingUp
} from 'lucide-react';"""

content = re.sub(r"import \{\s+LayoutDashboard,.*?from 'lucide-react';", import_block, content, flags=re.DOTALL)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)

print("Fixed Sidebar imports")
