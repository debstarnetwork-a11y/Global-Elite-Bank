const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

code = code.replace(
  'if (actionForm.status) {\n                            updateUserStatus(currentActiveUser.id, actionForm.status as any);\n                          }',
  'updateUserStatus(currentActiveUser.id, (actionForm.status || currentActiveUser.status) as any);'
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
console.log('Fixed action button');
