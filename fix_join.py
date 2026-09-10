import re
with open('src/components/RecentTransactions.tsx', 'r') as f:
    content = f.read()

content = content.replace("].join('\\\n');", "].join('\\n');")
content = content.replace("].join('", "].join('\\n'); //") # just in case

with open('src/components/RecentTransactions.tsx', 'w') as f:
    f.write(content)
