import { stringToUUID } from './uuid';

export function sanitizePin(pin: any): string {
  const p = String(pin || '').trim();
  if (/^\d{4}$/.test(p)) return p;
  const digits = p.replace(/\D/g, '');
  if (digits.length >= 4) return digits.slice(0, 4);
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function prepareUserForSupabase(user: any) {
  const pinVal = sanitizePin(user.pin || user.accounts?.[0]?.pin || '1234');
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
    account_opened_at: user.accountOpenedAt || new Date().toISOString(),
    pin: pinVal
  };
}

export function prepareAccountForSupabase(acc: any, userId?: string) {
  const finalUserId = stringToUUID(acc.userId || userId);
  const pinVal = sanitizePin(acc.pin || acc.pinCode || acc.codes?.pin || '1234');
  return {
    id: stringToUUID(acc.id),
    user_id: finalUserId,
    account_number: acc.accountNumber,
    type: acc.type || 'Checking',
    balance: Number(acc.balance) || 0,
    iban: acc.iban || null,
    pin: pinVal,
    swift_code: acc.codes?.swift || acc.swiftCode || null,
    cot_code: acc.codes?.cot || acc.cotCode || null,
    tax_code: acc.codes?.tax || acc.taxCode || null,
    imf_code: acc.codes?.imf || acc.imfCode || null,
    aml_code: acc.codes?.aml || acc.amlCode || null
  };
}

export function prepareTransactionForSupabase(txn: any, fallbackUserId?: string, validAccountIds?: Set<string>) {
  const finalUserId = stringToUUID(txn.userId || fallbackUserId);
  let finalAccountId: string | null = null;
  if (txn.accountId) {
    const accUuid = stringToUUID(txn.accountId);
    if (!validAccountIds || validAccountIds.has(accUuid) || validAccountIds.has(txn.accountId)) {
      finalAccountId = accUuid;
    }
  }

  return {
    id: stringToUUID(txn.id),
    user_id: finalUserId,
    account_id: finalAccountId,
    type: txn.type || 'deposit',
    amount: Number(txn.amount) || 0,
    date: txn.date || new Date().toISOString(),
    description: txn.description || (txn.recipientDetails?.remarks || 'Transaction'),
    status: txn.status || 'completed',
    recipient_details: txn.recipientDetails || null
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
    network: card.network?.toLowerCase() === 'mastercard' ? 'mastercard' : 'visa',
    tier: card.tier || null
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

export function prepareCryptoWithdrawalForSupabase(req: any, fallbackUserId?: string) {
  return {
    id: stringToUUID(req.id),
    user_id: stringToUUID(req.userId || fallbackUserId),
    user_name: req.userName || null,
    user_email: req.userEmail || null,
    amount: Number(req.amount) || 0,
    original_requested_amount: req.originalRequestedAmount != null ? Number(req.originalRequestedAmount) : null,
    crypto_amount: Number(req.cryptoAmount) || 0,
    original_requested_crypto_amount: req.originalRequestedCryptoAmount != null ? Number(req.originalRequestedCryptoAmount) : null,
    currency: req.currency || 'USDT',
    network: req.network || 'TRC20',
    wallet_address: req.walletAddress || '',
    memo: req.memo || null,
    status: req.status || 'pending',
    tx_hash: req.txHash || null,
    receipt_number: req.receiptNumber || null,
    network_fee: req.networkFee != null ? Number(req.networkFee) : null,
    admin_notes: req.adminNotes || null,
    source_wallet: req.sourceWallet || null,
    request_date: req.requestDate || new Date().toISOString(),
    approval_date: req.approvalDate || null
  };
}

export function prepareCryptoTradeOrderForSupabase(order: any, fallbackUserId?: string) {
  const cryptoAmt = Number(order.cryptoAmount) || 0.001;
  const fiatAmt = Number(order.fiatAmount) || 0;
  const rate = Number(order.exchangeRate) || (cryptoAmt > 0 ? fiatAmt / cryptoAmt : 1);
  return {
    id: stringToUUID(order.id),
    user_id: stringToUUID(order.userId || fallbackUserId),
    user_name: order.userName || null,
    user_email: order.userEmail || null,
    order_type: order.orderType || 'buy',
    crypto_currency: order.cryptoCurrency || 'BTC',
    fiat_currency: order.fiatCurrency || 'USD',
    crypto_amount: cryptoAmt,
    fiat_amount: fiatAmt,
    exchange_rate: rate,
    status: order.status || 'pending',
    approved_by: order.approvedBy || null,
    receipt_number: order.receiptNumber || null,
    tx_hash: order.txHash || null,
    notes: order.notes || null,
    request_date: order.requestDate || new Date().toISOString(),
    approval_date: order.approvalDate || null
  };
}

export function prepareAdminSettingsForSupabase(settings: any) {
  return {
    id: settings.id || '7d5b70a5-be4c-489c-b538-a069eaf348a8',
    alert_threshold: settings.alertThreshold != null ? Number(settings.alertThreshold) : 10000,
    max_crypto_withdrawal_limit: settings.maxCryptoWithdrawalLimit != null ? Number(settings.maxCryptoWithdrawalLimit) : 25000,
    require_wire_codes: settings.requireWireCodes ?? true,
    code1_name: settings.code1Name || 'COT',
    code1_message: settings.code1Message || '',
    require_code1: settings.requireCode1 ?? true,
    code2_name: settings.code2Name || 'SWIFT-SEC',
    code2_message: settings.code2Message || '',
    require_code2: settings.requireCode2 ?? true,
    code3_name: settings.code3Name || 'IMF Clearance',
    code3_message: settings.code3Message || '',
    require_code3: settings.requireCode3 ?? true,
    code4_name: settings.code4Name || 'TAX',
    code4_message: settings.code4Message || '',
    require_code4: settings.requireCode4 ?? true,
    code5_name: settings.code5Name || 'AML-PASS',
    code5_message: settings.code5Message || '',
    require_code5: settings.requireCode5 ?? true,
    require_otp: settings.requireOtp ?? false,
    preference_contact_email: settings.preferenceContactEmail || 'globalelitefund@gmail.com',
    website_currency: settings.websiteCurrency || '$',
    homepage_url: settings.homepageUrl || '',
    require_kyc_withdrawal: settings.requireKycWithdrawal ?? false,
    require_kyc_registration: settings.requireKycRegistration ?? false,
    require_email_verification: settings.requireEmailVerification ?? false,
    mail_server: settings.mailServer || '',
    email_from: settings.emailFrom || 'globalelitefund@gmail.com',
    email_from_name: settings.emailFromName || 'Global Elite Bank',
    google_client_id: settings.googleClientId || '',
    google_client_secret: settings.googleClientSecret || '',
    google_redirect_url: settings.googleRedirectUrl || '',
    captcha_secret: settings.captchaSecret || '',
    captcha_site_key: settings.captchaSiteKey || '',
    active_theme: settings.activeTheme || 'dark',
    logo_url: settings.logoUrl || 'https://i.ibb.co/G3NmLY1j/GEB-logo.png',
    favicon_url: settings.faviconUrl || 'https://i.ibb.co/G3NmLY1j/GEB-logo.png',
    admin_email: settings.adminEmail || 'mizbryo@gmail.com',
    admin_password: settings.adminPassword || '12345',
    contact_email: settings.contactEmail || 'globalelitefund@gmail.com',
    contact_phone: settings.contactPhone || '+1 (555) 000-0000',
    contact_address: settings.contactAddress || '109, Feldgüetliweg Meilen Bezirk Meilen Zurich 8706 Switzerland',
    broker_wallets: settings.brokerWallets || null,
    fiat_deposit_instructions: settings.fiatDepositInstructions || null,
    e_wallet_instructions: settings.eWalletInstructions || null,
    frontend_content: settings.frontendContent || null,
    updated_at: new Date().toISOString()
  };
}
