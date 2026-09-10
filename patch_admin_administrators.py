import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

admin_administrators_new = """
export function AdminAdministrators() {
  const { users, adminCreateUser } = useBank();
  const admins = users.filter(u => u.role === 'admin');
  
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;
    adminCreateUser({ ...newAdmin, role: 'admin', status: 'active', accounts: [], showFullCardDetails: true });
    setShowModal(false);
    setNewAdmin({ name: '', email: '', password: '' });
  };
  
  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Administrator(s)</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">Add Admin</button>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-4">Add New Administrator</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Name</label>
                <input type="text" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" placeholder="Admin Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email</label>
                <input type="email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" placeholder="admin@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Password</label>
                <input type="password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" placeholder="••••••••" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-foreground/70 font-bold hover:text-foreground">Cancel</button>
                <button onClick={handleAddAdmin} disabled={!newAdmin.name || !newAdmin.email || !newAdmin.password} className="px-4 py-2 bg-primary text-white font-bold rounded-lg disabled:opacity-50">Create Admin</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background/50 border-b border-border">
            <tr>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Name</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Email</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Role</th>
              <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="p-4 font-bold">{admin.name}</td>
                <td className="p-4">{admin.email}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-xs font-bold uppercase rounded">Super Admin</span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-emerald-500 text-xs font-bold uppercase">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"""

content = re.sub(r'export function AdminAdministrators\(\) \{.*?\n\}\n*', admin_administrators_new, content, flags=re.DOTALL)

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)
