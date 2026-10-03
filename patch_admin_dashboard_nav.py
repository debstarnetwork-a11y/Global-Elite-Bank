import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Update navItems
content = content.replace(
"""    { id: 'grant-applications', label: 'Grant Applications', icon: FileText },""",
"""    { id: 'grant-applications', label: 'Grant Applications', icon: FileText, subItems: ['All Applications', 'Processing', 'Approved', 'Rejected', 'Disbursed'] },"""
)

# Replace the manage users view rendering
content = content.replace(
"""      {currentView === 'manage-users' && (
        <div className="text-foreground/50">Manage Users Component (Not implemented in this snippet)</div>
      )}""",
""
) # just to be sure

# Add the AdminManageUsers import
content = content.replace(
"""  AdminTransactionsHistory, AdminVirtualCards, AdminEmailServices, AdminAdministrators } from './AdminModules';""",
"""  AdminTransactionsHistory, AdminVirtualCards, AdminEmailServices, AdminAdministrators, AdminManageUsers } from './AdminModules';"""
)

# Route the views
content = content.replace(
"""      {/* Module Router */}
      {currentView === 'new-user-apps' && <AdminApplications />}
      {currentView === 'grant-applications' && <AdminGrantApplications />}""",
"""      {/* Module Router */}
      {currentView === 'manage-users' && <AdminManageUsers />}
      {currentView === 'new-user-apps' && <AdminApplications />}
      {currentView === 'grant-applications-all-applications' && <AdminGrantApplications filter="all" />}
      {currentView === 'grant-applications-processing' && <AdminGrantApplications filter="processing" />}
      {currentView === 'grant-applications-approved' && <AdminGrantApplications filter="approved" />}
      {currentView === 'grant-applications-rejected' && <AdminGrantApplications filter="rejected" />}
      {currentView === 'grant-applications-disbursed' && <AdminGrantApplications filter="disbursed" />}
      {currentView === 'grant-applications' && <AdminGrantApplications filter="all" />}"""
)

# Fix the condition that wraps dashboard
content = content.replace(
"""        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {currentView === 'dashboard' || currentView === 'manage-users' ? (""",
"""        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {currentView === 'dashboard' ? ("""
)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
