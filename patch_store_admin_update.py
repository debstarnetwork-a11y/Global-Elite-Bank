import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Add to interface
content = content.replace(
"""  updateUserStatus: (userId: string, status: UserStatus) => void;""",
"""  adminUpdateUser: (userId: string, updates: Partial<User>) => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;"""
)

# Add implementation
impl = """  const adminUpdateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };"""

content = content.replace(
"""  const updateUserStatus = (userId: string, status: UserStatus) => {""",
impl + "\n\n  const updateUserStatus = (userId: string, status: UserStatus) => {"
)

# Also expose it
content = content.replace(
"""      adminCreateUser,
      updateUserStatus,""",
"""      adminCreateUser,
      adminUpdateUser,
      updateUserStatus,"""
)


with open('src/store.tsx', 'w') as f:
    f.write(content)

