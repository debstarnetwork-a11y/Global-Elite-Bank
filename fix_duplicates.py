import re

with open('src/store.tsx', 'r') as f:
    code = f.read()

# Fix interface
code = re.sub(r'  requireCode1: boolean;\n  requireCode2: boolean;\n  requireCode3: boolean;\n  requireCode4: boolean;\n  requireCode5: boolean;\n', '', code)

# Fix default state
code = re.sub(r'    requireCode1: true,\n    requireCode2: true,\n    requireCode3: true,\n    requireCode4: true,\n    requireCode5: true,\n', '', code)

with open('src/store.tsx', 'w') as f:
    f.write(code)

print("Duplicates removed.")
