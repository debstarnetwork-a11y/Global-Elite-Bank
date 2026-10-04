import re

with open('src/components/TransactionHistory.tsx', 'r') as f:
    content = f.read()

# Add user filter
content = content.replace("const filteredTransactions = transactions.filter((tx) => {", "const filteredTransactions = transactions.filter((tx) => {\n    if (tx.userId !== currentUser?.id) return false;")

with open('src/components/TransactionHistory.tsx', 'w') as f:
    f.write(content)
