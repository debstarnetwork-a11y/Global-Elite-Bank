import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

modal_balance = """
                  <p className="text-4xl font-bold text-foreground font-mono">{activeUser.accounts?.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}</p>
"""
content = re.sub(r'<p className="text-4xl font-bold text-foreground font-mono">\{activeUser\.balance\}</p>', modal_balance, content)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
