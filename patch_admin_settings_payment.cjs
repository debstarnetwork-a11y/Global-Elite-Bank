const fs = require('fs');
let code = fs.readFileSync('src/components/AdminSettingsView.tsx', 'utf8');

if (!code.includes("{ id: 'payment', label: 'Payment settings' }")) {
  code = code.replace(
    "{ id: 'theme', label: 'Theme/Display' },",
    "{ id: 'theme', label: 'Theme/Display' },\n    { id: 'payment', label: 'Payment settings' },"
  );
}

code = code.replace(
  "{/* Payment Settings Section */}\n      {activeTab === 'website' && (",
  "{/* Payment Settings Section */}\n      {activeTab === 'payment' && ("
);

fs.writeFileSync('src/components/AdminSettingsView.tsx', code);
console.log('Patched AdminSettingsView Payment tab');
