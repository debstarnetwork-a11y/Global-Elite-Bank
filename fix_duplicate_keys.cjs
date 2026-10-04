const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const regex = /requireCode([1-5]):\s*true,\s*requireCode\1:\s*true,/g;
let newCode = code.replace(regex, 'requireCode$1: true,');

// Since the duplicate might be separated, let's just do it manually with python or node line by line
