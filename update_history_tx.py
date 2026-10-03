import re

with open('src/components/TransactionHistory.tsx', 'r') as f:
    content = f.read()

# Add imports for TransferSlip and useState
if 'import { TransferSlip }' not in content:
    content = content.replace(
        "import { useBank } from '../store';",
        "import { useBank } from '../store';\nimport { TransferSlip } from './TransferSlip';"
    )

# Add selectedTx state
content = content.replace(
    '  const { transactions, currentUser } = useBank();',
    '''  const { transactions, currentUser } = useBank();
  const [selectedTx, setSelectedTx] = useState<any>(null);'''
)

# Make rows clickable for completed transactions
row_pattern = r'<tr key={tx\.id} className="hover:bg-white/5 transition-colors">'

replacement_row = '''<tr key={tx.id} 
                      className={`transition-colors ${tx.status === 'completed' ? 'cursor-pointer hover:bg-white/10' : 'hover:bg-white/5'}`}
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

with open('src/components/TransactionHistory.tsx', 'w') as f:
    f.write(content)

