const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

code = code.replace(/swift: 'GEBLCHZZ',/g, "swift: generateRandomCode('', 7),");

fs.writeFileSync('src/store.tsx', code);
console.log('Patched SWIFT generation in store');
