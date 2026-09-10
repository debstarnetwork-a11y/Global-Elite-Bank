import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

manage_users_component = """
export function AdminManageUsers() {
  const { users } = useBank();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState('10');
  const [sortOrder, setSortOrder] = useState('descending');
  
  // Filter clients
  const clients = users.filter(u => u.role !== 'admin');
  
  // Apply Search
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Apply Sort
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortOrder === 'descending') {
      return a.id > b.id ? -1 : 1;
    } else {
      return a.id > b.id ? 1 : -1;
    }
  });
  
  // Apply Pagination (mock)
  const displayClients = sortedClients.slice(0, parseInt(perPage) || 10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">WB CREDIT UNION users list</h2>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={16} />
            <input 
              type="text" 
              placeholder="name, username or email" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 p-2 text-sm focus:border-primary outline-none" 
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <select 
                value={perPage} 
                onChange={e => setPerPage(e.target.value)}
                className="bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground/50">id</span>
              <select 
                value={sortOrder} 
                onChange={e => setSortOrder(e.target.value)}
                className="bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none"
              >
                <option value="descending">Descending</option>
                <option value="ascending">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Client Name</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Username</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Email</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Phone</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Date registered</th>
                <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-foreground/50">No users found</td>
                </tr>
              ) : (
                displayClients.map(client => (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold">{client.name}</td>
                    <td className="p-4 text-sm">{client.id}</td>
                    <td className="p-4 text-sm">{client.email}</td>
                    <td className="p-4 text-sm">{client.contactPhone || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${
                        client.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 
                        client.status === 'blocked' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-foreground/70">1 week ago</td>
                    <td className="p-4 text-right">
                      <button className="text-primary hover:text-primary/80 font-bold text-sm">Manage</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"""

content = content.replace("export function AdminApplications() {", manage_users_component + "\nexport function AdminApplications() {")

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)
