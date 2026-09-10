import fs from 'fs';

let content = fs.readFileSync('src/store.tsx', 'utf8');

// The adminSettings declaration block
const adminMatch = content.match(/const \[adminSettings, setAdminSettings\] = useState<AdminSettings>\(\(\) => getInitialState\('bank_adminSettings', \{[\s\S]*?\}\)\);\n/);

if (adminMatch) {
  const adminStr = adminMatch[0];
  // Remove it from current position
  content = content.replace(adminStr, '');
  
  // Insert it before `const [isInitializing, setIsInitializing]`
  content = content.replace('const [isInitializing, setIsInitializing]', adminStr + '\n  const [isInitializing, setIsInitializing]');
  
  fs.writeFileSync('src/store.tsx', content, 'utf8');
  console.log('Fixed order of adminSettings');
} else {
  console.log('Could not find adminSettings block');
}
