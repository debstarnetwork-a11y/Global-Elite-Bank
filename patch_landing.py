import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

if "import { useBank }" not in content:
    content = content.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { useBank } from '../store';")
    content = content.replace("export function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {", "export function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {\n  const { adminSettings } = useBank();")

content = content.replace("Global Elite Bank", "{adminSettings?.websiteName || 'Global Elite Bank'}")
# There is a static string in quotes for the review, we need to fix that if it got replaced with curly braces.
content = content.replace("text: '{adminSettings?.websiteName || \\'Global Elite Bank\\'}", "text: `${adminSettings?.websiteName || 'Global Elite Bank'}")
content = content.replace("text: '{adminSettings?.websiteName || 'Global Elite Bank'}", "text: `${adminSettings?.websiteName || 'Global Elite Bank'}")

# The logo and title
content = content.replace("Global Elite", "{adminSettings?.websiteName || 'Global Elite Bank'}")
content = content.replace("Swiss Private Bank", "")

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
