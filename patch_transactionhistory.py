import re

with open('src/components/TransactionHistory.tsx', 'r') as f:
    content = f.read()

old_sender = """            sender: {
              name: currentUser.name,
              account: currentUser.accounts[0]?.accountNumber || '',
              bank: adminSettings?.websiteName || 'Global Elite Bank',
              iban: currentUser.accounts[0]?.iban || ''
            },"""

new_sender = """            sender: {
              name: currentUser.name,
              account: currentUser.accounts[0]?.accountNumber ? "**** **** **** " + currentUser.accounts[0].accountNumber.slice(-4) : '',
              bank: adminSettings?.websiteName || 'Global Elite Bank',
              iban: currentUser.accounts[0]?.iban ? "**** **** **** " + currentUser.accounts[0].iban.slice(-4) : ''
            },"""
content = content.replace(old_sender, new_sender)

# Need to make sure remarks are included in selectedTx too!
old_recipient = """            recipient: {
              name: selectedTx.recipientDetails?.name || '',
              account: selectedTx.recipientDetails?.account || '',
              bank: selectedTx.recipientDetails?.bank || adminSettings?.websiteName || 'Global Elite Bank',
              country: selectedTx.recipientDetails?.country || ''
            },"""

new_recipient = """            recipient: {
              name: selectedTx.recipientDetails?.name || '',
              account: selectedTx.recipientDetails?.account || '',
              bank: selectedTx.recipientDetails?.bank || adminSettings?.websiteName || 'Global Elite Bank',
              country: selectedTx.recipientDetails?.country || '',
              remarks: selectedTx.recipientDetails?.remarks || ''
            },"""
content = content.replace(old_recipient, new_recipient)


with open('src/components/TransactionHistory.tsx', 'w') as f:
    f.write(content)
print("Masked sender account in TransactionHistory selected modal")
