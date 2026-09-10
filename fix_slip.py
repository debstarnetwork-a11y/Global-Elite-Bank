import re

with open('src/components/TransferSlip.tsx', 'r') as f:
    content = f.read()

content = content.replace("adminSettings?.websiteName || '{adminSettings?.websiteName || 'Global Elite Bank'}'", "adminSettings?.websiteName || 'Global Elite Bank'")

with open('src/components/TransferSlip.tsx', 'w') as f:
    f.write(content)
