with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { motion } from 'motion/react';", "import { useEffect } from 'react';\nimport { motion } from 'motion/react';\nimport { useBank } from '../store';")
content = content.replace("import { \n  LayoutDashboard,\n  CreditCard,\n  ArrowRightLeft,\n  BarChart3,\n  ShieldCheck,\n  User,\n  Settings,\n  LogOut,", "import { \n  LayoutDashboard as Home,\n  ArrowRightLeft as Clock,\n  Bitcoin,\n  Activity,\n  ShieldCheck as Shield,\n  LayoutDashboard,\n  CreditCard,\n  ArrowRightLeft,\n  BarChart3,\n  ShieldCheck,\n  User,\n  Settings,\n  LogOut,")

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
