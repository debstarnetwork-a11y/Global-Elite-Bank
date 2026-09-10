const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

code = code.replace(/iban: generateRandomCode\('CH', 19\),/g, '');

fs.writeFileSync('src/store.tsx', code);
console.log('Removed IBAN generation in store');
