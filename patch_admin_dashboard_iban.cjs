const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const regex1 = /                    <div>\s*<label className="block text-xs font-bold text-foreground\/50 uppercase mb-1">IBAN<\/label>\s*<input type="text" value=\{editUserForm\.accounts\?\.\[0\]\?\.iban \|\| ''\} onChange=\{e => \{\s*const accs = \[\.\.\.\(editUserForm\.accounts \|\| \[\]\)\];\s*if \(accs\.length > 0\) accs\[0\] = \{ \.\.\.accs\[0\], iban: e\.target\.value \};\s*setEditUserForm\(\{\.\.\.editUserForm, accounts: accs\}\);\s*\}\} className="w-full bg-background border border-border rounded-lg p-2 text-sm font-mono focus:border-primary outline-none" \/>\s*<\/div>/g;

code = code.replace(regex1, '');

const regex2 = /                      <div className="flex justify-between items-center">\s*<span className="text-foreground\/50 flex items-center gap-2">IBAN<\/span>\s*<span className="font-mono text-foreground">\{currentActiveUser\.accounts\?\.\[0\]\?\.iban \|\| 'N\/A'\}<\/span>\s*<\/div>/g;

code = code.replace(regex2, '');

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
console.log('Removed IBAN completely');
