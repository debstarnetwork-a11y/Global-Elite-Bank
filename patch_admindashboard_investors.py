import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Import TrendingUp
content = content.replace("Users, Activity, ShieldAlert, ArrowUpRight, ArrowDownLeft,", 
                          "Users, Activity, ShieldAlert, ArrowUpRight, ArrowDownLeft, TrendingUp,")

# 2. Import AdminInvestors
content = content.replace("AdminEmailServices, AdminAdministrators, AdminManageUsers, AdminContactInquiries", 
                          "AdminEmailServices, AdminAdministrators, AdminManageUsers, AdminContactInquiries, AdminInvestors")

# 3. Add to navItems
nav_items = """  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'manage-users', label: 'Manage Users', icon: Users },
    { id: 'investors', label: 'Investors Management', icon: TrendingUp },"""
content = re.sub(r"  const navItems = \[\n    \{ id: 'dashboard', label: 'Dashboard', icon: Activity \},\n    \{ id: 'manage-users', label: 'Manage Users', icon: Users \},", nav_items, content)

# 4. Render
content = content.replace("{currentView === 'manage-users'", "{currentView === 'investors' && <AdminInvestors />}\n      {currentView === 'manage-users'")

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("Added AdminInvestors to AdminDashboard")
