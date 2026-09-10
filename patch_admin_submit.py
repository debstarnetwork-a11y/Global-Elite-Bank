import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

old_create = """      dob: newUserForm.dob,
      nationality: newUserForm.nationality,
      zipCode: newUserForm.zipCode,
      occupation: newUserForm.occupation,
      residentialAddress: newUserForm.residentialAddress,"""

new_create = """      dob: newUserForm.dob,
      nationality: newUserForm.nationality,
      country: newUserForm.nationality,
      zipCode: newUserForm.zipCode,
      occupation: newUserForm.occupation,
      residentialAddress: newUserForm.residentialAddress,
      profilePicture: (newUserForm as any).profilePicture,"""
content = content.replace(old_create, new_create)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
print("Updated adminCreateUser call")
