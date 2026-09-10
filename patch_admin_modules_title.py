import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

old_title = '<h2 className="text-2xl font-bold text-foreground">WB CREDIT UNION users list</h2>'
new_title = '<h2 className="text-2xl font-bold text-foreground">Global Elite users\' information</h2>'

content = content.replace(old_title, new_title)

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)

print("AdminModules title updated")
