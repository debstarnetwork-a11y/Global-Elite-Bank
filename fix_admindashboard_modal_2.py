import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("{activeUser.tier}", "Premium")
content = content.replace("{activeUser.joined}", "Recent")

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
