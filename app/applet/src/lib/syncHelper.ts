import { stringToUUID } from './uuid';

export function prepareUserForSupabase(user: any) {
  return {
    id: stringToUUID(user.id),
    name: user.name || 'User',
    email: (user.email || '').toLowerCase().trim(),
    password: user.password || null,
    role: user.role === 'admin' ? 'admin' : 'user',
    status: user.status || 'active',
    show_full_card_details: Boolean(user.showFullCardDetails),
    mobile: user.mobile || null,
    currency: user.currency || 'USD',
    btc_wallet: user.btcWallet || null,
    dob: user.dob || null,
    nationality: user.nationality || null,
    zip_code: user.zipCode || null,
    occupation: user.occupation || null,
    residential_address: user.residentialAddress || null,
    country: user.country || null,
    profile_picture: user.profilePicture || null,
    new_account_prompt_pending: Boolean(user.newAccountPromptPending),
    account_opened_at: user.accountOpenedAt || new Date().toISOString()
  };
}

export function prepareAccountForSupabase(acc: any, userId?: string) {
  const finalUserId = stringToUUID(acc.userId || userId);
  return {
    id: stringToUUID(acc.id),
    user_id: finalUserId,
    account_number: acc.accountNumber,
    type: acc.type || 'Checking',
    balance: Number(acc.balance) || 0,
    iban: acc.iban || null,
    swift_code: acc.codes?.swift || acc.swiftCode || null,
    cot_code: acc.codes?.cot || acc.cotCode || null,
    tax_code: acc.codes?.tax || acc.taxCode || null,
    imf_code: acc.codes?.imf || acc.imfCode || null,
    aml_code: acc.codes?.aml || acc.amlCode || null
  };
}

export function prepareTransactionForSupabase(txn: any, fallbackUserId?: string, fallbackAccountId?: string) {
  return {
    id: stringToUUID(txn.id),
    user_id: stringToUUID(txn.userId || fallbackUserId),
    account_id: stringToUUID(txn.accountId || fallbackAccountId),
    type: txn.type || 'deposit',
    amount: Number(txn.amount) || 0,
    date: txn.date || new Date().toISOString(),
    description: txn.description || 'Transaction',
    status: txn.status || 'completed'
  };
}

export function prepareVirtualCardForSupabase(card: any, fallbackUserId?: string) {
  return {
    id: stringToUUID(card.id),
    user_id: stringToUUID(card.userId || fallbackUserId),
    card_number: card.cardNumber,
    expiry: card.expiryDate || card.expiry || '12/28',
    cvv: card.cvv || '123',
    status: card.status || 'active',
    type: card.type === 'physical' ? 'physical' : 'virtual',
    spending_limit: Number(card.spendingLimit) || null,
    network: card.network?.toLowerCase() === 'mastercard' ? 'mastercard' : 'visa',
    billing_address: card.billingAddress || null
  };
}

export function prepareLoanForSupabase(loan: any, fallbackUserId?: string) {
  return {
    id: stringToUUID(loan.id),
    user_id: stringToUUID(loan.userId || fallbackUserId),
    amount: Number(loan.amount) || 0,
    date: loan.date || new Date().toISOString(),
    purpose: loan.purpose || 'Personal Loan',
    status: loan.status || 'pending'
  };
}

export function prepareGrantForSupabase(grant: any, fallbackUserId?: string) {
  return {
    id: stringToUUID(grant.id),
    user_id: stringToUUID(grant.userId || fallbackUserId),
    amount: Number(grant.amount) || 0,
    date: grant.date || new Date().toISOString(),
    purpose: grant.purpose || 'Business Grant',
    status: grant.status || 'pending'
  };
}

export function prepareInvestmentForSupabase(inv: any, fallbackUserId?: string) {
  const duration = Number(inv.durationDays) || 30;
  return {
    id: stringToUUID(inv.id),
    user_id: stringToUUID(inv.userId || fallbackUserId),
    currency: inv.currency || 'USD',
    amount: Number(inv.amount) || 0,
    duration_days: duration,
    start_date: inv.startDate || inv.createdDate || new Date().toISOString(),
    end_date: inv.maturationDate || inv.endDate || new Date(Date.now() + duration * 86400000).toISOString(),
    status: inv.status || 'active'
  };
}

export function prepareContactInquiryForSupabase(inq: any) {
  return {
    id: stringToUUID(inq.id),
    name: inq.name || 'Anonymous',
    email: inq.email || 'no-email@provided.com',
    message: inq.message || '',
    reply_message: inq.replyDetails?.message || inq.replyMessage || null,
    replied_at: inq.repliedAt || null,
    status: inq.status || 'new'
  };
}

export function prepareUserApplicationForSupabase(app: any) {
  return {
    id: stringToUUID(app.id),
    name: app.name || 'Applicant',
    email: app.email || '',
    dob: app.dob || null,
    nationality: app.nationality || null,
    occupation: app.occupation || null,
    residential_address: app.residentialAddress || null,
    status: app.status || 'pending'
  };
}
