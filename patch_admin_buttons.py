import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

old_buttons = """                    <td className="px-6 py-4 text-right space-x-2">
                      {inv.status === 'active' && (
                        <button onClick={() => handleMatureInvestment(inv)} className="bg-primary text-white text-xs font-bold px-3 py-1 rounded hover:bg-primary/90 transition-colors">
                          Mature / Add Profit
                        </button>
                      )}
                      {inv.status !== 'matured' && inv.status !== 'withdrawn' && (
                        <button onClick={() => handleRejectInvestment(inv.id)} className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold px-3 py-1 rounded hover:bg-rose-500 hover:text-white transition-colors">
                          Cancel
                        </button>
                      )}"""

new_buttons = """                    <td className="px-6 py-4 text-right space-x-2">
                      {inv.status === 'pending' && (
                        <button onClick={() => handleApproveInvestment(inv.id)} className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded hover:bg-emerald-600 transition-colors">
                          Approve
                        </button>
                      )}
                      {inv.status === 'active' && (
                        <button onClick={() => handleMatureInvestment(inv)} className="bg-primary text-white text-xs font-bold px-3 py-1 rounded hover:bg-primary/90 transition-colors">
                          Mature / Add Profit
                        </button>
                      )}
                      {inv.status !== 'matured' && inv.status !== 'withdrawn' && (
                        <button onClick={() => handleRejectInvestment(inv.id)} className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold px-3 py-1 rounded hover:bg-rose-500 hover:text-white transition-colors">
                          Cancel
                        </button>
                      )}"""

content = content.replace(old_buttons, new_buttons)

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)
print("Updated AdminButtons")
