import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

old_user = """  residentialAddress?: string;
}"""

new_user = """  residentialAddress?: string;
  country?: string;
  profilePicture?: string;
}"""

content = content.replace(old_user, new_user)

with open('src/store.tsx', 'w') as f:
    f.write(content)
print("Added profilePicture to User interface")
