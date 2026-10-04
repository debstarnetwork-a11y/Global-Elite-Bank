import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Add sol: string; to BrokerWallets
content = re.sub(
    r'export interface BrokerWallets \{([\s\S]*?)\}',
    r'export interface BrokerWallets {\1  sol: string;\n}',
    content
)

with open('src/store.tsx', 'w') as f:
    f.write(content)
print("Updated BrokerWallets interface")
