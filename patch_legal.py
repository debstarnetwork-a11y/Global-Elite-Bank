import re

with open('src/components/LegalModals.tsx', 'r') as f:
    content = f.read()

# Make sure it imports useBank
if "import { useBank }" not in content:
    content = content.replace("import { X } from 'lucide-react';", "import { X } from 'lucide-react';\nimport { useBank } from '../store';")
    content = content.replace("export function PrivacyPolicy({ onClose }: { onClose: () => void }) {", "export function PrivacyPolicy({ onClose }: { onClose: () => void }) {\n  const { adminSettings } = useBank();")
    content = content.replace("export function TermsOfService({ onClose }: { onClose: () => void }) {", "export function TermsOfService({ onClose }: { onClose: () => void }) {\n  const { adminSettings } = useBank();")

content = content.replace("Global Elite Bank", "{adminSettings?.websiteName || 'Global Elite Bank'}")
content = content.replace("Global Elite", "{adminSettings?.websiteName || 'Global Elite Bank'}")

# Fix instances where it might be string literal inside JSX but the replace put curly braces where they are not allowed
# In JSX, `{adminSettings...}` inside text nodes is correct. Let's make sure it's correct inside text nodes.
# Actually, a simple replace inside the component body works if it's `{adminSettings...}`. But in string literals it's bad.
# Let's see if there are string literals.
