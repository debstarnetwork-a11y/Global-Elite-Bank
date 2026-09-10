const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const startRegex = /\{isUserModalOpen && currentActiveUser && \(/;
const endText = '{/* Add New User Modal */}';

const startIndex = code.search(startRegex);
const endIndex = code.indexOf(endText);

if (startIndex !== -1 && endIndex !== -1) {
  let modalCode = code.substring(startIndex, endIndex);
  fs.writeFileSync('temp_modal.tsx', modalCode);
  console.log('Saved modal code to temp_modal.tsx');
} else {
  console.log('Could not find boundaries', startIndex, endIndex);
}
