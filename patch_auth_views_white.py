import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

old_logo = '<img src="/logo.png" alt="Global Elite Logo" className="w-16 h-16 mb-3 object-contain" />'
new_logo = '<img src="/logo.png" alt="Global Elite Logo" className="w-16 h-16 mb-3 object-contain brightness-0 invert opacity-90" />'

content = content.replace(old_logo, new_logo)

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)
print("Updated img class to be white")
