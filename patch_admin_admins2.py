import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

# I need to add state for editing admin.
old_states = """  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });"""

new_states = """  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState('');
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });"""

content = content.replace(old_states, new_states)

old_add = """  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;
    adminCreateUser({ ...newAdmin, role: 'admin', status: 'active', accounts: [], showFullCardDetails: true });
    setShowModal(false);
    setNewAdmin({ name: '', email: '', password: '' });
  };"""

new_add = """  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) return;
    if (isEditing && currentEditId) {
      adminUpdateUser(currentEditId, { name: newAdmin.name, email: newAdmin.email, ...(newAdmin.password ? { password: newAdmin.password } : {}) });
    } else {
      if (!newAdmin.password) return;
      adminCreateUser({ ...newAdmin, role: 'admin', status: 'active', accounts: [], showFullCardDetails: true });
    }
    setShowModal(false);
    setIsEditing(false);
    setNewAdmin({ name: '', email: '', password: '' });
  };
  
  const openEditModal = (admin: any) => {
    setIsEditing(true);
    setCurrentEditId(admin.id);
    setNewAdmin({ name: admin.name, email: admin.email, password: '' });
    setShowModal(true);
  };"""
content = content.replace(old_add, new_add)

old_button = """<button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">Add Admin</button>"""
new_button = """<button onClick={() => { setIsEditing(false); setNewAdmin({ name: '', email: '', password: '' }); setShowModal(true); }} className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">Add Admin</button>"""
content = content.replace(old_button, new_button)

old_modal_title = """<h3 className="text-xl font-bold mb-4">Add New Administrator</h3>"""
new_modal_title = """<h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Administrator' : 'Add New Administrator'}</h3>"""
content = content.replace(old_modal_title, new_modal_title)

old_pwd_label = """<input type="password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" placeholder="••••••••" />"""
new_pwd_label = """<input type="password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" placeholder={isEditing ? "Leave blank to keep same" : "••••••••"} />"""
content = content.replace(old_pwd_label, new_pwd_label)

old_create_btn = """<button onClick={handleAddAdmin} disabled={!newAdmin.name || !newAdmin.email || !newAdmin.password} className="px-4 py-2 bg-primary text-white font-bold rounded-lg disabled:opacity-50">Create Admin</button>"""
new_create_btn = """<button onClick={handleAddAdmin} disabled={!newAdmin.name || !newAdmin.email || (!isEditing && !newAdmin.password)} className="px-4 py-2 bg-primary text-white font-bold rounded-lg disabled:opacity-50">{isEditing ? 'Save Changes' : 'Create Admin'}</button>"""
content = content.replace(old_create_btn, new_create_btn)

old_edit_action = """<button onClick={() => alert('Edit Admin functionality coming soon.')} className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors bg-blue-500/10 px-3 py-1.5 rounded border border-blue-500/20">Edit</button>"""
new_edit_action = """<button onClick={() => openEditModal(admin)} className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors bg-blue-500/10 px-3 py-1.5 rounded border border-blue-500/20">Edit</button>"""
content = content.replace(old_edit_action, new_edit_action)

old_hook = "const { users, adminCreateUser, deleteUser } = useBank();"
new_hook = "const { users, adminCreateUser, deleteUser, adminUpdateUser } = useBank();"
content = content.replace(old_hook, new_hook)

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)
print("Updated AdminModules with Edit Form")
