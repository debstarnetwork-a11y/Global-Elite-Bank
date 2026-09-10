import re

with open('src/components/TransferSlip.tsx', 'r') as f:
    content = f.read()

# Update mask helper and numberToWords
old_utils = """// Utility functions
function numberToWords(amount: number): string {
  return "Fifteen Million US Dollars";
}"""

new_utils = """// Utility functions
function numberToWords(amount: number): string {
  return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) + ' ONLY';
}

function maskAccountNumber(account: string): string {
  if (!account || account.length < 4) return "****";
  return "**** **** **** " + account.slice(-4);
}"""
content = content.replace(old_utils, new_utils)

# Use maskAccountNumber for sender account
old_sender_mapping = """    sender: {
      name: currentUser.name,
      account: currentUser.accounts[0]?.accountNumber || '',
      bank: adminSettings?.websiteName || 'Global Elite Bank',
      iban: currentUser.accounts[0]?.iban || ''
    },"""

new_sender_mapping = """    sender: {
      name: currentUser.name,
      account: maskAccountNumber(currentUser.accounts[0]?.accountNumber || ''),
      bank: adminSettings?.websiteName || 'Global Elite Bank',
      iban: maskAccountNumber(currentUser.accounts[0]?.iban || '')
    },"""
content = content.replace(old_sender_mapping, new_sender_mapping)


with open('src/components/TransferSlip.tsx', 'w') as f:
    f.write(content)

print("Masked sender account in TransferSlip and fixed numberToWords")
