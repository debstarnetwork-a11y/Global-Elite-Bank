import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

old_action = """                  <td className="p-4 text-right flex justify-end gap-2">
                    {app.status === 'pending' && (
                      <>
                        <button onClick={() => handleReview(app)} className="p-2 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20"><Edit size={16} /></button>
                        <button onClick={() => updateUserApplicationStatus(app.id, 'rejected')} className="p-2 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-500/20"><XCircle size={16} /></button>
                      </>
                    )}
                  </td>"""

new_action = """                  <td className="p-4 text-right flex justify-end gap-2">
                    {app.status === 'pending' && (
                      <div className="relative group inline-block text-left">
                        <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded border border-primary/20">
                          Manage ▾
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] p-1 flex flex-col">
                          <button onClick={() => handleReview(app)} className="text-left px-3 py-2 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-500 rounded text-foreground">Approve</button>
                          <button onClick={() => updateUserApplicationStatus(app.id, 'rejected')} className="text-left px-3 py-2 text-xs font-bold hover:bg-rose-500/10 hover:text-rose-500 rounded text-foreground">Reject</button>
                        </div>
                      </div>
                    )}
                  </td>"""

content = content.replace(old_action, new_action)

# Wait, the prompt specifically says "Emman Debelu emmanueldebelu@gmail.com 9/5/2026".
# Should I pre-populate this into the mock data?
# Let's check store.tsx to see if this user is in the default data.

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)

print("Updated AdminApplications action dropdown")
