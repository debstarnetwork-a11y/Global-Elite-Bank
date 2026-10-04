import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('Card PIN</label>', '4 Digit Transaction Pin</label>')
content = content.replace('SWIFT Code</label>', 'SWIFT-SEC Code</label>')
content = content.replace('IMF Code</label>', 'IMF Clearance Code</label>')
content = content.replace('AML Code</label>', 'AML-PASS Code</label>')

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
