import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

# Replace the "Action" th if needed, actually it already says Action.
# Let's fix the buttons.
old_buttons = """                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <div className="relative group inline-block text-left">
                        <button className="text-xs font-bold text-foreground/70 hover:text-foreground transition-colors bg-white/5 px-3 py-1.5 rounded border border-border">
                          Action ▾
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] p-1 flex flex-col">
                          <button onClick={() => { updateUserStatus(client.id, 'active'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-500 rounded">Active</button>
                          <button onClick={() => { updateUserStatus(client.id, 'dormant'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-amber-500/10 hover:text-amber-500 rounded">Dormant</button>
                          <button onClick={() => { updateUserStatus(client.id, 'suspended'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-orange-500/10 hover:text-orange-500 rounded">Suspend</button>
                          <button onClick={() => { updateUserStatus(client.id, 'frozen'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-blue-500/10 hover:text-blue-500 rounded">Freeze</button>
                          <button onClick={() => { updateUserStatus(client.id, 'blocked'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-rose-500/10 hover:text-rose-500 rounded">Blocked</button>
                        </div>
                      </div>
                      <button onClick={() => onManageUser && onManageUser(client.id)} className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">Manage</button>
                    </td>"""

new_buttons = """                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button onClick={() => onManageUser && onManageUser(client.id)} className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">Manage</button>
                      <div className="relative group inline-block text-left">
                        <button className="text-foreground/70 hover:text-foreground transition-colors inline-flex align-middle p-2 rounded-md hover:bg-white/5 border border-border">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] p-1 flex flex-col">
                          <button onClick={() => { updateUserStatus(client.id, 'active'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-500 rounded">Active</button>
                          <button onClick={() => { updateUserStatus(client.id, 'dormant'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-amber-500/10 hover:text-amber-500 rounded">Dormant</button>
                          <button onClick={() => { updateUserStatus(client.id, 'suspended'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-orange-500/10 hover:text-orange-500 rounded">Suspend</button>
                          <button onClick={() => { updateUserStatus(client.id, 'frozen'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-blue-500/10 hover:text-blue-500 rounded">Freeze</button>
                          <button onClick={() => { updateUserStatus(client.id, 'blocked'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-rose-500/10 hover:text-rose-500 rounded">Blocked</button>
                        </div>
                      </div>
                    </td>"""

if old_buttons in content:
    content = content.replace(old_buttons, new_buttons)
else:
    print("Could not find old buttons")

import_patch = "import { FileText, CheckCircle, XCircle, Search, Clock, ShieldAlert, CreditCard, Edit } from 'lucide-react';"
import_new = "import { FileText, CheckCircle, XCircle, Search, Clock, ShieldAlert, CreditCard, Edit, MoreHorizontal } from 'lucide-react';"
if import_patch in content:
    content = content.replace(import_patch, import_new)

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)
print("Updated AdminModules buttons")
