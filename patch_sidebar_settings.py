import re

with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

content = content.replace("{ icon: ShieldCheck, label: 'Security', id: 'Security' }",
                          "{ icon: Settings, label: 'Settings', id: 'Settings' }")

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
print("Patched Sidebar")
