import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'value=\{brokerWalletsForm\.([a-z]+)\}', r'value={brokerWalletsForm.\1 || ""}', content)

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)

with open('src/components/InvestorsWallet.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'value=\{walletsForm\.([a-z]+)\}', r'value={walletsForm.\1 || ""}', content)

with open('src/components/InvestorsWallet.tsx', 'w') as f:
    f.write(content)

