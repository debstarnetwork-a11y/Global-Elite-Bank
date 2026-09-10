const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const startRegex = /\{isUserModalOpen && currentActiveUser && \(/;
const endText = '{/* New User Application Modal */}';

const startIndex = code.search(startRegex);
const endIndex = code.indexOf(endText);

if (startIndex !== -1 && endIndex !== -1) {
  console.log(code.substring(startIndex, startIndex + 200));
} else {
  console.log('Could not find boundaries', startIndex, endIndex);
}
