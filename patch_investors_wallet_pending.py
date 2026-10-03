import re

with open('src/components/InvestorsWallet.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const activeInvestments = myInvestments.filter(inv => inv.status === 'active');",
    "const activeInvestments = myInvestments.filter(inv => inv.status === 'active' || inv.status === 'pending');"
)

old_badge = """<span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold px-2 py-1 rounded uppercase">Active</span>"""
new_badge = """<span className={`${inv.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'} border text-[10px] font-bold px-2 py-1 rounded uppercase`}>{inv.status}</span>"""
content = content.replace(old_badge, new_badge)

with open('src/components/InvestorsWallet.tsx', 'w') as f:
    f.write(content)
print("Updated activeInvestments to include pending")
