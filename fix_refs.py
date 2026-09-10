import re

def fix_file(filename, function_name, original_destructure=None):
    with open(filename, 'r') as f:
        content = f.read()
    
    if original_destructure:
        if 'adminSettings' not in original_destructure:
            new_destructure = original_destructure.replace("} = useBank()", ", adminSettings } = useBank()")
            content = content.replace(original_destructure, new_destructure)
    else:
        # We need to insert `const { adminSettings } = useBank();` just after the function declaration.
        # Find the function declaration
        pattern = r"(export function " + function_name + r"\s*\(.*?\)\s*\{)"
        match = re.search(pattern, content)
        if match:
            # Check if it already has useBank
            if "useBank()" in content[match.end():match.end()+100]:
                if "adminSettings" not in content[match.end():match.end()+100]:
                    # Has useBank but no adminSettings
                    content = re.sub(r"(const \{.*?)( \} = useBank\(\);)", r"\1, adminSettings\2", content, count=1)
            else:
                content = content[:match.end()] + "\n  const { adminSettings } = useBank();" + content[match.end():]
    
    with open(filename, 'w') as f:
        f.write(content)

fix_file('src/components/QuickActions.tsx', 'QuickActions')
fix_file('src/components/TransactionHistory.tsx', 'TransactionHistory', "const { transactions, currentUser } = useBank();")
fix_file('src/components/RecentTransactions.tsx', 'RecentTransactions', "const { transactions, currentUser } = useBank();")
fix_file('src/components/LandingPage.tsx', 'LandingPage')

