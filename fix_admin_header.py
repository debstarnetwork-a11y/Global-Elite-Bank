import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<h2 className="text-2xl font-bold text-foreground">Command Center</h2>',
    '<h2 className="text-2xl font-bold text-foreground">Admin Portal</h2>'
)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
