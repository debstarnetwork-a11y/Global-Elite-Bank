const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const storageSyncEffect = `
  // Unified data management service for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key === 'bank_users' && e.newValue) setUsers(JSON.parse(e.newValue));
        if (e.key === 'bank_currentUser' && e.newValue) setCurrentUser(JSON.parse(e.newValue));
        if (e.key === 'bank_transactions' && e.newValue) setTransactions(JSON.parse(e.newValue));
        if (e.key === 'bank_virtualCards' && e.newValue) setVirtualCards(JSON.parse(e.newValue));
        if (e.key === 'bank_loanApplications' && e.newValue) setLoanApplications(JSON.parse(e.newValue));
        if (e.key === 'bank_userApplications' && e.newValue) setUserApplications(JSON.parse(e.newValue));
        if (e.key === 'bank_grantApplications' && e.newValue) setGrantApplications(JSON.parse(e.newValue));
        if (e.key === 'bank_contactInquiries' && e.newValue) setContactInquiries(JSON.parse(e.newValue));
        if (e.key === 'bank_adminSettings' && e.newValue) setAdminSettings(JSON.parse(e.newValue));
      } catch (err) {
        console.error("Error syncing data from storage", err);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
`;

code = code.replace(
  /  useEffect\(\(\) => \{ window\.localStorage\.setItem\('bank_adminSettings', JSON\.stringify\(adminSettings\)\); \}, \[adminSettings\]\);/,
  `  useEffect(() => { window.localStorage.setItem('bank_adminSettings', JSON.stringify(adminSettings)); }, [adminSettings]);\n${storageSyncEffect}`
);

fs.writeFileSync('src/store.tsx', code);
console.log('Added storage sync to store.tsx');
