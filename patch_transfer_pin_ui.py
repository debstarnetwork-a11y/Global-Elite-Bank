import re

with open('src/components/TransferForm.tsx', 'r') as f:
    content = f.read()

content = content.replace("step === 3 && (", "step === 'pin' && (")
content = content.replace("getPrevStep(3)", "getPrevStep('pin')")

with open('src/components/TransferForm.tsx', 'w') as f:
    f.write(content)
print("Updated PIN UI condition")
