import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

old_login_check = """    if (user) {
      if (user.status === 'inactive') {
        return { success: false, error: 'Your account is inactive. Please contact Support or Admin.' };
      }
      if (user.status === 'blocked' || user.status === 'frozen') {
        return { success: false, error: `Your account has been ${user.status}. Please kindly contact Support/Admin.` };
      }
      setCurrentUser(user);
      return { success: true };
    }"""

new_login_check = """    if (user) {
      if (user.status !== 'active') {
        const msg = user.status === 'inactive' ? 'Your account is inactive. Please contact Support or Admin.' :
                    user.status === 'dormant' ? 'Your account is currently dormant. Please kindly contact Support/Admin to reactivate.' :
                    user.status === 'suspended' ? 'Your account has been suspended. Please kindly contact Support/Admin.' :
                    `Your account has been ${user.status}. Please kindly contact Support/Admin.`;
        return { success: false, error: msg };
      }
      setCurrentUser(user);
      return { success: true };
    }"""

content = content.replace(old_login_check, new_login_check)

with open('src/store.tsx', 'w') as f:
    f.write(content)
print("Login check updated")
