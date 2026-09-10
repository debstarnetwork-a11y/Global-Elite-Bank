with open('src/store.tsx', 'r') as f:
    content = f.read()

content = content.replace("role: 'admin',\n  status: 'inactive',", "role: 'admin',\n  status: 'active',")

with open('src/store.tsx', 'w') as f:
    f.write(content)
