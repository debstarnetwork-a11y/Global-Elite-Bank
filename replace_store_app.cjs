const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');
let newFunc = fs.readFileSync('temp_store_update.tsx', 'utf8');

const startRegex = /const updateUserApplicationStatus = \(appId: string, status: UserApplication\['status'\], customData\?: Omit<User, 'id'>\) => \{/;
const endText = '  const createGrantApplication = (grant: Omit<GrantApplication, \'id\' | \'date\'>) => {';

const startIndex = code.search(startRegex);
const endIndex = code.indexOf(endText);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  fs.writeFileSync('src/store.tsx', before + newFunc + '\n' + after);
  console.log('Replaced updateUserApplicationStatus');
} else {
  console.log('Could not find boundaries', startIndex, endIndex);
}
