import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Add updateUserProfilePicture
old_return = """    adminCreateUser,
    updateUser,
    changePassword,"""

new_return = """    adminCreateUser,
    updateUser,
    updateUserProfilePicture,
    changePassword,"""
content = content.replace(old_return, new_return)

interface_old = """  adminCreateUser: (user: Partial<User>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  changePassword: (oldPw: string, newPw: string) => boolean;"""

interface_new = """  adminCreateUser: (user: Partial<User>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updateUserProfilePicture: (url: string) => void;
  changePassword: (oldPw: string, newPw: string) => boolean;"""
content = content.replace(interface_old, interface_new)

func_old = """  const changePassword = (oldPw: string, newPw: string) => {
    if (!currentUser) return false;"""

func_new = """  const updateUserProfilePicture = (url: string) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, profilePicture: url } : u));
    setCurrentUser({ ...currentUser, profilePicture: url });
  };

  const changePassword = (oldPw: string, newPw: string) => {
    if (!currentUser) return false;"""
content = content.replace(func_old, func_new)

with open('src/store.tsx', 'w') as f:
    f.write(content)
print("Added updateUserProfilePicture")
