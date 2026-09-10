import re

with open('src/components/QuickActions.tsx', 'r') as f:
    content = f.read()

# Fix the close button
content = content.replace("<button onClick={() => { setShowTransferOptions(false); setTransferType('wire'); }} className=\"absolute top-4 right-4", "<button onClick={() => setShowTransferOptions(false)} className=\"absolute top-4 right-4")

# Fix Local Transfer button
content = re.sub(r'<button onClick=\{\(\) => \{ setShowTransferOptions\(false\); setTransferType\(\'wire\'\); \}\} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors text-left group">(\s*<div className="w-10 h-10 rounded-lg bg-emerald-500/10)', r'<button onClick={() => { setShowTransferOptions(false); setTransferType(\'local\'); }} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors text-left group">\1', content)

# Fix Internal Transfer button
content = re.sub(r'<button onClick=\{\(\) => \{ setShowTransferOptions\(false\); setTransferType\(\'wire\'\); \}\} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors text-left group">(\s*<div className="w-10 h-10 rounded-lg bg-purple-500/10)', r'<button onClick={() => { setShowTransferOptions(false); setTransferType(\'internal\'); }} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors text-left group">\1', content)

# Add the form rendering at the bottom
if "<TransferForm type={transferType}" not in content:
    content = content.replace("    </>\n  );\n}", "      {transferType && (\n        <TransferForm type={transferType} onClose={() => setTransferType(null)} />\n      )}\n    </>\n  );\n}")

with open('src/components/QuickActions.tsx', 'w') as f:
    f.write(content)
