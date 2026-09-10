import re

# Fix QuickActions.tsx
with open('src/components/QuickActions.tsx', 'r') as f:
    content = f.read()

content = content.replace("export function QuickActions() {", "export function QuickActions({ setCurrentView }: { setCurrentView?: (v: string) => void }) {")
content = content.replace("<TransferForm type={transferType} onClose={() => setTransferType(null)} />", "<TransferForm type={transferType} onClose={() => setTransferType(null)} onSuccess={() => setCurrentView?.('Receipts')} />")

with open('src/components/QuickActions.tsx', 'w') as f:
    f.write(content)

# Fix App.tsx
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("<QuickActions />", "<QuickActions setCurrentView={setCurrentView} />")

with open('src/App.tsx', 'w') as f:
    f.write(content)

# Fix TransferForm.tsx
with open('src/components/TransferForm.tsx', 'r') as f:
    content = f.read()

content = content.replace("onClose: () => void }", "onClose: () => void, onSuccess?: () => void }")
content = content.replace("onClose();\n  };", "onClose();\n    if (onSuccess) onSuccess();\n  };")

with open('src/components/TransferForm.tsx', 'w') as f:
    f.write(content)
