import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

content = content.replace("const result = login(email, password);", "const result = login(email, password, isAdminPath);")

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)

print("Updated login call in AuthViews.tsx")
