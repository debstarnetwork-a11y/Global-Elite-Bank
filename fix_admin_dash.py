import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Replace submitNewUser to validate all fields
old_submit = """  const submitNewUser = () => {
    if (!newUserForm.name || !newUserForm.email) {
       showToast('Error', 'Name and Email are required');
       return;
    }"""
new_submit = """  const submitNewUser = () => {
    const requiredFields = ['name', 'email', 'password', 'mobile', 'dob', 'nationality', 'zipCode', 'occupation', 'residentialAddress', 'currency', 'accountType', 'accountNumber', 'pin', 'swift', 'cot', 'imf', 'tax', 'aml'];
    const missingField = requiredFields.find(field => !newUserForm[field as keyof typeof newUserForm]);
    
    if (missingField) {
       showToast('Error', 'Please fill out all fields before submitting');
       return;
    }"""
content = content.replace(old_submit, new_submit)

# Replace nationality input with select
old_nat = """                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</label>
                  <input type="text" value={newUserForm.nationality} onChange={e => setNewUserForm({...newUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>"""
new_nat = """                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Nationality</label>
                  <select value={newUserForm.nationality} onChange={e => setNewUserForm({...newUserForm, nationality: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none">
                    <option value="">Select Nationality</option>
                    <option value="American">American</option>
                    <option value="British">British</option>
                    <option value="Canadian">Canadian</option>
                    <option value="Australian">Australian</option>
                    <option value="European">European</option>
                    <option value="Asian">Asian</option>
                    <option value="African">African</option>
                    <option value="Other">Other</option>
                  </select>
                </div>"""
content = content.replace(old_nat, new_nat)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)

