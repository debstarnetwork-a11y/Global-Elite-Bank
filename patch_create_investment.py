import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

old_create = """    const newInv: Investment = {
      ...inv,
      id: `inv-${Date.now()}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active'
    };"""

new_create = """    const newInv: Investment = {
      ...inv,
      id: `inv-${Date.now()}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'pending'
    };"""

content = content.replace(old_create, new_create)

# In InvestorsWallet.tsx it filters activeInvestments = myInvestments.filter(inv => inv.status === 'active');
# It probably needs to include pending investments in the active list or have a separate section.

with open('src/store.tsx', 'w') as f:
    f.write(content)
print("Updated createInvestment default status to pending")
