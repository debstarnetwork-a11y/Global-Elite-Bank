import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "export type UserStatus = 'active' | 'dormant' | 'suspended' | 'blocked';",
    "export type UserStatus = 'active' | 'inactive' | 'dormant' | 'suspended' | 'blocked' | 'frozen';"
)

with open('src/store.tsx', 'w') as f:
    f.write(content)
