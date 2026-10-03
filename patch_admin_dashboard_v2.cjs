const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
let newModal = fs.readFileSync('temp_modal_new.tsx', 'utf8');

const startRegex = /\{isEditingUser \? \(/;
const endText = '            </div>\n          </div>\n        </div>\n      )}';

const startIndex = code.search(startRegex);
const endIndex = code.indexOf(endText);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  fs.writeFileSync('src/components/AdminDashboard.tsx', before + newModal + '\n' + after);
  console.log('Replaced User Modal V2');
} else {
  console.log('Could not find boundaries', startIndex, endIndex);
}
