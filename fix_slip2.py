import re

with open('src/components/TransferSlip.tsx', 'r') as f:
    content = f.read()

# Replace it in defaultTransaction
content = content.replace("bank: adminSettings?.websiteName || 'Global Elite Bank',", "bank: 'Global Elite Bank',", 1)

with open('src/components/TransferSlip.tsx', 'w') as f:
    f.write(content)
