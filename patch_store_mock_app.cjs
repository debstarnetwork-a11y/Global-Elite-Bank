const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const emptyApps = `const [userApplications, setUserApplications] = useState<UserApplication[]>(() => getInitialState('bank_userApplications', []));`;
const populatedApps = `const [userApplications, setUserApplications] = useState<UserApplication[]>(() => getInitialState('bank_userApplications', [
    {
      id: 'app-emman',
      name: 'Emman Debelu',
      email: 'emmanueldebelu@gmail.com',
      date: '2026-09-05T12:00:00Z',
      status: 'approved',
      password: ''
    }
  ]));`;

code = code.replace(emptyApps, populatedApps);

fs.writeFileSync('src/store.tsx', code);
console.log('Added Emman Debelu to mock user applications');
