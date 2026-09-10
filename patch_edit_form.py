import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'value=\{editForm\.([a-zA-Z0-9_]+)\}', r'value={editForm.\1 || ""}', content)

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)
