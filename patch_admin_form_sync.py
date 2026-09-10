import re

with open('src/components/AdminModules.tsx', 'r') as f:
    content = f.read()

# Add useEffect to sync the form
old_investors = """export function AdminInvestors() {
  const { adminSettings, updateAdminSettings, investments, updateInvestment, updateBalance, users, adminUpdateUser } = useBank();
  
  const [brokerWalletsForm, setBrokerWalletsForm] = useState(adminSettings.brokerWallets || { btc: '', eth: '', usdt: '', sol: '' });
  
  const handleSaveBrokerWallets = (e: React.FormEvent) => {"""

new_investors = """export function AdminInvestors() {
  const { adminSettings, updateAdminSettings, investments, updateInvestment, updateBalance, users, adminUpdateUser } = useBank();
  
  const [brokerWalletsForm, setBrokerWalletsForm] = useState(adminSettings.brokerWallets || { btc: '', eth: '', usdt: '', sol: '' });
  
  useEffect(() => {
    if (adminSettings.brokerWallets) {
      setBrokerWalletsForm(adminSettings.brokerWallets);
    }
  }, [adminSettings.brokerWallets]);
  
  const handleSaveBrokerWallets = (e: React.FormEvent) => {"""

content = content.replace(old_investors, new_investors)

# Check if useEffect is imported in AdminModules.tsx
if "useEffect" not in content[:500]:
    content = content.replace("import { useState }", "import { useState, useEffect }")

with open('src/components/AdminModules.tsx', 'w') as f:
    f.write(content)
print("Updated AdminInvestors form sync")
