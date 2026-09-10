import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

old_val = """    <BankContext.Provider value={{
      users, currentUser, transactions, adminSettings, virtualCards, loanApplications, userApplications, grantApplications, contactInquiries, updateVirtualCardStatus, updateLoanApplicationStatus, updateUserApplicationStatus, updateGrantApplicationStatus,
      login, logout, register, adminCreateUser, adminUpdateUser, updateUserStatus, deleteUser, updateUserCardVisibility,
      updateBalance, createTransaction, updateTransactionStatus, updateAdminSettings, changePassword, createContactInquiry
    }}>"""

new_val = """    <BankContext.Provider value={{
      users, currentUser, transactions, adminSettings, virtualCards, loanApplications, userApplications, grantApplications, contactInquiries, updateVirtualCardStatus, updateLoanApplicationStatus, updateUserApplicationStatus, updateGrantApplicationStatus,
      login, logout, register, adminCreateUser, updateUser, updateUserProfilePicture, adminUpdateUser, updateUserStatus, deleteUser, updateUserCardVisibility,
      updateBalance, createTransaction, updateTransactionStatus, updateAdminSettings, changePassword, createContactInquiry
    }}>"""
content = content.replace(old_val, new_val)

with open('src/store.tsx', 'w') as f:
    f.write(content)
print("Patched BankContext.Provider")
