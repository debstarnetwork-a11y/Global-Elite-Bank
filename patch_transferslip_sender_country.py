import re

with open('src/components/TransferSlip.tsx', 'r') as f:
    content = f.read()

# Add country to interface
content = content.replace("    iban: string;", "    iban: string;\n    country?: string;")

# Add country to defaultTransaction
content = content.replace("    iban: \"CH93 0000 0000 0000 0000 0\",", "    iban: \"CH93 0000 0000 0000 0000 0\",\n    country: \"Switzerland\",")

# Add country to actual transaction
content = content.replace("      iban: maskAccountNumber(currentUser.accounts[0]?.iban || '')", "      iban: maskAccountNumber(currentUser.accounts[0]?.iban || ''),\n      country: \"Switzerland\"")


with open('src/components/TransferSlip.tsx', 'w') as f:
    f.write(content)

with open('src/components/TransactionHistory.tsx', 'r') as f:
    content2 = f.read()

content2 = content2.replace("iban: currentUser.accounts[0]?.iban ? \"**** **** **** \" + currentUser.accounts[0].iban.slice(-4) : ''", 
                            "iban: currentUser.accounts[0]?.iban ? \"**** **** **** \" + currentUser.accounts[0].iban.slice(-4) : '',\n              country: \"Switzerland\"")

with open('src/components/TransactionHistory.tsx', 'w') as f:
    f.write(content2)

print("Added sender country to TransferSlip and TransactionHistory")
