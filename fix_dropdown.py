import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Replace the Account Status select
old_select = """                        <select 
                          value={actionForm.status || currentActiveUser.status} 
                          onChange={e => setActionForm({...actionForm, status: e.target.value})} 
                          className="w-full bg-card border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none"
                        >"""

new_select = """                        <select 
                          value={currentActiveUser.status} 
                          onChange={e => {
                            const newStatus = e.target.value as any;
                            updateUserStatus(currentActiveUser.id, newStatus);
                            showToast('Success', `Account status updated to ${newStatus}`);
                          }} 
                          className="w-full bg-card border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none"
                        >"""

content = content.replace(old_select, new_select)

# We should also prevent the 'Update / Save' button from throwing if it just processes the amount.
old_button = """                        onClick={() => {
                          if (actionForm.status) {
                            updateUserStatus(currentActiveUser.id, (actionForm.status || currentActiveUser.status) as any);
                          }
                          if (actionForm.amount) {"""

new_button = """                        onClick={() => {
                          if (actionForm.amount) {"""

content = content.replace(old_button, new_button)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
print("AdminDashboard updated")
