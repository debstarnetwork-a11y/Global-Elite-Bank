import fs from 'fs';

let content = fs.readFileSync('src/store.tsx', 'utf8');
const anchor = "const [mockEmail, setMockEmail] = useState<{to: string, subject: string, body: string} | null>(null);";

const syncBlock = `
  const [isInitializing, setIsInitializing] = useState(true);
  const prevStates = React.useRef<any>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [
          { data: usersData },
          { data: accountsData },
          { data: txnsData },
          { data: investmentsData },
          { data: virtualCardsData },
          { data: loanAppsData },
          { data: grantAppsData },
          { data: contactInquiriesData },
          { data: userAppsData },
          { data: cryptoWithdrawalsData },
          { data: cryptoOrdersData },
          { data: adminSettingsData },
          { data: investorWalletsData }
        ] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('accounts').select('*'),
          supabase.from('transactions').select('*'),
          supabase.from('investments').select('*'),
          supabase.from('virtual_cards').select('*'),
          supabase.from('loan_applications').select('*'),
          supabase.from('grant_applications').select('*'),
          supabase.from('contact_inquiries').select('*'),
          supabase.from('user_applications').select('*'),
          supabase.from('crypto_withdrawal_requests').select('*'),
          supabase.from('crypto_trade_orders').select('*'),
          supabase.from('admin_settings').select('*').limit(1).single(),
          supabase.from('investor_wallets').select('*')
        ]);

        if (adminSettingsData) {
          setAdminSettings(snakeToCamel(adminSettingsData));
        }
        if (txnsData) setTransactions(snakeToCamel(txnsData));
        if (investmentsData) setInvestments(snakeToCamel(investmentsData));
        if (virtualCardsData) setVirtualCards(snakeToCamel(virtualCardsData));
        if (loanAppsData) setLoanApplications(snakeToCamel(loanAppsData));
        if (grantAppsData) setGrantApplications(snakeToCamel(grantAppsData));
        if (contactInquiriesData) setContactInquiries(snakeToCamel(contactInquiriesData));
        if (userAppsData) setUserApplications(snakeToCamel(userAppsData));
        if (cryptoWithdrawalsData) setCryptoWithdrawals(snakeToCamel(cryptoWithdrawalsData));
        if (cryptoOrdersData) setCryptoOrders(snakeToCamel(cryptoOrdersData));

        if (usersData) {
          const mappedUsers = snakeToCamel(usersData).map((u: any) => ({
            ...u,
            accounts: snakeToCamel(accountsData || []).filter((a: any) => a.userId === u.id),
            investorWallets: snakeToCamel(investorWalletsData || []).find((w: any) => w.userId === u.id) || undefined
          }));
          
          if (!mappedUsers.find((u: any) => u.role === 'admin')) {
             // We can insert default admin if none exists
          }
          setUsers(mappedUsers);
        }

        // Set baseline for diffs
        prevStates.current = {
          users: usersData ? snakeToCamel(usersData) : [],
          accounts: accountsData ? snakeToCamel(accountsData) : [],
          investorWallets: investorWalletsData ? snakeToCamel(investorWalletsData) : [],
          transactions: txnsData ? snakeToCamel(txnsData) : [],
          investments: investmentsData ? snakeToCamel(investmentsData) : [],
          virtualCards: virtualCardsData ? snakeToCamel(virtualCardsData) : [],
          loanApplications: loanAppsData ? snakeToCamel(loanAppsData) : [],
          grantApplications: grantAppsData ? snakeToCamel(grantAppsData) : [],
          contactInquiries: contactInquiriesData ? snakeToCamel(contactInquiriesData) : [],
          userApplications: userAppsData ? snakeToCamel(userAppsData) : [],
          cryptoWithdrawals: cryptoWithdrawalsData ? snakeToCamel(cryptoWithdrawalsData) : [],
          cryptoOrders: cryptoOrdersData ? snakeToCamel(cryptoOrdersData) : [],
          adminSettings: adminSettingsData ? snakeToCamel(adminSettingsData) : null,
        };

      } catch (err) {
        console.error('Failed to load Supabase data:', err);
      } finally {
        setIsInitializing(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => { window.localStorage.setItem('bank_currentUser', JSON.stringify(currentUser)); }, [currentUser]);

  // Generic Sync function
  const syncTable = async (currentItems: any[], tableName: string, stateKey: string) => {
    if (isInitializing) return;
    const prevItems = prevStates.current[stateKey] || [];
    
    const toUpsert = currentItems.filter(item => {
      const prevItem = prevItems.find((p: any) => p.id === item.id);
      return !prevItem || JSON.stringify(prevItem) !== JSON.stringify(item);
    });

    const toDelete = prevItems.filter((p: any) => !currentItems.find(item => item.id === p.id));

    if (toUpsert.length > 0) {
      await supabase.from(tableName).upsert(toUpsert.map(camelToSnake));
    }
    if (toDelete.length > 0) {
      await supabase.from(tableName).delete().in('id', toDelete.map((d: any) => d.id));
    }

    prevStates.current[stateKey] = JSON.parse(JSON.stringify(currentItems));
  };

  // Sync users, accounts, investorWallets separately since they are nested in state
  useEffect(() => {
    if (isInitializing) return;
    
    // Extract flat lists
    const flatUsers = users.map(u => {
      const { accounts, investorWallets, ...rest } = u;
      return rest;
    });
    
    const flatAccounts = users.flatMap(u => 
      (u.accounts || []).map(a => ({ ...a, userId: u.id }))
    );
    
    const flatWallets = users.filter(u => u.investorWallets).map(u => ({
      ...u.investorWallets,
      userId: u.id
    }));

    syncTable(flatUsers, 'users', 'users');
    syncTable(flatAccounts, 'accounts', 'accounts');
    syncTable(flatWallets, 'investor_wallets', 'investorWallets');
    
  }, [users, isInitializing]);

  // Sync others
  useEffect(() => { syncTable(transactions, 'transactions', 'transactions'); }, [transactions, isInitializing]);
  useEffect(() => { syncTable(investments, 'investments', 'investments'); }, [investments, isInitializing]);
  useEffect(() => { syncTable(virtualCards, 'virtual_cards', 'virtualCards'); }, [virtualCards, isInitializing]);
  useEffect(() => { syncTable(loanApplications, 'loan_applications', 'loanApplications'); }, [loanApplications, isInitializing]);
  useEffect(() => { syncTable(grantApplications, 'grant_applications', 'grantApplications'); }, [grantApplications, isInitializing]);
  useEffect(() => { syncTable(contactInquiries, 'contact_inquiries', 'contactInquiries'); }, [contactInquiries, isInitializing]);
  useEffect(() => { syncTable(userApplications, 'user_applications', 'userApplications'); }, [userApplications, isInitializing]);
  useEffect(() => { syncTable(cryptoWithdrawals, 'crypto_withdrawal_requests', 'cryptoWithdrawals'); }, [cryptoWithdrawals, isInitializing]);
  useEffect(() => { syncTable(cryptoOrders, 'crypto_trade_orders', 'cryptoOrders'); }, [cryptoOrders, isInitializing]);

  useEffect(() => {
    if (isInitializing || !adminSettings.id) return;
    const prevSettings = prevStates.current.adminSettings;
    if (!prevSettings || JSON.stringify(prevSettings) !== JSON.stringify(adminSettings)) {
      supabase.from('admin_settings').upsert(camelToSnake(adminSettings)).then();
      prevStates.current.adminSettings = JSON.parse(JSON.stringify(adminSettings));
    }
  }, [adminSettings, isInitializing]);
`;

if (content.includes(anchor)) {
    content = content.replace(anchor, anchor + "\n" + syncBlock);
    fs.writeFileSync('src/store.tsx', content, 'utf8');
    console.log("Injected sync block.");
} else {
    console.error("Could not find anchor.");
}
