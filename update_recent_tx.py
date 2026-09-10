import re

with open('src/components/RecentTransactions.tsx', 'r') as f:
    content = f.read()

# Add imports for TransferSlip and useState
if 'import { useState }' not in content:
    content = content.replace(
        "import { useBank } from '../store';",
        "import { useState } from 'react';\nimport { useBank } from '../store';\nimport { TransferSlip, TransactionDetails } from './TransferSlip';"
    )

# Add selectedTx state
content = content.replace(
    '  const userTxns = transactions.filter(t => t.userId === currentUser?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);',
    '''  const userTxns = transactions.filter(t => t.userId === currentUser?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const [selectedTx, setSelectedTx] = useState<any>(null);'''
)

# Update the render of a transaction row
row_pattern = r'<div key={tx\.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">'

replacement_row = '''<div key={tx.id} 
              className={`flex items-center justify-between p-3 rounded-xl transition-colors group ${tx.status === 'completed' ? 'cursor-pointer hover:bg-white/5' : ''}`}
              onClick={() => {
                if (tx.status === 'completed') {
                  setSelectedTx(tx);
                }
              }}
            >'''
content = content.replace(row_pattern, replacement_row)

# Add receipt modal at the end of the return statement
modal_jsx = '''      </div>
      {selectedTx && currentUser && (
        <TransferSlip 
          onClose={() => setSelectedTx(null)}
          transaction={{
            reference: selectedTx.id,
            date: new Date(selectedTx.date).toLocaleDateString(),
            type: selectedTx.type.toUpperCase(),
            sender: {
              name: currentUser.name,
              account: currentUser.accounts[0]?.accountNumber || '',
              bank: 'Global Elite Bank',
              iban: currentUser.accounts[0]?.iban || ''
            },
            recipient: {
              name: selectedTx.recipientDetails?.name || '',
              account: selectedTx.recipientDetails?.account || '',
              bank: selectedTx.recipientDetails?.bank || 'Global Elite Bank',
              country: selectedTx.recipientDetails?.country || ''
            },
            amount: selectedTx.amount,
            currency: '$',
            fee: 0,
            status: selectedTx.status.toUpperCase() as any
          }}
        />
      )}
    </div>'''

content = re.sub(r'      </div>\s*</div>\s*\);\s*}', modal_jsx + '\n  );\n}', content)

with open('src/components/RecentTransactions.tsx', 'w') as f:
    f.write(content)

