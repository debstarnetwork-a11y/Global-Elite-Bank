const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

code = code.replace(
  /<select \n\s*value=\{actionForm.status \|\| currentActiveUser.status\} \n\s*onChange=\{e => setActionForm\(\{...actionForm, status: e.target.value\}\)\} \n\s*className="w-full bg-card border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none"\n\s*>/g,
  `<select 
  value={currentActiveUser.status} 
  onChange={e => {
    const newStatus = e.target.value as any;
    updateUserStatus(currentActiveUser.id, newStatus);
    showToast('Success', \`Account status updated to \${newStatus}\`);
  }} 
  className="w-full bg-card border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none"
>`
);

// We should also remove the status handling from the Update/Save button to avoid confusion,
// but actually leaving it doesn't hurt if we also update actionForm, but we aren't updating actionForm anymore.
// Wait, the replace string might not match exactly. Let me use a regex or check the exact string.
