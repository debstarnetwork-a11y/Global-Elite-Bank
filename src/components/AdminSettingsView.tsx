import React, { useState, useEffect, useRef } from 'react';
import { useBank, DEFAULT_BROKER_WALLETS } from '../store';
import { Upload, Save, Plus, Trash, CheckCircle, Wallet, Check, QrCode, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function AdminSettingsView() {
  const { adminSettings, updateAdminSettings } = useBank();
  const [activeTab, setActiveTab] = useState('website');
  const [showToast, setShowToast] = useState(false);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ name: '', type: 'currency', usedFor: 'both', status: 'enabled' });
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [brokerWalletsForm, setBrokerWalletsForm] = useState(adminSettings.brokerWallets || DEFAULT_BROKER_WALLETS);
  const [fiatDepositForm, setFiatDepositForm] = useState(adminSettings.fiatDepositInstructions || {
    bankName: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    swiftBic: '',
    bankAddress: '',
    referencePlaceholder: ''
  });
  const [eWalletForm, setEWalletForm] = useState(adminSettings.eWalletInstructions || {
    providerName: 'Global Elite Official PayPal',
    accountEmail: 'deposits@globalelitebank.com'
  });
  const [walletSaving, setWalletSaving] = useState(false);
  const [walletSaved, setWalletSaved] = useState(false);
  const [fiatSaving, setFiatSaving] = useState(false);
  const [fiatSaved, setFiatSaved] = useState(false);
  const [eWalletSaving, setEWalletSaving] = useState(false);
  const [eWalletSaved, setEWalletSaved] = useState(false);

  useEffect(() => {
    if (adminSettings.brokerWallets) {
      setBrokerWalletsForm(adminSettings.brokerWallets);
    }
  }, [adminSettings.brokerWallets]);

  useEffect(() => {
    if (adminSettings.fiatDepositInstructions) {
      setFiatDepositForm(adminSettings.fiatDepositInstructions);
    }
  }, [adminSettings.fiatDepositInstructions]);

  useEffect(() => {
    if (adminSettings.eWalletInstructions) {
      setEWalletForm(adminSettings.eWalletInstructions);
    }
  }, [adminSettings.eWalletInstructions]);

  const handleSaveEWallet = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEWalletSaving(true);
    updateAdminSettings({ eWalletInstructions: { ...eWalletForm } });
    try {
      const stored = localStorage.getItem('bank_adminSettings');
      const parsed = stored ? JSON.parse(stored) : {};
      localStorage.setItem('bank_adminSettings', JSON.stringify({
        ...parsed,
        eWalletInstructions: { ...eWalletForm }
      }));
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => {
      setEWalletSaving(false);
      setEWalletSaved(true);
      setTimeout(() => setEWalletSaved(false), 2000);
    }, 600);
  };

  const handleSaveFiatInstructions = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFiatSaving(true);
    updateAdminSettings({ fiatDepositInstructions: { ...fiatDepositForm } });
    try {
      const stored = localStorage.getItem('bank_adminSettings');
      const parsed = stored ? JSON.parse(stored) : {};
      localStorage.setItem('bank_adminSettings', JSON.stringify({
        ...parsed,
        fiatDepositInstructions: { ...fiatDepositForm }
      }));
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => {
      setFiatSaving(false);
      setFiatSaved(true);
      setTimeout(() => setFiatSaved(false), 2000);
    }, 600);
  };

  const handleSaveCryptoWallets = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setWalletSaving(true);
    updateAdminSettings({ brokerWallets: { ...brokerWalletsForm } });
    try {
      const stored = localStorage.getItem('bank_adminSettings');
      const parsed = stored ? JSON.parse(stored) : {};
      localStorage.setItem('bank_adminSettings', JSON.stringify({
        ...parsed,
        brokerWallets: { ...brokerWalletsForm }
      }));
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setWalletSaving(false);
      setWalletSaved(true);
      setShowToast(true);
      setTimeout(() => setWalletSaved(false), 3000);
      setTimeout(() => setShowToast(false), 4000);
    }, 300);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (type === 'logo') {
            updateAdminSettings({ logoUrl: event.target.result as string });
          } else {
            updateAdminSettings({ faviconUrl: event.target.result as string }); // Assuming faviconUrl exists or we just store it
          }
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const handleAddPayment = () => {
    const updatedMethods = [...(adminSettings.paymentMethods || []), { ...newPayment, id: Date.now().toString() }];
    updateAdminSettings({ paymentMethods: updatedMethods });
    setShowPaymentModal(false);
    setNewPayment({ name: '', type: 'currency', usedFor: 'both', status: 'enabled' });
  };
  
  const handleDeletePayment = (index: number) => {
    const updatedMethods = [...(adminSettings.paymentMethods || [])];
    updatedMethods.splice(index, 1);
    updateAdminSettings({ paymentMethods: updatedMethods });
  };


  const tabs = [
    { id: 'website', label: 'Website Information' },
    { id: 'transfer', label: 'Transfer codes' },
    { id: 'preference', label: 'Preference' },
    { id: 'login', label: 'Email/Google Login-Captcha' },
    { id: 'theme', label: 'Theme/Display' },
    { id: 'payment', label: 'Payment settings' },
    { id: 'crypto-wallets', label: 'Crypto Wallets' },
  ];

  return (
    <div className="space-y-6 relative">
      {showToast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold animate-in fade-in slide-in-from-top-2 z-50">
          Settings Saved Successfully!
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">App Settings</h2>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="flex overflow-x-auto gap-2 border-b border-border pb-2">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-foreground/60 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        {activeTab === 'website' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Website Name</label>
              <input type="text" value={adminSettings.websiteName || ''} onChange={e => updateAdminSettings({ websiteName: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Website Title</label>
              <input type="text" value={adminSettings.websiteTitle || ''} onChange={e => updateAdminSettings({ websiteTitle: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Website Keywords</label>
              <input type="text" value={adminSettings.websiteKeywords || ''} onChange={e => updateAdminSettings({ websiteKeywords: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Website Url</label>
              <input type="url" value={adminSettings.websiteUrl || ''} onChange={e => updateAdminSettings({ websiteUrl: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Bank Address</label>
              <input type="text" value={adminSettings.contactAddress || ''} onChange={e => updateAdminSettings({ contactAddress: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">whatsapp number</label>
              <input type="text" value={adminSettings.whatsappNumber || ''} onChange={e => updateAdminSettings({ whatsappNumber: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Tido livechat id</label>
              <input type="text" value={adminSettings.tidioId || ''} onChange={e => updateAdminSettings({ tidioId: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Timezone</label>
              <input type="text" value={adminSettings.timezone || ''} onChange={e => updateAdminSettings({ timezone: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Installation Type</label>
              <input type="text" value={adminSettings.installationType || ''} onChange={e => updateAdminSettings({ installationType: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div className="flex items-center gap-3">
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Turn On/Off SMS</label>
              <div className="flex items-center gap-2">
                <button onClick={() => updateAdminSettings({ smsEnabled: !adminSettings.smsEnabled })} className={`w-12 h-6 rounded-full transition-colors relative ${adminSettings.smsEnabled ? 'bg-primary' : 'bg-foreground/20'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings.smsEnabled ? 'left-7' : 'left-1'}`} />
                </button>
                <span className="text-sm font-bold text-foreground">{adminSettings.smsEnabled ? 'ON' : 'OFF'}</span>
              </div>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Logo (Recommended size; max width, 200px and max height 100px.)</label>
                <div onClick={() => logoInputRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer text-foreground/50">
                  {adminSettings.logoUrl ? <CheckCircle size={24} className="text-emerald-500" /> : <Upload size={24} />}
                  <span className="text-sm text-center line-clamp-1">{adminSettings.logoUrl ? 'Logo Uploaded' : 'No file chosen'}</span>
                  <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={(e) => handleFileUpload(e, 'logo')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Favicon (Recommended type: png, size: max width, 32px and max height 32px.)</label>
                <div onClick={() => faviconInputRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer text-foreground/50">
                  {adminSettings.faviconUrl ? <CheckCircle size={24} className="text-emerald-500" /> : <Upload size={24} />}
                  <span className="text-sm text-center line-clamp-1">{adminSettings.faviconUrl ? 'Favicon Uploaded' : 'No file chosen'}</span>
                  <input type="file" accept="image/png,image/x-icon" className="hidden" ref={faviconInputRef} onChange={(e) => handleFileUpload(e, 'favicon')} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        
        {activeTab === 'transfer' && (
          <div className="space-y-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Transfer Code Settings</h3>
            
            {[1, 2, 3, 4, 5].map(num => {
              const codeNameKey = `code${num}Name` as keyof typeof adminSettings;
              const codeMessageKey = `code${num}Message` as keyof typeof adminSettings;
              const requireCodeKey = `requireCode${num}` as keyof typeof adminSettings;
              
              return (
                <div key={num} className="bg-background border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground">Code {num}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground/50 uppercase">Turn {adminSettings[requireCodeKey] ? 'Off' : 'On'}</span>
                      <button onClick={() => updateAdminSettings({ [requireCodeKey]: !adminSettings[requireCodeKey] })} className={`w-10 h-5 rounded-full transition-colors relative ${adminSettings[requireCodeKey] ? 'bg-primary' : 'bg-foreground/20'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${adminSettings[requireCodeKey] ? 'left-[22px]' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Code Name</label>
                    <input type="text" value={adminSettings[codeNameKey] as string || ''} onChange={e => updateAdminSettings({ [codeNameKey]: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Code {num} Message</label>
                    <textarea rows={4} value={adminSettings[codeMessageKey] as string || ''} onChange={e => updateAdminSettings({ [codeMessageKey]: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none resize-none" />
                    <p className="text-xs text-foreground/50 mt-1">This message will be displayed to users on if code{num} is on international transfer</p>
                  </div>
                </div>
              );
            })}
            
            <div className="bg-background border border-border rounded-xl p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-foreground">OTP Code</h4>
                <p className="text-xs text-foreground/50 mt-1">Require One-Time Password for transfers</p>
              </div>
              <button onClick={() => updateAdminSettings({ requireOtp: !adminSettings.requireOtp })} className={`w-12 h-6 rounded-full transition-colors relative ${adminSettings.requireOtp ? 'bg-primary' : 'bg-foreground/20'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings.requireOtp ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'preference' && (
          <div className="space-y-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Preference Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Contact Email</label>
                <input type="email" value={adminSettings.preferenceContactEmail as string || ''} onChange={e => updateAdminSettings({ preferenceContactEmail: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Website Currency</label>
                <input type="text" value={adminSettings.websiteCurrency as string || ''} onChange={e => updateAdminSettings({ websiteCurrency: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Homepage URL (Redirect)</label>
                <input type="url" value={adminSettings.homepageUrl as string || ''} onChange={e => updateAdminSettings({ homepageUrl: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" placeholder="eg https://myhomepage.com" />
                <p className="text-xs text-foreground/50 mt-1">If you use a custom homepage and you want all requests to be redirected to that page, please enter the URL here. If empty, the system will use our default homepage/webpages</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <h4 className="font-bold text-foreground">KYC(Verification)</h4>
                  <p className="text-xs text-foreground/50 mt-1">if turned on, Users will need to submit required documents to get verified before they can place a withdrawal request.</p>
                </div>
                <button onClick={() => updateAdminSettings({ requireKycWithdrawal: !adminSettings.requireKycWithdrawal })} className={`shrink-0 w-12 h-6 rounded-full transition-colors relative ${adminSettings.requireKycWithdrawal ? 'bg-primary' : 'bg-foreground/20'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings.requireKycWithdrawal ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <h4 className="font-bold text-foreground">KYC(Verification) on Registraion</h4>
                  <p className="text-xs text-foreground/50 mt-1">If turned on, Users will have to go through the verification process upon registration, and they will not be allowed to carry out any operation on your system until they have been verified by the admin. Note that this will affect existing users who have not completed their KYC. After they have submitted an application, you will also need to verify the user from your end before they can proceed.</p>
                </div>
                <button onClick={() => updateAdminSettings({ requireKycRegistration: !adminSettings.requireKycRegistration })} className={`shrink-0 w-12 h-6 rounded-full transition-colors relative ${adminSettings.requireKycRegistration ? 'bg-primary' : 'bg-foreground/20'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings.requireKycRegistration ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <h4 className="font-bold text-foreground">Email Verification</h4>
                </div>
                <button onClick={() => updateAdminSettings({ requireEmailVerification: !adminSettings.requireEmailVerification })} className={`shrink-0 w-12 h-6 rounded-full transition-colors relative ${adminSettings.requireEmailVerification ? 'bg-primary' : 'bg-foreground/20'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adminSettings.requireEmailVerification ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'login' && (
          <div className="space-y-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Configuration</h3>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground border-b border-border pb-2">Mail Server</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email From</label>
                  <input type="email" value={adminSettings.emailFrom as string || ''} onChange={e => updateAdminSettings({ emailFrom: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Email From Name</label>
                  <input type="text" value={adminSettings.emailFromName as string || ''} onChange={e => updateAdminSettings({ emailFromName: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground border-b border-border pb-2">Google Login Credentials</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Client ID</label>
                  <input type="text" value={adminSettings.googleClientId as string || ''} onChange={e => updateAdminSettings({ googleClientId: e.target.value })} placeholder="From console.cloud.google.com" className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Client Secret</label>
                  <input type="password" value={adminSettings.googleClientSecret as string || ''} onChange={e => updateAdminSettings({ googleClientSecret: e.target.value })} placeholder="From console.cloud.google.com" className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Redirect URL</label>
                  <input type="url" value={adminSettings.googleRedirectUrl as string || ''} onChange={e => updateAdminSettings({ googleRedirectUrl: e.target.value })} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                  <p className="text-xs text-foreground/50 mt-1">Set this to your Valid OAuth Redirect URI in console.cloud.google.com. Be sure to replace 'yoursite.com' with your website URL</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground border-b border-border pb-2">Google Captcha Credentials</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Captcha Secret</label>
                  <input type="password" value={adminSettings.captchaSecret as string || ''} onChange={e => updateAdminSettings({ captchaSecret: e.target.value })} placeholder="From https://www.google.com/recaptcha/admin/create" className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Captcha Site-Key</label>
                  <input type="password" value={adminSettings.captchaSiteKey as string || ''} onChange={e => updateAdminSettings({ captchaSiteKey: e.target.value })} placeholder="From https://www.google.com/recaptcha/admin/create" className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Theme/Display</h3>
            <p className="text-sm text-foreground/60 mb-6">Website theme. Double-click to save. The current theme has a blue border.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['dark', 'light', 'midnight', 'ocean'].map(theme => (
                <div 
                  key={theme}
                  onDoubleClick={() => {
                    updateAdminSettings({ activeTheme: theme });
                    handleSave();
                  }}
                  className={`cursor-pointer border-2 rounded-xl p-4 overflow-hidden h-32 flex flex-col items-center justify-center transition-all ${
                    adminSettings.activeTheme === theme ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-foreground/30 bg-background/50'
                  }`}
                >
                  <div className="font-bold capitalize">{theme}</div>
                  <div className="text-xs text-foreground/50 mt-2">(Double-click to apply)</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Settings Section */}
      {activeTab === 'payment' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Payment Settings</h2>
            <button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors">
              <Plus size={16} /> Add New
            </button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background/50 text-xs font-bold text-foreground/50 uppercase tracking-widest">
                    <th className="p-4">Method Name</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Used for</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Option</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {adminSettings.paymentMethods?.map((method, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm font-bold text-foreground">{method.name}</td>
                      <td className="p-4 text-sm text-foreground/70">{method.type}</td>
                      <td className="p-4 text-sm text-foreground/70">{method.usedFor}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${method.status === 'enabled' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {method.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeletePayment(index)} className="text-foreground/50 hover:text-rose-500 transition-colors p-2 rounded-md hover:bg-white/5">
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fiat Bank Deposit Instructions */}
          <div className="bg-card border border-border rounded-2xl p-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Wallet className="text-primary" size={20} />
                  Fiat Bank Deposit Instructions
                </h3>
                <p className="text-sm text-foreground/60 mt-0.5">
                  Configure the bank details shown to users when they request to deposit funds via wire transfer.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 w-fit">
                <Check size={12} /> Active Global Configuration
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Bank Name</label>
                <input 
                  type="text" 
                  value={fiatDepositForm.bankName} 
                  onChange={e => setFiatDepositForm({...fiatDepositForm, bankName: e.target.value})} 
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors font-mono"
                  placeholder="e.g. Global Elite Partner Bank (US)"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Account Name</label>
                <input 
                  type="text" 
                  value={fiatDepositForm.accountName} 
                  onChange={e => setFiatDepositForm({...fiatDepositForm, accountName: e.target.value})} 
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors font-mono"
                  placeholder="e.g. Global Elite Holdings LLC"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Account Number</label>
                <input 
                  type="text" 
                  value={fiatDepositForm.accountNumber} 
                  onChange={e => setFiatDepositForm({...fiatDepositForm, accountNumber: e.target.value})} 
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors font-mono"
                  placeholder="e.g. 3482910048"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Routing Number / Sort Code</label>
                <input 
                  type="text" 
                  value={fiatDepositForm.routingNumber} 
                  onChange={e => setFiatDepositForm({...fiatDepositForm, routingNumber: e.target.value})} 
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors font-mono"
                  placeholder="e.g. 021000021"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">SWIFT / BIC</label>
                <input 
                  type="text" 
                  value={fiatDepositForm.swiftBic} 
                  onChange={e => setFiatDepositForm({...fiatDepositForm, swiftBic: e.target.value})} 
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors font-mono"
                  placeholder="e.g. GEHBUS33"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Bank Address</label>
                <input 
                  type="text" 
                  value={fiatDepositForm.bankAddress} 
                  onChange={e => setFiatDepositForm({...fiatDepositForm, bankAddress: e.target.value})} 
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors font-mono"
                  placeholder="e.g. 120 Broadway, New York, NY 10271, USA"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Transfer Reference Placeholder</label>
                <input 
                  type="text" 
                  value={fiatDepositForm.referencePlaceholder} 
                  onChange={e => setFiatDepositForm({...fiatDepositForm, referencePlaceholder: e.target.value})} 
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
                  placeholder="e.g. Include your Account ID in the transfer memo"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={handleSaveFiatInstructions}
                disabled={fiatSaving}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                {fiatSaving ? (
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : fiatSaved ? (
                  <><CheckCircle size={18} /> Saved successfully</>
                ) : (
                  <><Save size={18} /> Update Fiat Instructions</>
                )}
              </button>
            </div>
          </div>

          {/* E-Wallet & PayPal Instructions */}
          <div className="bg-card border border-border rounded-2xl p-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Wallet className="text-primary" size={20} />
                  E-Wallet & PayPal Instructions
                </h3>
                <p className="text-sm text-foreground/60 mt-0.5">
                  Configure the official E-Wallet (e.g. PayPal, Skrill) displayed to clients.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 w-fit">
                <Check size={12} /> Active Global Configuration
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Provider Name</label>
                <input 
                  type="text" 
                  value={eWalletForm.providerName} 
                  onChange={e => setEWalletForm({...eWalletForm, providerName: e.target.value})} 
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors font-mono"
                  placeholder="e.g. Global Elite Official PayPal"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Account Email / ID</label>
                <input 
                  type="text" 
                  value={eWalletForm.accountEmail} 
                  onChange={e => setEWalletForm({...eWalletForm, accountEmail: e.target.value})} 
                  className="w-full bg-background border border-border focus:border-primary rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors font-mono"
                  placeholder="e.g. deposits@globalelitebank.com"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={handleSaveEWallet}
                disabled={eWalletSaving}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                {eWalletSaving ? (
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : eWalletSaved ? (
                  <><CheckCircle size={18} /> Saved successfully</>
                ) : (
                  <><Save size={18} /> Update E-Wallet</>
                )}
              </button>
            </div>
          </div>

          {/* Crypto Wallets Section inside Payment Settings */}
          <div className="bg-card border border-border rounded-2xl p-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Wallet className="text-primary" size={20} />
                  Bank Broker Crypto Deposit Wallets
                </h3>
                <p className="text-sm text-foreground/60 mt-0.5">
                  Configure the bank's official deposit addresses for Bitcoin, Ethereum, USDT, and Solana.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

            <div className="flex flex-wrap items-center gap-4">
              <button 
                id="save-crypto-wallets-btn-settings"
                type="button" 
                onClick={handleSaveCryptoWallets}
                disabled={walletSaving}
                className={`flex items-center gap-2 font-bold py-3 px-8 rounded-xl transition-all shadow-md text-sm cursor-pointer select-none active:scale-95 ${
                  walletSaved 
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25' 
                    : walletSaving 
                    ? 'bg-primary/70 text-white cursor-wait'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {walletSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Crypto Wallets...</span>
                  </>
                ) : walletSaved ? (
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

              {walletSaved && (
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle size={14} /> Saved and synced across system
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Crypto Wallets Tab */}
      {activeTab === 'crypto-wallets' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Wallet className="text-primary" size={22} />
                  Bank Broker Crypto Deposit Wallets
                </h3>
                <p className="text-sm text-foreground/60 mt-1">
                  Manage all cryptocurrency deposit addresses for the bank. Clients will see these addresses and QR codes when funding accounts or staking investments.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active & Operational
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* BTC */}
              <div className="bg-background border border-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start shadow-xs">
                <div className="w-24 h-24 shrink-0 bg-white p-1.5 rounded-xl border border-border flex items-center justify-center shadow-xs overflow-hidden">
                  {brokerWalletsForm.btcQr ? (
                    <img 
                      src={brokerWalletsForm.btcQr} 
                      alt="Bitcoin QR Code" 
                      className="w-full h-full object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : brokerWalletsForm.btc ? (
                    <QRCodeSVG value={brokerWalletsForm.btc} size={76} level="M" />
                  ) : (
                    <span className="text-[10px] text-gray-400 font-mono text-center">No Address</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider">BTC Wallet (Native SegWit)</label>
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">Bitcoin</span>
                  </div>
                  <input 
                    type="text" 
                    value={brokerWalletsForm.btc || ""} 
                    onChange={e => setBrokerWalletsForm({...brokerWalletsForm, btc: e.target.value})} 
                    className="w-full bg-card border border-border rounded-lg p-2.5 focus:border-primary outline-none text-foreground font-mono text-xs mb-2" 
                    placeholder="e.g. bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" 
                  />
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
                      <QrCode size={11} /> Bitcoin QR Code Image URL
                    </label>
                    {brokerWalletsForm.btcQr && (
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                        <Check size={11} /> Scannable QR Image Active
                      </span>
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={brokerWalletsForm.btcQr || ""} 
                    onChange={e => setBrokerWalletsForm({...brokerWalletsForm, btcQr: e.target.value})} 
                    className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs" 
                    placeholder="e.g. https://i.ibb.co/6cJsKgVv/Bitcoin.jpg" 
                  />
                  <span className="text-[10px] text-foreground/40 mt-1 block">Clients see this exact QR code and address when depositing Bitcoin.</span>
                </div>
              </div>

              {/* ETH */}
              <div className="bg-background border border-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start shadow-xs">
                <div className="w-24 h-24 shrink-0 bg-white p-1.5 rounded-xl border border-border flex items-center justify-center shadow-xs overflow-hidden">
                  {brokerWalletsForm.ethQr ? (
                    <img 
                      src={brokerWalletsForm.ethQr} 
                      alt="Ethereum QR Code" 
                      className="w-full h-full object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : brokerWalletsForm.eth ? (
                    <QRCodeSVG value={brokerWalletsForm.eth} size={76} level="M" />
                  ) : (
                    <span className="text-[10px] text-gray-400 font-mono text-center">No Address</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider">ETH Wallet (ERC-20)</label>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">Ethereum</span>
                  </div>
                  <input 
                    type="text" 
                    value={brokerWalletsForm.eth || ""} 
                    onChange={e => setBrokerWalletsForm({...brokerWalletsForm, eth: e.target.value})} 
                    className="w-full bg-card border border-border rounded-lg p-2.5 focus:border-primary outline-none text-foreground font-mono text-xs mb-2" 
                    placeholder="e.g. 0x71C8705E311e2fE25E5b4c10a424eB7853f09072" 
                  />
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
                      <QrCode size={11} /> Ethereum QR Code Image URL
                    </label>
                    {brokerWalletsForm.ethQr && (
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                        <Check size={11} /> Scannable QR Image Active
                      </span>
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={brokerWalletsForm.ethQr || ""} 
                    onChange={e => setBrokerWalletsForm({...brokerWalletsForm, ethQr: e.target.value})} 
                    className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs" 
                    placeholder="e.g. https://i.ibb.co/yc1zKHbx/Ethereum.jpg" 
                  />
                  <span className="text-[10px] text-foreground/40 mt-1 block">ERC-20 network only. Compatible with Ethereum & smart contracts.</span>
                </div>
              </div>

              {/* USDT */}
              <div className="bg-background border border-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start shadow-xs">
                <div className="w-24 h-24 shrink-0 bg-white p-1.5 rounded-xl border border-border flex items-center justify-center shadow-xs overflow-hidden">
                  {brokerWalletsForm.usdtQr ? (
                    <img 
                      src={brokerWalletsForm.usdtQr} 
                      alt="USDT TRC-20 QR Code" 
                      className="w-full h-full object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : brokerWalletsForm.usdt ? (
                    <QRCodeSVG value={brokerWalletsForm.usdt} size={76} level="M" />
                  ) : (
                    <span className="text-[10px] text-gray-400 font-mono text-center">No Address</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider">USDT Wallet (TRC-20)</label>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">Tether TRC-20</span>
                  </div>
                  <input 
                    type="text" 
                    value={brokerWalletsForm.usdt || ""} 
                    onChange={e => setBrokerWalletsForm({...brokerWalletsForm, usdt: e.target.value})} 
                    className="w-full bg-card border border-border rounded-lg p-2.5 focus:border-primary outline-none text-foreground font-mono text-xs mb-2" 
                    placeholder="e.g. TYDzsYUE3b6WSo8rZV83JRNURNmr57qJp8" 
                  />
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
                      <QrCode size={11} /> USDT TRC-20 QR Code Image URL
                    </label>
                    {brokerWalletsForm.usdtQr && (
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                        <Check size={11} /> Scannable QR Image Active
                      </span>
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={brokerWalletsForm.usdtQr || ""} 
                    onChange={e => setBrokerWalletsForm({...brokerWalletsForm, usdtQr: e.target.value})} 
                    className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs" 
                    placeholder="e.g. https://i.ibb.co/JWfyTtm6/USDT-TRC-20.jpg" 
                  />
                  <span className="text-[10px] text-foreground/40 mt-1 block">TRON network (TRC-20) addresses starting with 'T'.</span>
                </div>
              </div>

              {/* SOL */}
              <div className="bg-background border border-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start shadow-xs">
                <div className="w-24 h-24 shrink-0 bg-white p-1.5 rounded-xl border border-border flex items-center justify-center shadow-xs overflow-hidden">
                  {brokerWalletsForm.solQr ? (
                    <img 
                      src={brokerWalletsForm.solQr} 
                      alt="Solana QR Code" 
                      className="w-full h-full object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : brokerWalletsForm.sol ? (
                    <QRCodeSVG value={brokerWalletsForm.sol} size={76} level="M" />
                  ) : (
                    <span className="text-[10px] text-gray-400 font-mono text-center">No Address</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider">SOL Wallet (Solana SPL)</label>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded-full border border-purple-500/20">Solana SPL</span>
                  </div>
                  <input 
                    type="text" 
                    value={brokerWalletsForm.sol || ""} 
                    onChange={e => setBrokerWalletsForm({...brokerWalletsForm, sol: e.target.value})} 
                    className="w-full bg-card border border-border rounded-lg p-2.5 focus:border-primary outline-none text-foreground font-mono text-xs mb-2" 
                    placeholder="e.g. 7EYnhQoR9YM3N7UoaKRoA44BW8PYJuYYU2nu23UocSQM" 
                  />
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
                      <QrCode size={11} /> Solana QR Code Image URL
                    </label>
                    {brokerWalletsForm.solQr && (
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                        <Check size={11} /> Scannable QR Image Active
                      </span>
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={brokerWalletsForm.solQr || ""} 
                    onChange={e => setBrokerWalletsForm({...brokerWalletsForm, solQr: e.target.value})} 
                    className="w-full bg-card border border-border rounded-lg p-2 focus:border-primary outline-none text-foreground font-mono text-xs" 
                    placeholder="e.g. https://i.ibb.co/nN1vjV2c/Solana.jpg" 
                  />
                  <span className="text-[10px] text-foreground/40 mt-1 block">Solana Mainnet-Beta network. Rapid sub-second finality.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
              <button 
                id="save-crypto-wallets-btn-tab"
                type="button" 
                onClick={handleSaveCryptoWallets}
                disabled={walletSaving}
                className={`flex items-center gap-2.5 font-bold py-3.5 px-8 rounded-xl transition-all shadow-md text-sm cursor-pointer select-none active:scale-95 ${
                  walletSaved 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25' 
                    : walletSaving 
                    ? 'bg-primary/70 text-white cursor-wait'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {walletSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Crypto Wallets...</span>
                  </>
                ) : walletSaved ? (
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

              {walletSaved && (
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle size={14} /> Saved & Synced Across Global Elite System
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-4">Add Payment Method</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Method Name</label>
                <input type="text" value={newPayment.name} onChange={e => setNewPayment({...newPayment, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none" placeholder="e.g. USDT" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Type</label>
                <select value={newPayment.type} onChange={e => setNewPayment({...newPayment, type: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none">
                  <option value="crypto">Crypto</option>
                  <option value="currency">Currency</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Used For</label>
                <select value={newPayment.usedFor} onChange={e => setNewPayment({...newPayment, usedFor: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:border-primary outline-none">
                  <option value="both">Both</option>
                  <option value="deposit">Deposit Only</option>
                  <option value="withdrawal">Withdrawal Only</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-foreground/70 font-bold hover:text-foreground">Cancel</button>
                <button onClick={handleAddPayment} disabled={!newPayment.name} className="px-4 py-2 bg-primary text-white font-bold rounded-lg disabled:opacity-50">Add Method</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
