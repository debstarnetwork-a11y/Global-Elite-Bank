import React, { useState } from 'react';
import { Facebook, Twitter, Menu, X } from 'lucide-react';
import { HomeView } from './landing/HomeView';
import { AboutView } from './landing/AboutView';
import { ServicesView } from './landing/ServicesView';
import { ContactView } from './landing/ContactView';
import { PrivacyPolicy, TermsOfService, LegalDisclosure } from './LegalModals';
import { useBank } from "../store";
import { LanguageDropdown } from './LanguageDropdown';
import { AIChatWidget } from './AIChatWidget';
import { useLanguage } from '../context/LanguageContext';

export function LandingPage({ onLogin, onRegister }: { onLogin: () => void, onRegister: () => void }) {
  const { adminSettings } = useBank();
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'legal' | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'services' | 'contact'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView onRegister={onRegister} onNavigate={setCurrentView} />;
      case 'about': return <AboutView onRegister={onRegister} onNavigate={setCurrentView} />;
      case 'services': return <ServicesView onRegister={onRegister} onNavigate={setCurrentView} />;
      case 'contact': return <ContactView onRegister={onRegister} />;
      default: return <HomeView onRegister={onRegister} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 w-full">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent via-accent to-accent group-hover:from-[#1e3a8a] group-hover:via-accent group-hover:to-secondary group-active:from-[#1e3a8a] group-active:via-accent group-active:to-secondary transition-all duration-300"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between relative z-10">
          {/* Logo & Bank Name */}
          <button onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 sm:gap-3 shrink-0 text-left">
            <img src={adminSettings?.logoUrl || "https://i.ibb.co/G3NmLY1j/GEB-logo.png"} alt="GEB Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0" />
            <span className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-tight whitespace-nowrap">{adminSettings?.websiteName || 'Global Elite Bank'}</span>
          </button>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            <button onClick={() => setCurrentView('home')} className={`${currentView === 'home' ? 'text-primary font-semibold' : 'text-foreground/70'} hover:text-primary transition-colors`}>{t('home', 'Home')}</button>
            <button onClick={() => setCurrentView('about')} className={`${currentView === 'about' ? 'text-primary font-semibold' : 'text-foreground/70'} hover:text-primary transition-colors`}>{t('about', 'About')}</button>
            <button onClick={() => setCurrentView('services')} className={`${currentView === 'services' ? 'text-primary font-semibold' : 'text-foreground/70'} hover:text-primary transition-colors`}>{t('services', 'Services')}</button>
            <button onClick={() => setCurrentView('contact')} className={`${currentView === 'contact' ? 'text-primary font-semibold' : 'text-foreground/70'} hover:text-primary transition-colors`}>{t('contact', 'Contact')}</button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:block">
              <LanguageDropdown variant="navbar" />
            </div>
            <button 
              onClick={onLogin}
              className="text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg"
            >
              {t('login', 'Login')}
            </button>
            <button 
              onClick={onRegister}
              className="hidden sm:inline-flex text-xs sm:text-sm font-bold bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-md whitespace-nowrap"
            >
              {t('applyMembership', 'Apply')}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-white/10 transition-colors focus:outline-none shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-3 pb-6 space-y-4 shadow-2xl z-50">
            <div className="flex flex-col space-y-1">
              <button 
                onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }} 
                className={`text-left py-3 px-4 rounded-xl text-base font-medium transition-colors ${currentView === 'home' ? 'bg-primary/20 text-primary' : 'text-white/80 hover:bg-white/5'}`}
              >
                {t('home', 'Home')}
              </button>
              <button 
                onClick={() => { setCurrentView('about'); setIsMobileMenuOpen(false); }} 
                className={`text-left py-3 px-4 rounded-xl text-base font-medium transition-colors ${currentView === 'about' ? 'bg-primary/20 text-primary' : 'text-white/80 hover:bg-white/5'}`}
              >
                {t('about', 'About')}
              </button>
              <button 
                onClick={() => { setCurrentView('services'); setIsMobileMenuOpen(false); }} 
                className={`text-left py-3 px-4 rounded-xl text-base font-medium transition-colors ${currentView === 'services' ? 'bg-primary/20 text-primary' : 'text-white/80 hover:bg-white/5'}`}
              >
                {t('services', 'Services')}
              </button>
              <button 
                onClick={() => { setCurrentView('contact'); setIsMobileMenuOpen(false); }} 
                className={`text-left py-3 px-4 rounded-xl text-base font-medium transition-colors ${currentView === 'contact' ? 'bg-primary/20 text-primary' : 'text-white/80 hover:bg-white/5'}`}
              >
                {t('contact', 'Contact')}
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-white/70 font-medium">Language</span>
                <LanguageDropdown variant="navbar" />
              </div>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onRegister(); }}
                className="w-full text-center text-base font-bold bg-primary text-white py-3.5 rounded-xl shadow-lg hover:bg-primary/90 transition-all touch-manipulation"
              >
                {t('applyMembership', 'Apply for Membership')}
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        {renderView()}
      </main>

      {/* Global Footer */}
      <footer className="bg-card border-t border-border pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src="https://i.ibb.co/G3NmLY1j/GEB-logo.png" alt="GEB Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold text-foreground tracking-tight">{adminSettings?.websiteName || 'Global Elite Bank'}</span>
              </div>
              <p className="text-sm text-foreground/60 leading-relaxed mb-6">
                {t('footerDescription', 'Global Elite Bank is a private financial institution serving an exclusive community of high-net-worth individuals and businesses. Membership is by application and approval only.')}
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-6">{t('quickLinks', 'Quick Links')}</h4>
              <ul className="space-y-4 text-sm text-foreground/70">
                <li><button onClick={() => setCurrentView('home')} className="hover:text-primary transition-colors">{t('home', 'Home')}</button></li>
                <li><button onClick={() => setCurrentView('about')} className="hover:text-primary transition-colors">{t('about', 'About')}</button></li>
                <li><button onClick={() => setCurrentView('services')} className="hover:text-primary transition-colors">{t('services', 'Services')}</button></li>
                <li><button onClick={() => setCurrentView('contact')} className="hover:text-primary transition-colors">{t('contact', 'Contact')}</button></li>
                <li><button onClick={onRegister} className="hover:text-primary transition-colors">{t('applyMembership', 'Apply for Membership')}</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-6">{t('legal', 'Legal')}</h4>
              <ul className="space-y-4 text-sm text-foreground/70">
                <li><button onClick={() => setActiveModal('privacy')} className="hover:text-primary transition-colors">{t('privacyPolicy', 'Privacy Policy')}</button></li>
                <li><button onClick={() => setActiveModal('terms')} className="hover:text-primary transition-colors">{t('termsOfService', 'Terms of Service')}</button></li>
                <li><button onClick={() => setActiveModal('legal')} className="hover:text-primary transition-colors">{t('regulatoryDisclosures', 'Regulatory Disclosures')}</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-6">{t('newsletterSignup', 'Newsletter Signup')}</h4>
              <p className="text-sm text-foreground/70 mb-4">{t('newsletterDesc', 'Subscribe to receive exclusive insights, financial briefings, and updates from Global Elite Bank.')}</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <input 
                  type="email" 
                  placeholder={t('emailAddress', 'Email address')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-3 sm:py-2 text-base sm:text-sm focus:outline-none focus:border-primary text-foreground min-h-[44px] w-full" 
                  required
                />
                <button 
                  type="submit"
                  className="bg-primary text-white font-bold px-4 py-3 sm:py-2 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap min-h-[44px] w-full sm:w-auto"
                >
                  {isSubscribed ? t('subscribed', 'Subscribed ✓') : t('subscribe', 'Subscribe')}
                </button>
              </form>
              <div className="mt-8">
                 <h4 className="font-bold text-foreground mb-4">{t('trustSecurity', 'Trust & Security')}</h4>
                 <div className="flex flex-wrap gap-2 text-xs text-foreground/50">
                   <span className="bg-background px-2 py-1 rounded border border-border">🔒 {t('ssl256', '256-bit SSL')}</span>
                   <span className="bg-background px-2 py-1 rounded border border-border">✓ {t('regulated', 'Regulated')}</span>
                   <span className="bg-background px-2 py-1 rounded border border-border">🛡️ {t('swissRegulated', 'Swiss Regulated')}</span>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 pb-28 md:pb-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-foreground/50 text-center md:text-left">
             <p className="max-w-2xl">© 2026 {adminSettings?.websiteName || 'Global Elite Bank'}. All rights reserved. Global Elite Bank is a private financial institution headquartered in Switzerland. All banking services are subject to membership approval and applicable regulatory requirements.</p>
             <div className="flex items-center justify-center gap-3 w-full md:w-auto md:pr-48">
               <a 
                 id="footer-social-facebook"
                 href="https://www.facebook.com" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/50 border border-border/60 hover:border-primary/40 hover:text-foreground text-foreground/70 transition-all cursor-pointer group shadow-sm"
                 title="Visit Facebook"
               >
                 <Facebook size={14} className="group-hover:text-blue-500 transition-colors" />
                 <span className="font-medium text-[11px]">Facebook</span>
               </a>
               <a 
                 id="footer-social-twitter"
                 href="https://twitter.com" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/50 border border-border/60 hover:border-primary/40 hover:text-foreground text-foreground/70 transition-all cursor-pointer group shadow-sm"
                 title="Visit Twitter / X"
               >
                 <Twitter size={14} className="group-hover:text-sky-400 transition-colors" />
                 <span className="font-medium text-[11px]">Twitter / X</span>
               </a>
             </div>
          </div>
        </div>
      </footer>

      {activeModal === 'privacy' && <PrivacyPolicy onClose={() => setActiveModal(null)} />}
      {activeModal === 'terms' && <TermsOfService onClose={() => setActiveModal(null)} />}
      {activeModal === 'legal' && <LegalDisclosure onClose={() => setActiveModal(null)} />}
      <AIChatWidget />
    </div>
  );
}
