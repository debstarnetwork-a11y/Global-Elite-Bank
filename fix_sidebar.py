with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const { currentUser } = useBank();',
    'const { currentUser, adminSettings } = useBank();'
)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
