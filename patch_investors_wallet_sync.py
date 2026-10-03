import re

with open('src/components/InvestorsWallet.tsx', 'r') as f:
    content = f.read()

old_wallets_form = """  // Wallet setup form
  const [isSettingUpWallets, setIsSettingUpWallets] = useState(false);
  const [walletsForm, setWalletsForm] = useState<InvestorWallets>(currentUser?.investorWallets || { btc: '', eth: '', usdt: '', balance: 0 });"""

new_wallets_form = """  // Wallet setup form
  const [isSettingUpWallets, setIsSettingUpWallets] = useState(false);
  const [walletsForm, setWalletsForm] = useState<InvestorWallets>(currentUser?.investorWallets || { btc: '', eth: '', usdt: '', sol: '', balance: 0 });

  useEffect(() => {
    if (currentUser?.investorWallets) {
      setWalletsForm(currentUser.investorWallets);
    }
  }, [currentUser?.investorWallets]);"""

content = content.replace(old_wallets_form, new_wallets_form)

with open('src/components/InvestorsWallet.tsx', 'w') as f:
    f.write(content)
print("Updated InvestorsWallet sync")
