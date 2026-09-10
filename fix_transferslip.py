import re

with open('src/components/TransferSlip.tsx', 'r') as f:
    content = f.read()

content = content.replace("const { transactions, currentUser } = useBank();", "const { transactions, currentUser, adminSettings } = useBank();")

with open('src/components/TransferSlip.tsx', 'w') as f:
    f.write(content)
