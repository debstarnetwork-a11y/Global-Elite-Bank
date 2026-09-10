import re

with open('src/components/TransactionHistory.tsx', 'r') as f:
    content = f.read()

content = content.replace("type: selectedTx.type.toUpperCase(),", "type: selectedTx.type.toUpperCase(),\n            rawType: selectedTx.type,")

with open('src/components/TransactionHistory.tsx', 'w') as f:
    f.write(content)
print("Added rawType to TransactionHistory")
