import re

with open('src/components/TransferSlip.tsx', 'r') as f:
    content = f.read()

old_interface = """    bank: string;
    country?: string;
  };"""

new_interface = """    bank: string;
    country?: string;
    remarks?: string;
  };"""
content = content.replace(old_interface, new_interface)

old_mapping = """      bank: latestTx.recipientDetails?.bank || adminSettings?.websiteName || 'Global Elite Bank',
      country: latestTx.recipientDetails?.country || ''
    },"""

new_mapping = """      bank: latestTx.recipientDetails?.bank || adminSettings?.websiteName || 'Global Elite Bank',
      country: latestTx.recipientDetails?.country || '',
      remarks: latestTx.recipientDetails?.remarks || ''
    },"""
content = content.replace(old_mapping, new_mapping)

old_ui_row = """              {transaction.recipient.country && (
                <p><span className="font-semibold text-[#4b5563] inline-block w-20">Country:</span> {transaction.recipient.country}</p>
              )}
            </div>
          </div>"""

new_ui_row = """              {transaction.recipient.country && (
                <p><span className="font-semibold text-[#4b5563] inline-block w-20">Country:</span> {transaction.recipient.country}</p>
              )}
              {transaction.recipient.remarks && (
                <p><span className="font-semibold text-[#4b5563] inline-block w-20">Purpose:</span> {transaction.recipient.remarks}</p>
              )}
            </div>
          </div>"""
content = content.replace(old_ui_row, new_ui_row)

with open('src/components/TransferSlip.tsx', 'w') as f:
    f.write(content)

print("Added remarks to TransferSlip.")
