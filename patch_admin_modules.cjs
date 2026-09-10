const fs = require('fs');
let code = fs.readFileSync('src/components/AdminModules.tsx', 'utf8');

// Remove IBAN input
code = code.replace(
`                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">IBAN</label>
                  <input type="text" value={editForm.iban} onChange={e => setEditForm({...editForm, iban: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" />
                </div>`,
""
);

// Rename SWIFT to SWIFT-SEC Code(auto)
code = code.replace(
`                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">SWIFT</label>`,
`                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">SWIFT-SEC</label>`
);

// Also remove IBAN generation from handleReview
code = code.replace(
`      accountNumber: generateRandomCode('', 16),
      iban: generateRandomCode('CH', 19),`,
`      accountNumber: generateRandomCode('', 16),`
);

// Also remove IBAN from handleApprove customUser
code = code.replace(
`          accountNumber: editForm.accountNumber,
          iban: editForm.iban,`,
`          accountNumber: editForm.accountNumber,`
);

fs.writeFileSync('src/components/AdminModules.tsx', code);
console.log('Patched AdminModules');
