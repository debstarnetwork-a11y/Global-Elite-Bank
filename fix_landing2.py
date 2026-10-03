import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("{adminSettings?.websiteName || '{adminSettings?.websiteName || 'Global Elite Bank'} Bank'}", "adminSettings?.websiteName || 'Global Elite Bank'")

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
