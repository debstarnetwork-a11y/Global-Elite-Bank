import re

with open('src/components/TransferSlip.tsx', 'r') as f:
    content = f.read()

# Add onClose to props
content = content.replace(
    'interface TransferSlipProps {',
    '''import { X } from 'lucide-react';

interface TransferSlipProps {
  onClose?: () => void;'''
)

content = content.replace(
    'export function TransferSlip({ transaction: propTransaction }: TransferSlipProps) {',
    'export function TransferSlip({ transaction: propTransaction, onClose }: TransferSlipProps) {'
)

# Add modal wrapper if onClose is provided
modal_start = '''  const content = (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 w-full">'''

content = content.replace(
    '    <div className="space-y-6 max-w-4xl mx-auto pb-12">',
    modal_start
)

modal_end = '''    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
        <div className="bg-background border border-border rounded-2xl shadow-2xl relative w-full max-w-5xl my-8">
          <button onClick={onClose} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground z-10 bg-card p-2 rounded-full border border-border">
            <X size={20} />
          </button>
          <div className="p-4 sm:p-8">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
}'''

content = content.replace(
    '''    </div>
  );
}''',
    modal_end
)

# Also fix the default transaction mapping to ensure we only get COMPLETED transactions
content = content.replace(
    'const latestTx = transactions.length > 0 ? transactions[0] : null;',
    "const latestTx = transactions.find(t => t.userId === currentUser?.id && t.status === 'completed') || (transactions.length > 0 ? transactions[0] : null);"
)

with open('src/components/TransferSlip.tsx', 'w') as f:
    f.write(content)

