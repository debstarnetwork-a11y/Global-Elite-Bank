import re

for file_name in ['src/components/TransactionHistory.tsx', 'src/components/TransferSlip.tsx', 'src/components/QuickActions.tsx']:
    try:
        with open(file_name, 'r') as f:
            content = f.read()

        if "import { useBank }" not in content:
            content = content.replace("from 'lucide-react';", "from 'lucide-react';\nimport { useBank } from '../store';")
            
            # This is a basic injection, might need manual if function signatures vary
            if 'TransferSlip' in file_name:
                content = content.replace("export function TransferSlip({ transaction, onClose }: { transaction: any; onClose: () => void }) {", "export function TransferSlip({ transaction, onClose }: { transaction: any; onClose: () => void }) {\n  const { adminSettings } = useBank();")
            elif 'TransactionHistory' in file_name:
                content = content.replace("export function TransactionHistory({ transactions }: { transactions: any[] }) {", "export function TransactionHistory({ transactions }: { transactions: any[] }) {\n  const { adminSettings } = useBank();")
            elif 'QuickActions' in file_name:
                pass # QuickActions already imports useBank! Let's check

        content = content.replace("'Global Elite Bank'", "adminSettings?.websiteName || 'Global Elite Bank'")
        content = content.replace('"Global Elite Bank"', "adminSettings?.websiteName || 'Global Elite Bank'")
        content = content.replace("Global Elite Bank", "{adminSettings?.websiteName || 'Global Elite Bank'}")
        
        # fix string literals if there are any
        content = content.replace("bank: {adminSettings?.websiteName || 'Global Elite Bank'}", "bank: adminSettings?.websiteName || 'Global Elite Bank'")

        with open(file_name, 'w') as f:
            f.write(content)
    except Exception as e:
        print(f"Error on {file_name}: {e}")

