const fs = require('fs');
let code = fs.readFileSync('src/components/AdminSettingsView.tsx', 'utf8');

code = code.replace(
  "{activeTab === 'payment' && (\n        <div className=\"mt-12\">",
  "{activeTab === 'payment' && (\n        <div className=\"space-y-8\">"
);
fs.writeFileSync('src/components/AdminSettingsView.tsx', code);
console.log('Fixed payment margin');
