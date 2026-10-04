import re

with open('src/components/TransferForm.tsx', 'r') as f:
    content = f.read()

# Replace handleTransfer references to verifyPin
content = content.replace("onClick={handleTransfer}", "onClick={verifyPin}")

# Replace verifySingleCode references to handleVerifySingleCode
content = content.replace("verifySingleCode(step as string)", "handleVerifySingleCode(step as string)")


# Add the Success Screen rendering
success_screen = """        {step === 'success' && (
          <div className="space-y-4 text-center py-6">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h3 className="font-bold text-2xl text-foreground">Transfer Successful!</h3>
            <p className="text-sm text-foreground/70 mb-8 max-w-xs mx-auto">Your transfer of ${Number(amount).toLocaleString()} has been processed and is now complete.</p>
            
            <button onClick={() => { onClose(); if (onSuccess) onSuccess(); }} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
              View Receipt
            </button>
          </div>
        )}"""

content = content.replace("      </div>\n    </div>", success_screen + "\n      </div>\n    </div>")


# Make sure we don't render "type Transfer" header for success
content = content.replace("""        <h2 className={`text-xl font-bold text-foreground mb-6 capitalize ${step !== 1 ? 'text-center' : ''}`}>{type} Transfer</h2>""",
"""        {step !== 'success' && (
          <h2 className={`text-xl font-bold text-foreground mb-6 capitalize ${step !== 1 ? 'text-center' : ''}`}>{type} Transfer</h2>
        )}""")


with open('src/components/TransferForm.tsx', 'w') as f:
    f.write(content)

print("Added success screen and fixed button click handlers.")
