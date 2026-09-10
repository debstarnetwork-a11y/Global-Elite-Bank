import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Update interface
content = content.replace("login: (email: string, password?: string) => { success: boolean, error?: string };", 
                          "login: (email: string, password?: string, isAdminPath?: boolean) => { success: boolean, error?: string };")

# Update implementation
old_login = """  const login = (email: string, password?: string) => {
    // If attempting to login as admin
    if (email === adminSettings.adminEmail) {
      if (password === adminSettings.adminPassword) {
        const adminUser = users.find(u => u.role === 'admin');
        if (adminUser) setCurrentUser(adminUser);
        return { success: true };
      }
      return { success: false, error: 'Invalid admin credentials' };
    }
    
    // Normal user login
    const user = users.find(u => u.email === email && u.role !== 'admin' && (password ? u.password === password : true));"""

new_login = """  const login = (email: string, password?: string, isAdminPath?: boolean) => {
    // If attempting to login as admin
    if (email === adminSettings.adminEmail) {
      if (password === adminSettings.adminPassword) {
        const adminUser = users.find(u => u.role === 'admin');
        if (adminUser) setCurrentUser(adminUser);
        return { success: true };
      }
      return { success: false, error: 'Invalid admin credentials' };
    }

    if (isAdminPath) {
       return { success: false, error: 'You do not have administrator access.' };
    }
    
    // Normal user login
    const user = users.find(u => u.email === email && u.role !== 'admin' && (password ? u.password === password : true));"""
content = content.replace(old_login, new_login)

with open('src/store.tsx', 'w') as f:
    f.write(content)

print("Updated login in store.tsx")
