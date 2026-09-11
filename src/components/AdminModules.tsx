import React, { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { useBank, ContactInquiry, UserApplication, CryptoWithdrawalRequest, CryptoTradeOrder, DEFAULT_FRONTEND_CONTENT, FrontendContent, DEFAULT_BROKER_WALLETS } from '../store';
import { CryptoReceiptModal } from './CryptoReceiptModal';
import { 
  FileText, CheckCircle, XCircle, Search, Clock, ShieldAlert, CreditCard, 
  Edit, MoreHorizontal, QrCode, Mail, Trash2, Eye, EyeOff, ChevronDown, 
  UserPlus, MessageSquare, AlertTriangle, Send, Check, X, ArrowRight, ArrowLeft,
  CornerDownRight, RotateCcw, Filter, AlertCircle, Users, Save, Wallet,
  ArrowUpRight, ArrowDownLeft, TrendingUp, PlusCircle, MinusCircle, DollarSign, Coins, Plus, RefreshCw,
  CheckCircle2, ArrowDownToLine, ShieldCheck, Lock, Edit3, Sparkles, Wifi
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { validateNewPassword } from '../utils/passwordStrength';


export function AdminManageUsers({ onManageUser }: { onManageUser?: (id: string) => void }) {
  const { users, updateUserStatus } = useBank();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState('10');
  const [sortOrder, setSortOrder] = useState('descending');
  
  // Filter clients: STRICT REQUIREMENT:
  // A new applicant whether rejected or approved CANNOT be allowed to appear here
  // until bank account has been created for him. Avoid duplicates of accounts in this list.
  const validClientsWithAccounts = users.filter(u => {
    if (u.role === 'admin') return false;
    // Must have at least one valid bank account created
    if (!u.accounts || !Array.isArray(u.accounts) || u.accounts.length === 0) return false;
    return u.accounts.some(acc => Boolean(acc?.accountNumber && acc.accountNumber.trim().length > 0));
  });

  // Deduplicate clients and accounts to avoid any duplicate accounts in this list
  const seenEmails = new Set<string>();
  const seenAccountNumbers = new Set<string>();
  const clients = validClientsWithAccounts.filter(c => {
    const emailKey = (c.email || '').trim().toLowerCase();
    if (emailKey && seenEmails.has(emailKey)) return false;
    if (emailKey) seenEmails.add(emailKey);

    const primaryAcc = c.accounts?.[0]?.accountNumber?.trim();
    if (primaryAcc && seenAccountNumbers.has(primaryAcc)) return false;
    if (primaryAcc) seenAccountNumbers.add(primaryAcc);

    return true;
  });
  
  // Apply Search
  const filteredClients = clients.filter(c => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const accNum = c.accounts?.[0]?.accountNumber?.toLowerCase() || '';
    return c.name.toLowerCase().includes(term) || 
           c.email.toLowerCase().includes(term) ||
           c.id.toLowerCase().includes(term) ||
           accNum.includes(term);
  });
  
  // Apply Sort
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortOrder === 'descending') {
      return a.id > b.id ? -1 : 1;
    } else {
      return a.id > b.id ? 1 : -1;
    }
  });
  
  // Apply Pagination (mock)
  const displayClients = sortedClients.slice(0, parseInt(perPage) || 10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Global Elite users' information</h2>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={16} />
            <input 
              type="text" 
              placeholder="name, username or email" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 p-2 text-sm focus:border-primary outline-none" 
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <select 
                value={perPage} 
                onChange={e => setPerPage(e.target.value)}
                className="bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground/50">id</span>
              <select 
                value={sortOrder} 
                onChange={e => setSortOrder(e.target.value)}
                className="bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none"
              >
                <option value="descending">Descending</option>
                <option value="ascending">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Client Name</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Username</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Email</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Phone</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Date registered</th>
                <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-foreground/50">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users size={28} className="text-foreground/30 mb-1" />
                      <p className="font-semibold text-foreground/70">No client accounts found</p>
                      <p className="text-xs text-foreground/40 max-w-sm">
                        New applicants (whether rejected or approved) will not appear here until a bank account has been created for them.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayClients.map(client => (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold">{client.name}</td>
                    <td className="p-4 text-sm">{client.id}</td>
                    <td className="p-4 text-sm">{client.email}</td>
                    <td className="p-4 text-sm">{client.contactPhone || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${
                        client.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 
                        client.status === 'blocked' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-foreground/70">1 week ago</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button onClick={() => onManageUser && onManageUser(client.id)} className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">Manage</button>
                      <div className="relative group inline-block text-left">
                        <button className="text-foreground/70 hover:text-foreground transition-colors inline-flex align-middle p-2 rounded-md hover:bg-white/5 border border-border">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] p-1 flex flex-col">
                          <button onClick={() => { updateUserStatus(client.id, 'active'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-500 rounded">Active</button>
                          <button onClick={() => { updateUserStatus(client.id, 'dormant'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-amber-500/10 hover:text-amber-500 rounded">Dormant</button>
                          <button onClick={() => { updateUserStatus(client.id, 'suspended'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-orange-500/10 hover:text-orange-500 rounded">Suspend</button>
                          <button onClick={() => { updateUserStatus(client.id, 'frozen'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-blue-500/10 hover:text-blue-500 rounded">Freeze</button>
                          <button onClick={() => { updateUserStatus(client.id, 'blocked'); }} className="text-left px-3 py-2 text-xs font-bold hover:bg-rose-500/10 hover:text-rose-500 rounded">Blocked</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminApplications({ onOpenAccountCreation }: { onOpenAccountCreation?: (applicant: any) => void }) {
  const { userApplications, updateUserApplicationStatus, users } = useBank();
  const [reviewApp, setReviewApp] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ title: string; message: string; type: 'success' | 'danger' | 'info' } | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerToast = (title: string, message: string, type: 'success' | 'danger' | 'info') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const generateRandomCode = (prefix: string, length: number) => {
    return prefix + Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  };

  const handleReview = (app: any) => {
    setReviewApp(app);
    setEditForm({
      name: app.name,
      email: app.email,
      password: app.password || 'BankPass2026#',
      accountNumber: generateRandomCode('', 16),
      pin: generateRandomCode('', 4),
      swift: generateRandomCode('', 7),
      cot: generateRandomCode('COT', 4),
      tax: generateRandomCode('GEB', 5),
      imf: generateRandomCode('IMF', 3),
      aml: generateRandomCode('AML', 6)
    });
  };

  const handleApproveApplicant = (app: any) => {
    setActiveDropdownId(null);
    updateUserApplicationStatus(app.id, 'approved');
    triggerToast(
      'Application Approved',
      `Congratulatory email sent to ${app.email}. Opening account creation...`,
      'success'
    );
    setTimeout(() => {
      if (onOpenAccountCreation) {
        onOpenAccountCreation(app);
      } else {
        handleReview(app);
      }
    }, 400);
  };

  const handleRejectApplicant = (app: any) => {
    setActiveDropdownId(null);
    updateUserApplicationStatus(app.id, 'rejected');
    triggerToast(
      'Application Rejected',
      `Automatic rejection email dispatched to ${app.email}.`,
      'danger'
    );
  };

  const handleApproveModal = () => {
    if (!reviewApp) return;
    const trimmedAccNumber = (editForm.accountNumber || '').trim();
    if (!trimmedAccNumber) {
      triggerToast('Validation Error', 'A valid account number is required to provision this bank account.', 'danger');
      return;
    }

    const pwdCheck = validateNewPassword(editForm.password || '');
    if (!pwdCheck.valid) {
      triggerToast('Weak Password', pwdCheck.error || 'Password must be at least 6 characters with a mix of characters.', 'danger');
      return;
    }

    // Check for duplicate account number
    const isAccTaken = users.some(u => 
      u.role !== 'admin' && (u.accounts || []).some(a => a.accountNumber?.trim() === trimmedAccNumber)
    );
    if (isAccTaken) {
      triggerToast('Duplicate Account', `Account number ${trimmedAccNumber} is already in use by another client.`, 'danger');
      return;
    }

    const assignedPin = String(editForm.pin || generateRandomCode('', 4)).padStart(4, '0').slice(-4);
    const customUser = {
      name: editForm.name,
      email: editForm.email,
      password: editForm.password,
      role: 'user' as const,
      status: 'active' as const,
      showFullCardDetails: false,
      pin: assignedPin,
      accounts: [
        {
          id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type: 'Checking' as const,
          accountNumber: trimmedAccNumber,
          balance: 0,
          pin: assignedPin,
          codes: {
            swift: editForm.swift,
            cot: editForm.cot,
            tax: editForm.tax,
            imf: editForm.imf,
            aml: editForm.aml
          }
        }
      ]
    };
    updateUserApplicationStatus(reviewApp.id, 'approved', customUser);
    setReviewApp(null);
    triggerToast('Account Provisioned', `Account created successfully for ${editForm.name}`, 'success');
  };

  const filteredApps = userApplications.filter(app => {
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = userApplications.filter(a => a.status === 'pending').length;
  const approvedCount = userApplications.filter(a => a.status === 'approved').length;
  const rejectedCount = userApplications.filter(a => a.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Toast feedback */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
          toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          toast.type === 'danger' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
          'bg-blue-500/10 text-blue-400 border-blue-500/20'
        }`}>
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-400 shrink-0" />}
            {toast.type === 'danger' && <AlertCircle size={18} className="text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Mail size={18} className="text-blue-400 shrink-0" />}
            <div>
              <span className="font-bold">{toast.title}: </span>
              <span>{toast.message}</span>
            </div>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:opacity-75 transition-opacity">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">New User Applications</h2>
          <p className="text-sm text-foreground/60 mt-1">Review onboarding applicants, issue approval or rejection notices, and provision accounts.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-card border border-border text-foreground/70 hover:text-foreground'
            }`}
          >
            All ({userApplications.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatus === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-card border border-border text-amber-500/80 hover:text-amber-500'
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">{pendingCount}</span>
            )}
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatus === 'approved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-card border border-border text-emerald-500/80 hover:text-emerald-500'
            }`}
          >
            <span>Approved</span>
            {approvedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">{approvedCount}</span>
            )}
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatus === 'rejected'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-card border border-border text-rose-500/80 hover:text-rose-500'
            }`}
          >
            <span>Rejected</span>
            {rejectedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">{rejectedCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Search box */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
        <input
          type="text"
          placeholder="Search applicants by name or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Table of Applications */}
      <div className="bg-card border border-border rounded-xl overflow-visible shadow-sm">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center">
            <Clock size={36} className="mx-auto text-foreground/30 mb-3" />
            <p className="text-foreground/70 font-semibold">No applications found</p>
            <p className="text-xs text-foreground/40 mt-1">Try switching the filter or clearing the search box.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background/60 border-b border-border">
                <tr>
                  <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Applicant Name</th>
                  <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Email Address</th>
                  <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Submission Date</th>
                  <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs uppercase">
                          {app.name ? app.name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <div>{app.name}</div>
                          {app.country && <div className="text-[11px] font-normal text-foreground/50">{app.country}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-foreground/80 font-mono text-sm">{app.email}</td>
                    <td className="p-4 text-foreground/60 text-sm whitespace-nowrap">{new Date(app.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase rounded-md border ${
                        app.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : app.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {app.status === 'pending' && <Clock size={11} />}
                        {app.status === 'approved' && <Check size={11} />}
                        {app.status === 'rejected' && <X size={11} />}
                        <span>{app.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="relative inline-block text-left" ref={activeDropdownId === app.id ? dropdownRef : undefined}>
                        <button
                          id={`manage-app-btn-${app.id}`}
                          onClick={() => setActiveDropdownId(activeDropdownId === app.id ? null : app.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/90 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/30 shadow-sm"
                        >
                          <span>Manage</span>
                          <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdownId === app.id ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdownId === app.id && (
                          <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-xl shadow-2xl z-[150] p-1.5 flex flex-col space-y-1 animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/40 border-b border-border/50 mb-1">
                              Applicant Actions
                            </div>
                            
                            {/* Approve Action */}
                            <button
                              id={`approve-app-btn-${app.id}`}
                              onClick={() => handleApproveApplicant(app)}
                              className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-emerald-500/15 hover:text-emerald-400 rounded-lg text-foreground transition-colors flex items-center gap-2 group"
                            >
                              <CheckCircle size={15} className="text-emerald-500 group-hover:scale-110 transition-transform shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-emerald-400 font-bold">Approve</span>
                                <span className="text-[10px] text-foreground/50 font-normal">Send congrats & open account page</span>
                              </div>
                            </button>

                            {/* Reject Action */}
                            <button
                              id={`reject-app-btn-${app.id}`}
                              onClick={() => handleRejectApplicant(app)}
                              className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-rose-500/15 hover:text-rose-400 rounded-lg text-foreground transition-colors flex items-center gap-2 group"
                            >
                              <XCircle size={15} className="text-rose-500 group-hover:scale-110 transition-transform shrink-0" />
                              <div className="flex flex-col">
                                <span className="text-rose-400 font-bold">Reject</span>
                                <span className="text-[10px] text-foreground/50 font-normal">Send automatic rejection notice</span>
                              </div>
                            </button>

                            {/* Optional: Configure / Review directly */}
                            <button
                              onClick={() => { setActiveDropdownId(null); handleReview(app); }}
                              className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-white/5 rounded-lg text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2 border-t border-border/40 mt-1 pt-1.5"
                            >
                              <Edit size={13} className="text-foreground/40 shrink-0" />
                              <span>Review & Provision Modal</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Built-in Review & Provision Account Modal */}
      {reviewApp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setReviewApp(null); }}
        >
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b border-border bg-background/50 flex justify-between items-center sticky top-0 z-10 gap-3">
              <div className="flex items-center gap-3">
                <button
                  id="review-app-back-btn"
                  onClick={() => setReviewApp(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-background hover:bg-background/80 text-foreground border border-border hover:border-primary/50 transition-colors shadow-sm"
                  title="Move back"
                >
                  <ArrowLeft size={15} />
                  <span>Move Back</span>
                </button>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">Review & Provision Account</h2>
                  <p className="text-xs text-foreground/50 mt-0.5">Configure institutional credentials and clearance codes for this applicant.</p>
                </div>
              </div>
              <button onClick={() => setReviewApp(null)} className="text-foreground/50 hover:text-foreground p-1 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Name</label>
                  <input type="text" value={editForm.name || ""} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Email</label>
                  <input type="email" value={editForm.email || ""} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Password</label>
                  <input type="text" value={editForm.password || ""} onChange={e => setEditForm({...editForm, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none" />
                  <div className="mt-1.5">
                    <PasswordStrengthMeter password={editForm.password || ""} compact />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Account Number</label>
                  <input type="text" value={editForm.accountNumber || ""} onChange={e => setEditForm({...editForm, accountNumber: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none font-mono" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest block">4-Digit Transaction PIN</label>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, pin: generateRandomCode('', 4) })}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      Generate New PIN
                    </button>
                  </div>
                  <input type="text" maxLength={4} value={editForm.pin || ""} onChange={e => setEditForm({...editForm, pin: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none font-mono" placeholder="4-digit PIN" />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-4">Clearance Codes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">SWIFT-SEC</label>
                    <input type="text" value={editForm.swift || ""} onChange={e => setEditForm({...editForm, swift: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">COT</label>
                    <input type="text" value={editForm.cot || ""} onChange={e => setEditForm({...editForm, cot: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">TAX</label>
                    <input type="text" value={editForm.tax || ""} onChange={e => setEditForm({...editForm, tax: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">IMF</label>
                    <input type="text" value={editForm.imf || ""} onChange={e => setEditForm({...editForm, imf: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">AML</label>
                    <input type="text" value={editForm.aml || ""} onChange={e => setEditForm({...editForm, aml: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none font-mono" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-border bg-background/50 flex justify-between items-center gap-3">
              <button 
                onClick={() => setReviewApp(null)} 
                className="px-4 py-2 bg-foreground/10 text-foreground font-bold rounded-xl hover:bg-foreground/20 flex items-center gap-1.5 text-xs transition-colors"
              >
                <ArrowLeft size={14} /> Move Back
              </button>
              <button onClick={handleApproveModal} className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 flex items-center gap-2 text-xs transition-colors shadow-md">
                <CheckCircle size={16} /> Save & Provision Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminLoanApplications() {
  const { loanApplications, updateLoanApplicationStatus, users } = useBank();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Loan Applications</h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loanApplications.length === 0 ? (
          <div className="p-8 text-center text-foreground/50">No loan applications</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">User</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Amount</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Purpose</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Status</th>
                <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loanApplications.map(loan => {
                const user = users.find(u => u.id === loan.userId);
                return (
                  <tr key={loan.id}>
                    <td className="p-4 font-bold">{user?.name || loan.userId}</td>
                    <td className="p-4 font-mono font-bold">${loan.amount.toLocaleString()}</td>
                    <td className="p-4">{loan.purpose}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${loan.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : loan.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      {loan.status === 'pending' && (
                        <>
                          <button onClick={() => updateLoanApplicationStatus(loan.id, 'approved')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20"><Edit size={16} /></button>
                          <button onClick={() => updateLoanApplicationStatus(loan.id, 'rejected')} className="p-2 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-500/20"><XCircle size={16} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function AdminGrantApplications({ filter = 'all' }: { filter?: 'all' | 'processing' | 'approved' | 'rejected' | 'disbursed' }) {
  const { grantApplications, updateGrantApplicationStatus, users } = useBank();
  
  const filtered = filter === 'all' 
    ? grantApplications 
    : grantApplications.filter(g => g.status === filter);
    
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground capitalize">{filter === 'all' ? 'All' : filter} Grant Applications</h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-foreground/50">No grant applications found</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">User</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Amount</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Purpose</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Status</th>
                <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(grant => {
                const user = users.find(u => u.id === grant.userId);
                return (
                  <tr key={grant.id}>
                    <td className="p-4 font-bold">{user?.name || grant.userId}</td>
                    <td className="p-4 text-emerald-500 font-bold">${grant.amount.toLocaleString()}</td>
                    <td className="p-4">{grant.purpose}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        grant.status === 'approved' || grant.status === 'disbursed' ? 'bg-emerald-500/10 text-emerald-500' :
                        grant.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {grant.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {grant.status === 'pending' || grant.status === 'processing' ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateGrantApplicationStatus(grant.id, 'approved')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20"><Edit size={16} /></button>
                          <button onClick={() => updateGrantApplicationStatus(grant.id, 'rejected')} className="p-2 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-500/20"><XCircle size={16} /></button>
                        </div>
                      ) : grant.status === 'approved' ? (
                        <button onClick={() => updateGrantApplicationStatus(grant.id, 'disbursed')} className="px-3 py-1 bg-emerald-500 text-white font-bold rounded hover:bg-emerald-600 text-xs">
                          Disburse
                        </button>
                      ) : (
                        <span className="text-foreground/50 text-xs font-bold uppercase">Processed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function AdminTransactionsHistory({ filter }: { filter?: 'transfers' | 'deposits' }) {
  const { 
    transactions, updateTransactionStatus, users, 
    cryptoWithdrawals, approveCryptoWithdrawal, rejectCryptoWithdrawal,
    cryptoOrders, approveCryptoTradeOrder, rejectCryptoTradeOrder
  } = useBank();
  const [selectedReceiptWithdrawal, setSelectedReceiptWithdrawal] = useState<CryptoWithdrawalRequest | null>(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<CryptoTradeOrder | null>(null);
  
  const filtered = transactions.filter(t => {
    if (filter === 'transfers') return t.type.includes('transfer');
    if (filter === 'deposits') return t.type === 'deposit';
    return true;
  });

  const handleApproveCrypto = (txn: any) => {
    const matchedWithdrawal = cryptoWithdrawals.find(w => w.id === txn.reference || w.receiptNumber === txn.reference || (w.userId === txn.userId && Math.abs(w.amount - txn.amount) < 0.01));
    if (matchedWithdrawal) {
      const approved = approveCryptoWithdrawal(matchedWithdrawal.id, { approvedBy: 'Admin Treasury Officer' });
      if (approved) {
        setSelectedReceiptWithdrawal(approved);
      }
      return;
    }

    const matchedOrder = cryptoOrders.find(o => o.id === txn.reference || (o.userId === txn.userId && Math.abs(o.fiatAmount - txn.amount) < 0.01));
    if (matchedOrder) {
      const approvedOrder = approveCryptoTradeOrder(matchedOrder.id, { approvedBy: 'Admin Treasury Officer' });
      if (approvedOrder) {
        setSelectedReceiptOrder(approvedOrder);
      }
      return;
    }

    updateTransactionStatus(txn.id, 'completed');
  };

  const handleRejectCrypto = (txn: any) => {
    const matchedWithdrawal = cryptoWithdrawals.find(w => w.id === txn.reference || w.receiptNumber === txn.reference || (w.userId === txn.userId && Math.abs(w.amount - txn.amount) < 0.01));
    if (matchedWithdrawal) {
      rejectCryptoWithdrawal(matchedWithdrawal.id, 'Compliance policy restriction');
      return;
    }

    const matchedOrder = cryptoOrders.find(o => o.id === txn.reference || (o.userId === txn.userId && Math.abs(o.fiatAmount - txn.amount) < 0.01));
    if (matchedOrder) {
      rejectCryptoTradeOrder(matchedOrder.id, 'Compliance policy restriction');
      return;
    }

    updateTransactionStatus(txn.id, 'failed');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {filter === 'transfers' ? 'Transfer Transactions' : filter === 'deposits' ? 'Users Deposits' : 'Transaction History'}
      </h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-foreground/50">No transactions found</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">User</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Type</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Amount</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Date</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Status</th>
                <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(txn => {
                const user = users.find(u => u.id === txn.userId);
                const isCryptoWithdrawal = txn.type === 'crypto_withdrawal';
                const isCryptoTrade = txn.type === 'crypto_buy' || txn.type === 'crypto_sell' || txn.type === 'crypto_trade';
                const isCrypto = isCryptoWithdrawal || isCryptoTrade;
                const matchedWithdrawal = isCryptoWithdrawal ? cryptoWithdrawals.find(w => w.id === txn.reference || w.receiptNumber === txn.reference || (w.userId === txn.userId && Math.abs(w.amount - txn.amount) < 0.01)) : null;
                const matchedOrder = isCryptoTrade ? cryptoOrders.find(o => o.id === txn.reference || (o.userId === txn.userId && Math.abs(o.fiatAmount - txn.amount) < 0.01)) : null;

                return (
                  <tr key={txn.id}>
                    <td className="p-4 font-bold">{user?.name || txn.userId}</td>
                    <td className="p-4 uppercase text-xs font-bold text-foreground/70">
                      <div className="flex items-center gap-1.5">
                        <span>{txn.type.replace('_', ' ')}</span>
                        {isCrypto && (
                          <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            Crypto
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold">${txn.amount.toLocaleString()}</td>
                    <td className="p-4 text-sm">{new Date(txn.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${txn.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : txn.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end items-center gap-2">
                      {txn.status === 'pending' && (
                        <>
                          {isCrypto ? (
                            <button
                              onClick={() => handleApproveCrypto(txn)}
                              className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1 transition-colors"
                              title="Approve & Mint Official Receipt"
                            >
                              <CheckCircle2 size={14} />
                              <span>Approve & Receipt</span>
                            </button>
                          ) : (
                            <button onClick={() => updateTransactionStatus(txn.id, 'completed')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20"><Edit size={16} /></button>
                          )}
                          <button
                            onClick={() => isCrypto ? handleRejectCrypto(txn) : updateTransactionStatus(txn.id, 'failed')}
                            className="p-2 bg-rose-500/10 text-rose-500 rounded hover:bg-rose-500/20"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}

                      {txn.status === 'completed' && (matchedWithdrawal || matchedOrder) && (
                        <button
                          onClick={() => {
                            if (matchedWithdrawal) setSelectedReceiptWithdrawal(matchedWithdrawal);
                            if (matchedOrder) setSelectedReceiptOrder(matchedOrder);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <FileText size={13} />
                          <span>Receipt</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <CryptoReceiptModal
        withdrawal={selectedReceiptWithdrawal}
        tradeOrder={selectedReceiptOrder}
        onClose={() => {
          setSelectedReceiptWithdrawal(null);
          setSelectedReceiptOrder(null);
        }}
      />
    </div>
  );
}

export function AdminVirtualCards({ filter }: { filter?: 'all' | 'pending' }) {
  const { virtualCards, updateVirtualCardStatus, users, adminSettings, createVirtualCard } = useBank();
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const filtered = virtualCards.filter(c => {
    if (filter === 'pending') return c.status === 'pending';
    return true;
  });

  const exportCardAsPNG = async (cardId: string, cardholderName: string) => {
    const cardElement = document.getElementById(`virtual-card-${cardId}`);
    if (cardElement) {
      try {
        const dataUrl = await htmlToImage.toPng(cardElement, {
          backgroundColor: 'transparent',
          pixelRatio: 3,
        });
        const link = document.createElement('a');
        link.download = `GEB_Card_${cardholderName.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Failed to export card image:', err);
        alert('Failed to export card. Please check the console for details.');
      }
    }
  };

  const CARD_TIERS = [
    { id: 'standard', name: 'Standard', network: 'visa', color: 'from-blue-700 via-blue-600 to-blue-500', textColor: 'text-white' },
    { id: 'gold', name: 'Gold', network: 'mastercard', color: 'from-yellow-500 via-yellow-400 to-yellow-300', textColor: 'text-gray-900' },
    { id: 'platinum', name: 'Platinum', network: 'visa', color: 'from-gray-300 via-gray-200 to-gray-100', textColor: 'text-gray-900' },
    { id: 'black', name: 'Global Elite Black (Mastercard)', network: 'mastercard', color: 'from-gray-900 via-gray-800 to-black', textColor: 'text-white' },
    { id: 'black_visa', name: 'Global Elite Black (Visa)', network: 'visa', color: 'from-gray-900 via-gray-800 to-black', textColor: 'text-white' }
  ];

  const renderNetworkLogo = (network: string, textColor: string) => {
    if (network === 'mastercard') {
      return (
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#EB001B] rounded-full opacity-90 z-10"></div>
            <div className="w-8 h-8 bg-[#F79E1B] rounded-full opacity-90 -ml-4 z-0"></div>
          </div>
          <span className={`text-[8px] font-bold tracking-widest mt-0.5 lowercase ${textColor}`}>mastercard</span>
        </div>
      );
    }
    return (
      <div className={`font-black italic text-2xl tracking-tighter drop-shadow-lg uppercase ${textColor}`}>
        VISA
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {filter === 'pending' ? 'Pending Card Applications' : 'All Virtual Cards'}
      </h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-8 text-center flex flex-col items-center justify-center">
          {filtered.length === 0 && <p className="text-foreground/50 mb-4">No cards found</p>}
          {virtualCards.length === 0 && (
            <button 
              onClick={() => {
                const demoUser = users.find(u => u.role !== 'admin');
                if (!demoUser) return alert('No regular users found to assign cards to.');
                createVirtualCard({
                  userId: demoUser.id,
                  cardNumber: '4532123456789012',
                  expiry: '12/29',
                  cvv: String(Math.floor(Math.random() * 900 + 100)),
                  status: 'active',
                  type: 'virtual',
                  tier: 'standard',
                  network: 'visa',
                  price: 500
                });
                createVirtualCard({
                  userId: demoUser.id,
                  cardNumber: '5332111122223333',
                  expiry: '04/29',
                  cvv: String(Math.floor(Math.random() * 900 + 100)),
                  status: 'active',
                  type: 'virtual',
                  tier: 'gold',
                  network: 'mastercard',
                  price: 1000
                });
                createVirtualCard({
                  userId: demoUser.id,
                  cardNumber: '4111222233334444',
                  expiry: '08/29',
                  cvv: String(Math.floor(Math.random() * 900 + 100)),
                  status: 'active',
                  type: 'virtual',
                  tier: 'platinum',
                  network: 'visa',
                  price: 2500
                });
                createVirtualCard({
                  userId: demoUser.id,
                  cardNumber: '5412987654321098',
                  expiry: '09/29',
                  cvv: String(Math.floor(Math.random() * 900 + 100)),
                  status: 'pending',
                  type: 'virtual',
                  tier: 'black',
                  network: 'mastercard',
                  price: 5000
                });
                createVirtualCard({
                  userId: demoUser.id,
                  cardNumber: '4222333344445555',
                  expiry: '11/29',
                  cvv: String(Math.floor(Math.random() * 900 + 100)),
                  status: 'active',
                  type: 'virtual',
                  tier: 'black_visa',
                  network: 'visa',
                  price: 5000
                });
              }}
              className="px-6 py-2 bg-primary/20 text-primary font-bold rounded-lg hover:bg-primary/30 transition-colors"
            >
              Load Sample Cards
            </button>
          )}
        </div>
        
        {filtered.length > 0 && (
          <table className="w-full text-left">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">User</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Card Number</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Tier / Network</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Status</th>
                <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(card => {
                const user = users.find(u => u.id === card.userId);
                const tierInfo = CARD_TIERS.find(t => t.id === card.tier) || CARD_TIERS[0];
                return (
                  <tr key={card.id}>
                    <td className="p-4 font-bold">{user?.name || card.userId}</td>
                    <td className="p-4 font-mono font-bold tracking-widest text-sm">•••• •••• •••• {card.cardNumber.slice(-4)}</td>
                    <td className="p-4 uppercase text-xs font-bold text-foreground/70">{tierInfo.name} • {tierInfo.network}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${card.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : card.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {card.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => setSelectedCard({ card, user, tierInfo })} className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded hover:bg-indigo-500/20 text-xs font-bold">
                        View & Print
                      </button>
                      {card.status === 'pending' ? (
                        <button onClick={() => updateVirtualCardStatus(card.id, 'active')} className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20 text-xs font-bold">Approve</button>
                      ) : card.status === 'active' ? (
                        <button onClick={() => updateVirtualCardStatus(card.id, 'frozen')} className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20 text-xs font-bold">Freeze</button>
                      ) : (
                        <button onClick={() => updateVirtualCardStatus(card.id, 'active')} className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20 text-xs font-bold">Unfreeze</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedCard && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedCard(null)}>
          <div className="bg-card border border-border p-8 rounded-2xl shadow-2xl relative max-w-lg w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-foreground/50 hover:text-foreground" onClick={() => setSelectedCard(null)}>
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-6">Card Management</h3>
            
            <div 
              id={`virtual-card-${selectedCard.card.id}`}
              className={`relative w-full aspect-[1.586/1] bg-gradient-to-tr ${selectedCard.tierInfo.color} ${selectedCard.tierInfo.textColor} rounded-2xl p-6 flex flex-col justify-between shadow-xl border border-white/10 overflow-hidden`}
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] opacity-60 w-full text-center">
                {selectedCard.tierInfo.name.replace(' (Mastercard)', '').replace(' (Visa)', '')}
              </div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                  {adminSettings?.websiteLogo ? (
                    <img src={adminSettings.websiteLogo} alt="Bank Logo" className={`h-8 object-contain ${selectedCard.tierInfo.textColor === 'text-white' ? 'brightness-0 invert' : ''}`} crossOrigin="anonymous" />
                  ) : null}
                  <div className="font-bold text-xl tracking-tighter">
                    GEB <span className="font-light opacity-50 text-xs tracking-normal block -mt-1">GLOBAL ELITE BANK</span>
                  </div>
                </div>
                <Wifi className="opacity-80 rotate-90" size={24} />
              </div>

              <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 relative z-10 opacity-90 mt-4 mb-2 flex items-center justify-center overflow-hidden">
                 <div className="w-full h-[1px] bg-black/20 absolute top-1/2"></div>
                 <div className="w-[1px] h-full bg-black/20 absolute left-1/3"></div>
                 <div className="w-[1px] h-full bg-black/20 absolute right-1/3"></div>
              </div>

              <div className="relative z-10 mb-4 mt-2">
                <p className="font-mono text-xl tracking-[0.2em] drop-shadow-md">
                  {selectedCard.card.cardNumber.match(/.{1,4}/g)?.join(' ')}
                </p>
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div>
                  <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1">Cardholder</p>
                  <p className="font-bold tracking-widest text-sm uppercase">{selectedCard.user?.name || 'User'}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="opacity-50 text-[10px] uppercase tracking-widest mb-1">Valid Thru</p>
                  <p className="font-mono tracking-widest text-sm">{selectedCard.card.expiry}</p>
                </div>
                {renderNetworkLogo(selectedCard.tierInfo.network, selectedCard.tierInfo.textColor)}
              </div>
            </div>

            <div className="w-full mt-4 p-4 bg-background border border-border rounded-xl">
               <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">Secure Details</h4>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-bold">CVV Code</span>
                 <span className="font-mono text-sm">{selectedCard.card.cvv}</span>
               </div>
            </div>

            <button 
              onClick={() => exportCardAsPNG(selectedCard.card.id, selectedCard.user?.name || 'User')}
              className="mt-6 w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <ArrowDownToLine size={18} />
              Export as PNG (Print-Ready)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminVirtualCardSettings() {
  const { virtualCards, users, updateVirtualCardStatus, deleteVirtualCard } = useBank();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-foreground">Card Settings & Complete Directory</h2>
       <p className="text-sm text-foreground/60 mb-6">Restricted View: Full PAN and CVV details are visible here for administrative configuration.</p>
       <div className="bg-card border border-border rounded-xl overflow-hidden pb-32">
         <table className="w-full text-left">
           <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">User</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Card Number</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Expiry</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">CVV</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Tier / Status</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-border">
             {virtualCards.map(card => {
               const user = users.find(u => u.id === card.userId);
               return (
                 <tr key={card.id}>
                   <td className="p-4 font-bold">{user?.name || card.userId}</td>
                   <td className="p-4 font-mono text-sm">{card.cardNumber}</td>
                   <td className="p-4 font-mono text-sm">{card.expiry}</td>
                   <td className="p-4 font-mono text-sm text-rose-500">{card.cvv}</td>
                   <td className="p-4 text-xs uppercase"><span className="font-bold">{card.tier || 'STANDARD'}</span> / {card.status}</td>
                   <td className="p-4 text-right relative">
                     <div className="relative inline-block text-left">
                       <button
                         onClick={() => setOpenDropdown(openDropdown === card.id ? null : card.id)}
                         className="flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-border rounded-lg text-xs font-bold hover:bg-foreground/10 transition-colors"
                       >
                         Manage <ChevronDown size={14} className={`transition-transform ${openDropdown === card.id ? 'rotate-180' : ''}`} />
                       </button>

                       {openDropdown === card.id && (
                         <>
                           <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                           <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-20 flex flex-col text-left">
                             {card.status !== 'pending' && (
                               <button 
                                 onClick={() => { updateVirtualCardStatus(card.id, card.status === 'frozen' ? 'active' : 'frozen'); setOpenDropdown(null); }} 
                                 className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-foreground/5 transition-colors"
                               >
                                 {card.status === 'frozen' ? 'Unfreeze Card' : 'Freeze Card'}
                               </button>
                             )}
                             {card.status !== 'blocked' && card.status !== 'pending' && (
                               <button 
                                 onClick={() => { updateVirtualCardStatus(card.id, 'blocked'); setOpenDropdown(null); }} 
                                 className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-foreground/5 transition-colors text-amber-500"
                               >
                                 Block Card
                               </button>
                             )}
                             <button 
                               onClick={() => { deleteVirtualCard(card.id); setOpenDropdown(null); }} 
                               className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-rose-500/10 transition-colors text-rose-500"
                             >
                               Delete Card
                             </button>
                           </div>
                         </>
                       )}
                     </div>
                   </td>
                 </tr>
               )
             })}
           </tbody>
         </table>
         {virtualCards.length === 0 && (
            <div className="p-8 text-center text-foreground/50">No cards issued yet.</div>
         )}
       </div>
    </div>
  )
}

export function AdminEmailServices() {
  const { adminSettings, updateAdminSettings } = useBank();
  const [formData, setFormData] = useState<FrontendContent>(() => ({
    ...DEFAULT_FRONTEND_CONTENT,
    ...(adminSettings.frontendContent || {})
  }));

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (adminSettings.frontendContent) {
      setFormData(prev => ({
        ...DEFAULT_FRONTEND_CONTENT,
        ...adminSettings.frontendContent,
        ...prev
      }));
    }
  }, [adminSettings.frontendContent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    try {
      updateAdminSettings({ frontendContent: formData });
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 4000);
    } catch (err) {
      console.error("Failed to save frontend content:", err);
      setSaveStatus('error');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all headings, contact details, committee data, and gallery links to factory defaults?')) {
      setFormData(DEFAULT_FRONTEND_CONTENT);
      updateAdminSettings({ frontendContent: DEFAULT_FRONTEND_CONTENT });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Quick Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Gallery & Email Services
          </h2>
          <p className="text-sm text-foreground/70 mt-1">
            Edit all headings, contact emails, office addresses, committee details, and media assets across the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 text-xs font-semibold text-foreground/70 bg-background border border-border rounded-xl hover:bg-muted transition-all"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${
              saveStatus === 'saved'
                ? 'bg-emerald-600 text-white'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <CheckCircle2 size={16} />
                Saved Successfully!
              </>
            ) : (
              <>
                <Save size={16} />
                Save All Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {saveStatus === 'saved' && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-400 font-medium flex items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-300">All Changes Saved Successfully!</p>
              <p className="text-xs text-emerald-400/80">The website's headings, contact channels, committee profiles, and media are now live.</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 px-2.5 py-1 rounded-md text-emerald-300">Active</span>
        </div>
      )}

      {/* Section 1: Contact Page & Channels */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Mail size={20} className="text-primary" />
            Contact Page Headings & Channels
          </h3>
          <p className="text-xs text-foreground/60 mt-1">Configure the main hero heading, section title, and 4 primary contact cards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground/60 uppercase mb-1">Contact Page Hero Title</label>
            <input
              type="text"
              name="contactPageHeading"
              value={formData.contactPageHeading || ''}
              onChange={handleChange}
              placeholder="Contact Our Membership Team"
              className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/60 uppercase mb-1">How to Reach Us Section Title</label>
            <input
              type="text"
              name="howToReachUsHeading"
              value={formData.howToReachUsHeading || ''}
              onChange={handleChange}
              placeholder="How to Reach Us"
              className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* 4 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card 1 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              Card 1: Membership Applications
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Card Heading</label>
              <input
                type="text"
                name="membershipApplicationsHeading"
                value={formData.membershipApplicationsHeading || ''}
                onChange={handleChange}
                placeholder="Membership Applications"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Inquiry Email</label>
              <input
                type="text"
                name="membershipApplicationsEmail"
                value={formData.membershipApplicationsEmail || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
              Card 2: Member Support
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Card Heading</label>
              <input
                type="text"
                name="memberSupportHeading"
                value={formData.memberSupportHeading || ''}
                onChange={handleChange}
                placeholder="Member Support"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Support Email</label>
              <input
                type="text"
                name="memberSupportEmail"
                value={formData.memberSupportEmail || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-wider">
              Card 3: Private Banking & Wealth
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Card Heading</label>
              <input
                type="text"
                name="privateBankingHeading"
                value={formData.privateBankingHeading || ''}
                onChange={handleChange}
                placeholder="Private Banking & Wealth"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Private Banking Email</label>
              <input
                type="text"
                name="privateBankingEmail"
                value={formData.privateBankingEmail || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-wider">
              Card 4: Head Office Location
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Card Heading</label>
              <input
                type="text"
                name="headOfficeHeading"
                value={formData.headOfficeHeading || ''}
                onChange={handleChange}
                placeholder="Head Office"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Head Office Address</label>
              <input
                type="text"
                name="headOfficeAddress"
                value={formData.headOfficeAddress || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Visiting Hours</label>
              <input
                type="text"
                name="headOfficeHours"
                value={formData.headOfficeHours || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Urgent Assistance & Inquiries */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <AlertTriangle size={20} className="text-rose-500" />
            Urgent Assistance & Emergency Inquiries
          </h3>
          <p className="text-xs text-foreground/60 mt-1">Configure emergency and media contact points displayed on the Contact page.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground/60 uppercase mb-1">Section Heading Title</label>
          <input
            type="text"
            name="urgentAssistanceHeading"
            value={formData.urgentAssistanceHeading || ''}
            onChange={handleChange}
            placeholder="Urgent Assistance (Existing Members)"
            className="w-full max-w-lg bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Urgent 1 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <span className="text-xs font-bold text-rose-500 uppercase">Emergency 1</span>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Heading</label>
              <input
                type="text"
                name="cardLostHeading"
                value={formData.cardLostHeading || ''}
                onChange={handleChange}
                placeholder="Card Lost or Stolen?"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Email</label>
              <input
                type="text"
                name="cardLostEmail"
                value={formData.cardLostEmail || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Urgent 2 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <span className="text-xs font-bold text-rose-500 uppercase">Emergency 2</span>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Heading</label>
              <input
                type="text"
                name="suspiciousActivityHeading"
                value={formData.suspiciousActivityHeading || ''}
                onChange={handleChange}
                placeholder="Suspicious Activity?"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Email</label>
              <input
                type="text"
                name="suspiciousActivityEmail"
                value={formData.suspiciousActivityEmail || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Urgent 3 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <span className="text-xs font-bold text-blue-500 uppercase">Inquiry 1</span>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Heading</label>
              <input
                type="text"
                name="mediaInquiriesHeading"
                value={formData.mediaInquiriesHeading || ''}
                onChange={handleChange}
                placeholder="Media Inquiries?"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Email</label>
              <input
                type="text"
                name="mediaInquiriesEmail"
                value={formData.mediaInquiriesEmail || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Urgent 4 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <span className="text-xs font-bold text-blue-500 uppercase">Inquiry 2</span>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Heading</label>
              <input
                type="text"
                name="partnershipInquiriesHeading"
                value={formData.partnershipInquiriesHeading || ''}
                onChange={handleChange}
                placeholder="Partnership Inquiries?"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Email</label>
              <input
                type="text"
                name="partnershipInquiriesEmail"
                value={formData.partnershipInquiriesEmail || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Membership Committee / Leadership */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users size={20} className="text-amber-500" />
            Membership Committee & Leadership
          </h3>
          <p className="text-xs text-foreground/60 mt-1">Manage the names, roles, headings, and portrait images for the committee panel.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground/60 uppercase mb-1">Committee Section Heading</label>
          <input
            type="text"
            name="committeeSectionHeading"
            value={formData.committeeSectionHeading || ''}
            onChange={handleChange}
            placeholder="The Gatekeepers of Excellence"
            className="w-full max-w-lg bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member 1 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={formData.aboutTeamEdwardImg}
                alt="Preview"
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <div>
                <span className="text-xs font-bold text-primary uppercase">Member 1</span>
                <p className="text-sm font-bold text-foreground">{formData.aboutTeamEdwardName}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Card Heading / Title</label>
              <input
                type="text"
                name="aboutTeamEdwardHeading"
                value={formData.aboutTeamEdwardHeading || ''}
                onChange={handleChange}
                placeholder="Membership Committee Chairman"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Full Name</label>
              <input
                type="text"
                name="aboutTeamEdwardName"
                value={formData.aboutTeamEdwardName || ''}
                onChange={handleChange}
                placeholder="Sir Edward Beaumont"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Role Subtitle</label>
              <input
                type="text"
                name="aboutTeamEdwardRole"
                value={formData.aboutTeamEdwardRole || ''}
                onChange={handleChange}
                placeholder="Chairman, Membership Committee"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Portrait Image URL</label>
              <input
                type="text"
                name="aboutTeamEdwardImg"
                value={formData.aboutTeamEdwardImg || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Member 2 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={formData.aboutTeamHelenaImg}
                alt="Preview"
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <div>
                <span className="text-xs font-bold text-primary uppercase">Member 2</span>
                <p className="text-sm font-bold text-foreground">{formData.aboutTeamHelenaName}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Card Heading / Title</label>
              <input
                type="text"
                name="aboutTeamHelenaHeading"
                value={formData.aboutTeamHelenaHeading || ''}
                onChange={handleChange}
                placeholder="Chief Risk Officer"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Full Name</label>
              <input
                type="text"
                name="aboutTeamHelenaName"
                value={formData.aboutTeamHelenaName || ''}
                onChange={handleChange}
                placeholder="Dr. Helena Van Der Berg"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Role Subtitle</label>
              <input
                type="text"
                name="aboutTeamHelenaRole"
                value={formData.aboutTeamHelenaRole || ''}
                onChange={handleChange}
                placeholder="Chief Risk Officer"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Portrait Image URL</label>
              <input
                type="text"
                name="aboutTeamHelenaImg"
                value={formData.aboutTeamHelenaImg || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Member 3 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={formData.aboutTeamJonathanImg}
                alt="Preview"
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <div>
                <span className="text-xs font-bold text-primary uppercase">Member 3</span>
                <p className="text-sm font-bold text-foreground">{formData.aboutTeamJonathanName}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Card Heading / Title</label>
              <input
                type="text"
                name="aboutTeamJonathanHeading"
                value={formData.aboutTeamJonathanHeading || ''}
                onChange={handleChange}
                placeholder="Head of Private Banking"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Full Name</label>
              <input
                type="text"
                name="aboutTeamJonathanName"
                value={formData.aboutTeamJonathanName || ''}
                onChange={handleChange}
                placeholder="Mr. Jonathan Westwood"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Role Subtitle</label>
              <input
                type="text"
                name="aboutTeamJonathanRole"
                value={formData.aboutTeamJonathanRole || ''}
                onChange={handleChange}
                placeholder="Head of Private Banking"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Portrait Image URL</label>
              <input
                type="text"
                name="aboutTeamJonathanImg"
                value={formData.aboutTeamJonathanImg || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Member 4 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={formData.aboutTeamIsabelleImg}
                alt="Preview"
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <div>
                <span className="text-xs font-bold text-primary uppercase">Member 4</span>
                <p className="text-sm font-bold text-foreground">{formData.aboutTeamIsabelleName}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Card Heading / Title</label>
              <input
                type="text"
                name="aboutTeamIsabelleHeading"
                value={formData.aboutTeamIsabelleHeading || ''}
                onChange={handleChange}
                placeholder="Chief Compliance Officer"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Full Name</label>
              <input
                type="text"
                name="aboutTeamIsabelleName"
                value={formData.aboutTeamIsabelleName || ''}
                onChange={handleChange}
                placeholder="Ms. Isabelle Moreau"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Role Subtitle</label>
              <input
                type="text"
                name="aboutTeamIsabelleRole"
                value={formData.aboutTeamIsabelleRole || ''}
                onChange={handleChange}
                placeholder="Chief Compliance Officer"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Portrait Image URL</label>
              <input
                type="text"
                name="aboutTeamIsabelleImg"
                value={formData.aboutTeamIsabelleImg || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Gallery & Facilities Media */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles size={20} className="text-cyan-500" />
            Gallery & Facility Media
          </h3>
          <p className="text-xs text-foreground/60 mt-1">Configure section banners and images displayed on the Homepage and Services page.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Media 1 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase">Homepage Staff Banner</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Caption / Heading</label>
              <input
                type="text"
                name="homeStaffHeading"
                value={formData.homeStaffHeading || ''}
                onChange={handleChange}
                placeholder="Global Elite Bank Leadership & Staff"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Image URL</label>
              <input
                type="text"
                name="homeStaffImg"
                value={formData.homeStaffImg || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            {formData.homeStaffImg && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border max-h-40">
                <img src={formData.homeStaffImg} alt="Staff Preview" className="w-full h-auto object-cover" />
              </div>
            )}
          </div>

          {/* Media 2 */}
          <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase">Services Hall Banner</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Caption / Heading</label>
              <input
                type="text"
                name="servicesHallHeading"
                value={formData.servicesHallHeading || ''}
                onChange={handleChange}
                placeholder="Executive Banking Hall"
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/60 mb-1">Image URL</label>
              <input
                type="text"
                name="servicesHallImg"
                value={formData.servicesHallImg || ''}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-lg p-2.5 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>
            {formData.servicesHallImg && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border max-h-40">
                <img src={formData.servicesHallImg} alt="Hall Preview" className="w-full h-auto object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Save Bar */}
      <div className="sticky bottom-4 z-20 bg-card/95 backdrop-blur border border-border/80 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {saveStatus === 'saved' ? (
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 size={18} />
              Settings saved and active!
            </div>
          ) : (
            <p className="text-xs text-foreground/70 hidden sm:block">
              Remember to save all modified headings and media links.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2 text-xs font-semibold text-foreground/70 bg-background border border-border rounded-xl hover:bg-muted transition-all"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
              saveStatus === 'saved'
                ? 'bg-emerald-600 text-white'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <CheckCircle2 size={16} />
                Saved!
              </>
            ) : (
              <>
                <Save size={16} />
                Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


export function AdminAdministrators() {
  const { users, adminCreateUser, deleteUser, adminUpdateUser } = useBank();
  const admins = users.filter(u => u.role === 'admin');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState('');
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [adminFormError, setAdminFormError] = useState('');

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) return;
    if (!isEditing || newAdmin.password) {
      const pwdCheck = validateNewPassword(newAdmin.password);
      if (!pwdCheck.valid) {
        setAdminFormError(pwdCheck.error || 'Password must be at least 6 characters with a mix of characters.');
        return;
      }
    }
    setAdminFormError('');
    if (isEditing && currentEditId) {
      adminUpdateUser(currentEditId, { name: newAdmin.name, email: newAdmin.email, ...(newAdmin.password ? { password: newAdmin.password } : {}) });
    } else {
      if (!newAdmin.password) return;
      adminCreateUser({ ...newAdmin, role: 'admin', status: 'active', accounts: [], showFullCardDetails: true });
    }
    setShowModal(false);
    setIsEditing(false);
    setNewAdmin({ name: '', email: '', password: '' });
  };
  
  const openEditModal = (admin: any) => {
    setIsEditing(true);
    setCurrentEditId(admin.id);
    setNewAdmin({ name: admin.name, email: admin.email, password: admin.password || '' });
    setAdminFormError('');
    setShowModal(true);
  };
  
  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Administrator(s)</h2>
        <button onClick={() => { setIsEditing(false); setNewAdmin({ name: '', email: '', password: '' }); setShowModal(true); }} className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">Add Admin</button>
      </div>
      
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-background text-foreground border border-border hover:border-primary/50 transition-colors"
                title="Move back"
              >
                <ArrowLeft size={14} />
                <span>Move Back</span>
              </button>
              <h3 className="text-lg font-bold">{isEditing ? 'Edit Administrator' : 'Add New Administrator'}</h3>
              <button onClick={() => setShowModal(false)} className="text-foreground/50 hover:text-foreground p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Name</label>
                <input type="text" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" placeholder="Admin Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email</label>
                <input type="email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" placeholder="admin@example.com" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-foreground/50 uppercase">Password</label>
                  <span className="text-[10px] text-primary font-bold">Visible to Admin</span>
                </div>
                <input type="text" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none font-mono" placeholder="Enter password" />
                <div className="mt-2">
                  <PasswordStrengthMeter password={newAdmin.password} />
                </div>
              </div>
              {adminFormError && (
                <div className="text-xs text-rose-500 font-bold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  {adminFormError}
                </div>
              )}
              <div className="flex justify-between items-center gap-3 mt-6 pt-3 border-t border-border/40">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-3.5 py-2 text-foreground/70 font-bold hover:text-foreground text-xs flex items-center gap-1.5 rounded-lg border border-border bg-background"
                >
                  <ArrowLeft size={14} /> Move Back
                </button>
                <button onClick={handleAddAdmin} disabled={!newAdmin.name || !newAdmin.email || (!isEditing && !newAdmin.password)} className="px-4 py-2 bg-primary text-white font-bold rounded-lg disabled:opacity-50 text-xs shadow-md">{isEditing ? 'Save Changes' : 'Create Admin'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background/50 border-b border-border">
            <tr>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Name</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Email</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Role</th>
              <th className="p-4 text-xs font-bold text-foreground/50 uppercase">Status</th>
              <th className="p-4 text-right text-xs font-bold text-foreground/50 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="p-4 font-bold">{admin.name}</td>
                <td className="p-4">{admin.email}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-xs font-bold uppercase rounded">Super Admin</span>
                </td>
                <td className="p-4">
                  <span className="text-emerald-500 text-xs font-bold uppercase">Active</span>
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button onClick={() => openEditModal(admin)} className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors bg-blue-500/10 px-3 py-1.5 rounded border border-blue-500/20">Edit</button>
                  <button onClick={() => { if(window.confirm('Delete this admin?')) deleteUser(admin.id); }} className="text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors bg-rose-500/10 px-3 py-1.5 rounded border border-rose-500/20">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminContactInquiries() {
  const { contactInquiries, updateContactInquiryStatus, deleteContactInquiry, sendMockEmail } = useBank();
  
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'replied' | 'ignored'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Modals
  const [replyingInquiry, setReplyingInquiry] = useState<ContactInquiry | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [viewingThreadInquiry, setViewingThreadInquiry] = useState<ContactInquiry | null>(null);
  const [deleteConfirmInquiry, setDeleteConfirmInquiry] = useState<ContactInquiry | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string; type: 'success' | 'danger' | 'info' } | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerToast = (title: string, message: string, type: 'success' | 'danger' | 'info') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleOpenReply = (inq: ContactInquiry) => {
    setActiveDropdownId(null);
    setReplyingInquiry(inq);
    setReplySubject(`Re: Inquiry regarding Private Wealth & Banking Services - Global Elite Bank`);
    setReplyMessage(`Dear ${inq.name},

Thank you for contacting Global Elite Bank regarding private client solutions.

We have received and reviewed your inquiry. Our Senior Private Banking Directorate specializes in bespoke wealth structuring, multi-currency accounts, and institutional transfer clearance.

We would be pleased to schedule an introductory conference or private phone consultation to discuss how Global Elite Bank can best serve your requirements.

Please let us know your preferred date and time, or reply directly to this correspondence.

Warm regards,
Admissions & Client Advisory Desk
Global Elite Bank, Zurich, Switzerland`);
  };

  const handleSendReply = () => {
    if (!replyingInquiry) return;
    if (!replySubject.trim() || !replyMessage.trim()) {
      triggerToast('Error', 'Please provide both subject and message before sending.', 'danger');
      return;
    }

    sendMockEmail({
      to: replyingInquiry.email,
      subject: replySubject,
      body: replyMessage
    });

    updateContactInquiryStatus(replyingInquiry.id, 'replied', {
      subject: replySubject,
      message: replyMessage
    });

    triggerToast(
      'Reply Dispatched',
      `Official response sent to ${replyingInquiry.email} and status marked as Replied.`,
      'success'
    );
    setReplyingInquiry(null);
  };

  const handleToggleIgnore = (inq: ContactInquiry) => {
    setActiveDropdownId(null);
    const newStatus = inq.status === 'ignored' ? 'new' : 'ignored';
    updateContactInquiryStatus(inq.id, newStatus);
    triggerToast(
      newStatus === 'ignored' ? 'Inquiry Ignored' : 'Inquiry Restored',
      newStatus === 'ignored'
        ? `Inquiry from ${inq.name} moved to Ignored.`
        : `Inquiry from ${inq.name} restored to active list.`,
      newStatus === 'ignored' ? 'info' : 'success'
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmInquiry) return;
    const name = deleteConfirmInquiry.name;
    deleteContactInquiry(deleteConfirmInquiry.id);
    setDeleteConfirmInquiry(null);
    triggerToast('Inquiry Deleted', `Inquiry from ${name} was permanently removed.`, 'danger');
  };

  // Filtering
  const filteredInquiries = contactInquiries.filter(inq => {
    const status = inq.status || 'new';
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const newCount = contactInquiries.filter(i => (i.status || 'new') === 'new').length;
  const repliedCount = contactInquiries.filter(i => i.status === 'replied').length;
  const ignoredCount = contactInquiries.filter(i => i.status === 'ignored').length;

  return (
    <div className="space-y-6">
      {/* Toast Alert Banner */}
      {toast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
          toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          toast.type === 'danger' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
          'bg-blue-500/10 text-blue-400 border-blue-500/20'
        }`}>
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-400 shrink-0" />}
            {toast.type === 'danger' && <AlertCircle size={18} className="text-rose-400 shrink-0" />}
            {toast.type === 'info' && <EyeOff size={18} className="text-blue-400 shrink-0" />}
            <div>
              <span className="font-bold">{toast.title}: </span>
              <span>{toast.message}</span>
            </div>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:opacity-75 transition-opacity">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contact Inquiries</h2>
          <p className="text-sm text-foreground/60 mt-1">Manage inbound inquiries, send direct email replies, and organize prospect communication.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-card border border-border text-foreground/70 hover:text-foreground'
            }`}
          >
            All ({contactInquiries.length})
          </button>
          <button
            onClick={() => setFilterStatus('new')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatus === 'new'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-card border border-border text-blue-400 hover:text-blue-300'
            }`}
          >
            <span>New</span>
            {newCount > 0 && (
              <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">{newCount}</span>
            )}
          </button>
          <button
            onClick={() => setFilterStatus('replied')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatus === 'replied'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-card border border-border text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <span>Replied</span>
            {repliedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">{repliedCount}</span>
            )}
          </button>
          <button
            onClick={() => setFilterStatus('ignored')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatus === 'ignored'
                ? 'bg-slate-600 text-white shadow-sm'
                : 'bg-card border border-border text-foreground/50 hover:text-foreground'
            }`}
          >
            <span>Ignored</span>
            {ignoredCount > 0 && (
              <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">{ignoredCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
        <input
          type="text"
          placeholder="Search inquiries by name, email, country, or content..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Table Container */}
      <div className="bg-card border border-border rounded-xl overflow-visible shadow-sm">
        {filteredInquiries.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare size={36} className="mx-auto text-foreground/30 mb-3" />
            <p className="text-foreground/70 font-semibold">No inquiries found</p>
            <p className="text-xs text-foreground/40 mt-1">Try switching the filter or clearing the search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background/60 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Prospect</th>
                  <th className="px-6 py-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Net Worth</th>
                  <th className="px-6 py-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-foreground/50 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInquiries.map(inq => {
                  const status = inq.status || 'new';
                  return (
                    <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                        {new Date(inq.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs uppercase">
                            {inq.name ? inq.name.charAt(0) : 'P'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">{inq.name}</div>
                            <div className="text-xs text-foreground/50 font-mono">{inq.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70 uppercase">
                        <span className="px-2 py-0.5 rounded bg-background/50 border border-border/60 text-xs font-mono">
                          {inq.country}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-foreground/70">
                        <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border/50 text-primary font-semibold">
                          {inq.netWorth === '1' ? '$100K – $500K' :
                           inq.netWorth === '2' ? '$500K – $1M' :
                           inq.netWorth === '3' ? '$1M – $5M' :
                           inq.netWorth === '4' ? '$5M – $10M' :
                           inq.netWorth === '5' ? '$10M+' : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70 max-w-xs">
                        <div 
                          onClick={() => setViewingThreadInquiry(inq)}
                          className="truncate cursor-pointer hover:text-foreground transition-colors group"
                          title="Click to view full message"
                        >
                          <span>{inq.message}</span>
                          <span className="text-[11px] text-primary underline block group-hover:opacity-100 opacity-70">View details</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase rounded-md border ${
                          status === 'new'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : status === 'replied'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {status === 'new' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>}
                          {status === 'replied' && <Check size={11} />}
                          {status === 'ignored' && <EyeOff size={11} />}
                          <span>{status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="relative inline-block text-left" ref={activeDropdownId === inq.id ? dropdownRef : undefined}>
                          <button
                            id={`manage-enquiry-btn-${inq.id}`}
                            onClick={() => setActiveDropdownId(activeDropdownId === inq.id ? null : inq.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/90 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/30 shadow-sm"
                          >
                            <span>Manage</span>
                            <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdownId === inq.id ? 'rotate-180' : ''}`} />
                          </button>

                          {activeDropdownId === inq.id && (
                            <div className="absolute right-0 top-full mt-1.5 w-48 bg-card border border-border rounded-xl shadow-2xl z-[150] p-1.5 flex flex-col space-y-1 animate-in fade-in zoom-in-95 duration-150">
                              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/40 border-b border-border/50 mb-1">
                                Enquiry Actions
                              </div>
                              
                              {/* 1. Reply */}
                              <button
                                id={`reply-enquiry-btn-${inq.id}`}
                                onClick={() => handleOpenReply(inq)}
                                className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-blue-500/15 hover:text-blue-400 rounded-lg text-foreground transition-colors flex items-center gap-2 group"
                              >
                                <Mail size={14} className="text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
                                <div className="flex flex-col">
                                  <span>Reply</span>
                                  <span className="text-[10px] text-foreground/40 font-normal">Send official email response</span>
                                </div>
                              </button>

                              {/* 2. Ignore / Restore */}
                              <button
                                id={`ignore-enquiry-btn-${inq.id}`}
                                onClick={() => handleToggleIgnore(inq)}
                                className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-amber-500/15 hover:text-amber-400 rounded-lg text-foreground transition-colors flex items-center gap-2 group"
                              >
                                {status === 'ignored' ? (
                                  <>
                                    <Eye size={14} className="text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                                    <div className="flex flex-col">
                                      <span>Restore</span>
                                      <span className="text-[10px] text-foreground/40 font-normal">Move back to Active</span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff size={14} className="text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                                    <div className="flex flex-col">
                                      <span>Ignore</span>
                                      <span className="text-[10px] text-foreground/40 font-normal">Mark as unhandled/muted</span>
                                    </div>
                                  </>
                                )}
                              </button>

                              {/* 3. Delete */}
                              <button
                                id={`delete-enquiry-btn-${inq.id}`}
                                onClick={() => { setActiveDropdownId(null); setDeleteConfirmInquiry(inq); }}
                                className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-rose-500/15 hover:text-rose-400 rounded-lg text-foreground transition-colors flex items-center gap-2 group border-t border-border/40 mt-1 pt-1.5"
                              >
                                <Trash2 size={14} className="text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
                                <div className="flex flex-col">
                                  <span className="text-rose-400 font-bold">Delete</span>
                                  <span className="text-[10px] text-foreground/40 font-normal">Remove inquiry permanently</span>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyingInquiry && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setReplyingInquiry(null); }}
        >
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b border-border bg-background/50 flex justify-between items-center sticky top-0 z-10 gap-3">
              <div className="flex items-center gap-3">
                <button
                  id="reply-modal-back-btn"
                  onClick={() => setReplyingInquiry(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-background text-foreground border border-border hover:border-primary/50 transition-colors shadow-sm"
                  title="Move back"
                >
                  <ArrowLeft size={15} />
                  <span>Move Back</span>
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">Reply to Prospect Inquiry</h2>
                    <p className="text-xs text-foreground/50">Dispatches an official email to {replyingInquiry.email}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setReplyingInquiry(null)} className="text-foreground/50 hover:text-foreground p-1 rounded-lg">
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Prospect context summary */}
              <div className="bg-background/80 border border-border rounded-xl p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                  <div>
                    <span className="text-foreground/40 block uppercase tracking-wider text-[10px] font-bold">Prospect</span>
                    <span className="font-bold text-foreground">{replyingInquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-foreground/40 block uppercase tracking-wider text-[10px] font-bold">Email</span>
                    <span className="font-mono text-foreground/80">{replyingInquiry.email}</span>
                  </div>
                  <div>
                    <span className="text-foreground/40 block uppercase tracking-wider text-[10px] font-bold">Country</span>
                    <span className="font-bold text-foreground uppercase">{replyingInquiry.country}</span>
                  </div>
                  <div>
                    <span className="text-foreground/40 block uppercase tracking-wider text-[10px] font-bold">Net Worth</span>
                    <span className="font-semibold text-primary">
                      {replyingInquiry.netWorth === '1' ? '$100K – $500K' :
                       replyingInquiry.netWorth === '2' ? '$500K – $1M' :
                       replyingInquiry.netWorth === '3' ? '$1M – $5M' :
                       replyingInquiry.netWorth === '4' ? '$5M – $10M' :
                       replyingInquiry.netWorth === '5' ? '$10M+' : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-border/50">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-foreground/40 mb-1">Inquiry Message Received</div>
                  <p className="text-xs text-foreground/70 italic bg-card/60 p-3 rounded-lg border-l-2 border-primary">
                    "{replyingInquiry.message}"
                  </p>
                </div>
              </div>

              {/* Reply Subject */}
              <div>
                <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1.5 block">Subject Line</label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={e => setReplySubject(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none transition-colors"
                  placeholder="Subject of the email..."
                />
              </div>

              {/* Reply Body */}
              <div>
                <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1.5 block">Response Message</label>
                <textarea
                  rows={8}
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none transition-colors resize-y leading-relaxed font-sans"
                  placeholder="Type your official response..."
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-border bg-background/50 flex justify-between items-center gap-3">
              <button
                onClick={() => setReplyingInquiry(null)}
                className="px-4 py-2 bg-foreground/10 text-foreground font-bold rounded-xl hover:bg-foreground/20 transition-colors text-sm flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Move Back</span>
              </button>
              <button
                onClick={handleSendReply}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 text-sm"
              >
                <Send size={15} />
                <span>Send Email Reply</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Thread / Full Message Details Modal */}
      {viewingThreadInquiry && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setViewingThreadInquiry(null); }}
        >
          <div className="bg-card border border-border w-full max-w-xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 sm:p-6 border-b border-border bg-background/50 flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <button
                  id="view-thread-back-btn"
                  onClick={() => setViewingThreadInquiry(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-background text-foreground border border-border hover:border-primary/50 transition-colors shadow-sm"
                  title="Move back"
                >
                  <ArrowLeft size={15} />
                  <span>Move Back</span>
                </button>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">Inquiry Details & History</h2>
                  <p className="text-xs text-foreground/50">From {viewingThreadInquiry.name} ({viewingThreadInquiry.email})</p>
                </div>
              </div>
              <button onClick={() => setViewingThreadInquiry(null)} className="text-foreground/50 hover:text-foreground">
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-background/50 p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-foreground/70">Original Inquiry</span>
                  <span className="text-xs font-mono text-foreground/40">{new Date(viewingThreadInquiry.date).toLocaleString()}</span>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                  {viewingThreadInquiry.message}
                </p>
              </div>

              {viewingThreadInquiry.replyMessage && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CornerDownRight size={13} />
                      <span>Admin Reply Dispatched</span>
                    </span>
                    {viewingThreadInquiry.repliedAt && (
                      <span className="text-xs font-mono text-foreground/40">{new Date(viewingThreadInquiry.repliedAt).toLocaleString()}</span>
                    )}
                  </div>
                  {viewingThreadInquiry.replySubject && (
                    <div className="text-xs font-semibold text-foreground/80 mb-2">
                      Subject: {viewingThreadInquiry.replySubject}
                    </div>
                  )}
                  <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed bg-background/60 p-3 rounded-lg border border-border/40">
                    {viewingThreadInquiry.replyMessage}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-border bg-background/50 flex justify-between items-center gap-3">
              <button
                onClick={() => setViewingThreadInquiry(null)}
                className="px-4 py-2 bg-foreground/10 text-foreground text-xs font-bold rounded-xl hover:bg-foreground/20 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Move Back</span>
              </button>

              <button
                onClick={() => {
                  const inq = viewingThreadInquiry;
                  setViewingThreadInquiry(null);
                  handleOpenReply(inq);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Mail size={14} />
                <span>{viewingThreadInquiry.replyMessage ? 'Send Follow-up Reply' : 'Reply to Prospect'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmInquiry && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirmInquiry(null); }}
        >
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">Delete Inquiry?</h3>
              <p className="text-sm text-foreground/60">
                Are you sure you want to permanently delete the inquiry from <span className="font-bold text-foreground">{deleteConfirmInquiry.name}</span> ({deleteConfirmInquiry.email})?
              </p>
              <p className="text-xs text-rose-400 font-medium">This action cannot be undone.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmInquiry(null)}
                className="flex-1 py-2.5 bg-foreground/10 text-foreground font-bold rounded-xl hover:bg-foreground/20 transition-colors text-sm flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Move Back</span>
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-rose-600/20"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export function AdminInvestors() {
  const { 
    adminSettings, updateAdminSettings, investments, createInvestment, 
    updateInvestment, deleteInvestment, updateBalance, users, adminUpdateUser, 
    createTransaction, cryptoWithdrawals, approveCryptoWithdrawal, rejectCryptoWithdrawal,
    cryptoOrders, approveCryptoTradeOrder, rejectCryptoTradeOrder, adminAdjustInvestmentDuration
  } = useBank();
  
  const [brokerWalletsForm, setBrokerWalletsForm] = useState(adminSettings.brokerWallets || DEFAULT_BROKER_WALLETS);

  useEffect(() => {
    if (adminSettings.brokerWallets) {
      setBrokerWalletsForm(adminSettings.brokerWallets);
    }
  }, [adminSettings.brokerWallets]);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeDropdownInvId, setActiveDropdownInvId] = useState<string | null>(null);
  
  // Tabs & Section Navigation
  const [adminSectionTab, setAdminSectionTab] = useState<'investments' | 'trade_orders' | 'withdrawals'>('investments');
  const [withdrawalSearch, setWithdrawalSearch] = useState('');
  const [withdrawalStatus, setWithdrawalStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReceiptWithdrawal, setSelectedReceiptWithdrawal] = useState<CryptoWithdrawalRequest | null>(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<CryptoTradeOrder | null>(null);
  const [tradeOrderSearch, setTradeOrderSearch] = useState('');
  const [tradeOrderStatusFilter, setTradeOrderStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [maxWithdrawalLimitInput, setMaxWithdrawalLimitInput] = useState<string>(String(adminSettings.maxCryptoWithdrawalLimit || 25000));
  const [limitSaveStatus, setLimitSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Search & Filter for Investments
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'matured' | 'withdrawn'>('all');

  // Modals for Admin Discretionary Withdrawal Approval & Amount Modification
  const [payoutApprovalModal, setPayoutApprovalModal] = useState<{
    withdrawal: CryptoWithdrawalRequest;
    approvedAmount: string;
    approvedCryptoAmount: string;
    customTxHash: string;
    adminNotes: string;
  } | null>(null);

  // Modal for Admin Fixed Duration Approval & Principal Lockup Adjustment
  const [durationAdjustModal, setDurationAdjustModal] = useState<{
    inv: any;
    newDuration: number;
    adminNotes: string;
  } | null>(null);

  // Modals
  const [matureModal, setMatureModal] = useState<{ inv: any; profit: string; destination: '1' | '2' } | null>(null);
  const [walletActionModal, setWalletActionModal] = useState<{
    type: 'credit' | 'debit';
    userId: string;
    invId?: string;
    accountId: string;
    walletType: 'fiat' | 'crypto';
    amount: string;
    currency: string;
    reason: string;
  } | null>(null);
  const [editInvModal, setEditInvModal] = useState<{
    id: string;
    userId: string;
    amount: string;
    currency: string;
    durationDays: string;
    txHash: string;
    status: 'pending' | 'active' | 'matured' | 'withdrawn';
    profit: string;
  } | null>(null);
  const [deleteInvConfirm, setDeleteInvConfirm] = useState<any | null>(null);
  const [isAddInvModalOpen, setIsAddInvModalOpen] = useState(false);
  const [addInvForm, setAddInvForm] = useState({
    userId: users.find(u => u.role !== 'admin')?.id || '',
    amount: '5000',
    currency: 'USDT',
    durationDays: '30',
    txHash: '',
    status: 'active' as 'pending' | 'active' | 'matured' | 'withdrawn',
    profit: '0'
  });

  const nonAdminUsers = users.filter(u => u.role !== 'admin').length > 0
    ? users.filter(u => u.role !== 'admin')
    : users;

  const filteredInvestments = investments.filter(inv => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const user = users.find(u => u.id === inv.userId);
    const userName = user?.name?.toLowerCase() || '';
    const userEmail = user?.email?.toLowerCase() || '';
    const invId = inv.id?.toLowerCase() || '';
    const userId = inv.userId?.toLowerCase() || '';
    const curr = inv.currency?.toLowerCase() || '';
    const tx = inv.txHash?.toLowerCase() || '';
    return (
      userName.includes(term) ||
      userEmail.includes(term) ||
      invId.includes(term) ||
      userId.includes(term) ||
      curr.includes(term) ||
      tx.includes(term)
    );
  });

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[id^="action-dropdown-wrapper-"]')) {
        setActiveDropdownInvId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (adminSettings.brokerWallets) {
      setBrokerWalletsForm(adminSettings.brokerWallets);
    }
  }, [adminSettings.brokerWallets]);
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveBrokerWallets = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSaveStatus('saving');
    
    // Save to centralized store state
    updateAdminSettings({ brokerWallets: { ...brokerWalletsForm } });
    
    // Also save directly to localStorage to guarantee immediate cross-tab sync
    try {
      const stored = localStorage.getItem('bank_adminSettings');
      const parsed = stored ? JSON.parse(stored) : {};
      localStorage.setItem('bank_adminSettings', JSON.stringify({
        ...parsed,
        brokerWallets: { ...brokerWalletsForm }
      }));
    } catch (err) {
      console.error('LocalStorage save error:', err);
    }

    setTimeout(() => {
      setSaveStatus('saved');
      showToast('Crypto Wallets saved and updated successfully!');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }, 300);
  };

  const handleApproveInvestment = (invId: string) => {
    updateInvestment(invId, { status: 'active' });
    showToast('Investment approved and set to Active.');
  };
  
  const handleRejectInvestment = (invId: string) => {
    updateInvestment(invId, { status: 'withdrawn' });
    showToast('Investment cancelled.');
  };

  const handleExecuteMature = () => {
    if (!matureModal) return;
    const { inv, profit, destination } = matureModal;
    const profitAmount = Number(profit) || 0;
    const totalPayout = inv.amount + profitAmount;

    if (destination === '1') {
      const user = users.find(u => u.id === inv.userId);
      if (user && user.accounts.length > 0) {
        updateBalance(inv.userId, user.accounts[0].id, totalPayout);
        createTransaction({
          userId: inv.userId,
          accountId: user.accounts[0].id,
          amount: totalPayout,
          type: 'deposit',
          description: `Investment Return Matured (Principal: $${inv.amount.toLocaleString()} + Profit: $${profitAmount.toLocaleString()})`,
          status: 'completed'
        });
        updateInvestment(inv.id, { status: 'matured', profit: profitAmount });
        showToast(`Matured: $${totalPayout.toLocaleString()} credited to client fiat bank account.`);
      } else {
        showToast('Client has no active bank account to credit.');
      }
    } else if (destination === '2') {
      const user = users.find(u => u.id === inv.userId);
      if (user) {
        const currentBal = user.investorWallets?.balance || 0;
        adminUpdateUser(inv.userId, { 
          investorWallets: { ...user.investorWallets, balance: currentBal + totalPayout } as any
        });
        createTransaction({
          userId: inv.userId,
          accountId: 'crypto-wallet',
          amount: totalPayout,
          type: 'crypto_deposit' as any,
          description: `GEB Investor Crypto Wallet Return (Principal: $${inv.amount.toLocaleString()} + Profit: $${profitAmount.toLocaleString()})`,
          status: 'completed'
        });
        updateInvestment(inv.id, { status: 'matured', profit: profitAmount });
        showToast(`Matured: $${totalPayout.toLocaleString()} credited to Investor Crypto Wallet balance.`);
      }
    }
    setMatureModal(null);
  };

  // Open Wallet Action Modal (Credit / Debit)
  const handleOpenWalletModal = (type: 'credit' | 'debit', inv?: any, preselectedUserId?: string) => {
    const targetUserId = inv ? inv.userId : (preselectedUserId || users.find(u => u.role !== 'admin')?.id || '');
    const user = users.find(u => u.id === targetUserId);
    const defaultAccountId = user?.accounts?.[0]?.id || '';

    setWalletActionModal({
      type,
      userId: targetUserId,
      invId: inv?.id,
      accountId: defaultAccountId,
      walletType: 'crypto',
      amount: inv ? (type === 'credit' ? '1000' : '500') : '1000',
      currency: inv?.currency || 'USDT',
      reason: inv 
        ? `${type === 'credit' ? 'Investment Wallet Credit' : 'Investment Wallet Debit'} - Ref: ${inv.id}`
        : `Admin Direct Wallet ${type === 'credit' ? 'Credit' : 'Debit'}`
    });
  };

  // Execute Credit or Debit
  const handleExecuteWalletAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletActionModal) return;

    const { type, userId, accountId, walletType, amount, currency, reason } = walletActionModal;
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid amount greater than 0.');
      return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      showToast('User not found.');
      return;
    }

    if (walletType === 'fiat') {
      if (!accountId) {
        showToast('Please select a valid user bank account.');
        return;
      }
      const acc = user.accounts.find(a => a.id === accountId);
      if (!acc) {
        showToast('Bank account not found.');
        return;
      }

      if (type === 'credit') {
        updateBalance(userId, accountId, numAmount);
        createTransaction({
          userId,
          accountId,
          amount: numAmount,
          type: 'deposit',
          description: reason || `Admin Fiat Credit (${currency})`,
          status: 'completed'
        });
        showToast(`Successfully credited $${numAmount.toLocaleString()} to ${user.name}'s ${acc.type} account.`);
      } else {
        updateBalance(userId, accountId, -numAmount);
        createTransaction({
          userId,
          accountId,
          amount: numAmount,
          type: 'withdrawal',
          description: reason || `Admin Fiat Debit (${currency})`,
          status: 'completed'
        });
        showToast(`Successfully debited $${numAmount.toLocaleString()} from ${user.name}'s ${acc.type} account.`);
      }
    } else {
      // Investor Crypto Wallet (Segregated digital assets, strictly isolated from fiat bank accounts)
      const currentBal = user.investorWallets?.balance || 0;
      const targetAccId = 'crypto-wallet';

      if (type === 'credit') {
        const newBal = currentBal + numAmount;
        adminUpdateUser(userId, {
          investorWallets: {
            ...user.investorWallets,
            balance: newBal
          } as any
        });
        createTransaction({
          userId,
          accountId: targetAccId,
          amount: numAmount,
          type: 'crypto_deposit' as any,
          description: reason || `Investor Crypto Wallet Credit (${currency})`,
          status: 'completed'
        });
        showToast(`Successfully credited $${numAmount.toLocaleString()} to ${user.name}'s Crypto Wallet balance.`);
      } else {
        const newBal = Math.max(0, currentBal - numAmount);
        adminUpdateUser(userId, {
          investorWallets: {
            ...user.investorWallets,
            balance: newBal
          } as any
        });
        createTransaction({
          userId,
          accountId: targetAccId,
          amount: numAmount,
          type: 'crypto_withdrawal' as any,
          description: reason || `Investor Crypto Wallet Debit (${currency})`,
          status: 'completed'
        });
        showToast(`Successfully debited $${numAmount.toLocaleString()} from ${user.name}'s Crypto Wallet balance.`);
      }
    }

    setWalletActionModal(null);
  };

  // Open Edit Investment Modal
  const handleOpenEditModal = (inv: any) => {
    setEditInvModal({
      id: inv.id,
      userId: inv.userId,
      amount: String(inv.amount),
      currency: inv.currency,
      durationDays: String(inv.durationDays),
      txHash: inv.txHash || '',
      status: inv.status,
      profit: String(inv.profit || 0)
    });
  };

  // Save Edited Investment
  const handleSaveEditModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInvModal) return;

    const numAmount = parseFloat(editInvModal.amount) || 0;
    const numDays = parseInt(editInvModal.durationDays) || 30;
    const numProfit = parseFloat(editInvModal.profit) || 0;

    updateInvestment(editInvModal.id, {
      amount: numAmount,
      currency: editInvModal.currency,
      durationDays: numDays,
      txHash: editInvModal.txHash,
      status: editInvModal.status,
      profit: numProfit
    });

    showToast('Investment details successfully updated.');
    setEditInvModal(null);
  };

  // Create New Investment
  const handleCreateInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(addInvForm.amount) || 0;
    const numDays = parseInt(addInvForm.durationDays) || 30;
    const numProfit = parseFloat(addInvForm.profit) || 0;

    if (!addInvForm.userId) {
      showToast('Please select a client.');
      return;
    }

    const generatedTx = addInvForm.txHash.trim() || `0x${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;

    createInvestment({
      userId: addInvForm.userId,
      amount: numAmount,
      currency: addInvForm.currency,
      durationDays: numDays,
      txHash: generatedTx,
      status: addInvForm.status,
      profit: numProfit
    });

    showToast('New investment record successfully created.');
    setIsAddInvModalOpen(false);
  };

  // Delete Investment
  const handleExecuteDelete = () => {
    if (!deleteInvConfirm) return;
    deleteInvestment(deleteInvConfirm.id);
    showToast(`Investment record ${deleteInvConfirm.id} deleted.`);
    setDeleteInvConfirm(null);
  };

  // Seed sample investments if table is empty
  const handleSeedDefaultInvestments = () => {
    const primaryClient = users.find(u => u.role !== 'admin') || users[0];
    if (!primaryClient) return;

    createInvestment({
      userId: primaryClient.id,
      amount: 125000,
      currency: 'USDT',
      durationDays: 30,
      status: 'active',
      txHash: '0x8f2a9c4b1d6e3f5a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
      profit: 4200
    });

    createInvestment({
      userId: primaryClient.id,
      amount: 2.5,
      currency: 'BTC',
      durationDays: 14,
      status: 'pending',
      txHash: 'bc1q8a9f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
      profit: 0
    });

    createInvestment({
      userId: primaryClient.id,
      amount: 50000,
      currency: 'USDT',
      durationDays: 7,
      status: 'matured',
      txHash: '0x3c5a7b9d1e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4',
      profit: 1750
    });

    showToast('Loaded 3 sample investments for immediate management.');
  };

  // Save Withdrawal Limit Policy
  const handleSaveMaxWithdrawalLimit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseFloat(maxWithdrawalLimitInput);
    if (isNaN(val) || val <= 0) {
      showToast('Please enter a valid positive withdrawal limit in USD.');
      return;
    }
    setLimitSaveStatus('saving');
    updateAdminSettings({ maxCryptoWithdrawalLimit: val });
    setTimeout(() => {
      setLimitSaveStatus('saved');
      showToast(`Crypto withdrawal cap successfully locked at $${val.toLocaleString()} USD.`);
      setTimeout(() => setLimitSaveStatus('idle'), 2500);
    }, 400);
  };

  // Discretionary Payout Approval with Amount Modification
  const openPayoutApprovalModal = (w: CryptoWithdrawalRequest) => {
    setPayoutApprovalModal({
      withdrawal: w,
      approvedAmount: String(w.amount),
      approvedCryptoAmount: String(w.cryptoAmount),
      customTxHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      adminNotes: `Approved by Compliance Officer & Treasury Desk. Payout credited to client receiving wallet.`
    });
  };

  const handleConfirmPayoutApproval = () => {
    if (!payoutApprovalModal) return;
    const { withdrawal, approvedAmount, approvedCryptoAmount, customTxHash, adminNotes } = payoutApprovalModal;
    const numAmt = parseFloat(approvedAmount);
    if (isNaN(numAmt) || numAmt <= 0) {
      showToast('Please specify a valid approved payout amount.');
      return;
    }
    const numCrypto = parseFloat(approvedCryptoAmount) || withdrawal.cryptoAmount;

    const approved = approveCryptoWithdrawal(withdrawal.id, {
      approvedAmount: numAmt,
      approvedCryptoAmount: numCrypto,
      customTxHash,
      adminNotes,
      approvedBy: 'Chief Risk Officer & Compliance Treasury Desk'
    });

    setPayoutApprovalModal(null);
    if (approved) {
      setSelectedReceiptWithdrawal(approved);
      showToast(`Withdrawal approved for $${numAmt.toLocaleString()} USD and credited to user's wallet!`);
    }
  };

  // Fixed Duration Approval & Principal Lockup
  const openDurationAdjustModal = (inv: any) => {
    setDurationAdjustModal({
      inv,
      newDuration: inv.durationDays || 30,
      adminNotes: inv.adminNotes || `Fixed duration of ${inv.durationDays || 30} days approved by Administrator. Principal locked until maturity.`
    });
  };

  const handleConfirmDurationAdjustment = () => {
    if (!durationAdjustModal) return;
    const { inv, newDuration, adminNotes } = durationAdjustModal;
    if (!newDuration || newDuration <= 0) {
      showToast('Please specify a valid duration in days.');
      return;
    }
    adminAdjustInvestmentDuration(inv.id, newDuration, adminNotes);
    setDurationAdjustModal(null);
    showToast(`Fixed duration set to ${newDuration} days (Principal Locked). Approved by Admin.`);
  };

  // Quick Approve Withdrawal Request & issue receipt
  const handleApproveWithdrawalRequest = (withdrawalId: string) => {
    const w = cryptoWithdrawals.find(item => item.id === withdrawalId);
    if (w) {
      openPayoutApprovalModal(w);
      return;
    }
    const approved = approveCryptoWithdrawal(withdrawalId, { approvedBy: 'Chief Risk Officer & Compliance Admin' });
    if (approved) {
      setSelectedReceiptWithdrawal(approved);
      showToast(`Withdrawal approved! Official receipt ${approved.receiptNumber} minted.`);
    }
  };

  // Reject Withdrawal Request
  const handleRejectWithdrawalRequest = (withdrawalId: string) => {
    rejectCryptoWithdrawal(withdrawalId, 'Policy limit reached or AML verification required');
    showToast('Withdrawal request rejected.');
  };

  // Filtered Withdrawals
  const filteredWithdrawals = cryptoWithdrawals.filter(w => {
    if (withdrawalStatus !== 'all' && w.status !== withdrawalStatus) return false;
    if (withdrawalSearch.trim()) {
      const q = withdrawalSearch.toLowerCase();
      const user = users.find(u => u.id === w.userId);
      return (
        (w.receiptNumber && w.receiptNumber.toLowerCase().includes(q)) ||
        (w.walletAddress && w.walletAddress.toLowerCase().includes(q)) ||
        (w.currency && w.currency.toLowerCase().includes(q)) ||
        (w.network && w.network.toLowerCase().includes(q)) ||
        (user?.name && user.name.toLowerCase().includes(q)) ||
        (user?.email && user.email.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingWithdrawalsCount = cryptoWithdrawals.filter(w => w.status === 'pending').length;

  // Filtered Crypto Trade Orders (Buy / Sell)
  const filteredTradeOrders = cryptoOrders.filter(order => {
    if (tradeOrderStatusFilter !== 'all' && order.status !== tradeOrderStatusFilter) return false;
    if (tradeOrderSearch.trim()) {
      const q = tradeOrderSearch.toLowerCase();
      const user = users.find(u => u.id === order.userId);
      return (
        order.id.toLowerCase().includes(q) ||
        order.cryptoCurrency.toLowerCase().includes(q) ||
        order.orderType.toLowerCase().includes(q) ||
        (user?.name && user.name.toLowerCase().includes(q)) ||
        (user?.email && user.email.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingTradeOrdersCount = cryptoOrders.filter(o => o.status === 'pending').length;

  const handleApproveTradeOrder = (orderId: string) => {
    const approved = approveCryptoTradeOrder(orderId, { approvedBy: 'Chief Risk Officer & Treasury Desk' });
    if (approved) {
      setSelectedReceiptOrder(approved);
      showToast(`Trade order approved! Settled into client portfolio.`);
    }
  };

  const handleRejectTradeOrder = (orderId: string) => {
    rejectCryptoTradeOrder(orderId, 'Disapproved by Administrator / Compliance Check');
    showToast('Crypto trade order rejected.');
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-sm animate-in fade-in slide-in-from-top-4">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Broker Wallets Settings with Live QR Code Preview */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Wallet className="text-primary" size={20} />
              Global Elite Bank Broker Crypto Wallets
            </h3>
            <p className="text-sm text-foreground/60 mt-0.5">Configure official cryptocurrency deposit addresses (BTC, ETH, USDT, SOL). QR codes are generated dynamically and displayed across client investor portals.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground/50 font-mono">Status:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live & Ready
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveBrokerWallets} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BTC */}
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-20 h-20 shrink-0 bg-white p-1 rounded-lg border border-border flex items-center justify-center shadow-xs overflow-hidden">
                {brokerWalletsForm.btcQr ? (
                  <img 
                    src={brokerWalletsForm.btcQr} 
                    alt="BTC QR Code" 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer" 
                  />
                ) : brokerWalletsForm.btc ? (
                  <QRCodeSVG value={brokerWalletsForm.btc} size={64} level="M" />
                ) : (
                  <span className="text-[10px] text-gray-400 font-mono text-center">No Address</span>
                )}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest">BTC Wallet (Native SegWit)</label>
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">BTC</span>
                </div>
                <input 
                  type="text" 
                  value={brokerWalletsForm.btc || ""} 
                  onChange={e => setBrokerWalletsForm({...brokerWalletsForm, btc: e.target.value})} 
                  className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs mb-2" 
                  placeholder="e.g. bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" 
                />
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
                    <QrCode size={11} /> BTC QR Code Image URL
                  </label>
                  {brokerWalletsForm.btcQr && (
                    <span className="text-[10px] text-emerald-500 font-medium">Image Linked</span>
                  )}
                </div>
                <input 
                  type="text" 
                  value={brokerWalletsForm.btcQr || ""} 
                  onChange={e => setBrokerWalletsForm({...brokerWalletsForm, btcQr: e.target.value})} 
                  className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs" 
                  placeholder="e.g. https://i.ibb.co/6cJsKgVv/Bitcoin.jpg" 
                />
              </div>
            </div>

            {/* ETH */}
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-20 h-20 shrink-0 bg-white p-1 rounded-lg border border-border flex items-center justify-center shadow-xs overflow-hidden">
                {brokerWalletsForm.ethQr ? (
                  <img 
                    src={brokerWalletsForm.ethQr} 
                    alt="ETH QR Code" 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer" 
                  />
                ) : brokerWalletsForm.eth ? (
                  <QRCodeSVG value={brokerWalletsForm.eth} size={64} level="M" />
                ) : (
                  <span className="text-[10px] text-gray-400 font-mono text-center">No Address</span>
                )}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest">ETH Wallet (ERC-20)</label>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">ERC-20</span>
                </div>
                <input 
                  type="text" 
                  value={brokerWalletsForm.eth || ""} 
                  onChange={e => setBrokerWalletsForm({...brokerWalletsForm, eth: e.target.value})} 
                  className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs mb-2" 
                  placeholder="e.g. 0x71C8705E311e2fE25E5b4c10a424eB7853f09072" 
                />
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
                    <QrCode size={11} /> ETH QR Code Image URL
                  </label>
                  {brokerWalletsForm.ethQr && (
                    <span className="text-[10px] text-emerald-500 font-medium">Image Linked</span>
                  )}
                </div>
                <input 
                  type="text" 
                  value={brokerWalletsForm.ethQr || ""} 
                  onChange={e => setBrokerWalletsForm({...brokerWalletsForm, ethQr: e.target.value})} 
                  className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs" 
                  placeholder="e.g. https://i.ibb.co/yc1zKHbx/Ethereum.jpg" 
                />
              </div>
            </div>

            {/* USDT */}
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-20 h-20 shrink-0 bg-white p-1 rounded-lg border border-border flex items-center justify-center shadow-xs overflow-hidden">
                {brokerWalletsForm.usdtQr ? (
                  <img 
                    src={brokerWalletsForm.usdtQr} 
                    alt="USDT TRC-20 QR Code" 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer" 
                  />
                ) : brokerWalletsForm.usdt ? (
                  <QRCodeSVG value={brokerWalletsForm.usdt} size={64} level="M" />
                ) : (
                  <span className="text-[10px] text-gray-400 font-mono text-center">No Address</span>
                )}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest">USDT Wallet (TRC-20)</label>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">TRC-20</span>
                </div>
                <input 
                  type="text" 
                  value={brokerWalletsForm.usdt || ""} 
                  onChange={e => setBrokerWalletsForm({...brokerWalletsForm, usdt: e.target.value})} 
                  className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs mb-2" 
                  placeholder="e.g. TYDzsYUE3b6WSo8rZV83JRNURNmr57qJp8" 
                />
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
                    <QrCode size={11} /> USDT QR Code Image URL
                  </label>
                  {brokerWalletsForm.usdtQr && (
                    <span className="text-[10px] text-emerald-500 font-medium">Image Linked</span>
                  )}
                </div>
                <input 
                  type="text" 
                  value={brokerWalletsForm.usdtQr || ""} 
                  onChange={e => setBrokerWalletsForm({...brokerWalletsForm, usdtQr: e.target.value})} 
                  className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs" 
                  placeholder="e.g. https://i.ibb.co/JWfyTtm6/USDT-TRC-20.jpg" 
                />
              </div>
            </div>

            {/* SOL */}
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-20 h-20 shrink-0 bg-white p-1 rounded-lg border border-border flex items-center justify-center shadow-xs overflow-hidden">
                {brokerWalletsForm.solQr ? (
                  <img 
                    src={brokerWalletsForm.solQr} 
                    alt="Solana QR Code" 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer" 
                  />
                ) : brokerWalletsForm.sol ? (
                  <QRCodeSVG value={brokerWalletsForm.sol} size={64} level="M" />
                ) : (
                  <span className="text-[10px] text-gray-400 font-mono text-center">No Address</span>
                )}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest">SOL Wallet (Solana SPL)</label>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded-full border border-purple-500/20">SPL</span>
                </div>
                <input 
                  type="text" 
                  value={brokerWalletsForm.sol || ""} 
                  onChange={e => setBrokerWalletsForm({...brokerWalletsForm, sol: e.target.value})} 
                  className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs mb-2" 
                  placeholder="e.g. 7EYnhQoR9YM3N7UoaKRoA44BW8PYJuYYU2nu23UocSQM" 
                />
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
                    <QrCode size={11} /> SOL QR Code Image URL
                  </label>
                  {brokerWalletsForm.solQr && (
                    <span className="text-[10px] text-emerald-500 font-medium">Image Linked</span>
                  )}
                </div>
                <input 
                  type="text" 
                  value={brokerWalletsForm.solQr || ""} 
                  onChange={e => setBrokerWalletsForm({...brokerWalletsForm, solQr: e.target.value})} 
                  className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs" 
                  placeholder="e.g. https://i.ibb.co/nN1vjV2c/Solana.jpg" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              id="save-crypto-wallets-btn"
              type="button" 
              onClick={handleSaveBrokerWallets}
              disabled={saveStatus === 'saving'}
              className={`relative z-10 flex items-center gap-2.5 font-bold py-3 px-8 rounded-xl transition-all shadow-md text-sm cursor-pointer select-none active:scale-95 ${
                saveStatus === 'saved'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
                  : saveStatus === 'saving'
                  ? 'bg-primary/70 text-white cursor-wait'
                  : 'bg-primary text-white hover:bg-primary/90 hover:shadow-primary/25'
              }`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Crypto Wallets...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check size={18} className="text-white" />
                  <span>Crypto Wallets Saved!</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Crypto Wallets</span>
                </>
              )}
            </button>

            {saveStatus === 'saved' && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle size={14} /> Saved & Synced Across System
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Mature / Payout Modal */}
      {matureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" /> Mature Investment & Process Payout
              </h4>
              <button 
                type="button"
                onClick={() => setMatureModal(null)} 
                className="text-foreground/50 hover:text-foreground text-sm p-1 rounded-lg hover:bg-foreground/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-background rounded-xl border border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Investment ID:</span>
                  <span className="font-mono font-bold text-foreground">{matureModal.inv.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Principal Amount:</span>
                  <span className="font-bold text-foreground">{matureModal.inv.amount.toLocaleString()} {matureModal.inv.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Duration:</span>
                  <span className="font-bold text-foreground">{matureModal.inv.durationDays} Days</span>
                </div>
              </div>

              <div>
                <label className="block text-foreground/70 font-bold mb-1">Accrued Profit / ROI to Add ({matureModal.inv.currency})</label>
                <input 
                  type="number" 
                  value={matureModal.profit} 
                  onChange={e => setMatureModal({ ...matureModal, profit: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-primary outline-none font-bold text-foreground"
                  placeholder="0.00"
                />
                <p className="text-[11px] text-foreground/50 mt-1">Total payout will be ${(matureModal.inv.amount + (Number(matureModal.profit) || 0)).toLocaleString()}.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-foreground/70 font-bold">Disbursement Destination</label>
                
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${matureModal.destination === '1' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}>
                  <input 
                    type="radio" 
                    name="dest" 
                    checked={matureModal.destination === '1'} 
                    onChange={() => setMatureModal({ ...matureModal, destination: '1' })}
                    className="text-primary"
                  />
                  <div>
                    <div className="text-xs font-bold text-foreground">User Primary Fiat Account</div>
                    <div className="text-[11px] text-foreground/50">Credit principal + profit directly to user's main checking account</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${matureModal.destination === '2' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}>
                  <input 
                    type="radio" 
                    name="dest" 
                    checked={matureModal.destination === '2'} 
                    onChange={() => setMatureModal({ ...matureModal, destination: '2' })}
                    className="text-primary"
                  />
                  <div>
                    <div className="text-xs font-bold text-foreground">GEB Investor Crypto Wallet Balance</div>
                    <div className="text-[11px] text-foreground/50">Credit to user's investor crypto balance for reinvestment or withdrawal</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setMatureModal(null)}
                className="flex-1 py-2.5 border border-border text-foreground font-bold rounded-xl hover:bg-foreground/5 text-xs transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleExecuteMature}
                className="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 text-xs transition-colors shadow-md"
              >
                Confirm Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credit / Debit User Wallet Modal */}
      {walletActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                {walletActionModal.type === 'credit' ? (
                  <>
                    <ArrowDownLeft size={20} className="text-emerald-500" />
                    <span>Credit User Wallet / Balance</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight size={20} className="text-rose-500" />
                    <span>Debit User Wallet / Balance</span>
                  </>
                )}
              </h4>
              <button 
                type="button"
                onClick={() => setWalletActionModal(null)} 
                className="text-foreground/50 hover:text-foreground text-sm p-1 rounded-lg hover:bg-foreground/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleExecuteWalletAction} className="space-y-4">
              {/* Target User */}
              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Target Client</label>
                <select
                  value={walletActionModal.userId}
                  onChange={e => {
                    const selectedUser = users.find(u => u.id === e.target.value);
                    setWalletActionModal({
                      ...walletActionModal,
                      userId: e.target.value,
                      accountId: selectedUser?.accounts?.[0]?.id || ''
                    });
                  }}
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-primary outline-none font-bold text-foreground"
                >
                  {nonAdminUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) - ID: {u.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Wallet Type Selection */}
              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Select Wallet To {walletActionModal.type === 'credit' ? 'Credit' : 'Debit'}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWalletActionModal({ ...walletActionModal, walletType: 'crypto' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      walletActionModal.walletType === 'crypto'
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-background hover:bg-foreground/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">Investor Crypto Wallet</span>
                      <Coins size={14} className="text-primary" />
                    </div>
                    <div className="text-[11px] text-foreground/50">
                      Balance: <span className="font-bold text-foreground">${((users.find(u => u.id === walletActionModal.userId)?.investorWallets?.balance) || 0).toLocaleString()}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWalletActionModal({ ...walletActionModal, walletType: 'fiat' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      walletActionModal.walletType === 'fiat'
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-background hover:bg-foreground/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">Fiat Bank Account</span>
                      <CreditCard size={14} className="text-primary" />
                    </div>
                    <div className="text-[11px] text-foreground/50">
                      Primary Account Balance
                    </div>
                  </button>
                </div>
              </div>

              {/* Fiat Bank Account Picker if fiat selected */}
              {walletActionModal.walletType === 'fiat' && (
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Specific Bank Account</label>
                  <select
                    value={walletActionModal.accountId}
                    onChange={e => setWalletActionModal({ ...walletActionModal, accountId: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-primary outline-none font-bold text-foreground"
                  >
                    {users.find(u => u.id === walletActionModal.userId)?.accounts?.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.type} (#{acc.accountNumber}) - Balance: ${acc.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Amount and Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Amount</label>
                  <input
                    type="number"
                    step="any"
                    value={walletActionModal.amount}
                    onChange={e => setWalletActionModal({ ...walletActionModal, amount: e.target.value })}
                    required
                    placeholder="0.00"
                    className="w-full bg-background border border-border rounded-xl p-3 text-base focus:border-primary outline-none font-bold text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Currency</label>
                  <select
                    value={walletActionModal.currency}
                    onChange={e => setWalletActionModal({ ...walletActionModal, currency: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-primary outline-none font-bold text-foreground"
                  >
                    <option value="USDT">USDT</option>
                    <option value="USD">USD</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                  </select>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2">
                {['250', '500', '1000', '5000', '25000'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setWalletActionModal({ ...walletActionModal, amount: val })}
                    className="flex-1 py-1.5 bg-background border border-border rounded-lg text-xs font-bold text-foreground/70 hover:text-foreground hover:border-primary transition-colors"
                  >
                    ${Number(val).toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Reason / Reference Memo */}
              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Description / Memo</label>
                <input
                  type="text"
                  value={walletActionModal.reason}
                  onChange={e => setWalletActionModal({ ...walletActionModal, reason: e.target.value })}
                  placeholder="e.g. Investment yield credit, admin capital adjustment"
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs focus:border-primary outline-none text-foreground"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWalletActionModal(null)}
                  className="flex-1 py-2.5 border border-border text-foreground font-bold rounded-xl hover:bg-foreground/5 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 font-bold rounded-xl text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                    walletActionModal.type === 'credit'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                  }`}
                >
                  {walletActionModal.type === 'credit' ? (
                    <>
                      <ArrowDownLeft size={16} />
                      <span>Execute Credit</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight size={16} />
                      <span>Execute Debit</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Investment Modal */}
      {editInvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                <Edit size={18} className="text-blue-500" /> Edit Investment Record
              </h4>
              <button 
                type="button"
                onClick={() => setEditInvModal(null)} 
                className="text-foreground/50 hover:text-foreground text-sm p-1 rounded-lg hover:bg-foreground/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Amount</label>
                  <input
                    type="number"
                    step="any"
                    value={editInvModal.amount}
                    onChange={e => setEditInvModal({ ...editInvModal, amount: e.target.value })}
                    required
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Currency</label>
                  <select
                    value={editInvModal.currency}
                    onChange={e => setEditInvModal({ ...editInvModal, currency: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-bold text-foreground"
                  >
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Duration (Days)</label>
                  <input
                    type="number"
                    value={editInvModal.durationDays}
                    onChange={e => setEditInvModal({ ...editInvModal, durationDays: e.target.value })}
                    required
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Status</label>
                  <select
                    value={editInvModal.status}
                    onChange={e => setEditInvModal({ ...editInvModal, status: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-bold text-foreground"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="matured">Matured</option>
                    <option value="withdrawn">Withdrawn / Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Profit Accrued</label>
                <input
                  type="number"
                  step="any"
                  value={editInvModal.profit}
                  onChange={e => setEditInvModal({ ...editInvModal, profit: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-bold text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Blockchain Tx Hash</label>
                <input
                  type="text"
                  value={editInvModal.txHash}
                  onChange={e => setEditInvModal({ ...editInvModal, txHash: e.target.value })}
                  placeholder="0x..."
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-xs font-mono text-foreground"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditInvModal(null)}
                  className="flex-1 py-2.5 border border-border text-foreground font-bold rounded-xl hover:bg-foreground/5 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteInvConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle size={24} />
              <h4 className="text-base font-bold text-foreground">Delete Investment Record?</h4>
            </div>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Are you sure you want to permanently delete this investment record (<span className="font-mono font-bold text-foreground">{deleteInvConfirm.id}</span>) for <span className="font-bold text-foreground">{deleteInvConfirm.amount.toLocaleString()} {deleteInvConfirm.currency}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteInvConfirm(null)}
                className="flex-1 py-2.5 border border-border text-foreground font-bold rounded-xl hover:bg-foreground/5 text-xs transition-colors"
              >
                Keep Record
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Trash2 size={15} />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Record New Investment Modal */}
      {isAddInvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                <PlusCircle size={18} className="text-emerald-500" /> Record New Investment
              </h4>
              <button 
                type="button"
                onClick={() => setIsAddInvModalOpen(false)} 
                className="text-foreground/50 hover:text-foreground text-sm p-1 rounded-lg hover:bg-foreground/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvestment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Target Client</label>
                <select
                  value={addInvForm.userId}
                  onChange={e => setAddInvForm({ ...addInvForm, userId: e.target.value })}
                  required
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-bold text-foreground"
                >
                  {nonAdminUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Amount</label>
                  <input
                    type="number"
                    step="any"
                    value={addInvForm.amount}
                    onChange={e => setAddInvForm({ ...addInvForm, amount: e.target.value })}
                    required
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Currency</label>
                  <select
                    value={addInvForm.currency}
                    onChange={e => setAddInvForm({ ...addInvForm, currency: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-bold text-foreground"
                  >
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Duration (Days)</label>
                  <input
                    type="number"
                    value={addInvForm.durationDays}
                    onChange={e => setAddInvForm({ ...addInvForm, durationDays: e.target.value })}
                    required
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Initial Status</label>
                  <select
                    value={addInvForm.status}
                    onChange={e => setAddInvForm({ ...addInvForm, status: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-sm font-bold text-foreground"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="matured">Matured</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5">Blockchain Tx Hash (Optional)</label>
                <input
                  type="text"
                  value={addInvForm.txHash}
                  onChange={e => setAddInvForm({ ...addInvForm, txHash: e.target.value })}
                  placeholder="Auto-generated if left empty"
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-xs font-mono text-foreground"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddInvModalOpen(false)}
                  className="flex-1 py-2.5 border border-border text-foreground font-bold rounded-xl hover:bg-foreground/5 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md"
                >
                  Create Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crypto Withdrawal Maximum Limit Policy Configuration Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Crypto Withdrawal Maximum Limit Policy</h3>
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  Admin Enforced Ceiling
                </span>
              </div>
              <p className="text-xs text-foreground/60 mt-1 max-w-2xl">
                Set the maximum allowable amount (in USD equivalent) that any user can request in a single crypto withdrawal. Requests exceeding this ceiling are blocked automatically at submission time on the user dashboard.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveMaxWithdrawalLimit} className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/50 font-bold text-sm">$</span>
              <input
                type="number"
                min="100"
                step="500"
                value={maxWithdrawalLimitInput}
                onChange={e => setMaxWithdrawalLimitInput(e.target.value)}
                className="w-36 sm:w-44 bg-background border border-border rounded-xl pl-7 pr-3 py-2.5 text-sm font-bold font-mono text-foreground focus:border-primary outline-none"
                placeholder="25000"
              />
            </div>

            <button
              type="submit"
              disabled={limitSaveStatus === 'saving'}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm flex items-center gap-1.5 active:scale-95 ${
                limitSaveStatus === 'saved'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {limitSaveStatus === 'saved' ? (
                <>
                  <Check size={15} />
                  <span>Limit Saved!</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Limit</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Limit Presets */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/60">
          <span className="text-xs font-semibold text-foreground/50 mr-1">Quick Presets:</span>
          {[5000, 10000, 25000, 50000, 100000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setMaxWithdrawalLimitInput(String(preset));
                updateAdminSettings({ maxCryptoWithdrawalLimit: preset });
                showToast(`Withdrawal limit updated to $${preset.toLocaleString()} USD.`);
              }}
              className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                (adminSettings.maxCryptoWithdrawalLimit || 25000) === preset
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-background hover:bg-card border-border text-foreground/70 hover:text-foreground'
              }`}
            >
              ${preset.toLocaleString()}
            </button>
          ))}
          <span className="text-[11px] text-foreground/50 ml-auto">
            Current Active Policy: <strong className="text-foreground">${(adminSettings.maxCryptoWithdrawalLimit || 25000).toLocaleString()} USD</strong>
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setAdminSectionTab('investments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            adminSectionTab === 'investments'
              ? 'bg-primary text-white shadow-sm'
              : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
          }`}
        >
          <Coins size={15} />
          <span>Client Investment Stakes</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            adminSectionTab === 'investments' ? 'bg-white/20 text-white' : 'bg-foreground/10 text-foreground/70'
          }`}>
            {investments.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAdminSectionTab('withdrawals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            adminSectionTab === 'withdrawals'
              ? 'bg-primary text-white shadow-sm'
              : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
          }`}
        >
          <ArrowDownToLine size={15} />
          <span>Withdrawal Requests & Receipts</span>
          {pendingWithdrawalsCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black animate-pulse">
              {pendingWithdrawalsCount} pending
            </span>
          ) : (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              adminSectionTab === 'withdrawals' ? 'bg-white/20 text-white' : 'bg-foreground/10 text-foreground/70'
            }`}>
              {cryptoWithdrawals.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setAdminSectionTab('trade_orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            adminSectionTab === 'trade_orders'
              ? 'bg-primary text-white shadow-sm'
              : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
          }`}
        >
          <TrendingUp size={15} />
          <span>Crypto Trade Orders (Buy / Sell)</span>
          {pendingTradeOrdersCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black animate-pulse">
              {pendingTradeOrdersCount} pending
            </span>
          ) : (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              adminSectionTab === 'trade_orders' ? 'bg-white/20 text-white' : 'bg-foreground/10 text-foreground/70'
            }`}>
              {cryptoOrders.length}
            </span>
          )}
        </button>
      </div>

      {/* View 1: Active & Pending Investments Table */}
      {adminSectionTab === 'investments' && (
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Manage User Investments</h3>
            <p className="text-xs text-foreground/60 mt-0.5">Control client cryptocurrency investments, execute wallet credits and debits, approve deposits, or disburse matured capital.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="direct-wallet-action-btn"
              type="button"
              onClick={() => handleOpenWalletModal('credit')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors shadow-sm"
            >
              <Coins size={15} />
              <span>Credit / Debit Wallet</span>
            </button>

            <button
              id="add-new-investment-btn"
              type="button"
              onClick={() => setIsAddInvModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus size={15} />
              <span>Record Investment</span>
            </button>

            {investments.length === 0 && (
              <button
                type="button"
                onClick={handleSeedDefaultInvestments}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
              >
                <RefreshCw size={14} />
                <span>Load Sample Investments</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 pb-4 border-b border-border/60">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by User ID, Name, Currency, or Tx Hash..."
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:border-primary outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['all', 'pending', 'active', 'matured', 'withdrawn'] as const).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  statusFilter === status
                    ? 'bg-foreground/10 text-foreground border border-foreground/20'
                    : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[220px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-background/50 border-b border-border text-foreground/50 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">User ID</th>
                <th className="px-6 py-4 font-medium">Amount / Curr</th>
                <th className="px-6 py-4 font-medium">Tx Hash</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvestments.map(inv => {
                const user = users.find(u => u.id === inv.userId);
                return (
                  <tr key={inv.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{user?.name || 'Unknown User'}</div>
                      <div className="text-xs text-foreground/60 font-mono">{inv.userId}</div>
                      {user?.email && <div className="text-[11px] text-foreground/40">{user.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground text-sm">
                        {inv.amount.toLocaleString()} {inv.currency}
                      </div>
                      {Boolean(inv.profit && inv.profit > 0) && (
                        <div className="text-[11px] text-emerald-500 font-bold">
                          +${inv.profit?.toLocaleString()} Profit
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-foreground/60 max-w-[150px] truncate" title={inv.txHash}>
                      {inv.txHash || '—'}
                    </td>
                    <td className="px-6 py-4 text-foreground/80">
                      <div className="flex items-center gap-1.5 font-semibold text-sm">
                        <Lock size={13} className="text-amber-500 shrink-0" />
                        <span>{inv.durationDays} days</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] mt-0.5">
                        <span className={`font-bold ${inv.adminApprovedDuration ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {inv.adminApprovedDuration ? '✓ Approved' : '⏳ Pending Approval'}
                        </span>
                        <span className="opacity-40">•</span>
                        <span className="opacity-70 font-mono">Principal Locked</span>
                      </div>
                      {inv.reinvestedFromProfit && (
                        <div className="text-[10px] text-purple-400 font-bold mt-0.5 flex items-center gap-1">
                          <Sparkles size={10} />
                          <span>Reinvested from Profit</span>
                        </div>
                      )}
                      <span className="text-[10px] opacity-70 block mt-0.5">End: {inv.endDate ? new Date(inv.endDate).toLocaleDateString() : 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                        inv.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        inv.status === 'matured' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        inv.status === 'withdrawn' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Manage Button with Dropdown Feature */}
                      <div className="relative inline-block text-left" id={`action-dropdown-wrapper-${inv.id}`}>
                        <button
                          id={`manage-inv-btn-${inv.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownInvId(activeDropdownInvId === inv.id ? null : inv.id);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all shadow-sm ${
                            activeDropdownInvId === inv.id
                              ? 'bg-primary text-white border-primary shadow-primary/25'
                              : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
                          }`}
                        >
                          <span>Manage</span>
                          <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdownInvId === inv.id ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdownInvId === inv.id && (
                          <div 
                            className="absolute right-0 mt-1.5 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Wallet Operations Section */}
                            <div className="px-3 py-1 text-[10px] uppercase font-extrabold tracking-wider text-foreground/40 border-b border-border/50">
                              Wallet Operations
                            </div>

                            <button
                              id={`credit-wallet-btn-${inv.id}`}
                              type="button"
                              onClick={() => {
                                setActiveDropdownInvId(null);
                                handleOpenWalletModal('credit', inv);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-500/10 text-emerald-500 flex items-center gap-2.5 transition-colors"
                            >
                              <ArrowDownLeft size={15} className="text-emerald-500" />
                              <span>Credit User Wallet</span>
                            </button>

                            <button
                              id={`debit-wallet-btn-${inv.id}`}
                              type="button"
                              onClick={() => {
                                setActiveDropdownInvId(null);
                                handleOpenWalletModal('debit', inv);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-rose-500/10 text-rose-500 flex items-center gap-2.5 transition-colors"
                            >
                              <ArrowUpRight size={15} className="text-rose-500" />
                              <span>Debit User Wallet</span>
                            </button>

                            {/* Investment Lifecycle Section */}
                            <div className="px-3 py-1 text-[10px] uppercase font-extrabold tracking-wider text-foreground/40 border-t border-b border-border/50 mt-1">
                              Investment Lifecycle
                            </div>

                            {inv.status === 'pending' && (
                              <button
                                id={`approve-inv-btn-${inv.id}`}
                                type="button"
                                onClick={() => {
                                  setActiveDropdownInvId(null);
                                  handleApproveInvestment(inv.id);
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-500/10 text-emerald-500 flex items-center gap-2.5 transition-colors"
                              >
                                <CheckCircle size={15} className="text-emerald-500" />
                                <span>Approve Investment</span>
                              </button>
                            )}

                            {inv.status === 'active' && (
                              <button
                                id={`mature-inv-btn-${inv.id}`}
                                type="button"
                                onClick={() => {
                                  setActiveDropdownInvId(null);
                                  setMatureModal({ inv, profit: '0', destination: '1' });
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-primary/10 text-primary flex items-center gap-2.5 transition-colors"
                              >
                                <TrendingUp size={15} className="text-primary" />
                                <span>Mature / Add Profit</span>
                              </button>
                            )}

                            <button
                              id={`adjust-duration-btn-${inv.id}`}
                              type="button"
                              onClick={() => {
                                setActiveDropdownInvId(null);
                                openDurationAdjustModal(inv);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-amber-500/10 text-amber-500 flex items-center gap-2.5 transition-colors"
                            >
                              <Lock size={15} className="text-amber-500" />
                              <span>Adjust Fixed Duration & Lock</span>
                            </button>

                            {inv.status === 'pending' && (
                              <button
                                id={`approve-inv-btn-${inv.id}`}
                                type="button"
                                onClick={() => {
                                  setActiveDropdownInvId(null);
                                  handleApproveInvestment(inv.id);
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-500/10 text-emerald-500 flex items-center gap-2.5 transition-colors"
                              >
                                <CheckCircle size={15} className="text-emerald-500" />
                                <span>Approve Investment</span>
                              </button>
                            )}
                            {inv.status !== 'matured' && inv.status !== 'withdrawn' && (
                              <button
                                id={`cancel-inv-btn-${inv.id}`}
                                type="button"
                                onClick={() => {
                                  setActiveDropdownInvId(null);
                                  handleRejectInvestment(inv.id);
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-amber-500/10 text-amber-500 flex items-center gap-2.5 transition-colors"
                              >
                                <XCircle size={15} className="text-amber-500" />
                                <span>Cancel / Reject</span>
                              </button>
                            )}

                            {/* Record Controls */}
                            <div className="border-t border-border/50 my-1" />

                            <button
                              id={`edit-inv-btn-${inv.id}`}
                              type="button"
                              onClick={() => {
                                setActiveDropdownInvId(null);
                                handleOpenEditModal(inv);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-foreground/5 text-foreground/80 flex items-center gap-2.5 transition-colors"
                            >
                              <Edit size={15} className="text-blue-400" />
                              <span>Edit Investment</span>
                            </button>

                            <button
                              id={`delete-inv-btn-${inv.id}`}
                              type="button"
                              onClick={() => {
                                setActiveDropdownInvId(null);
                                setDeleteInvConfirm(inv);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-rose-500/10 text-rose-500 flex items-center gap-2.5 transition-colors"
                            >
                              <Trash2 size={15} className="text-rose-500" />
                              <span>Delete Record</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInvestments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-foreground/50 italic">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Coins size={36} className="text-foreground/20" />
                      <div className="font-semibold text-foreground/60 text-sm">No investments found.</div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddInvModalOpen(true)}
                          className="px-3.5 py-1.5 bg-primary text-white font-bold rounded-lg text-xs hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          + Record Investment
                        </button>
                        <button
                          type="button"
                          onClick={handleSeedDefaultInvestments}
                          className="px-3.5 py-1.5 bg-foreground/10 text-foreground font-bold rounded-lg text-xs hover:bg-foreground/20 transition-colors"
                        >
                          Load Sample Investments
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* View 2: Crypto Withdrawal Requests & Receipts Management */}
      {adminSectionTab === 'withdrawals' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Pending Review</span>
              <p className="text-2xl font-black font-mono text-amber-500 mt-1">
                {pendingWithdrawalsCount}
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                ${cryptoWithdrawals.filter(w => w.status === 'pending').reduce((acc, w) => acc + w.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} awaiting approval
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Approved & Settled</span>
              <p className="text-2xl font-black font-mono text-emerald-500 mt-1">
                {cryptoWithdrawals.filter(w => w.status === 'approved').length}
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                ${cryptoWithdrawals.filter(w => w.status === 'approved').reduce((acc, w) => acc + w.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} cleared & receipted
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Total Requests</span>
              <p className="text-2xl font-black font-mono text-foreground mt-1">
                {cryptoWithdrawals.length}
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                All submitted requests
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Enforced Cap / Request</span>
              <p className="text-2xl font-black font-mono text-primary mt-1">
                ${(adminSettings.maxCryptoWithdrawalLimit || 25000).toLocaleString()}
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                Per-transaction maximum ceiling
              </p>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ArrowDownToLine className="text-primary" size={20} />
                  User Crypto Withdrawal Requests & Clearance
                </h3>
                <p className="text-xs text-foreground/60 mt-0.5">
                  Review client withdrawal requests, enforce compliance policy limits, disburse crypto funds, and automatically mint Swiss digital settlement receipts.
                </p>
              </div>

              {pendingWithdrawalsCount > 0 && (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-500 text-xs font-bold shrink-0">
                  <AlertCircle size={15} />
                  <span>{pendingWithdrawalsCount} Action Required</span>
                </div>
              )}
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/60">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={15} />
                <input
                  type="text"
                  value={withdrawalSearch}
                  onChange={e => setWithdrawalSearch(e.target.value)}
                  placeholder="Search by client name, email, wallet address, currency, or receipt ref..."
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:border-primary outline-none"
                />
                {withdrawalSearch && (
                  <button onClick={() => setWithdrawalSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground">
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setWithdrawalStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      withdrawalStatus === st
                        ? 'bg-foreground/10 text-foreground border border-foreground/20'
                        : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Withdrawals Table */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-background/80 text-foreground/50 font-bold uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Withdrawal Amount</th>
                    <th className="py-3.5 px-4">Destination Wallet</th>
                    <th className="py-3.5 px-4">Submission Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions & Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {filteredWithdrawals.map(w => {
                    const client = users.find(u => u.id === w.userId);
                    return (
                      <tr key={w.id} className="hover:bg-foreground/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-foreground text-sm">{client?.name || w.userId}</div>
                          <div className="text-xs text-foreground/50">{client?.email || 'N/A'}</div>
                          <div className="text-[10px] font-mono text-foreground/40 mt-0.5">Acc: {client?.accounts?.[0]?.accountNumber || 'Primary'}</div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-foreground text-sm font-mono">
                            {w.cryptoAmount} {w.currency}
                          </div>
                          <div className="text-xs text-foreground/60 font-mono">
                            ${w.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                          </div>
                          {Boolean(w.originalRequestedAmount && w.originalRequestedAmount !== w.amount) && (
                            <div className="text-[10px] text-amber-500 font-bold mt-0.5 flex items-center gap-1">
                              <Edit3 size={10} />
                              <span>Adjusted by Admin (Req: ${w.originalRequestedAmount?.toLocaleString()} USD)</span>
                            </div>
                          )}
                          <div className="text-[10px] text-foreground/40 mt-0.5">
                            Source: {w.sourceWallet === 'investor' ? 'GEB Investor Profit' : 'Crypto Portfolio'}
                          </div>
                        </td>

                        <td className="py-4 px-4 max-w-[220px]">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-foreground/10 text-foreground mb-1">
                            {w.network}
                          </span>
                          <div className="font-mono text-[11px] text-foreground/70 break-all select-all">
                            {w.walletAddress}
                          </div>
                          {w.memo && (
                            <div className="text-[10px] text-foreground/50 mt-1 italic">
                              Memo: {w.memo}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap text-foreground/60">
                          <div>{new Date(w.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div className="text-[10px] text-foreground/40 font-mono">
                            {new Date(w.requestDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          {w.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 whitespace-nowrap">
                              <CheckCircle2 size={12} /> Approved
                            </span>
                          ) : w.status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 border border-rose-500/30 text-rose-500 whitespace-nowrap">
                              <XCircle size={12} /> Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-500 whitespace-nowrap animate-pulse">
                              <Clock size={12} /> Pending Review
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {w.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openPayoutApprovalModal(w)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 whitespace-nowrap"
                                  title="Review withdrawal request, modify amount, and credit user's wallet"
                                >
                                  <Edit3 size={13} />
                                  <span>Review & Credit Amount</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectWithdrawalRequest(w.id)}
                                  className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                                  title="Reject Request"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}

                            {w.status === 'approved' && (
                              <button
                                type="button"
                                onClick={() => setSelectedReceiptWithdrawal(w)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/25 font-bold text-xs transition-all shadow-xs active:scale-95 whitespace-nowrap"
                              >
                                <FileText size={13} />
                                <span>Official Receipt</span>
                              </button>
                            )}

                            {w.status === 'rejected' && (
                              <span className="text-[10px] text-foreground/40 italic">
                                Declined
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredWithdrawals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-foreground/50">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText size={32} className="text-foreground/20" />
                          <p className="font-semibold text-sm">No withdrawal requests found matching your filters.</p>
                          <p className="text-xs text-foreground/40">Users can submit requests directly from their Crypto Dashboard or Investors Wallet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Crypto Trade Orders (Buy / Sell) Management */}
      {adminSectionTab === 'trade_orders' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Pending Orders</span>
              <p className="text-2xl font-black font-mono text-amber-500 mt-1">
                {pendingTradeOrdersCount}
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                ${cryptoOrders.filter(o => o.status === 'pending').reduce((acc, o) => acc + o.fiatAmount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} awaiting clearance
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Settled & Cleared</span>
              <p className="text-2xl font-black font-mono text-emerald-500 mt-1">
                {cryptoOrders.filter(o => o.status === 'approved').length}
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                ${cryptoOrders.filter(o => o.status === 'approved').reduce((acc, o) => acc + o.fiatAmount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} trade volume approved
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Total Trade Orders</span>
              <p className="text-2xl font-black font-mono text-foreground mt-1">
                {cryptoOrders.length}
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                All Buy & Sell submissions
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Core Rate Engine</span>
              <p className="text-2xl font-black font-mono text-primary mt-1">
                $65,100.00
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                1 BTC Reference Exchange Rate
              </p>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="text-primary" size={18} />
                  Crypto Buy & Sell Trade Clearance Queue
                </h4>
                <p className="text-xs text-foreground/60 mt-0.5">
                  Strict regulatory gate: all cryptocurrency purchases and liquidation sales require compliance verification and administrator approval.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="text"
                    value={tradeOrderSearch}
                    onChange={e => setTradeOrderSearch(e.target.value)}
                    placeholder="Search by ID, client, coin..."
                    className="w-full bg-background border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-foreground/40 focus:border-primary outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-xl">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTradeOrderStatusFilter(s)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                        tradeOrderStatusFilter === s
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-foreground/60 font-semibold bg-background/50">
                    <th className="py-3 px-4">Order Ref & Date</th>
                    <th className="py-3 px-4">Client Details</th>
                    <th className="py-3 px-4">Trade Direction</th>
                    <th className="py-3 px-4">Trade Amounts (USD / Crypto)</th>
                    <th className="py-3 px-4">Exchange Rate</th>
                    <th className="py-3 px-4">Approval Status</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTradeOrders.map(order => {
                    const client = users.find(u => u.id === order.userId);
                    return (
                      <tr key={order.id} className="hover:bg-foreground/[0.02] transition-colors">
                        {/* Order Ref & Date */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-foreground">{order.id}</div>
                          <div className="text-[10px] text-foreground/50 mt-0.5">
                            {new Date(order.createdAt).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>

                        {/* Client Details */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-foreground">{client?.name || order.userName || 'Client'}</div>
                          <div className="text-[10px] text-foreground/50">{client?.email || 'Registered Investor'}</div>
                        </td>

                        {/* Trade Direction */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                            order.orderType === 'buy'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          }`}>
                            {order.orderType === 'buy' ? (
                              <>
                                <ArrowDownLeft size={12} />
                                Buy {order.cryptoCurrency}
                              </>
                            ) : (
                              <>
                                <ArrowUpRight size={12} />
                                Sell {order.cryptoCurrency}
                              </>
                            )}
                          </span>
                        </td>

                        {/* Trade Amounts */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-foreground font-mono">
                            ${order.fiatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {order.fiatCurrency}
                          </div>
                          <div className="text-[11px] font-mono text-primary font-semibold mt-0.5">
                            {order.cryptoAmount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 8 })} {order.cryptoCurrency}
                          </div>
                        </td>

                        {/* Applied Rate */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-xs text-foreground/80 font-semibold">
                            1 {order.cryptoCurrency} = ${order.exchangeRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-foreground/50">Treasury Index Rate</div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {order.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/25">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Pending Approval
                            </span>
                          )}
                          {order.status === 'approved' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
                              <CheckCircle2 size={12} />
                              Approved & Settled
                            </span>
                          )}
                          {order.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/25">
                              <XCircle size={12} />
                              Rejected
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {order.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApproveTradeOrder(order.id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs active:scale-95 whitespace-nowrap"
                                  title="Approve and execute order"
                                >
                                  <Check size={14} />
                                  <span>Approve Order</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRejectTradeOrder(order.id)}
                                  className="p-1.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors"
                                  title="Reject Order"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}

                            {order.status === 'approved' && (
                              <button
                                type="button"
                                onClick={() => setSelectedReceiptOrder(order)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/25 font-bold text-xs transition-all shadow-xs active:scale-95 whitespace-nowrap"
                              >
                                <FileText size={13} />
                                <span>Official Receipt</span>
                              </button>
                            )}

                            {order.status === 'rejected' && (
                              <span className="text-[10px] text-foreground/40 italic">
                                Declined
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredTradeOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-foreground/50">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <TrendingUp size={32} className="text-foreground/20" />
                          <p className="font-semibold text-sm">No crypto trade orders found matching your filters.</p>
                          <p className="text-xs text-foreground/40">Clients can submit Buy & Sell requests from the Quick Trade desk on the Crypto Dashboard.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Official Crypto Transaction & Trade Order Receipt Modal */}
      <CryptoReceiptModal
        withdrawal={selectedReceiptWithdrawal}
        tradeOrder={selectedReceiptOrder}
        onClose={() => {
          setSelectedReceiptWithdrawal(null);
          setSelectedReceiptOrder(null);
        }}
      />

      {/* Admin Discretionary Withdrawal Review & Credit Modal */}
      {payoutApprovalModal && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-background/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setPayoutApprovalModal(null); }}
        >
          <div className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-emerald-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <Coins size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">Review & Credit Crypto Withdrawal</h3>
                  <p className="text-xs text-foreground/60">Admin power to adjust requested amount & credit user wallet</p>
                </div>
              </div>
              <button 
                onClick={() => setPayoutApprovalModal(null)}
                className="text-foreground/40 hover:text-foreground p-1.5 rounded-xl hover:bg-foreground/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Investor & Request Info */}
              <div className="bg-background/80 border border-border rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider">Investor Account</span>
                    <div className="font-bold text-sm text-foreground">{payoutApprovalModal.withdrawal.userName}</div>
                    <div className="text-xs text-foreground/60">{payoutApprovalModal.withdrawal.userEmail}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider">Original Request</span>
                    <div className="font-mono font-bold text-base text-foreground">
                      ${payoutApprovalModal.withdrawal.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                    </div>
                    <div className="text-xs font-mono text-emerald-500 font-bold">
                      {payoutApprovalModal.withdrawal.cryptoAmount} {payoutApprovalModal.withdrawal.currency}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-foreground/50 text-[10px] uppercase font-bold">Destination Network</span>
                    <div className="font-semibold text-foreground mt-0.5">{payoutApprovalModal.withdrawal.network}</div>
                  </div>
                  <div>
                    <span className="text-foreground/50 text-[10px] uppercase font-bold">Receiving Address</span>
                    <div className="font-mono text-[11px] text-foreground/80 break-all select-all mt-0.5" title={payoutApprovalModal.withdrawal.walletAddress}>
                      {payoutApprovalModal.withdrawal.walletAddress}
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Payout Override Field */}
              <div className="bg-card border-2 border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Edit3 size={14} />
                    <span>Admin Approved Amount to Credit ($ USD)</span>
                  </label>
                  <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                    Admin Discretion
                  </span>
                </div>

                <p className="text-xs text-foreground/60 leading-relaxed">
                  As administrator, you have full power to modify this payout amount. The user&apos;s wallet balance will be debited by the exact approved amount you set below.
                </p>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-foreground/50 text-base">$</span>
                  <input
                    type="number"
                    value={payoutApprovalModal.approvedAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      const orig = payoutApprovalModal.withdrawal.amount;
                      const origCrypto = payoutApprovalModal.withdrawal.cryptoAmount;
                      const num = parseFloat(val) || 0;
                      const newCrypto = (orig > 0 && origCrypto > 0) ? +(origCrypto * (num / orig)).toFixed(6) : num;
                      setPayoutApprovalModal(prev => prev ? {
                        ...prev,
                        approvedAmount: val,
                        approvedCryptoAmount: String(newCrypto)
                      } : null);
                    }}
                    placeholder="Enter amount to approve"
                    step="any"
                    className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl pl-8 pr-4 py-3 text-lg font-mono font-bold text-foreground outline-none shadow-inner"
                  />
                </div>

                {/* Quick Adjustment Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { label: '100% (Full)', pct: 1.0 },
                    { label: '75%', pct: 0.75 },
                    { label: '50%', pct: 0.50 },
                    { label: '25%', pct: 0.25 },
                  ].map(pill => {
                    const calc = +(payoutApprovalModal.withdrawal.amount * pill.pct).toFixed(2);
                    return (
                      <button
                        key={pill.label}
                        type="button"
                        onClick={() => {
                          const orig = payoutApprovalModal.withdrawal.amount;
                          const origCrypto = payoutApprovalModal.withdrawal.cryptoAmount;
                          const newCrypto = (orig > 0 && origCrypto > 0) ? +(origCrypto * (calc / orig)).toFixed(6) : calc;
                          setPayoutApprovalModal(prev => prev ? {
                            ...prev,
                            approvedAmount: String(calc),
                            approvedCryptoAmount: String(newCrypto)
                          } : null);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-background hover:bg-foreground/5 border border-border text-foreground/80 hover:text-foreground transition-colors"
                      >
                        {pill.label} (${calc.toLocaleString()} USD)
                      </button>
                    );
                  })}
                </div>

                {/* Adjusted Amount Alert Banner */}
                {parseFloat(payoutApprovalModal.approvedAmount) !== payoutApprovalModal.withdrawal.amount && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-500 flex items-start gap-2 animate-in fade-in duration-150">
                    <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <strong>Amount Modified by Admin:</strong> User requested{' '}
                      <span className="font-mono font-bold">${payoutApprovalModal.withdrawal.amount.toLocaleString()} USD</span>. 
                      You are approving and crediting{' '}
                      <span className="font-mono font-bold">${parseFloat(payoutApprovalModal.approvedAmount || '0').toLocaleString()} USD</span>. 
                      The user&apos;s wallet balance will be debited by this approved amount and the transaction record will document the change.
                    </div>
                  </div>
                )}
              </div>

              {/* Equivalent Crypto Amount & TX Hash */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-foreground/60 uppercase tracking-wider mb-1">
                    Equivalent Crypto ({payoutApprovalModal.withdrawal.currency})
                  </label>
                  <input
                    type="number"
                    value={payoutApprovalModal.approvedCryptoAmount}
                    onChange={(e) => setPayoutApprovalModal(prev => prev ? { ...prev, approvedCryptoAmount: e.target.value } : null)}
                    step="any"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-foreground/60 uppercase tracking-wider mb-1">
                    On-Chain Transaction Hash (TXID)
                  </label>
                  <input
                    type="text"
                    value={payoutApprovalModal.customTxHash}
                    onChange={(e) => setPayoutApprovalModal(prev => prev ? { ...prev, customTxHash: e.target.value } : null)}
                    placeholder="0x..."
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-mono text-foreground focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Compliance Notes */}
              <div>
                <label className="block text-[11px] font-bold text-foreground/60 uppercase tracking-wider mb-1">
                  Compliance Memo (Included in Swiss Audit Receipt)
                </label>
                <textarea
                  value={payoutApprovalModal.adminNotes}
                  onChange={(e) => setPayoutApprovalModal(prev => prev ? { ...prev, adminNotes: e.target.value } : null)}
                  rows={2}
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:border-emerald-500 outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setPayoutApprovalModal(null)}
                  className="py-2.5 px-4 rounded-xl border border-border text-xs font-bold text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = payoutApprovalModal.withdrawal.id;
                    setPayoutApprovalModal(null);
                    handleRejectWithdrawalRequest(id);
                  }}
                  className="py-2.5 px-4 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors"
                >
                  Reject Request
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayoutApproval}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 size={15} />
                  <span>Approve & Credit Wallet (${parseFloat(payoutApprovalModal.approvedAmount || '0').toLocaleString()} USD)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Fixed Duration & Principal Lockup Modal */}
      {durationAdjustModal && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-background/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setDurationAdjustModal(null); }}
        >
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col">
            <div className="px-6 py-4 border-b border-border bg-amber-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">Approve & Lock Fixed Duration</h3>
                  <p className="text-xs text-foreground/60">Admin-approved duration before principal can be withdrawn</p>
                </div>
              </div>
              <button 
                onClick={() => setDurationAdjustModal(null)}
                className="text-foreground/40 hover:text-foreground p-1.5 rounded-xl hover:bg-foreground/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-background/80 border border-border rounded-2xl p-3.5 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-foreground/50">Contract ID:</span>
                  <span className="font-mono font-bold text-foreground">{durationAdjustModal.inv.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/50">Principal Capital:</span>
                  <span className="font-bold text-foreground">{durationAdjustModal.inv.amount} {durationAdjustModal.inv.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/50">Current Duration:</span>
                  <span className="font-bold text-foreground">{durationAdjustModal.inv.durationDays} Days</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Admin Approved Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={durationAdjustModal.newDuration}
                  onChange={(e) => setDurationAdjustModal(prev => prev ? { ...prev, newDuration: parseInt(e.target.value) || 0 } : null)}
                  className="w-full bg-background border border-border focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm font-bold font-mono text-foreground outline-none"
                />

                <div className="flex flex-wrap gap-2 mt-2">
                  {[7, 14, 30, 60, 90, 180].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDurationAdjustModal(prev => prev ? { ...prev, newDuration: days } : null)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        durationAdjustModal.newDuration === days
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-background hover:bg-foreground/5 border-border text-foreground/70'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-500 flex items-start gap-2">
                <Lock size={15} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Principal Lockup Enforcement:</strong> The investor cannot withdraw this principal until the {durationAdjustModal.newDuration}-day duration approved by the admin has elapsed. Profits generated can be withdrawn or reinvested.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-foreground/60 uppercase tracking-wider mb-1">
                  Admin Approval Memo
                </label>
                <input
                  type="text"
                  value={durationAdjustModal.adminNotes}
                  onChange={(e) => setDurationAdjustModal(prev => prev ? { ...prev, adminNotes: e.target.value } : null)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:border-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDurationAdjustModal(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-border text-xs font-bold text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDurationAdjustment}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all active:scale-95"
                >
                  Confirm & Lock ({durationAdjustModal.newDuration}d)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
