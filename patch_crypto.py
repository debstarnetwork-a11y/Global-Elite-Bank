import re

with open('src/components/CryptoDashboard.tsx', 'r') as f:
    content = f.read()

# Add state for crypto modal
if 'const [activeModal, setActiveModal] = useState<' not in content:
    content = content.replace("export function CryptoDashboard() {", "export function CryptoDashboard() {\n  const [activeModal, setActiveModal] = useState<'buy' | 'deposit' | null>(null);")
    content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { X, AlertTriangle } from 'lucide-react';")

old_buttons = """        <div className="flex space-x-2">
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20">Buy/Sell</button>
          <button className="bg-card border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5">Deposit</button>
        </div>"""

new_buttons = """        <div className="flex space-x-2">
          <button onClick={() => setActiveModal('buy')} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20">Buy/Sell</button>
          <button onClick={() => setActiveModal('deposit')} className="bg-card border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5">Deposit</button>
        </div>"""
content = content.replace(old_buttons, new_buttons)

modal_html = """
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-foreground mb-6 capitalize">{activeModal === 'buy' ? 'Trade Crypto' : 'Deposit Crypto'}</h2>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 text-amber-500 text-sm">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <p>For security purposes, self-service {activeModal === 'buy' ? 'trading' : 'deposits'} are currently disabled on your account. Please contact your dedicated account manager or support to execute this transaction.</p>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-6 hover:bg-primary/90 transition-colors">
              Understood
            </button>
          </div>
        </div>
      )}
"""

# Insert modal right before the last closing div
content = content.rsplit("    </div>\n  );\n}", 1)
content = content[0] + modal_html + "    </div>\n  );\n}"

with open('src/components/CryptoDashboard.tsx', 'w') as f:
    f.write(content)

print("Patched CryptoDashboard")
