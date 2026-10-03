import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Update newUserForm state definition
content = content.replace(
    "dob: '', nationality: '', password: '', zipCode: '', occupation: ''",
    "dob: '', nationality: '', password: '', zipCode: '', occupation: '', residentialAddress: ''"
)

# 2. Update handleOpenAddUser
content = content.replace(
    "aml: generateRandomCode('AML', 5), dob: '', nationality: '', password: '', zipCode: '', occupation: ''",
    "aml: generateRandomCode('AML', 5), dob: '', nationality: '', password: '', zipCode: '', occupation: '', residentialAddress: ''"
)

# 3. Update adminCreateUser payload
content = content.replace(
    "occupation: newUserForm.occupation,\\n      accounts:",
    "occupation: newUserForm.occupation,\\n      residentialAddress: newUserForm.residentialAddress,\\n      accounts:"
)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
