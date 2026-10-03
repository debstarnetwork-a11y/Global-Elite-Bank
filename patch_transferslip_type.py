import re

with open('src/components/TransferSlip.tsx', 'r') as f:
    content = f.read()

# Add rawType to interface
content = content.replace("  type?: string;", "  type?: string;\n  rawType?: string;")

# Add rawType to defaultTransaction
content = content.replace("  type: \"TRANSACTION\",", "  type: \"TRANSACTION\",\n  rawType: \"transfer_wire\",")

# Add rawType to mapping
content = content.replace("    type: 'TRANSACTION',", "    type: 'TRANSACTION',\n    rawType: latestTx.type,")

# Conditionally render country
old_country_render = """<p><span className="font-semibold text-[#4b5563] inline-block w-20">Country:</span> {transaction.recipient.country}</p>"""
new_country_render = """{transaction.rawType === 'transfer_wire' && transaction.recipient.country && (
                  <p><span className="font-semibold text-[#4b5563] inline-block w-20">Country:</span> {transaction.recipient.country}</p>
                )}"""
content = content.replace(old_country_render, new_country_render)

with open('src/components/TransferSlip.tsx', 'w') as f:
    f.write(content)
print("Added rawType and fixed country condition in TransferSlip")
