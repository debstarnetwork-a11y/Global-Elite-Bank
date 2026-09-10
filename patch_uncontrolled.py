import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

# Fix brokerWalletsForm
content = content.replace(
    'value={brokerWalletsForm.btc}', 'value={brokerWalletsForm.btc || ""}'
)
content = content.replace(
    'value={brokerWalletsForm.eth}', 'value={brokerWalletsForm.eth || ""}'
)
content = content.replace(
    'value={brokerWalletsForm.usdt}', 'value={brokerWalletsForm.usdt || ""}'
)
content = content.replace(
    'value={brokerWalletsForm.sol}', 'value={brokerWalletsForm.sol || ""}'
)

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)

with open('src/components/InvestorsWallet.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'value={walletsForm.btc}', 'value={walletsForm.btc || ""}'
)
content = content.replace(
    'value={walletsForm.eth}', 'value={walletsForm.eth || ""}'
)
content = content.replace(
    'value={walletsForm.usdt}', 'value={walletsForm.usdt || ""}'
)
content = content.replace(
    'value={walletsForm.sol}', 'value={walletsForm.sol || ""}'
)
# Note: we might have already used value={walletsForm.sol || ''}, the replace above might mess it up or not do anything if it doesn't match exactly. Let's just use regex.
