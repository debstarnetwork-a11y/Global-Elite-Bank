const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Fix handleOpenAddUser
code = code.replace(
`      accountNumber: generateRandomCode('', 11),
      btcWallet: '', pin: generateRandomCode('', 4),
      cot: generateRandomCode('', 7), swift: generateRandomCode('', 7),
      imf: generateRandomCode('', 6), tax: generateRandomCode('GEB', 5),
      aml: generateRandomCode('AML', 5), dob: '', nationality: '', password: '', zipCode: '', occupation: '', residentialAddress: ''`,
`      accountNumber: generateRandomCode('', 11),
      btcWallet: '', pin: generateRandomCode('', 4),
      cot: generateRandomCode('', 7), swift: generateRandomCode('', 7),
      imf: generateRandomCode('', 6), tax: generateRandomCode('GEB', 5),
      aml: generateRandomCode('AML', 5), dob: '', nationality: '', password: '', zipCode: '', occupation: '', residentialAddress: ''`
);
// Above looks clean, no iban inside handleOpenAddUser originally. Let me check submitNewUser

code = code.replace(
`        accounts: [
          {
            id: \`acc-\${Date.now()}\`,
            type: newUserForm.accountType as any,
            accountNumber: newUserForm.accountNumber,
            iban: generateRandomCode('CH', 19),
            balance: 0,
            pin: newUserForm.pin,
            codes: {
              swift: newUserForm.swift,`,
`        accounts: [
          {
            id: \`acc-\${Date.now()}\`,
            type: newUserForm.accountType as any,
            accountNumber: newUserForm.accountNumber,
            balance: 0,
            pin: newUserForm.pin,
            codes: {
              swift: newUserForm.swift,`
);

// Remove IBAN from the form UI
const ibanRegex = /<div>\s*<label className="block text-xs font-bold text-foreground\/50 uppercase mb-1">IBAN<\/label>\s*<input type="text" value=\{newUserForm.iban \?\? ''\} onChange=\{e => setNewUserForm\(\{\.\.\.newUserForm, iban: e\.target\.value\}\)\} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none font-mono" \/>\s*<\/div>/;
code = code.replace(ibanRegex, "");

// Rename SWIFT
const swiftRegex = /<label className="block text-xs font-bold text-foreground\/50 uppercase mb-1">SWIFT Code<\/label>/g;
code = code.replace(swiftRegex, '<label className="block text-xs font-bold text-foreground/50 uppercase mb-1">SWIFT-SEC Code(auto)</label>');

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
console.log('Patched AdminDashboard Add Form');
