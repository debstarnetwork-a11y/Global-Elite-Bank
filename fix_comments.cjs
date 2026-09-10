const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

content = content.replace(
`      {currentView === 'virtual-cards' && <AdminVirtualCards />}
      {/* 
        <div className="p-8 text-center text-foreground/50">Please select a sub-category from the sidebar.</div>
      )}`,
`      {currentView === 'virtual-cards' && <AdminVirtualCards />}`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
