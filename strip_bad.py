import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

bad_string = """                           <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Password</label>
                    <input type="text" value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" placeholder="Default: password123" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Zip / Postal Code</label>
                    <input type="text" value={newUserForm.zipCode} onChange={e => setNewUserForm({...newUserForm, zipCode: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Occupation</label>
                    <input type="text" value={newUserForm.occupation} onChange={e => setNewUserForm({...newUserForm, occupation: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
               </div>"""

# There are variations. Let's just use a powerful Regex with DOTALL.
pattern = r'(?s)\s*<div>\s*<label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Password</label>.*?newUserForm\.occupation.*?</div>\s*</div>'

new_content = re.sub(pattern, '', content)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(new_content)
