import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Remove the create-user from navItems
content = content.replace(
"""    { id: 'create-user', label: 'Create New user', icon: UserPlus },""",
""
)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
