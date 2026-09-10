import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Fix Contact Information
content = content.replace("""                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50 flex items-center gap-2"><Mail size={14}/> Email</span>
                    <span className="font-mono text-foreground">{currentActiveUser.email}</span>

                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50 flex items-center gap-2"><Lock size={14}/> Joined</span>
                    <span className="text-foreground">Recent</span>

              </div>""", """                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50 flex items-center gap-2"><Mail size={14}/> Email</span>
                    <span className="font-mono text-foreground">{currentActiveUser.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50 flex items-center gap-2"><Lock size={14}/> Joined</span>
                    <span className="text-foreground">Recent</span>
                  </div>
                </div>
              </div>""")

# Fix Financial Overview
content = content.replace("""              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Financial Overview</h4>
                <div className="bg-gradient-to-br from-emerald-500/10 to-primary/10 border border-border rounded-xl p-6 text-center">
                  <p className="text-xs text-foreground/70 uppercase tracking-widest mb-2 font-bold">Estimated Net Worth</p>
                  
                  <p className="text-4xl font-bold text-foreground font-mono">{currentActiveUser.accounts?.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}</p>

              </div>""", """              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Financial Overview</h4>
                <div className="bg-gradient-to-br from-emerald-500/10 to-primary/10 border border-border rounded-xl p-6 text-center">
                  <p className="text-xs text-foreground/70 uppercase tracking-widest mb-2 font-bold">Estimated Net Worth</p>
                  
                  <p className="text-4xl font-bold text-foreground font-mono">{currentActiveUser.accounts?.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}</p>
                </div>
              </div>""")

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
