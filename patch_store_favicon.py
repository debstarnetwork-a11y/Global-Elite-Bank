import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""  logoUrl?: string;""",
"""  logoUrl?: string;
  faviconUrl?: string;"""
)

with open('src/store.tsx', 'w') as f:
    f.write(content)
