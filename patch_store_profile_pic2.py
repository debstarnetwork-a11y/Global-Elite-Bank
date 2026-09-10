import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Interface
interface_old = """  adminCreateUser: (user: Omit<User, "id">) => void;
  adminUpdateUser: (userId: string, updates: Partial<User>) => void;"""

interface_new = """  adminCreateUser: (user: Omit<User, "id">) => void;
  adminUpdateUser: (userId: string, updates: Partial<User>) => void;
  updateUserProfilePicture: (url: string) => void;"""
content = content.replace(interface_old, interface_new)

# Implementation
impl_old = """  const changePassword = (oldPw: string, newPw: string) => {
    if (!currentUser) return false;"""

impl_new = """  const updateUserProfilePicture = (url: string) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, profilePicture: url } : u));
    setCurrentUser({ ...currentUser, profilePicture: url });
  };

  const changePassword = (oldPw: string, newPw: string) => {
    if (!currentUser) return false;"""
content = content.replace(impl_old, impl_new)

# Provider
prov_old = """      login, logout, register, adminCreateUser, updateUser, updateUserProfilePicture, adminUpdateUser, updateUserStatus, deleteUser, updateUserCardVisibility,"""

prov_new = """      login, logout, register, adminCreateUser, updateUserProfilePicture, adminUpdateUser, updateUserStatus, deleteUser, updateUserCardVisibility,"""
content = content.replace(prov_old, prov_new)

prov_old_2 = """      login, logout, register, adminCreateUser, adminUpdateUser, updateUserStatus, deleteUser, updateUserCardVisibility,"""

prov_new_2 = """      login, logout, register, adminCreateUser, updateUserProfilePicture, adminUpdateUser, updateUserStatus, deleteUser, updateUserCardVisibility,"""
content = content.replace(prov_old_2, prov_new_2)

with open('src/store.tsx', 'w') as f:
    f.write(content)
print("Added updateUserProfilePicture again")
