with open('src/components/TransferSlip.tsx', 'r') as f:
    content = f.read()

content = content.replace("  return (\n  const content = (", "  const content = (")

with open('src/components/TransferSlip.tsx', 'w') as f:
    f.write(content)
