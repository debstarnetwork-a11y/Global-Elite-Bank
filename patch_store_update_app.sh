#!/bin/bash
cat << 'INNEREOF' > temp_store_update.tsx
  const updateUserApplicationStatus = (appId: string, status: UserApplication['status'], customData?: Omit<User, 'id'>) => {
    // 1. First find the app outside the state setter to avoid calling side-effects inside setState
    const app = userApplications.find(a => a.id === appId);
    
    if (app) {
      setTimeout(() => {
        const actionText = status === 'approved' ? 'has been APPROVED' : 'has been REJECTED';
        const nextSteps = status === 'approved' ? '\nYou can now log in using your email and password.' : '';
        setMockEmail({ to: app.email, subject: "Application Decision", body: `Dear ${app.name},\n\nYour application for membership ${actionText}.${nextSteps}`});
      }, 500);

      if (status === 'approved') {
        adminCreateUser(customData || {
          name: app.name,
          email: app.email,
          password: app.password || '0000',
          role: 'user',
          status: 'active',
          showFullCardDetails: false,
          accounts: [
            {
              id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              type: 'Checking',
              accountNumber: generateRandomCode('', 16),
              iban: generateRandomCode('CH', 19),
              balance: 0,
              pin: '0000',
              codes: {
                swift: 'GEBLCHZZ',
                cot: generateRandomCode('COT', 4),
                tax: generateRandomCode('GEB', 5),
                imf: generateRandomCode('IMF', 3),
                aml: generateRandomCode('AML', 6)
              }
            }
          ]
        });
      }
    }
    
    // 2. Then update the applications state cleanly
    setUserApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  };
INNEREOF
