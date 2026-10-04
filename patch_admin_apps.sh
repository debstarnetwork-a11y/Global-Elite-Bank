#!/bin/bash
cat << 'INNEREOF' > temp_admin_apps.tsx
export function AdminApplications() {
  const { userApplications, updateUserApplicationStatus } = useBank();
  const [reviewApp, setReviewApp] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});

  const generateRandomCode = (prefix: string, length: number) => {
    return prefix + Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  };

  const handleReview = (app: any) => {
    setReviewApp(app);
    setEditForm({
      name: app.name,
      email: app.email,
      password: app.password || '0000',
      accountNumber: generateRandomCode('', 16),
      iban: generateRandomCode('CH', 19),
      pin: '0000',
      swift: 'GEBLCHZZ',
      cot: generateRandomCode('COT', 4),
      tax: generateRandomCode('GEB', 5),
      imf: generateRandomCode('IMF', 3),
      aml: generateRandomCode('AML', 6)
    });
  };

  const handleApprove = () => {
    if (!reviewApp) return;
    const customUser = {
      name: editForm.name,
      email: editForm.email,
      password: editForm.password,
      role: 'user' as const,
      status: 'active' as const,
      showFullCardDetails: false,
      accounts: [
        {
          id: `acc-${Date.now()}`,
          type: 'Checking' as const,
          accountNumber: editForm.accountNumber,
          iban: editForm.iban,
          balance: 0,
          pin: editForm.pin,
          codes: {
            swift: editForm.swift,
            cot: editForm.cot,
            tax: editForm.tax,
            imf: editForm.imf,
            aml: editForm.aml
          }
        }
      ]
    };
    updateUserApplicationStatus(reviewApp.id, 'approved', customUser);
    setReviewApp(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">New User Applications</h2>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {userApplications.length === 0 ? (
          <div className="p-8 text-center text-foreground/50">No pending applications</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Name</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Email</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Date</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Status</th>
                <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {userApplications.map(app => (
                <tr key={app.id}>
                  <td className="p-4 font-bold">{app.name}</td>
                  <td className="p-4">{app.email}</td>
                  <td className="p-4">{new Date(app.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${app.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {app.status === 'pending' && (
                      <>
                        <button onClick={() => handleReview(app)} className="p-2 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20"><CheckCircle size={16} /></button>
                        <button onClick={() => updateUserApplicationStatus(app.id, 'rejected')} className="p-2 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-500/20"><XCircle size={16} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {reviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border bg-background/50 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-foreground">Review & Provision Account</h2>
              <button onClick={() => setReviewApp(null)} className="text-foreground/50 hover:text-foreground">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Name</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Email</label>
                  <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Password</label>
                  <input type="text" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Account Number</label>
                  <input type="text" value={editForm.accountNumber} onChange={e => setEditForm({...editForm, accountNumber: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">IBAN</label>
                  <input type="text" value={editForm.iban} onChange={e => setEditForm({...editForm, iban: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">PIN</label>
                  <input type="text" value={editForm.pin} onChange={e => setEditForm({...editForm, pin: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-widest">Clearance Codes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">SWIFT</label>
                    <input type="text" value={editForm.swift} onChange={e => setEditForm({...editForm, swift: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">COT</label>
                    <input type="text" value={editForm.cot} onChange={e => setEditForm({...editForm, cot: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">TAX</label>
                    <input type="text" value={editForm.tax} onChange={e => setEditForm({...editForm, tax: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">IMF</label>
                    <input type="text" value={editForm.imf} onChange={e => setEditForm({...editForm, imf: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">AML</label>
                    <input type="text" value={editForm.aml} onChange={e => setEditForm({...editForm, aml: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border bg-background/50 flex justify-end gap-3">
              <button onClick={() => setReviewApp(null)} className="px-4 py-2 bg-foreground/10 text-foreground font-bold rounded-lg hover:bg-foreground/20">
                Cancel
              </button>
              <button onClick={handleApprove} className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 flex items-center gap-2">
                <CheckCircle size={16} /> Approve & Provision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
INNEREOF
