import re

with open('src/components/TransferForm.tsx', 'r') as f:
    content = f.read()

old_validation = """const handleNext = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!account || Number(amount) > account.balance) {
      setError('Insufficient funds.');
      return;
    }
    if (!recipient.name || !recipient.account) {
      setError('Please fill in recipient details.');
      return;
    }
    setError('');
    setStep('preview');
  };"""

new_validation = """const handleNext = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!account || Number(amount) > account.balance) {
      setError('Insufficient funds.');
      return;
    }
    if (!recipient.name.trim()) {
      setError('Please fill in the Recipient Name.');
      return;
    }
    if (!recipient.account.trim()) {
      setError('Please fill in the Account Number / IBAN.');
      return;
    }
    if (type !== 'internal' && !recipient.bank.trim()) {
      setError('Please fill in the Bank Name.');
      return;
    }
    if (type === 'wire' && !recipient.country.trim()) {
      setError('Please fill in the Country.');
      return;
    }
    
    setError('');
    setStep('preview');
  };"""
content = content.replace(old_validation, new_validation)

with open('src/components/TransferForm.tsx', 'w') as f:
    f.write(content)

print("Updated TransferForm validation")
