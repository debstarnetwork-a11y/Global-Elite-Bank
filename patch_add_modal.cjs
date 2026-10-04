const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const startRegex = /\{\/\* Add New User Modal \*\/\}/;
const endText = 'export default function AdminDashboard() {';

const startIndex = code.search(startRegex);
const endIndex = code.indexOf(endText);

if (startIndex !== -1 && endIndex !== -1) {
  let modalCode = code.substring(startIndex, endIndex);
  fs.writeFileSync('temp_add_modal.tsx', modalCode);
  console.log('Saved Add User Modal');
} else {
  console.log('Could not find boundaries', startIndex, endIndex);
}
