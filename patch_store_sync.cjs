const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

// Add an effect to sync currentUser with users
const effectCode = `
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (!updatedUser) {
        setCurrentUser(null);
      } else if (updatedUser.status !== 'active') {
        setCurrentUser(null);
      } else if (JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users, currentUser]);
`;

code = code.replace(
  /  \/\/ Alert system for low balance\n  useEffect\(\(\) => \{/,
  `${effectCode}\n  // Alert system for low balance\n  useEffect(() => {`
);

fs.writeFileSync('src/store.tsx', code);
console.log('Synced currentUser in store.tsx');
