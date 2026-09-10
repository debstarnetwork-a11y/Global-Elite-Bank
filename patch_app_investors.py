import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace("import { TransactionHistory } from './components/TransactionHistory';", 
                          "import { TransactionHistory } from './components/TransactionHistory';\nimport { InvestorsWallet } from './components/InvestorsWallet';")


# Add component
content = content.replace("{currentView === 'Crypto' && <CryptoDashboard />}", 
                          "{currentView === 'Crypto' && <CryptoDashboard />}\n            {currentView === 'Investors' && <InvestorsWallet />}")


with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Added InvestorsWallet to App")
