import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("`${adminSettings?.websiteName || '{adminSettings?.websiteName || 'Global Elite Bank'} Bank'}", "`${adminSettings?.websiteName || 'Global Elite Bank'}")
content = content.replace("${adminSettings?.websiteName || '{adminSettings?.websiteName || 'Global Elite Bank'}", "${adminSettings?.websiteName || 'Global Elite Bank'}")
content = content.replace("`${adminSettings?.websiteName || 'Global Elite Bank'} transformed how we manage generational wealth. Their crypto custody and seamless cross-border transfers are years ahead of traditional institutions.'", "`${adminSettings?.websiteName || 'Global Elite Bank'} transformed how we manage generational wealth. Their crypto custody and seamless cross-border transfers are years ahead of traditional institutions.`")


with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
