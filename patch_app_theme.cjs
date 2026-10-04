const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { useBank } from './store'")) {
  code = code.replace(
    "import { useState } from 'react';",
    "import { useState, useEffect } from 'react';\nimport { useBank } from './store';"
  );
}

const themeHook = `
  const { adminSettings } = useBank();
  
  useEffect(() => {
    if (adminSettings?.activeTheme) {
      document.documentElement.className = adminSettings.activeTheme;
    }
  }, [adminSettings?.activeTheme]);
`;

if (!code.includes("document.documentElement.className = adminSettings.activeTheme")) {
  code = code.replace(
    "export default function App() {\n",
    "export default function App() {\n" + themeHook
  );
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched theme logic into App.tsx");
