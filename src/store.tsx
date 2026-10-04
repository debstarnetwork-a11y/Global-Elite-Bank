import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { Mail, X, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase } from './lib/supabase';
import { camelToSnake, snakeToCamel } from './lib/casing';
import { stringToUUID, generateUUID } from './lib/uuid';
import {
  sanitizePin,
  prepareUserForSupabase,
  prepareAccountForSupabase,
  prepareTransactionForSupabase,
  prepareVirtualCardForSupabase,
  prepareLoanForSupabase,
  prepareGrantForSupabase,
  prepareInvestmentForSupabase,
  prepareContactInquiryForSupabase,
  prepareUserApplicationForSupabase,
  prepareCryptoWithdrawalForSupabase,
  prepareCryptoTradeOrderForSupabase,
  prepareAdminSettingsForSupabase
} from './lib/syncHelper';

export type UserStatus = 'active' | 'inactive' | 'dormant' | 'suspended' | 'blocked' | 'frozen';
export type AccountType = 'Savings' | 'Checking' | 'Business';

export interface BrokerWallets {
  btc: string;
  eth: string;
  usdt: string;
  sol: string;
  btcQr?: string;
  ethQr?: string;
  usdtQr?: string;
  solQr?: string;
}

export const DEFAULT_BROKER_WALLETS: BrokerWallets = {
  btc: 'bc1q4cuj7w73zhc9wulsk2qn9htggfdfjuzkgg2vm2',
  eth: '0x10B950A223D1326099f61662c4a873B51cA2a3c5',
  usdt: 'TTtuJB1gzgPGejDikPEyRmmmvHQNhtm6p6',
  sol: 'GqwXL6h7mYxkAsEpYQ669JDq99XunxVbVFZs49e82Knv',
  btcQr: 'https://i.ibb.co/6cJsKgVv/Bitcoin.jpg',
  ethQr: 'https://i.ibb.co/yc1zKHbx/Ethereum.jpg',
  usdtQr: 'https://i.ibb.co/JWfyTtm6/USDT-TRC-20.jpg',
  solQr: 'https://i.ibb.co/nN1vjV2c/Solana.jpg'
};

export interface InvestorWallets {
  btc: string;
  eth: string;
  usdt: string;
  sol: string;
  balance: number;
}

export interface Investment {
  id: string;
  userId: string;
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDT' | string;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'matured' | 'withdrawn';
  txHash: string;
  profit?: number;
  isPrincipalLocked?: boolean;
  adminApprovedDuration?: boolean;
  reinvestedFromProfit?: boolean;
  adminNotes?: string;
}

export interface Account {
  id: string;
  userId?: string;
  type: AccountType;
  accountNumber: string;
  iban: string;
  balance: number;
  currency?: string;
  status?: string;
  pin: string;
  codes: {
    swift: string;
    cot: string;
    tax: string;
    imf: string;
    aml: string;
  };
}


export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  status: UserStatus;
  accounts: Account[];
  showFullCardDetails?: boolean;
  pin?: string;
  phone?: string;
  mobile?: string;
  currency?: string;
  btcWallet?: string;
  dob?: string;
  nationality?: string;
  zipCode?: string;
  occupation?: string;
  residentialAddress?: string;
  investorWallets?: InvestorWallets;
  country?: string;
  profilePicture?: string;
  newAccountPromptPending?: boolean;
  accountOpenedAt?: string;
  accountLimit?: number;
  grantLimit?: number;
  kycStatus?: string;
}

export interface VirtualCard {
  id: string;
  userId: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  status: 'active' | 'frozen' | 'pending' | 'blocked';
  type: 'virtual' | 'physical';
  tier?: 'standard' | 'gold' | 'platinum' | 'black';
  network?: 'visa' | 'mastercard';
  price?: number;
}

export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  country: string;
  netWorth: string;
  message: string;
  date: string;
  status?: 'new' | 'replied' | 'ignored';
  replySubject?: string;
  replyMessage?: string;
  repliedAt?: string;
}

export interface UserApplication {
  id: string;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  country?: string;
  nationality?: string;
  dob?: string;
  zipCode?: string;
  occupation?: string;
  residentialAddress?: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface GrantApplication {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'disbursed';
  date: string;
}

export interface CryptoWithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number; // in USD equivalent (approved amount or current requested)
  originalRequestedAmount?: number; // original amount requested before admin adjustment
  cryptoAmount: number; // e.g. 0.25 BTC or 5000 USDT
  originalRequestedCryptoAmount?: number;
  currency: string; // 'USDT' | 'BTC' | 'ETH' | 'SOL' | 'BNB' | 'XRP'
  network: string; // 'TRC20', 'ERC20', 'Bitcoin Mainnet', etc.
  walletAddress: string;
  memo?: string;
  requestDate: string;
  approvalDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  txHash?: string;
  receiptNumber?: string;
  networkFee?: number;
  adminNotes?: string;
  sourceWallet?: 'investor' | 'crypto_portfolio' | 'fiat';
}

export interface CryptoTradeOrder {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderType: 'buy' | 'sell';
  cryptoCurrency: string; // 'BTC' | 'ETH' | 'SOL' | 'BNB' | 'XRP' | 'USDT'
  fiatCurrency: string; // 'USD'
  cryptoAmount: number; // e.g. 0.0768 BTC
  fiatAmount: number; // e.g. 5000 USD
  exchangeRate: number; // e.g. 65100
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvalDate?: string;
  approvedBy?: string;
  receiptNumber?: string;
  txHash?: string;
  notes?: string;
}

export interface AppleGiftCard {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  targetAccountId: string;
  targetAccountNumber?: string;
  cardCode: string;
  pin?: string;
  amount: number;
  payoutAmount: number;
  currency: string;
  region: string;
  cardType: 'digital' | 'physical';
  receiptImageUrl?: string;
  cardImageUrl?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvalDate?: string;
  approvedBy?: string;
  rejectionReason?: string;
  adminNotes?: string;
  txHash?: string;
  receiptNumber?: string;
}

export interface AppleGiftCardSettings {
  enabled: boolean;
  officialAppleStoreUrl: string;
  amazonBuyUrl?: string;
  payoutRatePercentage: number;
  minCardAmount: number;
  maxCardAmount: number;
  instructionsNotice?: string;
}

export const DEFAULT_APPLE_GIFTCARD_SETTINGS: AppleGiftCardSettings = {
  enabled: true,
  officialAppleStoreUrl: 'https://www.apple.com/shop/buy-giftcard/giftcard',
  amazonBuyUrl: 'https://www.amazon.com/Apple-Gift-Card-email/dp/B08857ZSQ5',
  payoutRatePercentage: 100,
  minCardAmount: 25,
  maxCardAmount: 2000,
  instructionsNotice: 'Purchase an official Apple Gift Card online or in-store, then submit the 16-character digital redemption code below to fund your account.'
};

export const INITIAL_APPLE_GIFT_CARDS: AppleGiftCard[] = [
  {
    id: 'apple-card-001',
    userId: 'user-sample-01',
    userName: 'Alexander Wright',
    userEmail: 'alexander.wright@eliteholdings.ch',
    targetAccountId: 'acc-alex-001',
    targetAccountNumber: 'CH93 0000 0000 8821',
    cardCode: 'X-4829-109482-9912',
    pin: '8491',
    amount: 500,
    payoutAmount: 500,
    currency: 'USD',
    region: 'United States',
    cardType: 'digital',
    cardImageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554415707-9e4c97984f70?auto=format&fit=crop&q=80&w=400',
    status: 'pending',
    requestDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    receiptNumber: 'GEB-APPLE-REC-91823',
    notes: 'Official Apple Store e-gift card purchased via Apple Online Store.'
  },
  {
    id: 'apple-card-002',
    userId: 'user-sample-02',
    userName: 'Sophia Martinez',
    userEmail: 'sophia.martinez@genevatrust.ch',
    targetAccountId: 'acc-sophia-001',
    targetAccountNumber: 'CH93 0000 0000 4419',
    cardCode: 'X-9941-882019-3381',
    pin: '1092',
    amount: 250,
    payoutAmount: 250,
    currency: 'USD',
    region: 'United States',
    cardType: 'physical',
    cardImageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400',
    status: 'approved',
    requestDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    approvalDate: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
    approvedBy: 'Admin Verification Desk',
    receiptNumber: 'GEB-APPLE-REC-84920',
    txHash: '0x8f3c7b2e9a1d4f6c8b0e2a4d6f8a0b2c4e6f8a0b2c4e6f8a0b2c4e6f8a0b2c4e',
    notes: 'Physical 16-digit card purchased at Apple Fifth Avenue retail store.'
  }
];

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  type: 'deposit' | 'transfer_local' | 'transfer_internal' | 'transfer_wire' | 'crypto_withdrawal' | 'withdrawal' | 'crypto_buy' | 'crypto_sell' | 'crypto_trade' | 'crypto_deposit' | 'crypto_reinvest' | 'apple_card_deposit';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  recipientDetails?: any;
  description?: string;
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-deb-001",
    userId: "211992ed-d481-4b45-82f4-9420e9b6fbb6",
    accountId: "87f42de8-e3ba-4ccf-9766-e676f9c048b5",
    type: "deposit",
    amount: 100000.00,
    date: "2026-10-03T09:53:00Z",
    status: "completed",
    description: "FINMA Tier-1 Liquidity Inflow via Wire Transfer",
    recipientDetails: {
      name: "DEB STAR",
      accountNumber: "92348059788",
      bank: "Global Elite Bank Zurich",
      remarks: "Account Activation & Private Liquidity Credit"
    }
  }
];

export interface FiatDepositInstructions {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftBic: string;
  bankAddress: string;
  referencePlaceholder: string;
}

interface AdminSettings {
  id?: string;
  websiteName?: string;
  websiteTitle?: string;
  websiteKeywords?: string;
  websiteUrl?: string;
  whatsappNumber?: string;
  tidioId?: string;
  geminiApiKey?: string;
  timezone?: string;
  installationType?: string;
  alertThreshold: number;
  maxCryptoWithdrawalLimit?: number;
  requireWireCodes: boolean;
  code1Name: string;
  code1Message: string;
  requireCode1: boolean;
  code2Name: string;
  code2Message: string;
  requireCode2: boolean;
  code3Name: string;
  code3Message: string;
  requireCode3: boolean;
  code4Name: string;
  code4Message: string;
  requireCode4: boolean;
  code5Name: string;
  code5Message: string;
  requireCode5: boolean;
  requireOtp: boolean;
  preferenceContactEmail: string;
  websiteCurrency: string;
  homepageUrl: string;
  requireKycWithdrawal: boolean;
  requireKycRegistration: boolean;
  requireEmailVerification: boolean;
  mailServer: string;
  emailFrom: string;
  emailFromName: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUrl: string;
  captchaSecret: string;
  captchaSiteKey: string;
  activeTheme: string;


  logoUrl?: string;
  faviconUrl?: string;
  adminEmail?: string;
  adminPassword?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  brokerWallets?: BrokerWallets;
  fiatDepositInstructions?: FiatDepositInstructions;
  eWalletInstructions?: {
    providerName: string;
    accountEmail: string;
  };
  appleGiftCardSettings?: AppleGiftCardSettings;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
  smsEnabled?: boolean;
  testRecipient?: string;
  paymentMethods?: {
    id: string;
    name: string;
    type: string;
    usedFor: string;
    status: string;
  }[];
  frontendContent?: FrontendContent;
}

export interface FrontendContent {
  // Page / Section Headings
  contactPageHeading?: string;
  contactPageSubheading?: string;
  howToReachUsHeading?: string;
  urgentAssistanceHeading?: string;
  committeeSectionHeading?: string;

  // Contact Cards (Headings & Emails / Addresses)
  membershipApplicationsHeading: string;
  membershipApplicationsEmail: string;
  memberSupportHeading: string;
  memberSupportEmail: string;
  privateBankingHeading: string;
  privateBankingEmail: string;
  headOfficeHeading: string;
  headOfficeAddress: string;
  headOfficeHours: string;

  // Urgent Assistance Cards (Headings & Emails)
  cardLostHeading: string;
  cardLostEmail: string;
  suspiciousActivityHeading: string;
  suspiciousActivityEmail: string;
  mediaInquiriesHeading: string;
  mediaInquiriesEmail: string;
  partnershipInquiriesHeading: string;
  partnershipInquiriesEmail: string;

  // Committee / Team Members (Headings/Names, Roles, Image URLs)
  aboutTeamEdwardHeading?: string;
  aboutTeamEdwardName?: string;
  aboutTeamEdwardRole?: string;
  aboutTeamEdwardImg: string;

  aboutTeamHelenaHeading?: string;
  aboutTeamHelenaName?: string;
  aboutTeamHelenaRole?: string;
  aboutTeamHelenaImg: string;

  aboutTeamJonathanHeading?: string;
  aboutTeamJonathanName?: string;
  aboutTeamJonathanRole?: string;
  aboutTeamJonathanImg: string;

  aboutTeamIsabelleHeading?: string;
  aboutTeamIsabelleName?: string;
  aboutTeamIsabelleRole?: string;
  aboutTeamIsabelleImg: string;

  // Gallery / Photos
  homeStaffHeading?: string;
  homeStaffImg: string;
  servicesHallHeading?: string;
  servicesHallImg: string;
}

export const DEFAULT_FRONTEND_CONTENT: FrontendContent = {
  contactPageHeading: 'Contact Our Membership Team',
  contactPageSubheading: 'Whether you have a question about membership, need assistance with your application, or are an existing member seeking support — our team is available to assist you with the discretion and professionalism you deserve.',
  howToReachUsHeading: 'How to Reach Us',
  urgentAssistanceHeading: 'Urgent Assistance (Existing Members)',
  committeeSectionHeading: 'The Gatekeepers of Excellence',

  membershipApplicationsHeading: 'Membership Applications',
  membershipApplicationsEmail: 'admissions@digitalglobalelite.com',
  memberSupportHeading: 'Member Support',
  memberSupportEmail: 'support@digitalglobalelite.com',
  privateBankingHeading: 'Private Banking & Wealth',
  privateBankingEmail: 'info@digitalglobalelite.com',
  headOfficeHeading: 'Head Office',
  headOfficeAddress: 'Route de Saint-Julien 114, 1228 Plan-les-Ouates, Switzerland',
  headOfficeHours: 'Mon-Fri, 9:00 - 18:00 CET',

  cardLostHeading: 'Card Lost or Stolen?',
  cardLostEmail: 'support@digitalglobalelite.com',
  suspiciousActivityHeading: 'Suspicious Activity?',
  suspiciousActivityEmail: 'security@digitalglobalelite.com',
  mediaInquiriesHeading: 'Media Inquiries?',
  mediaInquiriesEmail: 'press@digitalglobalelite.com',
  partnershipInquiriesHeading: 'Partnership Inquiries?',
  partnershipInquiriesEmail: 'partners@digitalglobalelite.com',

  aboutTeamEdwardHeading: 'Membership Committee Chairman',
  aboutTeamEdwardName: 'Sir Edward Beaumont',
  aboutTeamEdwardRole: 'Chairman, Membership Committee',
  aboutTeamEdwardImg: 'https://i.ibb.co/jPQpZPtq/Sir-Edward-Beaumont.jpg',

  aboutTeamHelenaHeading: 'Chief Risk Officer',
  aboutTeamHelenaName: 'Dr. Helena Van Der Berg',
  aboutTeamHelenaRole: 'Chief Risk Officer',
  aboutTeamHelenaImg: 'https://i.ibb.co/93tLKGxv/Dr-Helena-Van-Der-Berg.jpg',

  aboutTeamJonathanHeading: 'Head of Private Banking',
  aboutTeamJonathanName: 'Mr. Jonathan Westwood',
  aboutTeamJonathanRole: 'Head of Private Banking',
  aboutTeamJonathanImg: 'https://i.ibb.co/mFYbyrLh/Mr-Jonathan-Westwood.jpg',

  aboutTeamIsabelleHeading: 'Chief Compliance Officer',
  aboutTeamIsabelleName: 'Ms. Isabelle Moreau',
  aboutTeamIsabelleRole: 'Chief Compliance Officer',
  aboutTeamIsabelleImg: 'https://i.ibb.co/1Gwq9LMm/Ms-Isabelle-Moreau.jpg',

  homeStaffHeading: 'Global Elite Bank Leadership & Staff',
  homeStaffImg: 'https://i.ibb.co/PsZ7fdd0/GEB-Staff-Photo.png',

  servicesHallHeading: 'Executive Banking Hall',
  servicesHallImg: 'https://i.ibb.co/bjLWcpry/GEB-HALL-02.png',
};

export const DEFAULT_INITIAL_ADMIN_SETTINGS: AdminSettings = {
  alertThreshold: 10000,
  maxCryptoWithdrawalLimit: 25000,
  requireWireCodes: true,
  code1Name: "COT",
  code1Message: "The COT code is required to enable you to continue with this transaction. Please contact our online customer care representative via email or live chat; they will help you with the appropriate COT code for this transaction.",
  requireCode1: true,
  code2Name: "SWIFT-SEC",
  code2Message: "To complete your transfer, please contact our Customer Service team to obtain your SWIFT-SEC code. This code is required for the transaction to go swiftly across borders.\n\nYou can reach us via email or live chat.",
  requireCode2: true,
  code3Name: "IMF Clearance",
  code3Message: "To complete your transfer, don't hesitate to contact our Customer Service team to obtain your IMF code. This code is required for the transaction to go through.\n\nYou can reach us via email or live chat.",
  requireCode3: true,
  code4Name: "TAX",
  code4Message: "The TAX code is required to enable you to continue with this transaction. Please contact our online customer care representative via email or live chat; they will help you with the appropriate TAX code for this transaction.",
  requireCode4: true,
  code5Name: "AML-PASS",
  code5Message: "The Anti-Money Laundering Passcode is required to enable you to continue with this transaction. Please contact our online customer care representative via email or live chat; they will help you with the appropriate SWIFT code for this transaction.",
  requireCode5: true,
  requireOtp: false,
  preferenceContactEmail: "support@digitalglobalelite.com",
  websiteCurrency: "$",
  homepageUrl: "",
  requireKycWithdrawal: false,
  requireKycRegistration: false,
  requireEmailVerification: false,
  mailServer: "mail.digitalglobalelite.com",
  smtpHost: "mail.digitalglobalelite.com",
  smtpPort: 465,
  smtpUser: "info@digitalglobalelite.com",
  smtpPass: "",
  smtpSecure: true,
  emailFrom: "info@digitalglobalelite.com",
  emailFromName: "Global Elite Bank",
  googleClientId: "",
  googleClientSecret: "",
  googleRedirectUrl: "http://yoursite.com/auth/google/callback",
  captchaSecret: "",
  captchaSiteKey: "",
  activeTheme: "dark",

  logoUrl: 'https://i.postimg.cc/vBZjpPr4/GEB-logo.png',
  adminEmail: 'mizbryo@gmail.com',
  adminPassword: '12345',
  contactEmail: 'info@digitalglobalelite.com',
  contactPhone: '+1 (555) 000-0000',
  contactAddress: '109, Feldgüetliweg Meilen Bezirk Meilen Zurich 8706 Switzerland',
  frontendContent: DEFAULT_FRONTEND_CONTENT,
  websiteName: 'Global Elite Bank',
  websiteTitle: 'Welcome to Global Elite Bank',
  websiteKeywords: 'online bank',
  websiteUrl: 'https://digitalglobalelite.com',
  whatsappNumber: '+1 (207) 613-1332',
  tidioId: '',
  timezone: 'Pacific/Wallis',
  installationType: 'Main-Domain',
  smsEnabled: true,
  faviconUrl: 'https://i.postimg.cc/vBZjpPr4/GEB-logo.png',
  paymentMethods: [
    { id: '1', name: 'Credit Card', type: 'currency', usedFor: 'both', status: 'enabled' },
    { id: '2', name: 'BUSD', type: 'crypto', usedFor: 'withdrawal', status: 'disabled' },
    { id: '3', name: 'USDT (TRC-20)', type: 'crypto', usedFor: 'both', status: 'enabled' },
    { id: '4', name: 'Bank Transfer', type: 'currency', usedFor: 'both', status: 'enabled' },
    { id: '5', name: 'Paypal', type: 'currency', usedFor: 'both', status: 'enabled' },
    { id: '6', name: 'Litecoin', type: 'crypto', usedFor: 'both', status: 'disabled' },
    { id: '7', name: 'Ethereum (ERC-20)', type: 'crypto', usedFor: 'both', status: 'enabled' },
    { id: '8', name: 'Bitcoin (BTC)', type: 'crypto', usedFor: 'both', status: 'enabled' },
    { id: '9', name: 'Solana (SOL)', type: 'crypto', usedFor: 'both', status: 'enabled' }
  ],
  brokerWallets: DEFAULT_BROKER_WALLETS,
  fiatDepositInstructions: {
    bankName: 'Global Elite Partner Bank (US)',
    accountName: 'Global Elite Holdings LLC',
    accountNumber: '3482910048',
    routingNumber: '021000021',
    swiftBic: 'GEHBUS33',
    bankAddress: '120 Broadway, New York, NY 10271, USA',
    referencePlaceholder: 'Include your Global Elite Account ID in the transfer memo'
  },
  eWalletInstructions: {
    providerName: 'Global Elite Official PayPal',
    accountEmail: 'deposits@digitalglobalelite.com'
  },
  appleGiftCardSettings: DEFAULT_APPLE_GIFTCARD_SETTINGS
};

interface BankContextType {
  users: User[];
  currentUser: User | null;
  transactions: Transaction[];
  virtualCards: VirtualCard[];
  loanApplications: LoanApplication[];
  userApplications: UserApplication[];
  grantApplications: GrantApplication[];
  contactInquiries: ContactInquiry[];
  investments: Investment[];
  createInvestment: (inv: Omit<Investment, 'id'> | (Omit<Investment, 'id' | 'startDate' | 'endDate' | 'status'> & Partial<Investment>)) => void;
  updateInvestment: (id: string, updates: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  reinvestProfit: (params: { userId: string; amount: number; currency: string; durationDays: number }) => { success: boolean; message: string; investment?: Investment };
  adminAdjustInvestmentDuration: (investmentId: string, newDurationDays: number, adminNotes?: string) => void;
  cryptoWithdrawals: CryptoWithdrawalRequest[];
  requestCryptoWithdrawal: (req: Omit<CryptoWithdrawalRequest, 'id' | 'requestDate' | 'status'>) => { success: boolean; message: string; request?: CryptoWithdrawalRequest };
  approveCryptoWithdrawal: (withdrawalId: string, options?: { approvedBy?: string; customTxHash?: string; adminNotes?: string; approvedAmount?: number; approvedCryptoAmount?: number }) => CryptoWithdrawalRequest | undefined;
  rejectCryptoWithdrawal: (withdrawalId: string, reason?: string) => void;
  cryptoOrders: CryptoTradeOrder[];
  requestCryptoTradeOrder: (order: Omit<CryptoTradeOrder, 'id' | 'status' | 'requestDate' | 'receiptNumber'>) => { success: boolean; message: string; order?: CryptoTradeOrder };
  approveCryptoTradeOrder: (orderId: string, options?: { approvedBy?: string; customTxHash?: string }) => CryptoTradeOrder | undefined;
  rejectCryptoTradeOrder: (orderId: string, reason?: string) => void;
  adminSettings: AdminSettings;
  login: (email: string, password?: string, isAdminPath?: boolean, skipSetCurrentUser?: boolean) => { success: boolean, error?: string, user?: User };
  setCurrentUser: (user: User | null) => void;
  loginAsAdmin: () => User;
  logout: () => void;
  register: (name: string, email: string, password?: string, details?: Partial<UserApplication>) => void;
  adminCreateUser: (user: Omit<User, "id">) => void;
  adminUpdateUser: (userId: string, updates: Partial<User>) => void;
  updateUserProfilePicture: (url: string) => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  deleteUser: (userId: string) => void;
  updateUserCardVisibility: (userId: string, show: boolean) => void;
  updateBalance: (userId: string, accountId: string, amount: number) => void;
  createTransaction: (txn: Omit<Transaction, 'id' | 'date'>) => void;
  updateTransactionStatus: (txId: string, status: 'pending' | 'completed' | 'failed') => void;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  changePassword: (oldPass: string, newPass: string) => boolean;

  createVirtualCard: (card: Omit<VirtualCard, 'id'>) => void;
  updateVirtualCardStatus: (cardId: string, status: VirtualCard['status']) => void;
  deleteVirtualCard: (cardId: string) => void;
  createLoanApplication: (loan: Omit<LoanApplication, 'id' | 'date'>) => void;
  updateLoanApplicationStatus: (loanId: string, status: 'approved' | 'rejected') => void;
  updateUserApplicationStatus: (appId: string, status: 'approved' | 'rejected', customData?: Omit<User, 'id'>) => void;
  createGrantApplication: (grant: Omit<GrantApplication, 'id' | 'date'>) => void;
  updateGrantApplicationStatus: (appId: string, status: 'approved' | 'rejected' | 'disbursed' | 'processing') => void;
  createContactInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'date'>) => void;
  deleteContactInquiry: (inquiryId: string) => void;
  updateContactInquiryStatus: (inquiryId: string, status: 'new' | 'replied' | 'ignored', replyDetails?: { subject: string; message: string }) => void;
  sendMockEmail: (email: { to: string; subject: string; body: string }) => void;
  sendTransactionalEmail: (email: { to: string; subject: string; body: string; html?: string }) => Promise<void>;
  appleGiftCards: AppleGiftCard[];
  submitAppleGiftCard: (card: Omit<AppleGiftCard, 'id' | 'requestDate' | 'status' | 'receiptNumber'>) => { success: boolean; message: string; card?: AppleGiftCard };
  approveAppleGiftCard: (cardId: string, options?: { approvedAmount?: number; adminNotes?: string }) => AppleGiftCard | undefined;
  rejectAppleGiftCard: (cardId: string, reason?: string) => void;
  deleteAppleGiftCard: (cardId: string) => void;
  restoreDemoClients: () => void;
}

const defaultAdmin: User = {
  id: '26dc7f33-7fec-47b8-92cd-d3acdff17b66',
  name: 'Super Admin',
  email: 'mizbryo@gmail.com',
  password: '12345',
  role: 'admin',
  status: 'active',
  accounts: [],
  showFullCardDetails: true
};

export const INITIAL_DEMO_CLIENTS: User[] = [
  {
    id: "211992ed-d481-4b45-82f4-9420e9b6fbb6",
    name: "DEB STAR",
    email: "debstarnetwork@gmail.com",
    role: "user",
    status: "active",
    phone: "08039498812",
    mobile: "08039498812",
    country: "Bahrain",
    nationality: "Bahrain",
    dob: "2003-03-04",
    zipCode: "430213",
    occupation: "Lawyer",
    residentialAddress: "Plot 185 Transi-Nkisi Layout 3-3",
    pin: "1234",
    currency: "USD",
    accountOpenedAt: "2026-10-03T09:53:00Z",
    accountLimit: 300000,
    grantLimit: 0,
    kycStatus: "Verified",
    btcWallet: "",
    investorWallets: {
      btc: "",
      eth: "",
      usdt: "",
      sol: "",
      balance: 0
    },
    accounts: [
      {
        id: "acc-deb-checking-01",
        accountNumber: "92348059788",
        type: "Checking",
        balance: 100000.00,
        currency: "USD",
        status: "active",
        iban: "CH930000000092348059788",
        pin: "1234",
        codes: {
          swift: "0502261",
          cot: "9174906",
          tax: "GEB67716",
          imf: "251112",
          aml: "AML78377"
        }
      }
    ]
  },
  {
    id: "c0e89123-1d92-4f32-8e21-938201948200",
    name: "Emman Debelu",
    email: "emmanueldebelu@gmail.com",
    role: "user",
    status: "active",
    phone: "+1 (555) 789-0142",
    country: "United States",
    residentialAddress: "100 Wall Street, Penthouse 42, New York, NY 10005",
    pin: "1234",
    accountOpenedAt: "2026-09-05T12:00:00Z",
    accounts: [
      {
        id: "a0b1c2d3-e4f5-4a6b-8c9d-0e1f2a3b4c5e",
        accountNumber: "8492019482",
        type: "Checking",
        balance: 350000.00,
        currency: "USD",
        status: "active",
        iban: "CH93000000008492019482",
        pin: "1234",
        codes: {
          swift: "0502261",
          cot: "9174906",
          tax: "GEB67716",
          imf: "251112",
          aml: "AML78377"
        }
      },
      {
        id: "a0b1c2d3-e4f5-4a6b-8c9d-0e1f2a3b4c5f",
        accountNumber: "9281039481",
        type: "Savings",
        balance: 1200000.00,
        currency: "USD",
        status: "active",
        iban: "CH93000000009281039481",
        pin: "1234",
        codes: {
          swift: "0502261",
          cot: "9174906",
          tax: "GEB67716",
          imf: "251112",
          aml: "AML78377"
        }
      }
    ]
  },
  {
    id: "user-sample-01",
    name: "Alexander Wright",
    email: "alexander.wright@eliteholdings.ch",
    role: "user",
    status: "active",
    phone: "+41 22 819 4000",
    country: "Switzerland",
    residentialAddress: "Quai du Mont-Blanc 19, 1201 Genève, Switzerland",
    pin: "8491",
    accountOpenedAt: "2026-08-20T10:00:00Z",
    accounts: [
      {
        id: "acc-alex-001",
        accountNumber: "CH93 0000 0000 8821",
        type: "Checking",
        balance: 785000.00,
        currency: "USD",
        status: "active",
        iban: "CH930000000088219482",
        pin: "8491",
        codes: {
          swift: "0502261",
          cot: "9174906",
          tax: "GEB67716",
          imf: "251112",
          aml: "AML78377"
        }
      }
    ]
  },
  {
    id: "user-sample-02",
    name: "Sophia Martinez",
    email: "sophia.martinez@genevatrust.ch",
    role: "user",
    status: "active",
    phone: "+41 22 718 2000",
    country: "Switzerland",
    residentialAddress: "Rue du Rhône 48, 1204 Genève, Switzerland",
    pin: "1092",
    accountOpenedAt: "2026-08-25T14:30:00Z",
    accounts: [
      {
        id: "acc-sophia-001",
        accountNumber: "CH93 0000 0000 4419",
        type: "Checking",
        balance: 520000.00,
        currency: "USD",
        status: "active",
        iban: "CH930000000044198821",
        pin: "1092",
        codes: {
          swift: "0502261",
          cot: "9174906",
          tax: "GEB67716",
          imf: "251112",
          aml: "AML78377"
        }
      }
    ]
  },
  {
    id: "c1a93821-4d92-4f32-8e21-938201948201",
    name: "Michael Vance",
    email: "michael.vance@eliteclients.com",
    role: "user",
    status: "active",
    phone: "+1 (555) 234-8901",
    country: "United States",
    residentialAddress: "742 Evergreen Terrace, New York, NY 10001",
    pin: "1234",
    accounts: [
      {
        id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        accountNumber: "4829103948",
        type: "Checking",
        balance: 148500.00,
        currency: "USD",
        status: "active",
        iban: "CH93000000004829103948",
        pin: "1234",
        codes: {
          swift: "0502261",
          cot: "9174906",
          tax: "GEB67716",
          imf: "251112",
          aml: "AML78377"
        }
      },
      {
        id: "a2b3c4d5-e6f7-4b6c-9d0e-1f2a3b4c5d6e",
        accountNumber: "9102847192",
        type: "Savings",
        balance: 450000.00,
        currency: "USD",
        status: "active",
        iban: "CH93000000009102847192",
        pin: "1234",
        codes: {
          swift: "0502261",
          cot: "9174906",
          tax: "GEB67716",
          imf: "251112",
          aml: "AML78377"
        }
      }
    ]
  },
  {
    id: "c2b84910-5e03-4a43-9f32-049382019382",
    name: "Sarah Jenkins",
    email: "sarah.j@institutionalcapital.org",
    role: "user",
    status: "active",
    phone: "+44 20 7946 0912",
    country: "United Kingdom",
    residentialAddress: "14 Belgrave Square, London SW1X 8PZ",
    pin: "8899",
    accounts: [
      {
        id: "a3c4d5e6-f7a8-4c7d-0e1f-2a3b4c5d6e7f",
        accountNumber: "7392019482",
        type: "Checking",
        balance: 295000.00,
        currency: "USD",
        status: "active",
        iban: "CH93000000007392019482",
        pin: "8899",
        codes: {
          swift: "1948203",
          cot: "8392015",
          tax: "GEB44921",
          imf: "738291",
          aml: "AML91823"
        }
      }
    ]
  }
];

export const INITIAL_USER_APPLICATIONS: UserApplication[] = [
  {
    id: "app-deb-star",
    name: "DEB STAR",
    email: "debstarnetwork@gmail.com",
    mobile: "08039498812",
    country: "Bahrain",
    nationality: "Bahrain",
    dob: "2003-03-04",
    zipCode: "430213",
    occupation: "Lawyer",
    residentialAddress: "Plot 185 Transi-Nkisi Layout 3-3",
    date: "2026-10-03T09:53:00Z",
    status: "approved"
  },
  {
    id: "app-emman-debelu",
    name: "Emman Debelu",
    email: "emmanueldebelu@gmail.com",
    mobile: "+1 (555) 789-0142",
    country: "United States",
    nationality: "American",
    dob: "1988-04-15",
    zipCode: "10005",
    occupation: "Managing Director & Venture Partner",
    residentialAddress: "100 Wall Street, Penthouse 42, New York, NY 10005",
    date: "2026-09-05T12:00:00Z",
    status: "approved"
  }
];




export function getRealtimeCardExpiry(yearsAhead = 4): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String((now.getFullYear() + yearsAhead) % 100).padStart(2, '0');
  return `${month}/${year}`;
}

export const INITIAL_VIRTUAL_CARDS: VirtualCard[] = [
  {
    id: "vc-deb-star-001",
    userId: "211992ed-d481-4b45-82f4-9420e9b6fbb6",
    cardNumber: "4921 8842 9104 3820",
    expiry: getRealtimeCardExpiry(4),
    cvv: "784",
    tier: "black",
    status: "active",
    type: "virtual",
    network: "mastercard",
    price: 1500
  },
  {
    id: "vc-9842-1092-8812",
    userId: "c1a93821-4d92-4f32-8e21-938201948201",
    cardNumber: "4000 1234 5678 9010",
    expiry: getRealtimeCardExpiry(4),
    cvv: "842",
    tier: "black",
    status: "active",
    type: "virtual",
    network: "mastercard",
    price: 1500
  },
  {
    id: "vc-4491-8821-0091",
    userId: "c2b84910-5e03-4a43-9f32-049382019382",
    cardNumber: "4111 2222 3333 4444",
    expiry: getRealtimeCardExpiry(3),
    cvv: "319",
    tier: "platinum",
    status: "active",
    type: "virtual",
    network: "visa",
    price: 1000
  }
];

const BankContext = createContext<BankContextType | undefined>(undefined);



function sanitizeUsers(usersList: any[]): User[] {
  if (!Array.isArray(usersList)) return [defaultAdmin];
  
  const seenEmails = new Set<string>();
  const seenAccountNumbers = new Set<string>();
  const seenIds = new Set<string>();
  const sanitized: User[] = [];
  let foundMizbryoAdmin = false;

  for (const rawUser of usersList) {
    if (!rawUser || typeof rawUser !== 'object') continue;
    
    // Always preserve admin users and map mizbryo/mizbrymo to mizbryo@gmail.com
    if (rawUser.role === 'admin' || rawUser.email?.toLowerCase() === 'mizbryo@gmail.com' || rawUser.email?.toLowerCase() === 'mizbrymo@gmail.com') {
      const adminId = rawUser.id || 'admin-1';
      if (!seenIds.has(adminId)) {
        seenIds.add(adminId);
        const isAdminTarget = rawUser.email?.toLowerCase() === 'mizbryo@gmail.com' || rawUser.email?.toLowerCase() === 'mizbrymo@gmail.com' || adminId === 'admin-1';
        if (isAdminTarget) {
          foundMizbryoAdmin = true;
          sanitized.push({
            ...rawUser,
            id: adminId,
            name: rawUser.name || 'Super Admin',
            email: 'mizbryo@gmail.com',
            password: '12345',
            role: 'admin',
            status: 'active',
            accounts: [],
            showFullCardDetails: true
          });
        } else {
          sanitized.push({ ...rawUser, id: adminId, role: 'admin' });
        }
      }
      continue;
    }

    // A new applicant whether rejected or approved cannot be allowed to appear until bank account has been created for him.
    // Exclude users without accounts or with empty account arrays.
    if (!rawUser.accounts || !Array.isArray(rawUser.accounts) || rawUser.accounts.length === 0) {
      continue;
    }

    // Deduplicate accounts within the user and verify valid account number
    const validUniqueAccounts: Account[] = [];
    const userAccNums = new Set<string>();
    for (const acc of rawUser.accounts) {
      if (!acc || !acc.accountNumber || !acc.accountNumber.trim()) continue;
      const accNum = acc.accountNumber.trim();
      if (!userAccNums.has(accNum) && !seenAccountNumbers.has(accNum)) {
        userAccNums.add(accNum);
        seenAccountNumbers.add(accNum);
        const resolvedPin = acc.pin || acc.pinCode || acc.pin_code || rawUser.pin || rawUser.pin_code || '1234';
        validUniqueAccounts.push({
          ...acc,
          pin: resolvedPin
        });
      }
    }

    // Must have at least one valid bank account created
    if (validUniqueAccounts.length === 0) {
      continue;
    }

    const emailKey = (rawUser.email || '').trim().toLowerCase();
    if (emailKey && seenEmails.has(emailKey)) {
      // Avoid duplicate client entry for same email; merge any non-duplicate accounts
      const existingClient = sanitized.find(c => (c.email || '').trim().toLowerCase() === emailKey);
      if (existingClient) {
        for (const va of validUniqueAccounts) {
          if (!existingClient.accounts.some(ea => ea.accountNumber.trim() === va.accountNumber.trim())) {
            existingClient.accounts.push(va);
          }
        }
      }
      continue;
    }
    if (emailKey) seenEmails.add(emailKey);

    const userId = rawUser.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    if (seenIds.has(userId)) continue;
    seenIds.add(userId);

    const primaryPin = validUniqueAccounts[0]?.pin || rawUser.pin || '1234';
    sanitized.push({
      ...rawUser,
      id: userId,
      pin: primaryPin,
      accounts: validUniqueAccounts
    });
  }

  // Ensure defaultAdmin mizbryo@gmail.com exists
  if (!foundMizbryoAdmin) {
    sanitized.unshift(defaultAdmin);
  }

  return sanitized;
}

function getInitialState<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (key === 'bank_adminSettings') {
        const stored = parsed || {};
        const oldDefaults = [
          'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          '0x71C8705E311e2fE25E5b4c10a424eB7853f09072',
          'TYDzsYUE3b6WSo8rZV83JRNURNmr57qJp8',
          '7EYnhQoR9YM3N7UoaKRoA44BW8PYJuYYU2nu23UocSQM'
        ];
        const storedWallets = stored.brokerWallets || {};
        const cleanWallets: BrokerWallets = {
          btc: (!storedWallets.btc || oldDefaults.includes(storedWallets.btc)) ? DEFAULT_BROKER_WALLETS.btc : storedWallets.btc,
          eth: (!storedWallets.eth || oldDefaults.includes(storedWallets.eth)) ? DEFAULT_BROKER_WALLETS.eth : storedWallets.eth,
          usdt: (!storedWallets.usdt || oldDefaults.includes(storedWallets.usdt)) ? DEFAULT_BROKER_WALLETS.usdt : storedWallets.usdt,
          sol: (!storedWallets.sol || oldDefaults.includes(storedWallets.sol)) ? DEFAULT_BROKER_WALLETS.sol : storedWallets.sol,
          btcQr: storedWallets.btcQr || DEFAULT_BROKER_WALLETS.btcQr,
          ethQr: storedWallets.ethQr || DEFAULT_BROKER_WALLETS.ethQr,
          usdtQr: storedWallets.usdtQr || DEFAULT_BROKER_WALLETS.usdtQr,
          solQr: storedWallets.solQr || DEFAULT_BROKER_WALLETS.solQr,
        };
        return {
          ...defaultValue,
          ...stored,
          brokerWallets: cleanWallets,
          fiatDepositInstructions: {
            ...((defaultValue as any)?.fiatDepositInstructions || {}),
            ...(stored.fiatDepositInstructions || {})
          },
          eWalletInstructions: {
            ...((defaultValue as any)?.eWalletInstructions || {}),
            ...(stored.eWalletInstructions || {})
          },
          appleGiftCardSettings: {
            ...DEFAULT_APPLE_GIFTCARD_SETTINGS,
            ...((defaultValue as any)?.appleGiftCardSettings || {}),
            ...(stored.appleGiftCardSettings || {})
          },
          frontendContent: {
            ...DEFAULT_FRONTEND_CONTENT,
            ...((defaultValue as any)?.frontendContent || {}),
            ...(stored.frontendContent || {})
          },
          code1Message: "The COT code is required to enable you to continue with this transaction. Please contact our online customer care representative via email or live chat; they will help you with the appropriate COT code for this transaction.",
          code2Message: "To complete your transfer, please contact our Customer Service team to obtain your SWIFT-SEC code. This code is required for the transaction to go swiftly across borders. You can reach us via email or live chat.",
          code3Message: "To complete your transfer, don't hesitate to contact our Customer Service team to obtain your IMF code. This code is required for the transaction to go through. You can reach us via email or live chat.",
          code4Message: "The TAX code is required to enable you to continue with this transaction. Please contact our online customer care representative via email or live chat; they will help you with the appropriate TAX code for this transaction.",
          code5Message: "The Anti-Money Laundering Passcode is required to enable you to continue with this transaction. Please contact our online customer care representative via email or live chat; they will help you with the appropriate SWIFT code for this transaction."
        } as any as T;
      }
      // Deduplicate arrays by id if applicable to fix any corrupted state
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id) {
        const unique = [];
        const seenIds = new Set();
        for (const obj of parsed) {
          if (!seenIds.has(obj.id)) {
            unique.push(obj);
            seenIds.add(obj.id);
          }
        }
        return unique as any as T;
      }
      return parsed;
    }
    return defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function BankProvider({ children }: { children: ReactNode }) {

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const local = getInitialState<User[]>('bank_users', []);
      if (Array.isArray(local) && local.length > 0) {
        const existingEmails = new Set(local.map(u => (u.email || '').trim().toLowerCase()));
        const missingClients = INITIAL_DEMO_CLIENTS.filter(d => !existingEmails.has(d.email.trim().toLowerCase()));
        let merged = missingClients.length > 0 ? [...local, ...missingClients] : local;
        if (!merged.some(u => u.role === 'admin' || u.email?.toLowerCase() === 'mizbryo@gmail.com')) {
          merged = [defaultAdmin, ...merged];
        }
        return merged;
      }
    } catch {}
    return [defaultAdmin, ...INITIAL_DEMO_CLIENTS];
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try { return JSON.parse(window.localStorage.getItem('bank_currentUser') || 'null'); } catch { return null; }
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const local = getInitialState<Transaction[]>('bank_transactions', []);
    if (Array.isArray(local) && local.length > 0) {
      const existingIds = new Set(local.map(t => t.id));
      const missing = INITIAL_TRANSACTIONS.filter(t => !existingIds.has(t.id));
      return missing.length > 0 ? [...missing, ...local] : local;
    }
    return INITIAL_TRANSACTIONS;
  });
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>(() => {
    const local = getInitialState<VirtualCard[]>('bank_virtualCards', []);
    if (Array.isArray(local) && local.length > 0) return local;
    return INITIAL_VIRTUAL_CARDS;
  });
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>(() => 
    getInitialState('bank_loanApplications', [])
  );
  const [userApplications, setUserApplications] = useState<UserApplication[]>(() => {
    const local = getInitialState<UserApplication[]>('bank_userApplications', []);
    if (Array.isArray(local) && local.length > 0) {
      const existingIds = new Set(local.map(a => a.id));
      const missing = INITIAL_USER_APPLICATIONS.filter(a => !existingIds.has(a.id));
      return missing.length > 0 ? [...local, ...missing] : local;
    }
    return INITIAL_USER_APPLICATIONS;
  });
  const [grantApplications, setGrantApplications] = useState<GrantApplication[]>(() => 
    getInitialState('bank_grantApplications', [])
  );
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(() => 
    getInitialState('bank_contactInquiries', [])
  );
  const [investments, setInvestments] = useState<Investment[]>(() => 
    getInitialState('bank_investments', [])
  );
  const [cryptoWithdrawals, setCryptoWithdrawals] = useState<CryptoWithdrawalRequest[]>(() => 
    getInitialState('bank_cryptoWithdrawals', [])
  );
  const [cryptoOrders, setCryptoOrders] = useState<CryptoTradeOrder[]>(() => 
    getInitialState('bank_cryptoOrders', [])
  );
  const [appleGiftCards, setAppleGiftCards] = useState<AppleGiftCard[]>(() => 
    getInitialState('bank_appleGiftCards', INITIAL_APPLE_GIFT_CARDS)
  );
  const [mockEmail, setMockEmail] = useState<{
    to: string;
    subject: string;
    body: string;
    fromName?: string;
    fromEmail?: string;
    logoUrl?: string;
    timestamp?: string;
  } | null>(null);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => 
    getInitialState<AdminSettings>('bank_adminSettings', DEFAULT_INITIAL_ADMIN_SETTINGS)
  );

  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Asynchronously check server-side disk storage for admin settings, users, and applications
        fetch('/api/admin/settings')
          .then(res => res.json())
          .then(data => {
            if (data?.success && data?.settings) {
              setAdminSettings(prev => {
                const merged = { ...prev, ...data.settings };
                try {
                  window.localStorage.setItem('bank_adminSettings', JSON.stringify(merged));
                  window.localStorage.setItem('bank_adminSettings_backup', JSON.stringify(merged));
                } catch (e) {}
                return merged;
              });
            }
          })
          .catch(() => {});

        fetch('/api/admin/users')
          .then(res => res.json())
          .then(data => {
            if (data?.success && Array.isArray(data?.users) && data.users.length > 0) {
              setUsers(prev => {
                const existingEmails = new Set(prev.map(u => (u.email || '').trim().toLowerCase()));
                const newUsers = data.users.filter((u: any) => !existingEmails.has((u.email || '').trim().toLowerCase()));
                if (newUsers.length > 0) {
                  const updated = [...prev, ...newUsers];
                  try { window.localStorage.setItem('bank_users', JSON.stringify(updated)); } catch (e) {}
                  return updated;
                }
                return prev;
              });
            }
          })
          .catch(() => {});

        fetch('/api/admin/applications')
          .then(res => res.json())
          .then(data => {
            if (data?.success && Array.isArray(data?.applications) && data.applications.length > 0) {
              setUserApplications(prev => {
                const existingIds = new Set(prev.map(a => a.id));
                const newApps = data.applications.filter((a: any) => !existingIds.has(a.id));
                if (newApps.length > 0) {
                  const updated = [...prev, ...newApps];
                  try { window.localStorage.setItem('bank_userApplications', JSON.stringify(updated)); } catch (e) {}
                  return updated;
                }
                return prev;
              });
            }
          })
          .catch(() => {});

        fetch('/api/admin/transactions')
          .then(res => res.json())
          .then(data => {
            if (data?.success && Array.isArray(data?.transactions) && data.transactions.length > 0) {
              setTransactions(prev => {
                const existingIds = new Set(prev.map(t => t.id));
                const newTxns = data.transactions.filter((t: any) => !existingIds.has(t.id));
                if (newTxns.length > 0) {
                  const updated = [...newTxns, ...prev];
                  try { window.localStorage.setItem('bank_transactions', JSON.stringify(updated)); } catch (e) {}
                  return updated;
                }
                return prev;
              });
            }
          })
          .catch(() => {});

        const fetchPromise = Promise.all([
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
          supabase.from('admin_settings').select('*').limit(1).maybeSingle(),
          supabase.from('investor_wallets').select('*')
        ]).catch(err => {
          console.warn('Notice: Cloud database initial fetch safely deferred to local cache:', err?.message || err);
          return new Array(13).fill({ data: null, error: null });
        });

        const timeoutPromise = new Promise<any[]>((resolve) =>
          setTimeout(() => resolve(new Array(13).fill({ data: null, error: { message: 'Cloud database deferred - loaded local cache' } })), 3000)
        );

        const results = await Promise.race([fetchPromise, timeoutPromise]);

        const [
          { data: rawUsers },
          { data: rawAccounts },
          { data: rawTxns },
          { data: rawInvestments },
          { data: rawVirtualCards },
          { data: rawLoanApps },
          { data: rawGrantApps },
          { data: rawContactInquiries },
          { data: rawUserApps },
          { data: rawCryptoWithdrawals },
          { data: rawCryptoOrders },
          { data: adminSettingsData },
          { data: rawInvestorWallets }
        ] = results;

        let usersList: any[] = rawUsers ? snakeToCamel(rawUsers) : [];
        let accountsList: any[] = rawAccounts ? snakeToCamel(rawAccounts) : [];
        let txnsList: any[] = rawTxns ? snakeToCamel(rawTxns) : [];
        let virtualCardsList: any[] = rawVirtualCards ? snakeToCamel(rawVirtualCards) : [];
        let investmentsList: any[] = rawInvestments ? snakeToCamel(rawInvestments) : [];
        let loanAppsList: any[] = rawLoanApps ? snakeToCamel(rawLoanApps) : [];
        let grantAppsList: any[] = rawGrantApps ? snakeToCamel(rawGrantApps) : [];
        let contactInquiriesList: any[] = rawContactInquiries ? snakeToCamel(rawContactInquiries) : [];
        let userAppsList: any[] = rawUserApps ? snakeToCamel(rawUserApps) : [];
        let cryptoWithdrawalsList: any[] = rawCryptoWithdrawals ? snakeToCamel(rawCryptoWithdrawals) : [];
        let cryptoOrdersList: any[] = rawCryptoOrders ? snakeToCamel(rawCryptoOrders) : [];
        let investorWalletsList: any[] = rawInvestorWallets ? snakeToCamel(rawInvestorWallets) : [];

        // Check local storage for existing user/data to automatically sync into Supabase
        try {
          let parsedLocalUsers: any[] = [];
          const localUsersStr = window.localStorage.getItem('bank_users');
          const backupUsersStr = window.localStorage.getItem('bank_users_backup');
          
          if (localUsersStr) {
            try { parsedLocalUsers = JSON.parse(localUsersStr); } catch {}
          }
          if ((!Array.isArray(parsedLocalUsers) || parsedLocalUsers.filter(u => u?.role !== 'admin').length === 0) && backupUsersStr) {
            try { parsedLocalUsers = JSON.parse(backupUsersStr); } catch {}
          }

          // If still no clients, ensure INITIAL_DEMO_CLIENTS are loaded so user database is never wiped or empty
          if (!Array.isArray(parsedLocalUsers) || parsedLocalUsers.filter(u => u?.role !== 'admin').length === 0) {
            parsedLocalUsers = INITIAL_DEMO_CLIENTS;
          }

          if (Array.isArray(parsedLocalUsers)) {
            for (const lu of parsedLocalUsers) {
              if (!lu || !lu.email) continue;
              const emailKey = lu.email.trim().toLowerCase();
              let existingInDb = usersList.find((u: any) => (u.email || '').trim().toLowerCase() === emailKey);
              let targetUserId = existingInDb ? (existingInDb.id || stringToUUID(existingInDb.id)) : (lu.id || stringToUUID(lu.id));

              if (!existingInDb) {
                // ALWAYS push user into usersList with complete accounts so client is preserved
                const userObj = {
                  ...lu,
                  id: targetUserId,
                  accounts: Array.isArray(lu.accounts) ? lu.accounts : []
                };
                usersList.push(userObj);
                
                // Background non-blocking sync to Supabase
                const prepUser = prepareUserForSupabase(lu);
                (async () => {
                  try { await supabase.from('users').upsert(prepUser); } catch {}
                })();
              } else {
                // If local user has updated profilePicture that cloud DB lacks, preserve and sync
                if (lu.profilePicture && !existingInDb.profilePicture) {
                  existingInDb.profilePicture = lu.profilePicture;
                  (async () => {
                    try {
                      await supabase.from('users').update({ profile_picture: lu.profilePicture }).eq('id', existingInDb.id);
                    } catch {}
                  })();
                }
              }

              // Check and migrate accounts for this user
              if (lu.accounts && Array.isArray(lu.accounts)) {
                for (const acc of lu.accounts) {
                  const accUUID = stringToUUID(acc.id);
                  const accExists = accountsList.some((a: any) => a.id === accUUID || a.id === acc.id || (a.accountNumber && a.accountNumber === acc.accountNumber));
                  if (!accExists) {
                    const accObj = {
                      ...acc,
                      id: accUUID,
                      userId: targetUserId
                    };
                    accountsList.push(accObj);
                    
                    const prepAcc = prepareAccountForSupabase(acc, targetUserId);
                    (async () => {
                      try { await supabase.from('accounts').upsert(prepAcc); } catch {}
                    })();
                  }
                }
              }
            }
          }
        } catch (e) {
          console.warn('Auto-migration error for users:', e);
        }

        // Only add DEB STAR if not already present in the database, preserving all admin edits
        const debIdx = usersList.findIndex((u: any) => (u.email || '').toLowerCase() === 'debstarnetwork@gmail.com');
        if (debIdx === -1) {
          const debStarExact = INITIAL_DEMO_CLIENTS.find(d => d.email.toLowerCase() === 'debstarnetwork@gmail.com')!;
          usersList.unshift(debStarExact);
          const debAcc = debStarExact.accounts[0];
          accountsList.unshift({ ...debAcc, userId: debStarExact.id });
        }

        // Safety fallback: ensure at least initial clients exist if list only contains admin
        if (usersList.filter((u: any) => u.role !== 'admin').length === 0) {
          for (const demoClient of INITIAL_DEMO_CLIENTS) {
            if (!usersList.some((u: any) => u.email?.toLowerCase() === demoClient.email.toLowerCase())) {
              usersList.push(demoClient);
              for (const demoAcc of demoClient.accounts) {
                if (!accountsList.some((a: any) => a.accountNumber === demoAcc.accountNumber)) {
                  accountsList.push(demoAcc);
                }
              }
            }
          }
        }

        const validUserIds = new Set(usersList.map((u: any) => u.id));
        const validAccountIds = new Set(accountsList.map((a: any) => a.id));

        try {
          const localTxnsStr = window.localStorage.getItem('bank_transactions');
          if (localTxnsStr) {
            const parsedLocalTxns = JSON.parse(localTxnsStr);
            if (Array.isArray(parsedLocalTxns)) {
              for (const lt of parsedLocalTxns) {
                const txnId = stringToUUID(lt.id);
                if (!txnsList.some((t: any) => t.id === txnId || t.id === lt.id)) {
                  const txUserUUID = stringToUUID(lt.userId);
                  const effectiveUserId = validUserIds.has(txUserUUID) ? txUserUUID : (usersList[0]?.id || '26dc7f33-7fec-47b8-92cd-d3acdff17b66');
                  const prepTxn = prepareTransactionForSupabase(lt, effectiveUserId, validAccountIds);
                  const { error: tErr } = await supabase.from('transactions').upsert(prepTxn);
                  if (!tErr) {
                    txnsList.push(snakeToCamel(prepTxn));
                  }
                }
              }
            }
          }
        } catch (e) {
          console.warn('Auto-migration error for transactions:', e);
        }

        // Ensure INITIAL_TRANSACTIONS (Deb Star transactions) are preserved
        for (const it of INITIAL_TRANSACTIONS) {
          if (!txnsList.some((t: any) => t.id === it.id)) {
            txnsList.unshift(it);
          }
        }

        try {
          const localCardsStr = window.localStorage.getItem('bank_virtualCards');
          if (localCardsStr) {
            const parsedLocalCards = JSON.parse(localCardsStr);
            if (Array.isArray(parsedLocalCards)) {
              for (const lc of parsedLocalCards) {
                const cardId = stringToUUID(lc.id);
                if (!virtualCardsList.some((c: any) => c.id === cardId || c.id === lc.id)) {
                  const cardUserUUID = stringToUUID(lc.userId);
                  const effectiveUserId = validUserIds.has(cardUserUUID) ? cardUserUUID : (usersList[0]?.id || '26dc7f33-7fec-47b8-92cd-d3acdff17b66');
                  const prepCard = prepareVirtualCardForSupabase(lc, effectiveUserId);
                  const { error: cErr } = await supabase.from('virtual_cards').upsert(prepCard);
                  if (!cErr) {
                    virtualCardsList.push(snakeToCamel(prepCard));
                  }
                }
              }
            }
          }
        } catch (e) {
          console.warn('Auto-migration error for cards:', e);
        }

        try {
          const localInvsStr = window.localStorage.getItem('bank_investments');
          if (localInvsStr) {
            const parsedInvs = JSON.parse(localInvsStr);
            if (Array.isArray(parsedInvs)) {
              for (const li of parsedInvs) {
                const invId = stringToUUID(li.id);
                if (!investmentsList.some((i: any) => i.id === invId || i.id === li.id)) {
                  const invUserUUID = stringToUUID(li.userId);
                  const effectiveUserId = validUserIds.has(invUserUUID) ? invUserUUID : (usersList[0]?.id || '26dc7f33-7fec-47b8-92cd-d3acdff17b66');
                  const prepInv = prepareInvestmentForSupabase(li, effectiveUserId);
                  const { error: iErr } = await supabase.from('investments').upsert(prepInv);
                  if (!iErr) {
                    investmentsList.push(snakeToCamel(prepInv));
                  }
                }
              }
            }
          }
        } catch (e) {
          console.warn('Auto-migration error for investments:', e);
        }

        try {
          const localLoansStr = window.localStorage.getItem('bank_loanApplications');
          if (localLoansStr) {
            const parsedLoans = JSON.parse(localLoansStr);
            if (Array.isArray(parsedLoans)) {
              for (const ll of parsedLoans) {
                const loanId = stringToUUID(ll.id);
                if (!loanAppsList.some((l: any) => l.id === loanId || l.id === ll.id)) {
                  const loanUserUUID = stringToUUID(ll.userId);
                  const effectiveUserId = validUserIds.has(loanUserUUID) ? loanUserUUID : (usersList[0]?.id || '26dc7f33-7fec-47b8-92cd-d3acdff17b66');
                  const prepLoan = prepareLoanForSupabase(ll, effectiveUserId);
                  const { error: lErr } = await supabase.from('loan_applications').upsert(prepLoan);
                  if (!lErr) {
                    loanAppsList.push(snakeToCamel(prepLoan));
                  }
                }
              }
            }
          }
        } catch (e) {
          console.warn('Auto-migration error for loans:', e);
        }

        try {
          const localGrantsStr = window.localStorage.getItem('bank_grantApplications');
          if (localGrantsStr) {
            const parsedGrants = JSON.parse(localGrantsStr);
            if (Array.isArray(parsedGrants)) {
              for (const lg of parsedGrants) {
                const grantId = stringToUUID(lg.id);
                if (!grantAppsList.some((g: any) => g.id === grantId || g.id === lg.id)) {
                  const grantUserUUID = stringToUUID(lg.userId);
                  const effectiveUserId = validUserIds.has(grantUserUUID) ? grantUserUUID : (usersList[0]?.id || '26dc7f33-7fec-47b8-92cd-d3acdff17b66');
                  const prepGrant = prepareGrantForSupabase(lg, effectiveUserId);
                  const { error: gErr } = await supabase.from('grant_applications').upsert(prepGrant);
                  if (!gErr) {
                    grantAppsList.push(snakeToCamel(prepGrant));
                  }
                }
              }
            }
          }
        } catch (e) {
          console.warn('Auto-migration error for grants:', e);
        }

        if (adminSettingsData) {
          const camelSettings = snakeToCamel(adminSettingsData);
          setAdminSettings(prev => {
            // Clean empty/null values so they don't erase existing active credentials
            const nonNullSettings: any = {};
            Object.keys(camelSettings).forEach(k => {
              const val = (camelSettings as any)[k];
              if (val !== null && val !== undefined && val !== '') {
                nonNullSettings[k] = val;
              }
            });

            const merged: AdminSettings = {
              ...prev,
              ...nonNullSettings,
              id: adminSettingsData.id || prev.id,
              smtpHost: nonNullSettings.smtpHost || nonNullSettings.mailServer || prev.smtpHost || prev.mailServer || 'mail.digitalglobalelite.com',
              smtpPort: nonNullSettings.smtpPort ? Number(nonNullSettings.smtpPort) : (prev.smtpPort || 465),
              smtpUser: nonNullSettings.smtpUser || prev.smtpUser || 'info@digitalglobalelite.com',
              smtpPass: nonNullSettings.smtpPass || prev.smtpPass || '',
              smtpSecure: nonNullSettings.smtpSecure !== undefined ? Boolean(nonNullSettings.smtpSecure) : (prev.smtpSecure ?? true),
              emailFrom: nonNullSettings.emailFrom || prev.emailFrom || 'info@digitalglobalelite.com',
              emailFromName: nonNullSettings.emailFromName || prev.emailFromName || 'Global Elite Bank',
              googleClientId: nonNullSettings.googleClientId || prev.googleClientId || '',
              googleClientSecret: nonNullSettings.googleClientSecret || prev.googleClientSecret || '',
              googleRedirectUrl: nonNullSettings.googleRedirectUrl || prev.googleRedirectUrl || 'http://yoursite.com/auth/google/callback',
              captchaSecret: nonNullSettings.captchaSecret || prev.captchaSecret || '',
              captchaSiteKey: nonNullSettings.captchaSiteKey || prev.captchaSiteKey || '',
              logoUrl: (adminSettingsData.logo_url && adminSettingsData.logo_url.startsWith('http') && !adminSettingsData.logo_url.includes('ibb.co')) 
                ? adminSettingsData.logo_url 
                : prev.logoUrl || 'https://i.postimg.cc/vBZjpPr4/GEB-logo.png',
              faviconUrl: (adminSettingsData.favicon_url && adminSettingsData.favicon_url.startsWith('http') && !adminSettingsData.favicon_url.includes('ibb.co')) 
                ? adminSettingsData.favicon_url 
                : prev.faviconUrl || 'https://i.postimg.cc/vBZjpPr4/GEB-logo.png'
            };

            // Auto-migrate any legacy globalelitefund@gmail.com references to digitalglobalelite.com
            if (merged.emailFrom === 'globalelitefund@gmail.com') merged.emailFrom = 'info@digitalglobalelite.com';
            if (merged.contactEmail === 'globalelitefund@gmail.com') merged.contactEmail = 'info@digitalglobalelite.com';
            if (merged.preferenceContactEmail === 'globalelitefund@gmail.com') merged.preferenceContactEmail = 'support@digitalglobalelite.com';
            if (merged.frontendContent) {
              const fc = { ...merged.frontendContent };
              Object.keys(fc).forEach(k => {
                if (typeof (fc as any)[k] === 'string' && (fc as any)[k].includes('globalelitefund@gmail.com')) {
                  if (k.toLowerCase().includes('support') || k.toLowerCase().includes('lost')) {
                    (fc as any)[k] = 'support@digitalglobalelite.com';
                  } else if (k.toLowerCase().includes('admissions') || k.toLowerCase().includes('application')) {
                    (fc as any)[k] = 'admissions@digitalglobalelite.com';
                  } else {
                    (fc as any)[k] = 'info@digitalglobalelite.com';
                  }
                }
              });
              merged.frontendContent = fc;
            }

            try {
              window.localStorage.setItem('bank_adminSettings', JSON.stringify(merged));
              window.localStorage.setItem('bank_adminSettings_backup', JSON.stringify(merged));
            } catch (e) {}

            return merged;
          });
        } else {
          setAdminSettings(prev => {
            const merged = { ...prev };
            if (merged.emailFrom === 'globalelitefund@gmail.com') merged.emailFrom = 'info@digitalglobalelite.com';
            if (merged.contactEmail === 'globalelitefund@gmail.com') merged.contactEmail = 'info@digitalglobalelite.com';
            if (merged.preferenceContactEmail === 'globalelitefund@gmail.com') merged.preferenceContactEmail = 'support@digitalglobalelite.com';
            try {
              window.localStorage.setItem('bank_adminSettings', JSON.stringify(merged));
              window.localStorage.setItem('bank_adminSettings_backup', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }

        setTransactions(txnsList);
        setInvestments(investmentsList);
        setVirtualCards(virtualCardsList);
        setLoanApplications(loanAppsList);
        setGrantApplications(grantAppsList);
        setContactInquiries(contactInquiriesList);
        setUserApplications(userAppsList);
        setCryptoWithdrawals(cryptoWithdrawalsList);
        setCryptoOrders(cryptoOrdersList);

        // Helper to validate 4-digit PIN and avoid N/A
        const getValidPin = (val: any): string => {
          const s = String(val || '').trim();
          if (s && s !== 'N/A' && s !== 'null' && s !== 'undefined' && /^\d{4}$/.test(s)) {
            return s;
          }
          const digits = s.replace(/\D/g, '');
          if (digits.length >= 4) return digits.slice(0, 4);
          return '';
        };

        // Map users with nested accounts and investorWallets
        const mappedUsers: User[] = usersList.map((u: any) => {
          const userPin = getValidPin(u.pin || u.pin_code || u.transaction_pin || u.pinCode);
          const isDebStar = (u.email || '').trim().toLowerCase() === 'debstarnetwork@gmail.com';
          const resolvedName = isDebStar ? (u.name === 'Ama' ? 'DEB STAR' : (u.name || 'DEB STAR')) : u.name;
          const resolvedRole = isDebStar ? 'user' : (u.email?.toLowerCase() === 'mizbryo@gmail.com' ? 'admin' : (u.role === 'admin' ? 'admin' : 'user'));
          const resolvedPassword = u.password || '';

          let uAccounts = accountsList
            .filter((a: any) => a.userId === u.id || a.user_id === u.id || (isDebStar && a.accountNumber === '92348059788'))
            .map((a: any) => {
              const accountPin = getValidPin(a.pin || a.pinCode || a.pin_code);
              const assignedPin = accountPin || userPin || generateRandomCode('', 4);
              return {
                id: a.id,
                userId: a.userId || u.id,
                accountNumber: a.accountNumber,
                type: a.type || 'Checking',
                balance: Number(a.balance) || 0,
                currency: u.currency || 'USD',
                status: 'active' as const,
                iban: a.iban || `CH9300000000${a.accountNumber}`,
                pin: assignedPin,
                codes: {
                  swift: a.codes?.swift || a.swiftCode || a.swift_code || '0502261',
                  cot: a.codes?.cot || a.cotCode || a.cot_code || '9174906',
                  tax: a.codes?.tax || a.taxCode || a.tax_code || 'GEB67716',
                  imf: a.codes?.imf || a.imfCode || a.imf_code || '251112',
                  aml: a.codes?.aml || a.amlCode || a.aml_code || 'AML78377'
                }
              };
            });

          // Preserve existing accounts on u if uAccounts was empty
          if (uAccounts.length === 0 && Array.isArray(u.accounts) && u.accounts.length > 0) {
            uAccounts = u.accounts;
          }

          // If still no account and non-admin, provide checking account fallback
          if (uAccounts.length === 0 && resolvedRole !== 'admin') {
            const accNum = isDebStar ? '92348059788' : generateRandomCode('', 11);
            uAccounts = [{
              id: generateUUID(),
              userId: u.id,
              accountNumber: accNum,
              type: 'Checking',
              balance: isDebStar ? 100000 : 0,
              currency: u.currency || 'USD',
              status: 'active',
              iban: `CH9300000000${accNum}`,
              pin: userPin || '1234',
              codes: {
                swift: '0502261',
                cot: '9174906',
                tax: 'GEB67716',
                imf: '251112',
                aml: 'AML78377'
              }
            }];
          }

          const uWallet = investorWalletsList.find((w: any) => w.userId === u.id || w.user_id === u.id);
          const finalPin = uAccounts[0]?.pin || userPin || '1234';

          return {
            ...u,
            name: resolvedName,
            role: resolvedRole,
            password: resolvedPassword,
            status: u.status || 'active',
            pin: finalPin,
            accounts: uAccounts,
            investorWallets: uWallet ? {
              btc: uWallet.btc || '',
              eth: uWallet.eth || '',
              usdt: uWallet.usdt || '',
              sol: uWallet.sol || '',
              balance: Number(uWallet.balance) || 0
            } : undefined
          };
        });

        // Ensure defaultAdmin exists
        if (!mappedUsers.some(u => u.role === 'admin' || u.email?.toLowerCase() === 'mizbryo@gmail.com')) {
          mappedUsers.unshift(defaultAdmin);
        }

        // Ensure virtualCards are populated
        if (virtualCardsList.length === 0) {
          virtualCardsList = INITIAL_VIRTUAL_CARDS;
        }
        setVirtualCards(virtualCardsList);
        try {
          window.localStorage.setItem('bank_virtualCards', JSON.stringify(virtualCardsList));
        } catch (e) {}

        setUsers(mappedUsers);
        setCurrentUser(prev => {
          if (!prev) return prev;
          const fresh = mappedUsers.find(u => u.id === prev.id || (u.email && prev.email && u.email.toLowerCase() === prev.email.toLowerCase()));
          return fresh ? { ...prev, ...fresh, profilePicture: fresh.profilePicture || prev.profilePicture } : prev;
        });
      } catch (err) {
        console.warn('Notice: Failed to load Supabase data, continuing with local cache:', err);
      } finally {
        setIsInitializing(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    window.localStorage.setItem('bank_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  // Sync users and accounts to Supabase
  useEffect(() => {
    if (isInitializing) return;
    const syncUsersAndAccounts = async () => {
      try {
        if (users.length > 0) {
          const prepUsers = users.map(prepareUserForSupabase);
          let { error: uErr } = await supabase.from('users').upsert(prepUsers);
          if (uErr && (uErr.message?.includes('pin') || uErr.message?.includes('column "pin"'))) {
            // Try pin_code column
            const pinCodeUsers = prepUsers.map(({ pin, ...rest }: any) => ({ ...rest, pin_code: pin }));
            const { error: pErr } = await supabase.from('users').upsert(pinCodeUsers);
            if (pErr && (pErr.message?.includes('pin_code') || pErr.message?.includes('column "pin_code"'))) {
              // Try transaction_pin column
              const txPinUsers = prepUsers.map(({ pin, ...rest }: any) => ({ ...rest, transaction_pin: pin }));
              const { error: tErr } = await supabase.from('users').upsert(txPinUsers);
              if (tErr) {
                const strippedUsers = prepUsers.map(({ pin, ...rest }: any) => rest);
                await supabase.from('users').upsert(strippedUsers);
              }
            }
          }

          const prepAccounts = users.flatMap(u =>
            (u.accounts || []).map(a => prepareAccountForSupabase(a, u.id))
          );
          if (prepAccounts.length > 0) {
            let { error: aErr } = await supabase.from('accounts').upsert(prepAccounts);
            if (aErr && (aErr.message?.includes('pin') || aErr.message?.includes('column "pin"'))) {
              // Try pin_code on accounts
              const pinCodeAccounts = prepAccounts.map(({ pin, ...rest }: any) => ({ ...rest, pin_code: pin }));
              const { error: apErr } = await supabase.from('accounts').upsert(pinCodeAccounts);
              if (apErr) {
                const strippedAccounts = prepAccounts.map(({ pin, ...rest }: any) => rest);
                await supabase.from('accounts').upsert(strippedAccounts);
              }
            }
          }

          const prepInvestorWallets = users
            .filter(u => u.investorWallets)
            .map(u => ({
              id: stringToUUID(u.id),
              user_id: stringToUUID(u.id),
              btc: u.investorWallets!.btc || '',
              eth: u.investorWallets!.eth || '',
              usdt: u.investorWallets!.usdt || '',
              sol: u.investorWallets!.sol || '',
              balance: Number(u.investorWallets!.balance) || 0
            }));

          if (prepInvestorWallets.length > 0) {
            const { error: wErr } = await supabase.from('investor_wallets').upsert(prepInvestorWallets);
            if (wErr) {
              console.warn('Notice: investor_wallets sync deferred to local:', wErr.message || wErr);
            }
          }
        }
        if (users.some(u => u.role !== 'admin')) {
          window.localStorage.setItem('bank_users', JSON.stringify(users));
          window.localStorage.setItem('bank_users_backup', JSON.stringify(users));
        } else {
          // If state currently only has admin, check if bank_users had clients before overwriting!
          const existing = window.localStorage.getItem('bank_users');
          if (!existing || !existing.includes('"role":"user"')) {
            window.localStorage.setItem('bank_users', JSON.stringify(users));
          }
        }
      } catch (err: any) {
        console.warn('Notice: users sync deferred to local:', err?.message || err);
      }
    };
    syncUsersAndAccounts();
  }, [users, isInitializing]);

  // Sync transactions to Supabase
  useEffect(() => {
    if (isInitializing) return;
    const syncTxns = async () => {
      try {
        if (transactions.length > 0) {
          const validAccounts = new Set<string>(
            users.flatMap(u => (u.accounts || []).map(a => stringToUUID(a.id)))
          );
          const defaultUserId = users[0]?.id || '26dc7f33-7fec-47b8-92cd-d3acdff17b66';
          const prep = transactions.map(t => prepareTransactionForSupabase(t, defaultUserId, validAccounts));
          await supabase.from('transactions').upsert(prep);
        }
        window.localStorage.setItem('bank_transactions', JSON.stringify(transactions));
      } catch (err: any) {
        console.warn('Notice: transactions sync deferred to local:', err?.message || err);
      }
    };
    syncTxns();
  }, [transactions, isInitializing, users]);

  // Sync virtual cards to Supabase
  useEffect(() => {
    if (isInitializing) return;
    const syncCards = async () => {
      try {
        if (virtualCards.length > 0) {
          const prep = virtualCards.map(c => prepareVirtualCardForSupabase(c));
          await supabase.from('virtual_cards').upsert(prep);
        }
        window.localStorage.setItem('bank_virtualCards', JSON.stringify(virtualCards));
      } catch (err: any) {
        console.warn('Notice: virtual cards sync deferred to local:', err?.message || err);
      }
    };
    syncCards();
  }, [virtualCards, isInitializing]);

  // Sync investments to Supabase
  useEffect(() => {
    if (isInitializing) return;
    const syncInvs = async () => {
      try {
        if (investments.length > 0) {
          const prep = investments.map(i => prepareInvestmentForSupabase(i));
          await supabase.from('investments').upsert(prep);
        }
        window.localStorage.setItem('bank_investments', JSON.stringify(investments));
      } catch (err: any) {
        console.warn('Notice: investments sync deferred to local:', err?.message || err);
      }
    };
    syncInvs();
  }, [investments, isInitializing]);

  // Sync loans to Supabase
  useEffect(() => {
    if (isInitializing) return;
    const syncLoans = async () => {
      try {
        if (loanApplications.length > 0) {
          const prep = loanApplications.map(l => prepareLoanForSupabase(l));
          await supabase.from('loan_applications').upsert(prep);
        }
        window.localStorage.setItem('bank_loanApplications', JSON.stringify(loanApplications));
      } catch (err: any) {
        console.warn('Notice: loans sync deferred to local:', err?.message || err);
      }
    };
    syncLoans();
  }, [loanApplications, isInitializing]);

  // Sync grants to Supabase
  useEffect(() => {
    if (isInitializing) return;
    const syncGrants = async () => {
      try {
        if (grantApplications.length > 0) {
          const prep = grantApplications.map(g => prepareGrantForSupabase(g));
          await supabase.from('grant_applications').upsert(prep);
        }
        window.localStorage.setItem('bank_grantApplications', JSON.stringify(grantApplications));
      } catch (err: any) {
        console.warn('Notice: grants sync deferred to local:', err?.message || err);
      }
    };
    syncGrants();
  }, [grantApplications, isInitializing]);

  // Sync inquiries to Supabase
  useEffect(() => {
    if (isInitializing) return;
    const syncInquiries = async () => {
      try {
        if (contactInquiries.length > 0) {
          const prep = contactInquiries.map(prepareContactInquiryForSupabase);
          await supabase.from('contact_inquiries').upsert(prep);
        }
        window.localStorage.setItem('bank_contactInquiries', JSON.stringify(contactInquiries));
      } catch (err: any) {
        console.warn('Notice: contact inquiries sync deferred to local:', err?.message || err);
      }
    };
    syncInquiries();
  }, [contactInquiries, isInitializing]);

  // Sync user applications to Supabase
  useEffect(() => {
    if (isInitializing) return;
    const syncUserApps = async () => {
      try {
        if (userApplications.length > 0) {
          const prep = userApplications.map(prepareUserApplicationForSupabase);
          await supabase.from('user_applications').upsert(prep);
        }
        window.localStorage.setItem('bank_userApplications', JSON.stringify(userApplications));
      } catch (err: any) {
        console.warn('Notice: user applications sync deferred to local:', err?.message || err);
      }
    };
    syncUserApps();
  }, [userApplications, isInitializing]);

  // Sync crypto withdrawals to Supabase
  useEffect(() => {
    if (isInitializing) return;
    const syncCryptoWithdrawals = async () => {
      try {
        if (cryptoWithdrawals.length > 0) {
          const prep = cryptoWithdrawals.map(prepareCryptoWithdrawalForSupabase);
          await supabase.from('crypto_withdrawal_requests').upsert(prep);
        }
        window.localStorage.setItem('bank_crypto_withdrawals', JSON.stringify(cryptoWithdrawals));
      } catch (err: any) {
        console.warn('Notice: crypto withdrawals sync deferred to local:', err?.message || err);
      }
    };
    syncCryptoWithdrawals();
  }, [cryptoWithdrawals, isInitializing]);

  // Sync crypto trade orders to Supabase
  useEffect(() => {
    if (isInitializing) return;
    const syncCryptoOrders = async () => {
      try {
        if (cryptoOrders.length > 0) {
          const prep = cryptoOrders.map(prepareCryptoTradeOrderForSupabase);
          await supabase.from('crypto_trade_orders').upsert(prep);
        }
        window.localStorage.setItem('bank_crypto_orders', JSON.stringify(cryptoOrders));
      } catch (err: any) {
        console.warn('Notice: crypto orders sync deferred to local:', err?.message || err);
      }
    };
    syncCryptoOrders();
  }, [cryptoOrders, isInitializing]);

  // Debounced, in-flight-safe Sync of admin settings to Supabase & immediate localStorage caching
  const settingsSyncTimeoutRef = useRef<any>(null);
  const isSyncingSettingsRef = useRef(false);

  useEffect(() => {
    if (isInitializing) return;

    // Immediately cache settings locally so no credentials or SMTP configs are lost across reloads/logouts
    try {
      window.localStorage.setItem('bank_adminSettings', JSON.stringify(adminSettings));
      window.localStorage.setItem('bank_adminSettings_backup', JSON.stringify(adminSettings));
    } catch (e) {
      console.warn("Notice: could not save bank_adminSettings to localStorage:", e);
    }

    if (settingsSyncTimeoutRef.current) {
      clearTimeout(settingsSyncTimeoutRef.current);
    }

    settingsSyncTimeoutRef.current = setTimeout(async () => {
      if (isSyncingSettingsRef.current) return;
      isSyncingSettingsRef.current = true;

      try {
        const payload = prepareAdminSettingsForSupabase(adminSettings);

        // Run upsert with a 4-second timeout race so queries never hang or stall the app
        const syncPromise = (async () => {
          try {
            return await supabase.from('admin_settings').upsert(payload);
          } catch (err: any) {
            return { error: { message: err?.message || 'Sync failed' } };
          }
        })();
        const timeoutPromise = new Promise<{ error: any }>((resolve) =>
          setTimeout(() => resolve({ error: { message: 'Sync timeout - safely saved to local storage' } }), 4000)
        );

        const result: any = await Promise.race([syncPromise, timeoutPromise]);
        if (result?.error) {
          console.warn('Notice: admin_settings cloud sync deferred (saved locally):', result.error.message || result.error);
        }
      } catch (err: any) {
        console.warn('Notice: admin_settings sync warning:', err?.message || err);
      } finally {
        isSyncingSettingsRef.current = false;
      }
    }, 1500);

    return () => {
      if (settingsSyncTimeoutRef.current) {
        clearTimeout(settingsSyncTimeoutRef.current);
      }
    };
  }, [adminSettings, isInitializing]);

  
  // Ensure mizbryo@gmail.com is set in admin settings if older settings existed
  useEffect(() => {
    if (adminSettings.adminEmail === 'mizbrymo@gmail.com') {
      setAdminSettings(prev => ({ ...prev, adminEmail: 'mizbryo@gmail.com', adminPassword: '12345' }));
    }
  }, [adminSettings.adminEmail]);

                        
  // Unified data management service for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key === 'bank_users' && e.newValue) setUsers(sanitizeUsers(JSON.parse(e.newValue)));
        if (e.key === 'bank_currentUser' && e.newValue) setCurrentUser(JSON.parse(e.newValue));
        if (e.key === 'bank_transactions' && e.newValue) setTransactions(JSON.parse(e.newValue));
        if (e.key === 'bank_virtualCards' && e.newValue) setVirtualCards(JSON.parse(e.newValue));
        if (e.key === 'bank_loanApplications' && e.newValue) setLoanApplications(JSON.parse(e.newValue));
        if (e.key === 'bank_userApplications' && e.newValue) setUserApplications(JSON.parse(e.newValue));
        if (e.key === 'bank_grantApplications' && e.newValue) setGrantApplications(JSON.parse(e.newValue));
        if (e.key === 'bank_contactInquiries' && e.newValue) setContactInquiries(JSON.parse(e.newValue));
        if (e.key === 'bank_adminSettings' && e.newValue) {
          const parsed = JSON.parse(e.newValue);
          setAdminSettings(prev => ({
            ...prev,
            ...parsed,
            brokerWallets: {
              ...DEFAULT_BROKER_WALLETS,
              ...(prev.brokerWallets || {}),
              ...(parsed.brokerWallets || {})
            },
            fiatDepositInstructions: {
              ...(prev.fiatDepositInstructions || {}),
              ...(parsed.fiatDepositInstructions || {})
            },
            eWalletInstructions: {
              ...(prev.eWalletInstructions || {}),
              ...(parsed.eWalletInstructions || {})
            }
          }));
        }
        if (e.key === 'bank_investments' && e.newValue) setInvestments(JSON.parse(e.newValue));
        if (e.key === 'bank_crypto_withdrawals' && e.newValue) setCryptoWithdrawals(JSON.parse(e.newValue));
        if (e.key === 'bank_crypto_orders' && e.newValue) setCryptoOrders(JSON.parse(e.newValue));
      } catch (err) {
        console.warn("Notice: storage sync event skipped:", err);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  const login = (email: string, password?: string, isAdminPath?: boolean, skipSetCurrentUser: boolean = false) => {
    const inputEmail = (email || '').trim().toLowerCase();
    const configuredAdminEmail = (adminSettings?.adminEmail || 'mizbryo@gmail.com').trim().toLowerCase();

    // Check if logging in as Super Admin
    if (inputEmail === 'admin' || inputEmail === 'mizbryo@gmail.com' || inputEmail === configuredAdminEmail || inputEmail === 'mizbrymo@gmail.com') {
      const isValidPassword = password === 'admin' || password === '12345' || password === adminSettings?.adminPassword;
      if (isValidPassword) {
        let adminUser = users.find(u => u.role === 'admin' && (u.email?.toLowerCase() === inputEmail || u.email?.toLowerCase() === 'mizbryo@gmail.com'));
        if (!adminUser) {
          adminUser = {
            id: '26dc7f33-7fec-47b8-92cd-d3acdff17b66',
            name: 'Super Admin',
            email: 'mizbryo@gmail.com',
            password: '12345',
            role: 'admin',
            status: 'active',
            accounts: [],
            showFullCardDetails: true
          };
          if (!skipSetCurrentUser) {
            setUsers(prev => [adminUser!, ...prev.filter(u => u.id !== '26dc7f33-7fec-47b8-92cd-d3acdff17b66' && u.email?.toLowerCase() !== 'mizbryo@gmail.com')]);
          }
        }
        if (!skipSetCurrentUser) setCurrentUser(adminUser);
        return { success: true, user: adminUser };
      }
      return { success: false, error: 'Invalid admin credentials' };
    }

    // Check other registered admins
    const matchedAdmin = users.find(u => u.role === 'admin' && u.email?.toLowerCase() === inputEmail);
    if (matchedAdmin) {
      if (password === matchedAdmin.password || password === '12345') {
        if (!skipSetCurrentUser) setCurrentUser(matchedAdmin);
        return { success: true, user: matchedAdmin };
      }
      return { success: false, error: 'Invalid admin credentials' };
    }

    if (isAdminPath) {
       return { success: false, error: 'You do not have administrator access.' };
    }
    
    // Normal user login: support email, username/fullname, or account number, and check password case-insensitively
    const inputIdentifier = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const user = users.find(u => {
      if (u.role === 'admin') return false;
      const emailMatches = (u.email || '').trim().toLowerCase() === inputIdentifier;
      const nameMatches = (u.name || '').trim().toLowerCase() === inputIdentifier;
      const accMatches = (u.accounts || []).some(a => (a.accountNumber || '').trim() === (email || '').trim());

      if (!emailMatches && !nameMatches && !accMatches) return false;

      if (!cleanPassword) return true;
      const storedPassword = (u.password || '').trim();
      return (
        (storedPassword && (storedPassword === cleanPassword || storedPassword.toLowerCase() === cleanPassword.toLowerCase())) ||
        (u.pin && u.pin === cleanPassword)
      );
    });
    if (user) {
      if (user.status !== 'active') {
        const msg = user.status === 'inactive' ? 'Your account is inactive. Please contact Support or Admin.' :
                    user.status === 'dormant' ? 'Your account is currently dormant. Please kindly contact Support/Admin to reactivate.' :
                    user.status === 'suspended' ? 'Your account has been suspended. Please kindly contact Support/Admin.' :
                    `Your account has been ${user.status}. Please kindly contact Support/Admin.`;
        return { success: false, error: msg };
      }
      if (!skipSetCurrentUser) setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => setCurrentUser(null);

  const loginAsAdmin = () => {
    let adminUser = users.find(u => u.role === 'admin' && (u.email?.toLowerCase() === 'mizbryo@gmail.com' || u.email?.toLowerCase() === (adminSettings?.adminEmail || '').toLowerCase()));
    if (!adminUser) {
      adminUser = users.find(u => u.role === 'admin') || defaultAdmin;
    }
    setCurrentUser(adminUser);
    return adminUser;
  };

  const generateRandomCode = (prefix: string, length: number) => {
    return prefix + Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  };


  const adminCreateUser = (userData: Omit<User, "id">) => {
    // If client, ensure they have at least one valid bank account created
    if (userData.role !== 'admin') {
      if (!userData.accounts || !Array.isArray(userData.accounts) || userData.accounts.length === 0) {
        console.warn('Cannot create client without bank accounts');
        return;
      }
      const hasValidAcc = userData.accounts.some(a => Boolean(a?.accountNumber && a.accountNumber.trim()));
      if (!hasValidAcc) {
        console.warn('Cannot create client without valid account number');
        return;
      }
    }

    setUsers(prev => {
      // Deduplicate by email
      const emailKey = (userData.email || '').trim().toLowerCase();
      const existingIdx = prev.findIndex(u => (u.email || '').trim().toLowerCase() === emailKey);

      if (existingIdx !== -1) {
        // User already exists; update details and merge any non-duplicate bank accounts
        const existingUser = prev[existingIdx];
        const existingAccounts = existingUser.accounts || [];
        const incomingAccounts = userData.accounts || [];

        const mergedAccounts = [...existingAccounts];
        for (const incAcc of incomingAccounts) {
          if (!incAcc || !incAcc.accountNumber) continue;
          const accExists = mergedAccounts.some(a => 
            a.accountNumber?.trim() === incAcc.accountNumber?.trim() || a.id === incAcc.id
          );
          if (!accExists) {
            mergedAccounts.push(incAcc);
          }
        }

        const updatedUser: User = {
          ...existingUser,
          ...userData,
          id: existingUser.id,
          accounts: mergedAccounts
        };

        const next = [...prev];
        next[existingIdx] = updatedUser;
        return next;
      }

      // Check if any incoming account number is already registered to another user to avoid duplicates
      const incomingAccNums = (userData.accounts || []).map(a => a.accountNumber?.trim()).filter(Boolean);
      const isAccNumTaken = prev.some(u => 
        (u.accounts || []).some(a => incomingAccNums.includes(a.accountNumber?.trim()))
      );

      if (isAccNumTaken) {
        console.warn('Account number already belongs to an existing client. Duplicate prevented.');
        return prev;
      }

      const newUserId = generateUUID();
      const newAccounts = (userData.accounts || []).map(a => {
        const pinCode = String(a.pin || userData.pin || generateRandomCode('', 4));
        return {
          ...a,
          id: generateUUID(),
          userId: newUserId,
          pin: pinCode
        };
      });
      const primaryPin = newAccounts[0]?.pin || userData.pin || generateRandomCode('', 4);
      const newUser: User = {
        ...userData,
        id: newUserId,
        pin: primaryPin,
        accounts: newAccounts,
        newAccountPromptPending: true,
        accountOpenedAt: new Date().toISOString()
      };

      // Automated Welcome & Account Opening Email Alert
      if (newUser.email) {
        const primAcc = newAccounts[0];
        setTimeout(() => {
          sendTransactionalEmail({
            to: newUser.email,
            subject: `🏛️ Welcome to Global Elite Bank - Your Account #${primAcc?.accountNumber || ''} is Active`,
            body: `Dear ${newUser.name},\n\nWe are privileged to welcome you as a private client of Global Elite Bank.\n\nYour numbered multi-currency account has been officially opened and authenticated by our compliance directorate.\n\nAccount Credentials & Profile:\n• Account Name: ${newUser.name}\n• Primary Account Number: #${primAcc?.accountNumber || ''}\n• IBAN: ${primAcc?.iban || 'CH93 0000 0000 ' + (primAcc?.accountNumber?.slice(-4) || '8821')}\n• Currency: ${newUser.currency || 'USD'}\n• Account Tier: Private Checking\n• Security Clearance: Tier 1 FINMA Verified\n\nFunding Instructions:\nYou may now log in to fund your account via International Wire (SWIFT), Institutional Cold-Storage Crypto (BTC, ETH, USDT, SOL), or our instant Apple Gift Card redemption desk.\n\nThank you for trusting Global Elite Bank.\n\nWarm regards,\nAdmissions & Compliance Directorate\nGlobal Elite Bank, Zurich, Switzerland`
          });
        }, 400);
      }

      return [...prev, newUser];
    });
  };

  const register = (name: string, email: string, password?: string, details?: Partial<UserApplication>) => {
    const newApp: UserApplication = {
      id: generateUUID(),
      name,
      email,
      password,
      mobile: details?.mobile || '',
      country: details?.country || '',
      nationality: details?.nationality || '',
      dob: details?.dob || '',
      zipCode: details?.zipCode || '',
      occupation: details?.occupation || '',
      residentialAddress: details?.residentialAddress || '',
      date: new Date().toISOString(),
      status: 'pending'
    };
    setUserApplications(prev => [...prev, newApp]);
    
    // Automatic email mock
    setTimeout(() => {
      setMockEmail({ to: email, subject: "Application Under Review", body: `Dear ${name},

Your application for membership is currently being reviewed by our Membership Committee. You will receive another update within 2–5 business days.`});
    }, 500);
  };

  const adminUpdateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => {
      const next = prev.map(u => {
        if (u.id !== userId) return u;
        const rawPin = updates.pin || u.pin;
        const sanitizedPin = rawPin ? sanitizePin(rawPin) : sanitizePin(u.accounts?.[0]?.pin || '1234');
        const updatedAccounts = updates.accounts ? updates.accounts.map((a, idx) => {
          const pinVal = (idx === 0 && updates.pin) ? sanitizePin(updates.pin) : sanitizePin(a.pin || sanitizedPin);
          return { ...a, pin: pinVal };
        }) : (u.accounts || []).map((a, idx) => {
          if (idx === 0 && updates.pin) return { ...a, pin: sanitizePin(updates.pin) };
          return { ...a, pin: sanitizePin(a.pin || sanitizedPin) };
        });
        const resolvedPin = updates.pin ? sanitizePin(updates.pin) : sanitizePin(updatedAccounts[0]?.pin || sanitizedPin);
        return { ...u, ...updates, pin: resolvedPin, accounts: updatedAccounts };
      });

      try {
        window.localStorage.setItem('bank_users', JSON.stringify(next));
        window.localStorage.setItem('bank_users_backup', JSON.stringify(next));
      } catch (e) {}

      try {
        fetch('/api/admin/save-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users: next })
        }).catch(() => {});
      } catch (e) {}

      // Direct upsert to Supabase to persist photo and all fields permanently
      const userToSync = next.find(u => u.id === userId);
      if (userToSync) {
        const prep = prepareUserForSupabase(userToSync);
        (async () => {
          try {
            await supabase.from('users').upsert(prep);
          } catch (err) {
            console.warn('Failed to upsert updated user in Supabase:', err);
          }
        })();
      }

      return next;
    });

    setCurrentUser(prev => {
      if (!prev) return prev;
      const userMatches = prev.id === userId || (prev.email && updates.email && prev.email.toLowerCase() === updates.email.toLowerCase());
      if (!userMatches) return prev;
      const rawPin = updates.pin || prev.pin;
      const sanitizedPin = rawPin ? sanitizePin(rawPin) : sanitizePin(prev.accounts?.[0]?.pin || '1234');
      const updatedAccounts = (updates.accounts || prev.accounts || []).map((a, idx) => {
        if (idx === 0 && updates.pin) return { ...a, pin: sanitizePin(updates.pin) };
        return { ...a, pin: sanitizePin(a.pin || sanitizedPin) };
      });
      const resolvedPin = updates.pin ? sanitizePin(updates.pin) : sanitizePin(updatedAccounts?.[0]?.pin || sanitizedPin);
      const updated = { 
        ...prev, 
        ...updates, 
        pin: resolvedPin, 
        accounts: updatedAccounts,
        profilePicture: updates.profilePicture !== undefined ? updates.profilePicture : prev.profilePicture
      };
      try {
        window.localStorage.setItem('bank_currentUser', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateUserStatus = (userId: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateUserCardVisibility = (userId: string, show: boolean) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, showFullCardDetails: show } : u));
  };

  const updateBalance = (userId: string, accountId: string, amount: number) => {
    // Strictly isolate fiat bank accounts: never update fiat bank balance for crypto wallet actions
    if (!accountId || accountId === 'crypto-wallet' || String(accountId).toLowerCase().startsWith('crypto')) {
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          accounts: u.accounts.map(a => a.id === accountId ? { ...a, balance: a.balance + amount } : a)
        };
      }
      return u;
    }));
  };

  const updateAdminSettings = (newSettings: Partial<AdminSettings>) => {
    setAdminSettings(prev => {
      const mergedFrontend = newSettings.frontendContent
        ? { ...DEFAULT_FRONTEND_CONTENT, ...(prev.frontendContent || {}), ...newSettings.frontendContent }
        : prev.frontendContent;
      const updated: AdminSettings = {
        ...prev,
        ...newSettings,
        ...(mergedFrontend ? { frontendContent: mergedFrontend } : {})
      };
      try {
        window.localStorage.setItem('bank_adminSettings', JSON.stringify(updated));
        window.localStorage.setItem('bank_adminSettings_backup', JSON.stringify(updated));
      } catch (e) {
        console.warn("Notice: could not cache bank_adminSettings to localStorage:", e);
      }
      // Non-blocking server-side disk persistence
      try {
        fetch('/api/admin/save-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: updated })
        }).catch(() => {});
      } catch (e) {}
      return updated;
    });
  };
  
  const createVirtualCard = (card: Omit<VirtualCard, 'id'>) => {
    const newCard: VirtualCard = { ...card, id: generateUUID() };
    setVirtualCards(prev => [newCard, ...prev]);
  };
  
  const updateVirtualCardStatus = (cardId: string, status: VirtualCard['status']) => {
    setVirtualCards(prev => prev.map(c => c.id === cardId ? { ...c, status } : c));
  };

  const deleteVirtualCard = (cardId: string) => {
    setVirtualCards(prev => prev.filter(c => c.id !== cardId));
  };

  const createLoanApplication = (loan: Omit<LoanApplication, 'id' | 'date'>) => {
    const newLoan: LoanApplication = { ...loan, id: generateUUID(), date: new Date().toISOString() };
    setLoanApplications(prev => [newLoan, ...prev]);
  };

  const updateLoanApplicationStatus = (loanId: string, status: LoanApplication['status']) => {
    const loan = loanApplications.find(l => l.id === loanId);
    if (loan && loan.status !== 'approved' && status === 'approved') {
      const user = users.find(u => u.id === loan.userId);
      const fiatAccount = user?.accounts?.[0]; // Target the primary checking account
      if (fiatAccount) {
        // Schedule transaction creation in next tick to avoid side-effects during render cycle
        setTimeout(() => {
          createTransaction({
            userId: loan.userId,
            accountId: fiatAccount.id,
            amount: loan.amount,
            type: 'deposit',
            status: 'completed',
            recipientDetails: {
              name: 'Global Elite Bank Credit',
              bank: 'Global Elite Internal Transfer',
              remarks: `Approved Loan Disbursement (Ref: ${loan.id})`
            }
          });
        }, 100);
      }
    }
    setLoanApplications(prev => prev.map(l => l.id === loanId ? { ...l, status } : l));
  };

  const updateUserApplicationStatus = (appId: string, status: UserApplication['status'], customData?: Omit<User, 'id'>) => {
    // 1. First find the app outside the state setter to avoid calling side-effects inside setState
    const app = userApplications.find(a => a.id === appId);
    
    if (app) {
      setTimeout(() => {
        if (status === 'approved') {
          setMockEmail({
            to: app.email,
            subject: "🎉 Congratulations! Your Global Elite Bank Application has been Approved",
            body: `Dear ${app.name},

Congratulations! We are delighted to inform you that your application for an exclusive private banking account with Global Elite Bank has been officially APPROVED.

Your private client profile is currently being provisioned with multi-currency capabilities, VIP security clearance credentials, and premier wealth management access.

Welcome to Global Elite Bank.

Warm regards,
Admissions & Compliance Directorate
Global Elite Bank, Zurich, Switzerland`
          });
        } else if (status === 'rejected') {
          setMockEmail({
            to: app.email,
            subject: "Notice Regarding Your Application - Global Elite Bank",
            body: `Dear ${app.name},

Thank you for your interest in establishing a private banking relationship with Global Elite Bank.

Following a thorough assessment by our Admissions & Compliance Committee, we regret to inform you that your application could not be approved at this time under our current institutional onboarding guidelines and jurisdictional criteria.

We thank you for considering Global Elite Bank and wish you continued success.

Sincerely,
Admissions & Compliance Directorate
Global Elite Bank, Zurich, Switzerland`
          });
        }
      }, 300);

      if (status === 'approved') {
        if (customData) {
          adminCreateUser(customData);
        } else {
          // Check if user already exists in state
          const existingUser = users.find(u => (u.email || '').trim().toLowerCase() === (app.email || '').trim().toLowerCase());
          if (!existingUser) {
            const accNum = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            adminCreateUser({
              name: app.name,
              email: app.email,
              password: app.password || 'BankPass2026#',
              role: 'user',
              status: 'active',
              country: app.country || 'United States',
              phone: app.mobile || '',
              dob: app.dob || '',
              nationality: app.nationality || '',
              zipCode: app.zipCode || '',
              occupation: app.occupation || '',
              residentialAddress: app.residentialAddress || '',
              pin: '1234',
              accountOpenedAt: new Date().toISOString(),
              accounts: [
                {
                  id: generateUUID(),
                  type: 'Checking',
                  accountNumber: accNum,
                  iban: `CH9300000000${accNum}`,
                  balance: 0,
                  currency: 'USD',
                  status: 'active',
                  pin: '1234',
                  codes: {
                    swift: '0502261',
                    cot: '9174906',
                    tax: 'GEB67716',
                    imf: '251112',
                    aml: 'AML78377'
                  }
                }
              ]
            });
          }
        }
      }
    }
    
    // 2. Then update the applications state cleanly
    setUserApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  };

  const createGrantApplication = (grant: Omit<GrantApplication, 'id' | 'date'>) => {
    const newGrant: GrantApplication = { ...grant, id: generateUUID(), date: new Date().toISOString() };
    setGrantApplications(prev => [newGrant, ...prev]);
  };

  const updateGrantApplicationStatus = (grantId: string, status: GrantApplication['status']) => {
    const grant = grantApplications.find(g => g.id === grantId);
    if (grant && grant.status !== 'disbursed' && status === 'disbursed') {
      const user = users.find(u => u.id === grant.userId);
      const fiatAccount = user?.accounts?.[0];
      if (fiatAccount) {
        setTimeout(() => {
          createTransaction({
            userId: grant.userId,
            accountId: fiatAccount.id,
            amount: grant.amount,
            type: 'deposit',
            status: 'completed',
            recipientDetails: {
              name: 'Global Elite Foundation Grant',
              bank: 'Global Elite Internal Transfer',
              remarks: `Grant Disbursement (Ref: ${grant.id})`
            }
          });
        }, 100);
      }
    }
    setGrantApplications(prev => prev.map(g => g.id === grantId ? { ...g, status } : g));
  };

  const createContactInquiry = (inquiry: Omit<ContactInquiry, 'id' | 'date'>) => {
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: generateUUID(),
      date: new Date().toISOString(),
      status: 'new'
    };
    setContactInquiries(prev => [newInquiry, ...prev]);
  };

  const deleteContactInquiry = (inquiryId: string) => {
    setContactInquiries(prev => prev.filter(inq => inq.id !== inquiryId));
  };

  const updateContactInquiryStatus = (inquiryId: string, status: 'new' | 'replied' | 'ignored', replyDetails?: { subject: string; message: string }) => {
    setContactInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status,
          ...(replyDetails ? {
            replySubject: replyDetails.subject,
            replyMessage: replyDetails.message,
            repliedAt: new Date().toISOString()
          } : {})
        };
      }
      return inq;
    }));
  };

  const sendTransactionalEmail = async (email: { to: string; subject: string; body: string; html?: string; fromName?: string; fromEmail?: string; logoUrl?: string }) => {
    if (!email.to) return;
    
    const effectiveFromName = email.fromName || adminSettings.emailFromName || adminSettings.websiteName || 'Global Elite Bank';
    const effectiveFromEmail = email.fromEmail || adminSettings.emailFrom || 'info@digitalglobalelite.com';
    const effectiveLogoUrl = email.logoUrl || adminSettings.logoUrl || 'https://i.postimg.cc/vBZjpPr4/GEB-logo.png';
    const nowIso = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // 1. Immediately display the in-app email alert modal with verified Bank Profile identity
    setMockEmail({
      to: email.to,
      subject: email.subject,
      body: email.body,
      fromName: effectiveFromName,
      fromEmail: effectiveFromEmail,
      logoUrl: effectiveLogoUrl,
      timestamp: nowIso
    });

    // 2. Dispatch to backend /api/send-email (triggers live SMTP or simulation)
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email.to,
          subject: email.subject,
          text: email.body,
          html: email.html,
          fromEmail: effectiveFromEmail,
          fromName: effectiveFromName,
          logoUrl: effectiveLogoUrl,
          websiteName: adminSettings.websiteName || 'Global Elite Bank',
          smtpConfig: adminSettings.smtpHost ? {
            host: adminSettings.smtpHost,
            port: adminSettings.smtpPort,
            user: adminSettings.smtpUser,
            pass: adminSettings.smtpPass,
            secure: adminSettings.smtpSecure
          } : undefined
        })
      });
    } catch (err) {
      console.warn('[Email Dispatch Notice]:', err);
    }
  };

  const sendMockEmail = (email: { to: string; subject: string; body: string }) => {
    sendTransactionalEmail(email);
  };


  const createInvestment = (inv: Omit<Investment, 'id'> | (Omit<Investment, 'id' | 'startDate' | 'endDate' | 'status'> & Partial<Investment>)) => {
    const startDate = (inv as any).startDate ? new Date((inv as any).startDate) : new Date();
    const endDate = (inv as any).endDate ? new Date((inv as any).endDate) : new Date(startDate.getTime() + (inv.durationDays || 7) * 86400000);
    
    const newInv: Investment = {
      amount: inv.amount,
      currency: inv.currency,
      durationDays: inv.durationDays,
      txHash: inv.txHash,
      userId: inv.userId,
      id: generateUUID(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: (inv as any).status || 'pending',
      profit: (inv as any).profit,
      isPrincipalLocked: (inv as any).isPrincipalLocked ?? true,
      adminApprovedDuration: (inv as any).adminApprovedDuration ?? true,
      reinvestedFromProfit: (inv as any).reinvestedFromProfit ?? false,
      adminNotes: (inv as any).adminNotes
    };
    setInvestments(prev => [newInv, ...prev]);
  };
  
  const updateInvestment = (id: string, updates: Partial<Investment>) => {
    setInvestments(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
  };

  const deleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  const reinvestProfit = (params: {
    userId: string;
    amount: number;
    currency: string;
    durationDays: number;
  }): { success: boolean; message: string; investment?: Investment } => {
    const user = users.find(u => u.id === params.userId);
    if (!user) return { success: false, message: 'User not found.' };

    const currentProfitBalance = user.investorWallets?.balance || 0;
    if (params.amount <= 0) {
      return { success: false, message: 'Please enter a valid profit amount to reinvest.' };
    }
    if (params.amount > currentProfitBalance) {
      return { 
        success: false, 
        message: `Reinvestment amount ($${params.amount.toLocaleString()} USD) exceeds available profit balance ($${currentProfitBalance.toLocaleString()} USD).` 
      };
    }

    // Deduct reinvested amount from user's available profit balance
    const updatedBalance = Math.max(0, currentProfitBalance - params.amount);
    adminUpdateUser(user.id, {
      investorWallets: {
        ...user.investorWallets,
        balance: updatedBalance
      } as any
    });

    // Compute equivalent crypto amount based on institutional reference price
    const rates: Record<string, number> = {
      USDT: 1.0,
      BTC: 65100.0,
      ETH: 3420.5,
      SOL: 145.2,
      BNB: 580.4,
      XRP: 0.62
    };
    const rate = rates[params.currency] || 1.0;
    const cryptoAmount = +(params.amount / rate).toFixed(6);

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + params.durationDays * 86400000);
    const newInv: Investment = {
      id: `inv-reinvest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      amount: cryptoAmount,
      currency: params.currency,
      durationDays: params.durationDays,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      isPrincipalLocked: true,
      adminApprovedDuration: true,
      reinvestedFromProfit: true,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      profit: 0,
      adminNotes: `Reinvested profit of $${params.amount.toLocaleString()} USD. Principal locked for ${params.durationDays} days.`
    };

    setInvestments(prev => [newInv, ...prev]);

    // Record completed transaction
    createTransaction({
      userId: user.id,
      accountId: 'crypto-wallet',
      amount: params.amount,
      type: 'crypto_deposit',
      status: 'completed',
      description: `Profit Reinvestment into ${params.durationDays}-Day ${params.currency} Stake (Principal Locked)`,
      recipientDetails: {
        network: params.currency,
        txHash: newInv.txHash,
        remarks: `Profit reinvested into institutional stake. Principal locked for ${params.durationDays} days approved by Admin.`
      }
    });

    return {
      success: true,
      message: `Successfully reinvested $${params.amount.toLocaleString()} USD into a ${params.durationDays}-day ${params.currency} contract. Principal is locked for ${params.durationDays} days.`,
      investment: newInv
    };
  };

  const adminAdjustInvestmentDuration = (investmentId: string, newDurationDays: number, adminNotes?: string) => {
    setInvestments(prev => prev.map(inv => {
      if (inv.id === investmentId) {
        const start = new Date(inv.startDate).getTime();
        const newEnd = new Date(start + newDurationDays * 86400000).toISOString();
        return {
          ...inv,
          durationDays: newDurationDays,
          endDate: newEnd,
          adminApprovedDuration: true,
          adminNotes: adminNotes || `Duration set to ${newDurationDays} days approved by Administrator.`
        };
      }
      return inv;
    }));
  };
  
  const createTransaction = (txn: Omit<Transaction, 'id' | 'date'>) => {
    const newTxn: Transaction = {
      ...txn,
      id: generateUUID(),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTxn, ...prev]);
    
    // Also update balance if completed (strictly for fiat accounts, never for crypto transactions)
    if (newTxn.status === 'completed') {
      const isCryptoTxn = 
        txn.accountId === 'crypto-wallet' || 
        String(txn.accountId).toLowerCase().startsWith('crypto') ||
        String(txn.type).startsWith('crypto_');

      if (!isCryptoTxn) {
        if (txn.type === 'deposit') {
          updateBalance(txn.userId, txn.accountId, txn.amount);
        } else {
          updateBalance(txn.userId, txn.accountId, -txn.amount);
        }
      }
    }

    // AUTOMATED TRANSACTION EMAIL ALERTS (Transfer, Deposit, Wire, etc.)
    const clientUser = users.find(u => u.id === txn.userId) || currentUser;
    if (clientUser && clientUser.email) {
      const clientAccount = clientUser.accounts?.find(a => a.id === txn.accountId) || clientUser.accounts?.[0];
      const accNum = clientAccount?.accountNumber || '';
      const maskedAcc = accNum ? `••••${accNum.slice(-4)}` : 'Active Account';
      const currencySymbol = clientUser.currency || '$';
      const formattedDate = new Date().toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' });

      // 1. Debit alert for all transfers (wire, local, internal)
      if (txn.type.startsWith('transfer_')) {
        const transferTypeLabel = txn.type === 'transfer_wire' ? 'International SWIFT Wire Transfer' : txn.type === 'transfer_local' ? 'Domestic Clearing Transfer' : 'Internal Bank Transfer';
        const recipientName = txn.recipientDetails?.name || txn.recipientDetails?.accountName || 'Designated Beneficiary';

        setTimeout(() => {
          sendTransactionalEmail({
            to: clientUser.email,
            subject: `💸 Debit Alert: ${currencySymbol}${txn.amount.toLocaleString()} Debited from Account #${accNum}`,
            body: `Dear ${clientUser.name},\n\nThis is an official transaction alert from ${adminSettings.websiteName || 'Global Elite Bank'}.\n\nA debit transaction has been authorized and dispatched from your account.\n\nTransaction Summary:\n• Amount Debited: ${currencySymbol}${txn.amount.toLocaleString()}\n• Account Number: #${accNum}\n• Rail / Method: ${transferTypeLabel}\n• Beneficiary Name: ${recipientName}\n• Reference / TXID: ${newTxn.id.slice(0, 16).toUpperCase()}\n• Date & Time: ${formattedDate} UTC\n• Description: ${txn.description || txn.recipientDetails?.remarks || 'Outward Funds Transfer'}\n\nIf you did not initiate or authorize this transaction, please immediately lock your cards and notify our 24/7 Security Operations Center.\n\nWarm regards,\nGlobal Elite Bank Private Banking\nZurich, Switzerland`
          });
        }, 300);
      }

      // 2. Credit alert for completed deposits
      if (newTxn.status === 'completed' && (txn.type === 'deposit' || txn.type === 'apple_card_deposit')) {
        setTimeout(() => {
          sendTransactionalEmail({
            to: clientUser.email,
            subject: `💰 Credit Alert: ${currencySymbol}${txn.amount.toLocaleString()} Credited to Account #${accNum}`,
            body: `Dear ${clientUser.name},\n\nThis is an official transaction alert from ${adminSettings.websiteName || 'Global Elite Bank'}.\n\nFunds have been successfully verified and credited to your account.\n\nCredit Details:\n• Amount Credited: ${currencySymbol}${txn.amount.toLocaleString()}\n• Target Account: #${accNum}\n• Status: Cleared & Available\n• Reference / TXID: ${newTxn.id.slice(0, 16).toUpperCase()}\n• Date & Time: ${formattedDate} UTC\n• Source / Channel: ${txn.recipientDetails?.bank || txn.recipientDetails?.remarks || 'Direct Deposit / Clearing Settlement'}\n\nThank you for choosing Global Elite Bank for your premier wealth management.\n\nWarm regards,\nGlobal Elite Bank Private Banking\nZurich, Switzerland`
          });
        }, 300);
      }
    }
  };

  const updateTransactionStatus = (txId: string, status: 'pending' | 'completed' | 'failed') => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        const isCryptoTxn = 
          t.accountId === 'crypto-wallet' || 
          String(t.accountId).toLowerCase().startsWith('crypto') ||
          String(t.type).startsWith('crypto_');

        // If status changed from pending to completed, apply balance change
        if (t.status !== 'completed' && status === 'completed' && !isCryptoTxn) {
          if (t.type === 'deposit' || t.type === 'apple_card_deposit') {
            updateBalance(t.userId, t.accountId, t.amount);
          } else {
            updateBalance(t.userId, t.accountId, -t.amount);
          }
        }
        // If status changed from completed to anything else, revert balance change
        if (t.status === 'completed' && status !== 'completed' && !isCryptoTxn) {
           if (t.type === 'deposit' || t.type === 'apple_card_deposit') {
            updateBalance(t.userId, t.accountId, -t.amount);
          } else {
            updateBalance(t.userId, t.accountId, t.amount);
          }
        }

        // Trigger email notification upon transaction approval / clearance
        if (t.status !== 'completed' && status === 'completed') {
          const clientUser = users.find(u => u.id === t.userId);
          if (clientUser && clientUser.email) {
            const acc = clientUser.accounts?.find(a => a.id === t.accountId) || clientUser.accounts?.[0];
            const accNum = acc?.accountNumber || '';
            const currencySymbol = clientUser.currency || '$';
            setTimeout(() => {
              sendTransactionalEmail({
                to: clientUser.email,
                subject: `✅ Transaction Cleared: ${currencySymbol}${t.amount.toLocaleString()} in Account #${accNum}`,
                body: `Dear ${clientUser.name},\n\nWe are pleased to inform you that your transaction (Ref: ${t.id.slice(0, 16).toUpperCase()}) has successfully cleared and been settled in your account.\n\nTransaction Summary:\n• Amount: ${currencySymbol}${t.amount.toLocaleString()}\n• Account: #${accNum}\n• Status: Completed & Cleared\n• Details: ${t.recipientDetails?.remarks || t.description || 'Institutional Clearing'}\n\nWarm regards,\nGlobal Elite Bank Private Banking\nZurich, Switzerland`
              });
            }, 300);
          }
        }

        return { ...t, status };
      }
      return t;
    }));
  };

  // APPLE GIFT CARD TRADING & DEPOSIT MANAGEMENT
  const submitAppleGiftCard = (cardData: Omit<AppleGiftCard, 'id' | 'requestDate' | 'status' | 'receiptNumber'>): { success: boolean; message: string; card?: AppleGiftCard } => {
    const cardId = `apple-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNumber = `GEB-APPLE-REC-${Math.floor(10000 + Math.random() * 90000)}`;
    const requestDate = new Date().toISOString();

    const newCard: AppleGiftCard = {
      ...cardData,
      id: cardId,
      receiptNumber,
      requestDate,
      status: 'pending'
    };

    setAppleGiftCards(prev => {
      const updated = [newCard, ...prev];
      try { localStorage.setItem('bank_appleGiftCards', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    // Create a pending deposit transaction
    createTransaction({
      userId: cardData.userId,
      accountId: cardData.targetAccountId,
      amount: cardData.payoutAmount,
      type: 'deposit',
      status: 'pending',
      recipientDetails: {
        name: 'Apple Gift Card Deposit',
        bank: 'Apple Store & iTunes Market Rail',
        account: cardData.cardCode.replace(/.(?=.{4})/g, '*'),
        remarks: `Apple Gift Card Redemption (Claimed: $${cardData.amount} ${cardData.currency}) - Ref: ${receiptNumber}`
      }
    });

    // Send confirmation email to user
    sendTransactionalEmail({
      to: cardData.userEmail,
      subject: `🍏 Apple Gift Card Deposit Received ($${cardData.amount.toLocaleString()} USD) - Ref: ${receiptNumber}`,
      body: `Dear ${cardData.userName},\n\nWe have successfully received your Apple Gift Card deposit request.\n\nDeposit Submission Details:\n• Card Face Value: $${cardData.amount.toLocaleString()} ${cardData.currency}\n• Payout Credited Amount: $${cardData.payoutAmount.toLocaleString()} USD\n• Card Redemption Code: ${cardData.cardCode.replace(/.(?=.{4})/g, '*')}\n• Reference Number: ${receiptNumber}\n• Target Account: #${cardData.targetAccountNumber || 'Checking Account'}\n• Status: Pending Institutional Verification\n\nOur verification team is validating the card code with the official Apple Store gift card registry. Once confirmed, your balance will be credited promptly.\n\nThank you for banking with Global Elite Bank.\n\nWarm regards,\nInstitutional Clearing Desk\nGlobal Elite Bank, Zurich, Switzerland`
    });

    return {
      success: true,
      message: `Apple Gift Card (${receiptNumber}) submitted successfully! Clearing team is verifying the card code.`,
      card: newCard
    };
  };

  const approveAppleGiftCard = (cardId: string, options?: { approvedAmount?: number; adminNotes?: string }): AppleGiftCard | undefined => {
    let approvedCard: AppleGiftCard | undefined;

    setAppleGiftCards(prev => {
      const updated = prev.map(c => {
        if (c.id === cardId) {
          const finalAmount = options?.approvedAmount !== undefined && options.approvedAmount > 0 ? options.approvedAmount : c.payoutAmount;
          const approvalDate = new Date().toISOString();
          const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

          approvedCard = {
            ...c,
            payoutAmount: finalAmount,
            status: 'approved',
            approvalDate,
            approvedBy: 'Admin Clearing Desk',
            adminNotes: options?.adminNotes || c.adminNotes,
            txHash
          };

          // Credit the client's bank account
          updateBalance(c.userId, c.targetAccountId, finalAmount);

          // Update matching pending transaction to completed
          setTransactions(tList => tList.map(t => {
            if (t.userId === c.userId && (t.recipientDetails?.remarks?.includes(c.receiptNumber || c.id) || (t.amount === c.payoutAmount && t.status === 'pending' && t.recipientDetails?.name?.includes('Apple')))) {
              return {
                ...t,
                amount: finalAmount,
                status: 'completed',
                recipientDetails: {
                  ...t.recipientDetails,
                  txHash,
                  approvalDate,
                  remarks: `Apple Gift Card Cleared ($${finalAmount.toLocaleString()} USD verified by Administrator)`
                }
              };
            }
            return t;
          }));

          // Send confirmation email to user
          sendTransactionalEmail({
            to: c.userEmail,
            subject: `🍏 Deposit Approved: Apple Gift Card Credited ($${finalAmount.toLocaleString()} USD)`,
            body: `Dear ${c.userName},\n\nGreat news! Your Apple Gift Card submission has been verified with Apple and approved.\n\nDeposit Summary:\n• Credited Amount: $${finalAmount.toLocaleString()} USD\n• Card Value: $${c.amount.toLocaleString()} ${c.currency}\n• Reference Number: ${c.receiptNumber}\n• Clearing Authorization: ${txHash}\n• Status: Cleared & Available in Account #${c.targetAccountNumber || 'Checking'}\n\nYour account balance has been updated and is available for immediate transactions, wire transfers, or investments.\n\nWarm regards,\nGlobal Elite Bank Private Banking\nZurich, Switzerland`
          });

          return approvedCard;
        }
        return c;
      });

      try { localStorage.setItem('bank_appleGiftCards', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    return approvedCard;
  };

  const rejectAppleGiftCard = (cardId: string, reason?: string) => {
    setAppleGiftCards(prev => {
      const updated = prev.map(c => {
        if (c.id === cardId) {
          const rejectedReason = reason || 'Gift card code could not be redeemed or was already used.';
          // Update matching pending transaction to failed
          setTransactions(tList => tList.map(t => {
            if (t.userId === c.userId && (t.recipientDetails?.remarks?.includes(c.receiptNumber || c.id) || (t.amount === c.payoutAmount && t.status === 'pending' && t.recipientDetails?.name?.includes('Apple')))) {
              return {
                ...t,
                status: 'failed',
                recipientDetails: {
                  ...t.recipientDetails,
                  remarks: `Apple Gift Card Rejected: ${rejectedReason}`
                }
              };
            }
            return t;
          }));

          sendTransactionalEmail({
            to: c.userEmail,
            subject: `Notice: Apple Gift Card Deposit Update (Ref: ${c.receiptNumber})`,
            body: `Dear ${c.userName},\n\nWe regret to inform you that your Apple Gift Card deposit submission (Ref: ${c.receiptNumber}) could not be verified and has been rejected by our clearing desk.\n\nReason for Rejection:\n${rejectedReason}\n\nIf you have a replacement card or valid purchase receipt from Apple, please submit a new deposit request or contact our 24/7 customer support.\n\nSincerely,\nInstitutional Clearing Desk\nGlobal Elite Bank, Zurich, Switzerland`
          });

          return {
            ...c,
            status: 'rejected' as const,
            rejectionReason: rejectedReason
          };
        }
        return c;
      });

      try { localStorage.setItem('bank_appleGiftCards', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const deleteAppleGiftCard = (cardId: string) => {
    setAppleGiftCards(prev => {
      const updated = prev.filter(c => c.id !== cardId);
      try { localStorage.setItem('bank_appleGiftCards', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };


  const updateUserProfilePicture = (url: string) => {
    if (!currentUser) return;
    setUsers(prev => {
      const next = prev.map(u => u.id === currentUser.id ? { ...u, profilePicture: url } : u);
      try {
        localStorage.setItem('bank_users', JSON.stringify(next));
        localStorage.setItem('bank_users_backup', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setCurrentUser(prev => prev ? { ...prev, profilePicture: url } : null);
    try {
      localStorage.setItem('bank_currentUser', JSON.stringify({ ...currentUser, profilePicture: url }));
    } catch (e) {}
    // Sync directly to Supabase
    (async () => {
      try {
        await supabase.from('users').update({ profile_picture: url }).eq('id', currentUser.id);
      } catch (err) {
        console.warn('Failed to sync profile picture to Supabase:', err);
      }
    })();
  };

  const requestCryptoWithdrawal = (req: Omit<CryptoWithdrawalRequest, 'id' | 'requestDate' | 'status'>): { success: boolean; message: string; request?: CryptoWithdrawalRequest } => {
    const currentLimit = adminSettings?.maxCryptoWithdrawalLimit || 25000;
    if (req.amount < 100) {
      return {
        success: false,
        message: 'Minimum crypto withdrawal amount is $100.00 USD. Requests below $100 cannot be processed.'
      };
    }
    if (req.amount > currentLimit) {
      return {
        success: false,
        message: `Withdrawal request of $${req.amount.toLocaleString()} exceeds the maximum allowed limit of $${currentLimit.toLocaleString()} configured by the administrator.`
      };
    }

    const newReq: CryptoWithdrawalRequest = {
      ...req,
      id: `cw-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      requestDate: new Date().toISOString(),
      status: 'pending',
      receiptNumber: `GEB-CRYPTO-REC-${Math.floor(10000 + Math.random() * 90000)}`
    };

    setCryptoWithdrawals(prev => [newReq, ...prev]);

    // Crypto withdrawals strictly belong to the isolated crypto-wallet, never to bank checking accounts
    const accountId = 'crypto-wallet';

    createTransaction({
      userId: req.userId,
      accountId,
      amount: req.amount,
      type: 'crypto_withdrawal' as any,
      status: 'pending',
      recipientDetails: {
        name: `${req.currency} Digital Asset Withdrawal (${req.network})`,
        account: req.walletAddress,
        bank: 'Blockchain Digital Asset Vault',
        country: 'Global Distributed Ledger',
        remarks: `Crypto Withdrawal Request (${req.cryptoAmount} ${req.currency} via ${req.network}) - Ref: ${newReq.id}`
      }
    });

    return {
      success: true,
      message: 'Withdrawal request submitted successfully. Pending Admin approval.',
      request: newReq
    };
  };

  const approveCryptoWithdrawal = (withdrawalId: string, options?: { 
    approvedBy?: string; 
    customTxHash?: string; 
    adminNotes?: string;
    approvedAmount?: number;
    approvedCryptoAmount?: number;
  }): CryptoWithdrawalRequest | undefined => {
    let approvedReq: CryptoWithdrawalRequest | undefined;
    setCryptoWithdrawals(prev => prev.map(item => {
      if (item.id === withdrawalId) {
        const finalAmount = (options?.approvedAmount !== undefined && options.approvedAmount > 0)
          ? options.approvedAmount
          : item.amount;
        const originalRequested = item.amount;
        const finalCryptoAmount = (options?.approvedCryptoAmount !== undefined && options.approvedCryptoAmount > 0)
          ? options.approvedCryptoAmount
          : (item.cryptoAmount && item.amount > 0 ? +(item.cryptoAmount * (finalAmount / item.amount)).toFixed(6) : item.cryptoAmount);

        const generatedTxHash = options?.customTxHash?.trim() || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const approvalDate = new Date().toISOString();
        const receiptNumber = item.receiptNumber || `GEB-CRYPTO-REC-${Math.floor(10000 + Math.random() * 90000)}`;

        const user = users.find(u => u.id === item.userId);
        if (user && user.investorWallets && (item.sourceWallet === 'investor' || !item.sourceWallet)) {
          // Debit the actual admin-approved finalAmount from user's investor wallet balance
          const newBal = Math.max(0, (user.investorWallets.balance || 0) - finalAmount);
          adminUpdateUser(item.userId, {
            investorWallets: {
              ...user.investorWallets,
              balance: newBal
            } as any
          });
        }

        setTransactions(tList => tList.map(t => {
          if (t.userId === item.userId && (t.recipientDetails?.remarks?.includes(item.id) || (t.amount === item.amount && t.status === 'pending' && t.type === 'crypto_withdrawal'))) {
            return {
              ...t,
              amount: finalAmount,
              status: 'completed',
              recipientDetails: {
                ...t.recipientDetails,
                txHash: generatedTxHash,
                receiptNumber,
                approvalDate,
                remarks: `Crypto Withdrawal Cleared ($${finalAmount.toLocaleString()} USD approved by Admin${finalAmount !== originalRequested ? ` - Orig: $${originalRequested.toLocaleString()}` : ''})`
              }
            };
          }
          return t;
        }));

        approvedReq = {
          ...item,
          amount: finalAmount,
          cryptoAmount: finalCryptoAmount,
          originalRequestedAmount: finalAmount !== originalRequested ? originalRequested : item.originalRequestedAmount,
          originalRequestedCryptoAmount: finalAmount !== originalRequested ? item.cryptoAmount : item.originalRequestedCryptoAmount,
          status: 'approved',
          approvalDate,
          txHash: generatedTxHash,
          receiptNumber,
          adminNotes: options?.adminNotes || item.adminNotes || (finalAmount !== originalRequested 
            ? `Admin approved adjusted payout of $${finalAmount.toLocaleString()} USD (originally requested $${originalRequested.toLocaleString()} USD). Payout credited to receiving wallet.`
            : 'Approved by compliance officer. On-chain dispatch verified.')
        };
        return approvedReq;
      }
      return item;
    }));
    return approvedReq;
  };

  const rejectCryptoWithdrawal = (withdrawalId: string, reason?: string) => {
    setCryptoWithdrawals(prev => prev.map(item => {
      if (item.id === withdrawalId) {
        setTransactions(tList => tList.map(t => {
          if (t.userId === item.userId && t.recipientDetails?.remarks?.includes(item.id)) {
            return { ...t, status: 'failed' };
          }
          return t;
        }));

        return {
          ...item,
          status: 'rejected',
          adminNotes: reason || 'Rejected by administrator policy.'
        };
      }
      return item;
    }));
  };

  const requestCryptoTradeOrder = (order: Omit<CryptoTradeOrder, 'id' | 'status' | 'requestDate' | 'receiptNumber'>): { success: boolean; message: string; order?: CryptoTradeOrder } => {
    const user = users.find(u => u.id === order.userId);
    const account = user?.accounts?.[0];

    // Balance check for Buy order
    if (order.orderType === 'buy' && account && account.balance < order.fiatAmount) {
      return {
        success: false,
        message: `Insufficient USD account balance. Available: $${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, Required: $${order.fiatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      };
    }

    const newOrder: CryptoTradeOrder = {
      ...order,
      id: `ct-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      requestDate: new Date().toISOString(),
      status: 'pending',
      receiptNumber: `GEB-TRADE-${Math.floor(10000 + Math.random() * 90000)}`
    };

    setCryptoOrders(prev => [newOrder, ...prev]);

    // Create a linked pending transaction
    createTransaction({
      userId: order.userId,
      accountId: account?.id || 'crypto-trading-desk',
      amount: order.fiatAmount,
      type: (order.orderType === 'buy' ? 'crypto_buy' : 'crypto_sell') as any,
      status: 'pending',
      recipientDetails: {
        name: `Quick Trade ${order.orderType.toUpperCase()} ${order.cryptoAmount} ${order.cryptoCurrency}`,
        account: `${order.cryptoAmount} ${order.cryptoCurrency} @ $${order.exchangeRate.toLocaleString()}`,
        bank: 'Swiss Digital Assets & Forex Vault',
        country: 'Global Distributed Ledger',
        remarks: `Quick Trade ${order.orderType.toUpperCase()} Order (${order.cryptoAmount} ${order.cryptoCurrency} for $${order.fiatAmount.toLocaleString()} USD) - Ref: ${newOrder.id}`,
        orderRef: newOrder.id,
        orderType: order.orderType,
        cryptoCurrency: order.cryptoCurrency,
        cryptoAmount: order.cryptoAmount,
        exchangeRate: order.exchangeRate,
        receiptNumber: newOrder.receiptNumber
      }
    });

    return {
      success: true,
      message: `Your ${order.orderType.toUpperCase()} order for ${order.cryptoAmount} ${order.cryptoCurrency} ($${order.fiatAmount.toLocaleString()} USD) has been submitted for Admin approval.`,
      order: newOrder
    };
  };

  const approveCryptoTradeOrder = (orderId: string, options?: { approvedBy?: string; customTxHash?: string }): CryptoTradeOrder | undefined => {
    let approvedOrder: CryptoTradeOrder | undefined;

    setCryptoOrders(prev => prev.map(item => {
      if (item.id === orderId) {
        const generatedTxHash = options?.customTxHash?.trim() || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const approvalDate = new Date().toISOString();
        const receiptNumber = item.receiptNumber || `GEB-TRADE-${Math.floor(10000 + Math.random() * 90000)}`;

        approvedOrder = {
          ...item,
          status: 'approved',
          approvalDate,
          approvedBy: options?.approvedBy || 'Compliance & Digital Asset Admin',
          txHash: generatedTxHash,
          receiptNumber
        };

        // Balance settlements upon Admin approval
        const user = users.find(u => u.id === item.userId);
        if (user) {
          const account = user.accounts?.[0];
          if (item.orderType === 'buy') {
            // Debit USD from account
            if (account) {
              updateBalance(item.userId, account.id, -item.fiatAmount);
            }
            // Credit user's investorWallets balance in USD equivalent
            const currentInvestorBal = user.investorWallets?.balance || 0;
            adminUpdateUser(item.userId, {
              investorWallets: {
                ...(user.investorWallets || { btc: '', eth: '', usdt: '', sol: '', balance: 0 }),
                balance: currentInvestorBal + item.fiatAmount
              }
            });
          } else {
            // Sell: Credit USD to user account
            if (account) {
              updateBalance(item.userId, account.id, item.fiatAmount);
            }
            // Debit from investorWallets if applicable
            const currentInvestorBal = user.investorWallets?.balance || 0;
            adminUpdateUser(item.userId, {
              investorWallets: {
                ...(user.investorWallets || { btc: '', eth: '', usdt: '', sol: '', balance: 0 }),
                balance: Math.max(0, currentInvestorBal - item.fiatAmount)
              }
            });
          }
        }

        // Update corresponding transaction to completed
        setTransactions(tList => tList.map(t => {
          if (t.userId === item.userId && (t.recipientDetails?.remarks?.includes(item.id) || t.recipientDetails?.orderRef === item.id || (t.amount === item.fiatAmount && t.status === 'pending' && (t.type === 'crypto_buy' || t.type === 'crypto_sell' || t.type === 'crypto_trade')))) {
            return {
              ...t,
              status: 'completed',
              recipientDetails: {
                ...t.recipientDetails,
                txHash: generatedTxHash,
                receiptNumber,
                approvalDate
              }
            };
          }
          return t;
        }));

        return approvedOrder;
      }
      return item;
    }));

    return approvedOrder;
  };

  const rejectCryptoTradeOrder = (orderId: string, reason?: string) => {
    setCryptoOrders(prev => prev.map(item => {
      if (item.id === orderId) {
        return {
          ...item,
          status: 'rejected',
          notes: reason || 'Order rejected by Risk & Compliance Administrator'
        };
      }
      return item;
    }));

    // Update corresponding transaction to failed
    setTransactions(tList => tList.map(t => {
      if (t.recipientDetails?.remarks?.includes(orderId) || t.recipientDetails?.orderRef === orderId) {
        return { ...t, status: 'failed' };
      }
      return t;
    }));
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return false;
    if (currentUser.password !== oldPass && currentUser.password !== '0000') {
       return false; // If old pass doesn't match and isn't the default one (some allow overriding default freely, but let's be strict or just check match)
    }
    
    // We update both users array and currentUser
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, password: newPass } : u));
    setCurrentUser({ ...currentUser, password: newPass });
    return true;
  };


  

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

  // Alert system for low balance
  useEffect(() => {
    if (currentUser && currentUser.role === 'user') {
      const totalBalance = currentUser.accounts.reduce((sum, acc) => sum + acc.balance, 0);
      if (totalBalance < adminSettings.alertThreshold) {
        // We can just log or show alert. Let's create a toast function later.
        console.warn(`ALERT: Balance below threshold ${adminSettings.alertThreshold}`);
      }
    }
  }, [currentUser, users, adminSettings.alertThreshold]);

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mockEmail) {
        setMockEmail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mockEmail]);
  const restoreDemoClients = () => {
    setUsers(prev => {
      const adminUsers = prev.filter(u => u.role === 'admin');
      const merged = [...adminUsers, ...INITIAL_DEMO_CLIENTS.filter(d => !adminUsers.some(a => a.email.toLowerCase() === d.email.toLowerCase()))];
      window.localStorage.setItem('bank_users', JSON.stringify(merged));
      window.localStorage.setItem('bank_users_backup', JSON.stringify(merged));
      return merged;
    });
    setVirtualCards(INITIAL_VIRTUAL_CARDS);
    try {
      window.localStorage.setItem('bank_virtualCards', JSON.stringify(INITIAL_VIRTUAL_CARDS));
    } catch (e) {}
  };

  if (isInitializing) {
    return <div className="flex items-center justify-center min-h-screen bg-background text-foreground"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <BankContext.Provider value={{
      users, currentUser, setCurrentUser, transactions, adminSettings, virtualCards, loanApplications, userApplications, grantApplications, contactInquiries, createVirtualCard, updateVirtualCardStatus, deleteVirtualCard, createLoanApplication, updateLoanApplicationStatus, updateUserApplicationStatus, createGrantApplication, updateGrantApplicationStatus,
      login, loginAsAdmin, logout, register, adminCreateUser, updateUserProfilePicture, adminUpdateUser, updateUserStatus, deleteUser, updateUserCardVisibility,
      updateBalance, createTransaction, updateTransactionStatus, updateAdminSettings, changePassword, createContactInquiry, deleteContactInquiry, updateContactInquiryStatus, sendMockEmail, investments, createInvestment, updateInvestment, deleteInvestment, reinvestProfit, adminAdjustInvestmentDuration,
      cryptoWithdrawals, requestCryptoWithdrawal, approveCryptoWithdrawal, rejectCryptoWithdrawal,
      cryptoOrders, requestCryptoTradeOrder, approveCryptoTradeOrder, rejectCryptoTradeOrder,
      appleGiftCards, submitAppleGiftCard, approveAppleGiftCard, rejectAppleGiftCard, deleteAppleGiftCard,
      sendTransactionalEmail, restoreDemoClients
    }}>
      {children}
      {mockEmail && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setMockEmail(null); }}
        >
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header with prominent Move Back arrow */}
            <div className="p-4 sm:px-6 border-b border-border bg-gradient-to-r from-primary/10 via-background to-emerald-500/10 flex items-center justify-between gap-3 sticky top-0 z-10">
              <button 
                id="email-modal-back-btn"
                onClick={() => setMockEmail(null)} 
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-foreground hover:text-foreground bg-background/90 hover:bg-background border border-border px-3 py-1.5 rounded-xl transition-all shadow-sm group active:scale-95"
                title="Move back to previous page"
              >
                <ArrowLeft size={16} className="text-foreground group-hover:-translate-x-1 transition-transform" />
                <span>Move Back</span>
              </button>

              <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm">
                <Mail size={16} className="shrink-0 text-emerald-500" />
                <span className="truncate">Official Bank Dispatch</span>
              </div>

              <button 
                onClick={() => setMockEmail(null)} 
                className="text-foreground/50 hover:text-foreground transition-colors p-1.5 bg-background/80 hover:bg-background rounded-lg border border-border/50 flex items-center"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Email Profile & Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              
              {/* Official Bank Profile Identity Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-3 sm:gap-4">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-primary/40 bg-black/40 flex items-center justify-center shadow-inner">
                    <img 
                      src={mockEmail.logoUrl || adminSettings.logoUrl || 'https://i.postimg.cc/vBZjpPr4/GEB-logo.png'} 
                      alt="Bank Profile Logo" 
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://i.postimg.cc/vBZjpPr4/GEB-logo.png';
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm border-2 border-card" title="Verified Bank Sender">
                    <CheckCircle2 size={12} className="stroke-[3]" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-sm sm:text-base text-foreground tracking-tight truncate">
                      {mockEmail.fromName || adminSettings.emailFromName || adminSettings.websiteName || 'Global Elite Bank'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck size={11} /> Verified Bank
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate font-mono mt-0.5">
                    {mockEmail.fromEmail || adminSettings.emailFrom || 'info@digitalglobalelite.com'}
                  </div>
                </div>

                {mockEmail.timestamp && (
                  <div className="hidden sm:block text-[11px] font-mono text-muted-foreground shrink-0 text-right">
                    {mockEmail.timestamp}
                  </div>
                )}
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 gap-2.5 bg-background/50 p-3 rounded-xl border border-border/60">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground w-12 shrink-0">To:</span>
                  <span className="font-mono text-foreground font-medium truncate select-all">{mockEmail.to}</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm border-t border-border/40 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground w-12 shrink-0 mt-0.5">Subject:</span>
                  <span className="font-bold text-foreground leading-snug">{mockEmail.subject}</span>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <div className="text-[11px] text-foreground/50 uppercase tracking-widest font-bold mb-1.5">Official Message</div>
                <div className="text-xs sm:text-sm text-foreground/90 whitespace-pre-line leading-relaxed bg-background p-4 sm:p-5 rounded-2xl border border-border/70 font-sans shadow-sm selection:bg-primary/20">
                  {mockEmail.body}
                </div>
              </div>
              
              {/* Footer action buttons including Move Back */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-border/50">
                <button 
                  id="email-modal-bottom-back-btn"
                  onClick={() => setMockEmail(null)} 
                  className="w-full sm:flex-1 py-2.5 sm:py-3 bg-card border border-border text-foreground font-bold rounded-xl hover:bg-foreground/5 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm"
                >
                  <ArrowLeft size={16} />
                  <span>Move Back</span>
                </button>
                <button 
                  onClick={() => setMockEmail(null)} 
                  className="w-full sm:flex-1 bg-primary text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-xs sm:text-sm"
                >
                  Dismiss / Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BankContext.Provider>
  );
}


export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) throw new Error('useBank must be used within a BankProvider');
  
  return context;
};
