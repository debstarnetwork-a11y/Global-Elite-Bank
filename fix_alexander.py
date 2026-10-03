import re

files_to_fix = [
    ('src/components/PlaceholderViews.tsx', "currentUser?.name || 'Alexander von Drachen'", "currentUser?.name || 'User'"),
    ('src/components/Header.tsx', 'Alexander von Drachen', 'Welcome'),
    ('src/components/TransferSlip.tsx', 'Alexander von Drachen', 'Client Name'),
    ('src/components/AuthViews.tsx', 'Alexander von Drachen', 'John Doe'),
    ('src/components/LandingPage.tsx', 'Alexander V.', 'John D.'),
]

for filepath, search_str, replace_str in files_to_fix:
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # for Header, I should properly insert the currentUser name
        if filepath == 'src/components/Header.tsx':
            content = content.replace("import { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';\nimport { useBank } from '../store';")
            content = content.replace("export function Header() {", "export function Header() {\n  const { currentUser } = useBank();")
            content = content.replace('<p className="text-sm font-bold text-foreground">Alexander von Drachen</p>', '<p className="text-sm font-bold text-foreground">{currentUser?.name || \'User\'}</p>')
        elif filepath == 'src/components/TransferSlip.tsx':
            content = content.replace('name: "Alexander von Drachen"', 'name: currentUser?.name || "User"')
            if "import { useBank }" not in content:
                 content = content.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { useBank } from '../store';")
            content = content.replace("export function TransferSlip() {", "export function TransferSlip() {\n  const { currentUser } = useBank();")
        else:
            content = content.replace(search_str, replace_str)
            
        with open(filepath, 'w') as f:
            f.write(content)
    except Exception as e:
        print(f"Error modifying {filepath}: {e}")

