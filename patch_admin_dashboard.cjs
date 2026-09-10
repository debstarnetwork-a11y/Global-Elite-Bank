const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
let newModal = fs.readFileSync('new_modal.tsx', 'utf8');

const startRegex = /\{isUserModalOpen && currentActiveUser && \(/;
const endText = '{/* Add New User Modal */}';

const startIndex = code.search(startRegex);
const endIndex = code.indexOf(endText);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  fs.writeFileSync('src/components/AdminDashboard.tsx', before + newModal + '\n      ' + after);
  console.log('Replaced User Modal');
} else {
  console.log('Could not find boundaries', startIndex, endIndex);
}
