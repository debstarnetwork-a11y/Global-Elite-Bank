import { Bell, Search, Menu, CheckCheck, X, ArrowUpRight, ShieldCheck, Coins, CreditCard, Clock, ExternalLink, Sparkles } from 'lucide-react';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useBank, CryptoWithdrawalRequest } from '../store';
import { CryptoReceiptModal } from './CryptoReceiptModal';
import { LanguageDropdown } from './LanguageDropdown';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onNavigateView?: (view: string) => void;
  onToggleSidebar?: () => void;
}

interface NotificationItem {
  id: string;
  category: 'crypto' | 'transaction' | 'security' | 'investor';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  status?: 'pending' | 'completed' | 'rejected' | 'info';
  actionView?: string;
  cryptoWithdrawal?: CryptoWithdrawalRequest;
}

export function Header({ onNavigateView, onToggleSidebar }: HeaderProps) {
  const { currentUser, cryptoWithdrawals, transactions, investments, adminSettings } = useBank();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'crypto' | 'transaction' | 'security'>('all');
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`geb_read_alerts_${currentUser?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`geb_dismissed_alerts_${currentUser?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedReceiptWithdrawal, setSelectedReceiptWithdrawal] = useState<CryptoWithdrawalRequest | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  // Sync read/dismissed alerts to storage
  useEffect(() => {
    try {
      localStorage.setItem(`geb_read_alerts_${currentUser?.id || 'guest'}`, JSON.stringify(readIds));
    } catch (_) {}
  }, [readIds, currentUser?.id]);

  useEffect(() => {
    try {
      localStorage.setItem(`geb_dismissed_alerts_${currentUser?.id || 'guest'}`, JSON.stringify(dismissedIds));
    } catch (_) {}
  }, [dismissedIds, currentUser?.id]);

  // Click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        bellButtonRef.current &&
        !bellButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Compute dynamic user notifications from live state
  const notifications: NotificationItem[] = useMemo(() => {
    const list: NotificationItem[] = [];

    // 1. Core Institutional Security Alert
    list.push({
      id: 'sec-finma-custody',
      category: 'security',
      title: 'Institutional Custody Enforced',
      message: 'Bank credit and crypto assets are segregated into isolated Swiss FINMA cold-storage vaults with real-time multi-sig verification.',
      timestamp: 'Active Session',
      status: 'info',
      isRead: readIds.includes('sec-finma-custody'),
      actionView: 'Settings'
    });

    // 2. User's Crypto Withdrawals
    const userWithdrawals = cryptoWithdrawals.filter(w => w.userId === currentUser?.id);
    userWithdrawals.forEach(w => {
      const statusTitle = w.status === 'approved' 
        ? 'Crypto Withdrawal Cleared' 
        : w.status === 'rejected' 
        ? 'Crypto Withdrawal Declined' 
        : 'Crypto Withdrawal Pending Clearance';
      
      const statusDesc = w.status === 'approved'
        ? `Payout of ${w.cryptoAmount} ${w.currency} ($${w.amount.toLocaleString()} USD) successfully cleared on ${w.network || 'Mainnet'}. TXID: ${w.txHash ? w.txHash.slice(0, 14) + '...' : 'Available'}`
        : w.status === 'rejected'
        ? `Request of ${w.cryptoAmount} ${w.currency} was declined. Funds restored to your crypto vault.`
        : `Request of ${w.cryptoAmount} ${w.currency} ($${w.amount.toLocaleString()} USD) awaiting blockchain validator sign-off. Ref: ${w.receiptNumber || w.id}`;

      list.push({
        id: `cw-${w.id}`,
        category: 'crypto',
        title: statusTitle,
        message: statusDesc,
        timestamp: new Date(w.requestDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: w.status === 'approved' ? 'completed' : w.status === 'rejected' ? 'rejected' : 'pending',
        isRead: readIds.includes(`cw-${w.id}`),
        actionView: 'Crypto',
        cryptoWithdrawal: w
      });
    });

    // 3. User's Investor Wallet Yields
    const userInvestments = investments.filter(inv => inv.userId === currentUser?.id);
    userInvestments.forEach(inv => {
      if (inv.status === 'matured') {
        list.push({
          id: `inv-${inv.id}`,
          category: 'investor',
          title: 'Investment Yield Matured',
          message: `Principal of $${inv.amount.toLocaleString()} + profit of $${(inv.profit || 0).toLocaleString()} credited directly to your Investor Crypto Wallet balance.`,
          timestamp: 'Recently Matured',
          status: 'completed',
          isRead: readIds.includes(`inv-${inv.id}`),
          actionView: 'Investors'
        });
      }
    });

    // 4. User's Banking Transactions (Most recent 4)
    const userTxns = (currentUser?.transactions || transactions.filter(t => t.userId === currentUser?.id)).slice(0, 4);
    userTxns.forEach(tx => {
      const isCrypto = tx.accountId === 'crypto-wallet' || tx.type?.includes('crypto');
      list.push({
        id: `tx-${tx.id}`,
        category: isCrypto ? 'crypto' : 'transaction',
        title: isCrypto ? 'Digital Asset Settlement' : `${tx.type === 'deposit' ? 'Credit Received' : 'Debit Cleared'}`,
        message: `${tx.description} — $${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD (${tx.status.toUpperCase()})`,
        timestamp: new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: tx.status === 'completed' ? 'completed' : tx.status === 'failed' ? 'rejected' : 'pending',
        isRead: readIds.includes(`tx-${tx.id}`),
        actionView: isCrypto ? 'Crypto' : 'History'
      });
    });

    return list.filter(item => !dismissedIds.includes(item.id));
  }, [currentUser?.id, currentUser?.transactions, cryptoWithdrawals, investments, transactions, readIds, dismissedIds]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter(n => n.category === activeFilter);
  }, [notifications, activeFilter]);

  const handleMarkAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(prev => Array.from(new Set([...prev, ...allIds])));
  };

  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReadIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds(prev => [...prev, id]);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    // Mark as read
    if (!item.isRead) {
      setReadIds(prev => [...prev, item.id]);
    }

    // If item has a crypto withdrawal receipt, open receipt modal
    if (item.cryptoWithdrawal && item.cryptoWithdrawal.status === 'approved') {
      setSelectedReceiptWithdrawal(item.cryptoWithdrawal);
      setIsOpen(false);
      return;
    }

    // Navigate to view if available
    if (item.actionView && onNavigateView) {
      onNavigateView(item.actionView);
      setIsOpen(false);
    }
  };

  return (
    <>
      <header className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-border bg-background sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-card transition-colors"
            title="Toggle Menu"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-base sm:text-lg font-semibold hidden md:block text-foreground">
            {adminSettings?.websiteName || 'Global Elite Bank'} • Private Banking
          </h1>
          <div className="hidden sm:flex items-center space-x-2 bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-emerald-500/20">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>SEGREGATED VAULT SECURED</span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative hidden lg:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder', 'Search assets, txns, or accounts...')}
              className="w-64 h-9 pl-9 pr-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs transition-all placeholder:text-foreground/40 text-foreground"
            />
          </div>
          
          <LanguageDropdown variant="dashboard" />
          
          {/* Bell Notification Icon with Live Status and Dropdown Trigger */}
          <div className="relative">
            <button 
              ref={bellButtonRef}
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
                isOpen 
                  ? 'bg-primary text-white shadow-md shadow-primary/25' 
                  : 'text-foreground/70 hover:text-foreground hover:bg-card border border-transparent hover:border-border'
              }`}
              title="Alerts & System Notifications"
              aria-label="Alerts and Notifications"
            >
              <Bell size={19} className={unreadCount > 0 ? 'animate-[bounce_2s_ease-in-out_infinite]' : ''} />
              
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-background shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {isOpen && (
              <div 
                ref={dropdownRef}
                className="absolute right-0 top-12 mt-2 w-[340px] sm:w-[420px] max-w-[92vw] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col"
                style={{ maxHeight: '82vh' }}
              >
                {/* Popover Header */}
                <div className="px-4 py-3.5 border-b border-border bg-card flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Bell size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Alerts & Notifications</h3>
                      <p className="text-[10px] text-foreground/50">
                        {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All vaults & activity up to date'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors"
                        title="Mark all as read"
                      >
                        <CheckCheck size={14} />
                        <span>Read All</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
                      title="Close"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 px-3 py-2 bg-foreground/[0.02] border-b border-border text-xs overflow-x-auto no-scrollbar">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'crypto', label: 'Crypto & Vault' },
                    { key: 'transaction', label: 'Banking' },
                    { key: 'security', label: 'Security' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveFilter(tab.key as any)}
                      className={`px-2.5 py-1 rounded-lg font-medium text-[11px] whitespace-nowrap transition-colors ${
                        activeFilter === tab.key
                          ? 'bg-primary text-white font-bold'
                          : 'text-foreground/60 hover:text-foreground hover:bg-card'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Notification Items List */}
                <div className="overflow-y-auto flex-1 divide-y divide-border/60 max-h-[380px]">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-12 px-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <CheckCheck size={22} />
                      </div>
                      <p className="text-sm font-bold text-foreground">No active alerts</p>
                      <p className="text-xs text-foreground/50 mt-1 max-w-[240px] mx-auto">
                        Your account balances, crypto vaults, and security safeguards are completely in sync.
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3.5 sm:p-4 hover:bg-foreground/[0.02] transition-colors cursor-pointer relative group flex items-start gap-3 ${
                          !item.isRead ? 'bg-primary/[0.04]' : ''
                        }`}
                      >
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-white ${
                          item.category === 'crypto'
                            ? 'bg-emerald-500'
                            : item.category === 'investor'
                            ? 'bg-amber-500'
                            : item.category === 'security'
                            ? 'bg-blue-600'
                            : 'bg-primary'
                        }`}>
                          {item.category === 'crypto' && <Coins size={17} />}
                          {item.category === 'investor' && <Sparkles size={17} />}
                          {item.category === 'security' && <ShieldCheck size={17} />}
                          {item.category === 'transaction' && <CreditCard size={17} />}
                        </div>

                        {/* Text Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4 className="text-xs font-bold text-foreground truncate flex items-center gap-1.5">
                              <span>{item.title}</span>
                              {!item.isRead && (
                                <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                              )}
                            </h4>
                            <span className="text-[10px] text-foreground/40 shrink-0 font-medium">
                              {item.timestamp}
                            </span>
                          </div>

                          <p className="text-xs text-foreground/70 leading-relaxed break-words">
                            {item.message}
                          </p>

                          {/* Quick Action Footer */}
                          <div className="flex items-center justify-between gap-2 mt-2 pt-1.5">
                            <div className="flex items-center gap-1.5">
                              {item.status && (
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  item.status === 'completed'
                                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                                    : item.status === 'rejected'
                                    ? 'bg-red-500/15 text-red-500 border border-red-500/20'
                                    : item.status === 'pending'
                                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                                    : 'bg-primary/10 text-primary border border-primary/20'
                                }`}>
                                  {item.status}
                                </span>
                              )}

                              {item.cryptoWithdrawal?.status === 'approved' && (
                                <span className="text-[10px] font-bold text-emerald-500 hover:underline flex items-center gap-0.5">
                                  <span>View Receipt</span>
                                  <ExternalLink size={10} />
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => handleToggleRead(item.id, e)}
                                className="p-1 rounded text-foreground/40 hover:text-foreground text-[10px] hover:bg-card"
                                title={item.isRead ? "Mark as unread" : "Mark as read"}
                              >
                                {item.isRead ? 'Mark Unread' : 'Mark Read'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDismiss(item.id, e)}
                                className="p-1 rounded text-foreground/40 hover:text-red-500 text-[10px] hover:bg-card"
                                title="Dismiss notification"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Popover Footer */}
                <div className="px-4 py-2.5 bg-foreground/[0.02] border-t border-border flex items-center justify-between text-[11px] text-foreground/50">
                  <span>Segregated Swiss Custody</span>
                  {onNavigateView && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateView('Crypto');
                        setIsOpen(false);
                      }}
                      className="text-primary hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Open Crypto Vault</span>
                      <ArrowUpRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-2 border-l border-border">
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-1.5 justify-end">
                <p className="text-xs text-foreground/50">Welcome back,</p>
                {currentUser?.role === 'admin' && (
                  <span className="px-1.5 py-0.2 bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded text-[9px] font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-foreground">{currentUser?.name || 'User'}</p>
            </div>
            <div className="w-10 h-10 rounded-xl border-2 border-accent p-0.5 shrink-0 overflow-hidden shadow-xs">
              <img 
                src={currentUser?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"} 
                alt="Profile" 
                className="w-full h-full rounded-[9px] object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Crypto Receipt Modal triggered directly from notification */}
      {selectedReceiptWithdrawal && (
        <CryptoReceiptModal
          withdrawal={selectedReceiptWithdrawal}
          onClose={() => setSelectedReceiptWithdrawal(null)}
        />
      )}
    </>
  );
}

