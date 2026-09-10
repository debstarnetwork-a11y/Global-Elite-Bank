import re

with open('src/components/TransactionHistory.tsx', 'r') as f:
    content = f.read()

# Remove date-fns import
content = content.replace("import { format } from 'date-fns';", "")

# Fix format calls
# from: format(new Date(tx.date), 'MMM dd, yyyy HH:mm')
# to: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

content = content.replace("format(new Date(tx.date), 'MMM dd, yyyy HH:mm')", "new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })")

# from: format(new Date(tx.date), 'MMM dd, yyyy')
# to: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })

content = content.replace("format(new Date(tx.date), 'MMM dd, yyyy')", "new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })")

with open('src/components/TransactionHistory.tsx', 'w') as f:
    f.write(content)
