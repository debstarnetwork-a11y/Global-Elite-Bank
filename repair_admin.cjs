const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
let finalModal = fs.readFileSync('final_modal.tsx', 'utf8');

const startRegex = /\{\/\* User Details Slide-over Modal \*\/\}/;
const endRegex = /\{\/\* Add New User Modal \*\/\}/;

const startIndex = code.search(startRegex);
const endIndex = code.search(endRegex);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  fs.writeFileSync('src/components/AdminDashboard.tsx', before + finalModal + '\n      ' + after);
  console.log('Successfully repaired AdminDashboard');
} else {
  console.log('Could not find boundaries', startIndex, endIndex);
}
