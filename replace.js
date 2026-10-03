const fs = require('fs');
let code = fs.readFileSync('src/components/AdminModules.tsx', 'utf8');
let newFunc = fs.readFileSync('temp_admin_apps.tsx', 'utf8');

const startRegex = /export function AdminApplications\(\) \{/;
const endText = 'export function AdminLoanApplications() {';

const startIndex = code.search(startRegex);
const endIndex = code.indexOf(endText);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  fs.writeFileSync('src/components/AdminModules.tsx', before + newFunc + '\n' + after);
  console.log('Replaced AdminApplications');
} else {
  console.log('Could not find boundaries', startIndex, endIndex);
}
