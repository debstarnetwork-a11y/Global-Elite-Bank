const fs = require('fs');
let code = fs.readFileSync('src/components/AdminModules.tsx', 'utf8');

code = code.replace(/swift: 'GEBLCHZZ',/g, "swift: generateRandomCode('', 7),");

fs.writeFileSync('src/components/AdminModules.tsx', code);
console.log('Patched SWIFT generation in AdminModules');
