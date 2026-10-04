import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Add sol: string; to InvestorWallets
content = re.sub(
    r'export interface InvestorWallets \{([\s\S]*?)balance: number;\n\}',
    r'export interface InvestorWallets {\1sol: string;\n  balance: number;\n}',
    content
)

with open('src/store.tsx', 'w') as f:
    f.write(content)
print("Updated InvestorWallets interface")
