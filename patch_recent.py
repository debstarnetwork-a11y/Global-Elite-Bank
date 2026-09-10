import re

with open('src/components/RecentTransactions.tsx', 'r') as f:
    content = f.read()

# Add useBank if not present
if "import { useBank }" not in content:
    content = content.replace("import { ArrowDownLeft, ArrowUpRight, Search, Filter } from 'lucide-react';", "import { ArrowDownLeft, ArrowUpRight, Search, Filter } from 'lucide-react';\nimport { useBank } from '../store';")
    content = content.replace("export function RecentTransactions({ transactions }: { transactions: any[] }) {", "export function RecentTransactions({ transactions }: { transactions: any[] }) {\n  const { adminSettings } = useBank();")

content = content.replace("'Global Elite Bank'", "adminSettings?.websiteName || 'Global Elite Bank'")

with open('src/components/RecentTransactions.tsx', 'w') as f:
    f.write(content)
