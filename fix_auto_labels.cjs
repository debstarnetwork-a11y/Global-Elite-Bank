const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
code = code.replace(/\(auto\)/g, '');
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
console.log('Removed (auto)');
