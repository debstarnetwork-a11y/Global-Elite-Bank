import os
import glob
import re

for filepath in glob.glob('src/**/*.tsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find all function declarations
    funcs = re.finditer(r'(?:export function|function|const)\s+([A-Za-z0-9_]+)\s*(?:=\s*)?\(.*?\)\s*(?::\s*[^{]+)?\s*\{', content)
    
    for match in funcs:
        func_name = match.group(1)
        # Find the end of the function block (naive brace matching)
        start_idx = match.end()
        brace_count = 1
        idx = start_idx
        while idx < len(content) and brace_count > 0:
            if content[idx] == '{':
                brace_count += 1
            elif content[idx] == '}':
                brace_count -= 1
            idx += 1
        
        func_body = content[start_idx:idx]
        
        # Check if adminSettings is used
        if 'adminSettings' in func_body:
            # Check if it's destructured
            if not re.search(r'const\s+\{[^}]*adminSettings[^}]*\}\s*=\s*useBank', func_body):
                if 'useBank' in func_body:
                    print(f"{filepath}: Function {func_name} uses adminSettings but doesn't destructure it from useBank")
                else:
                    if func_name not in ['useBank', 'BankProvider'] and 'AdminSettings' not in func_body:
                        print(f"{filepath}: Function {func_name} uses adminSettings but NO useBank found")

