import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

impl_old = """  const changePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return false;"""

impl_new = """  const updateUserProfilePicture = (url: string) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, profilePicture: url } : u));
    setCurrentUser({ ...currentUser, profilePicture: url });
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return false;"""
content = content.replace(impl_old, impl_new)

with open('src/store.tsx', 'w') as f:
    f.write(content)
print("Fixed updateUserProfilePicture implementation")
