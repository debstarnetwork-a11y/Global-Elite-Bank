import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""  AdminTransactionsHistory, AdminVirtualCards, AdminEmailServices, AdminAdministrators 
} from './AdminModules';""",
"""  AdminTransactionsHistory, AdminVirtualCards, AdminEmailServices, AdminAdministrators, AdminManageUsers 
} from './AdminModules';""")

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
