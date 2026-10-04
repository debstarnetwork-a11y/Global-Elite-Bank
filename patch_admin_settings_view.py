import re

with open('src/components/AdminSettingsView.tsx', 'r') as f:
    content = f.read()

# Replace the tabs array to have 'transfer' correctly
# And add states for modals

content = content.replace(
"""  const [activeTab, setActiveTab] = useState('website');""",
"""  const [activeTab, setActiveTab] = useState('website');
  const [showToast, setShowToast] = useState(false);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ name: '', type: 'currency', usedFor: 'both', status: 'enabled' });
"""
)

# update handleSave to show toast instead of alert
content = content.replace(
"""  const handleSave = () => {
    // In a real app this would call an API
    alert('Settings Saved Successfully');
  };""",
"""  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const handleAddPayment = () => {
    const updatedMethods = [...(adminSettings.paymentMethods || []), { ...newPayment, id: Date.now().toString() }];
    updateAdminSettings({ paymentMethods: updatedMethods });
    setShowPaymentModal(false);
    setNewPayment({ name: '', type: 'currency', usedFor: 'both', status: 'enabled' });
  };
  
  const handleDeletePayment = (index: number) => {
    const updatedMethods = [...(adminSettings.paymentMethods || [])];
    updatedMethods.splice(index, 1);
    updateAdminSettings({ paymentMethods: updatedMethods });
  };
"""
)

# Render toast at top
content = content.replace(
"""    <div className="space-y-6">
      <div className="flex justify-between items-center">""",
"""    <div className="space-y-6 relative">
      {showToast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold animate-in fade-in slide-in-from-top-2 z-50">
          Settings Saved Successfully!
        </div>
      )}
      <div className="flex justify-between items-center">"""
)

# Render transfer tab content
transfer_content = """
        {activeTab === 'transfer' && (
          <div className="space-y-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Transfer Code Settings</h3>
            
            {[1, 2, 3, 4, 5].map(num => {
              const codeNameKey = `code${num}Name` as keyof typeof adminSettings;
              const codeMessageKey = `code${num}Message` as keyof typeof adminSettings;
              const requireCodeKey = `requireCode${num}` as keyof typeof adminSettings;
              
              return (
                <div key={num} className="bg-background border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground">Code {num}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground/50 uppercase">Turn {adminSettings[requireCodeKey] ? 'Off' : 'On'}</span>
                      <button onClick={() => updateAdminSettings({ [requireCodeKey]: !adminSettings[requireCodeKey] })} className={`w-10 h-5 rounded-full transition-colors relative ${adminSettings[requireCodeKey] ? 'bg-primary' : 'bg-foreground/20'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${adminSettings[requireCodeKey] ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Code Name</label>
                    <input type="text" value={adminSettings[codeNameKey] as string || ''} onChange={e => updateAdminSettings({ [codeNameKey]: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Code {num} Message</label>
                    <textarea rows={4} value={adminSettings[codeMessageKey] as string || ''} onChange={e => updateAdminSettings({ [codeMessageKey]: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none resize-none" />
                    <p className="text-xs text-foreground/50 mt-1">This message will be displayed to users on if code{num} is on international transfer</p>
                  </div>
                </div>
              );
            })}
            
            <div className="bg-background border border-border rounded-xl p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-foreground">OTP Code</h4>
                <p className="text-xs text-foreground/50 mt-1">Require One-Time Password for transfers</p>
              </div>
              <button onClick={() => updateAdminSettings({ requireOtp: !adminSettings.requireOtp })} className={`w-12 h-6 rounded-full transition-colors relative ${adminSettings.requireOtp ? 'bg-primary' : 'bg-foreground/20'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings.requireOtp ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        )}
"""

# Replace the under development part to omit 'transfer'
content = content.replace(
"""        {activeTab !== 'website' && (""",
"""        """ + transfer_content + """
        {activeTab !== 'website' && activeTab !== 'transfer' && ("""
)

# Link "Add New" for Payment Settings
content = content.replace(
"""            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors">
              <Plus size={16} /> Add New
            </button>""",
"""            <button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors">
              <Plus size={16} /> Add New
            </button>"""
)

# Connect Trash for Payment method
content = content.replace(
"""                        <button className="text-foreground/50 hover:text-rose-500 transition-colors p-2 rounded-md hover:bg-white/5">
                          <Trash size={16} />
                        </button>""",
"""                        <button onClick={() => handleDeletePayment(index)} className="text-foreground/50 hover:text-rose-500 transition-colors p-2 rounded-md hover:bg-white/5">
                          <Trash size={16} />
                        </button>"""
)

payment_modal = """
      {/* Add New Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-4">Add Payment Method</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Method Name</label>
                <input type="text" value={newPayment.name} onChange={e => setNewPayment({...newPayment, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" placeholder="e.g. USDT" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Type</label>
                <select value={newPayment.type} onChange={e => setNewPayment({...newPayment, type: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none">
                  <option value="crypto">Crypto</option>
                  <option value="currency">Currency</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Used For</label>
                <select value={newPayment.usedFor} onChange={e => setNewPayment({...newPayment, usedFor: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none">
                  <option value="both">Both</option>
                  <option value="deposit">Deposit Only</option>
                  <option value="withdrawal">Withdrawal Only</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-foreground/70 font-bold hover:text-foreground">Cancel</button>
                <button onClick={handleAddPayment} disabled={!newPayment.name} className="px-4 py-2 bg-primary text-white font-bold rounded-lg disabled:opacity-50">Add Method</button>
              </div>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("    </div>\n  );\n}\n", payment_modal + "    </div>\n  );\n}\n")

with open('src/components/AdminSettingsView.tsx', 'w') as f:
    f.write(content)
