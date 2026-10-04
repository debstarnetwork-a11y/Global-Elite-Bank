import re

with open('src/components/TransferForm.tsx', 'r') as f:
    content = f.read()

# Update container classes
old_container = """  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-foreground mb-6 capitalize">{type} Transfer</h2>"""

new_container = """  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {step !== 1 && (
          <button onClick={() => setStep(getPrevStep(step))} className="absolute top-4 left-4 text-foreground/50 hover:text-foreground">
            <ArrowLeft size={20} />
          </button>
        )}
        <button onClick={onClose} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
          <X size={20} />
        </button>
        <h2 className={`text-xl font-bold text-foreground mb-6 capitalize ${step !== 1 ? 'text-center' : ''}`}>{type} Transfer</h2>"""
content = content.replace(old_container, new_container)

# Add Cancel button to Step 1
old_step1_btns = """            <button onClick={handleNext} className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-6 hover:bg-primary/90 transition-colors">
              Continue
            </button>
          </div>
        )}"""

new_step1_btns = """            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 bg-background border border-border text-foreground font-bold py-3 rounded-xl hover:border-foreground/30 transition-colors">
                Cancel
              </button>
              <button onClick={handleNext} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Review
              </button>
            </div>
          </div>
        )}"""
content = content.replace(old_step1_btns, new_step1_btns)

# Add Preview Step (step === 'preview')
preview_step_code = """
        {step === 'preview' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground text-center mb-4">Confirm Details</h3>
            <div className="bg-background border border-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-foreground/50 uppercase font-bold">Amount</span>
                <span className="text-sm font-mono font-bold">${Number(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-foreground/50 uppercase font-bold">Recipient</span>
                <span className="text-sm font-bold">{recipient.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-foreground/50 uppercase font-bold">Account / IBAN</span>
                <span className="text-sm font-bold">{recipient.account}</span>
              </div>
              {type !== 'internal' && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground/50 uppercase font-bold">Bank Name</span>
                  <span className="text-sm font-bold">{recipient.bank}</span>
                </div>
              )}
              {type === 'wire' && recipient.country && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground/50 uppercase font-bold">Country</span>
                  <span className="text-sm font-bold">{recipient.country}</span>
                </div>
              )}
              {recipient.remarks && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-foreground/50 uppercase font-bold">Remarks</span>
                  <span className="text-sm font-bold truncate max-w-[150px]" title={recipient.remarks}>{recipient.remarks}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 bg-background border border-border text-foreground font-bold py-3 rounded-xl hover:border-foreground/30 transition-colors">
                Edit
              </button>
              <button onClick={() => setStep(getNextStep('preview'))} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Confirm
              </button>
            </div>
          </div>
        )}
"""

# Insert preview step right before the wire codes section
old_wire_codes = """        {/* --- WIRE CODES SEQUENCE --- */}"""
content = content.replace(old_wire_codes, preview_step_code + "\n        " + old_wire_codes)

with open('src/components/TransferForm.tsx', 'w') as f:
    f.write(content)

print("Updated TransferForm UI logic")
