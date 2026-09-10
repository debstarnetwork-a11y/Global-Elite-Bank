import re

with open('src/components/InvestorsWallet.tsx', 'r') as f:
    content = f.read()

content = content.replace("<button className=\"text-xs font-bold bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors\">\n                    Request Withdrawal\n                  </button>", 
                          "<button onClick={() => alert('Withdrawal request submitted. Pending Admin approval.')} className=\"text-xs font-bold bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors\">\n                    Request Withdrawal\n                  </button>")

with open('src/components/InvestorsWallet.tsx', 'w') as f:
    f.write(content)
