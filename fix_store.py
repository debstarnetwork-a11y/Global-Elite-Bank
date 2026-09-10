import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Add state
if "const [investments, setInvestments]" not in content:
    content = content.replace("const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(() => getInitialState('bank_contactInquiries', []));", 
                              "const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(() => getInitialState('bank_contactInquiries', []));\n  const [investments, setInvestments] = useState<Investment[]>(() => getInitialState('bank_investments', []));")

# Add to provider value
if "investments," not in content:
    content = content.replace("createContactInquiry", "createContactInquiry, investments, createInvestment, updateInvestment")
    
# Add sync effect
if "localStorage.setItem('bank_contactInquiries', JSON.stringify(contactInquiries));" in content and "bank_investments" not in content:
    content = content.replace("localStorage.setItem('bank_contactInquiries', JSON.stringify(contactInquiries));", 
                              "localStorage.setItem('bank_contactInquiries', JSON.stringify(contactInquiries));\n    localStorage.setItem('bank_investments', JSON.stringify(investments));")

# Let's verify the functions createInvestment and updateInvestment
with open('src/store.tsx', 'w') as f:
    f.write(content)

