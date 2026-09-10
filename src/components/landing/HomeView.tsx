import React from 'react';
import { ShieldCheck, Globe, Briefcase, Star, Users, ArrowRight } from 'lucide-react';
import { useBank } from "../../store";
import { useLanguage } from "../../context/LanguageContext";

export function HomeView({ onRegister, onNavigate }: { onRegister: () => void, onNavigate: (view: any) => void }) {
  const { adminSettings } = useBank();
  const { t } = useLanguage();

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden flex items-center min-h-[85vh]">
        <div className="absolute inset-0 z-0">
          <img src="https://i.ibb.co/r2h5SLxc/Bank-building.png" alt="Bank building" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a0b2e]/60 to-[#1a0b2e]"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center mt-32">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold tracking-widest uppercase mb-8">
            <ShieldCheck size={14} /> {t('securityBadge', 'Swiss Banking Grade Security')}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 tracking-tight mb-8 leading-tight">
            {t('heroTitle1', 'Banking Beyond Borders.')} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300">{t('heroTitle2', 'Exclusivity Redefined.')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('heroSubtitle', 'Global Elite Bank is not for everyone. It is for those who demand excellence, expect privacy, and operate on a global scale. Membership is by application and approval only.')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button onClick={onRegister} className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
              {t('applyMembership', 'Apply for Membership')} <ArrowRight size={18} />
            </button>
            <button onClick={() => onNavigate('services')} className="w-full sm:w-auto px-8 py-4 bg-card/80 backdrop-blur-md border border-border text-foreground font-bold rounded-xl hover:border-primary/50 transition-all">
              {t('explorePrivileges', 'Explore Privileges')}
            </button>
          </div>
        </div>
      </section>

      {/* Trust Indicators Bar */}
      <section className="border-y border-border/50 bg-card/50 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">$12.8B+</p>
              <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">{t('assetsUnderManagement', 'Assets Under Management')}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">180+</p>
              <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">{t('countriesServed', 'Countries Served')}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">48,500+</p>
              <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">{t('approvedMembers', 'Approved Members')}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">99.99%</p>
              <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">{t('uptimeReliability', 'Uptime Guarantee')}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">$2M+</p>
              <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">{t('avgMemberNetWorth', 'Avg Member Net Worth')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Global Elite Standard */}
      <section className="py-24 px-6 bg-background relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-6">{t('globalEliteStandard', 'The Global Elite Standard')}</h2>
            <p className="text-foreground/60 max-w-3xl mx-auto text-lg leading-relaxed">
              {t('globalEliteDesc', 'Global Elite Bank is a private financial institution serving an exclusive community of high-net-worth individuals, business leaders, and global citizens. We do not offer open enrollment. Every member is carefully vetted to ensure the integrity of our network.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t('privacyDiscretion', 'Privacy & Discretion')}</h3>
              <p className="text-foreground/70 leading-relaxed">{t('privacyDesc', 'Your financial affairs remain strictly confidential. We employ bank-grade encryption, private account numbers, and discretion at every level of service.')}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                <Star size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t('curatedMembership', 'Curated Membership')}</h3>
              <p className="text-foreground/70 leading-relaxed">{t('curatedDesc', 'Every application is personally reviewed by our Membership Committee. We assess financial standing, business interests, and alignment with our values.')}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t('globalReach', 'Global Reach')}</h3>
              <p className="text-foreground/70 leading-relaxed">{t('globalReachDesc', 'Once approved, you gain access to multi-currency accounts, international transfers at real rates, and dedicated support in over 180 countries.')}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t('dedicatedBanker', 'Dedicated Private Banker')}</h3>
              <p className="text-foreground/70 leading-relaxed">{t('dedicatedBankerDesc', 'Each approved member is assigned a dedicated relationship manager who serves as your single point of contact for all banking needs.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Path to Membership */}
      <section className="py-24 px-6 bg-card relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-6">{t('pathToMembership', 'Your Path to Membership')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-6 shadow-[0_0_20px_rgba(79,70,229,0.4)]">1</div>
              <h3 className="text-xl font-bold text-foreground mb-4">{t('submitApp', 'Submit Your Application')}</h3>
              <p className="text-foreground/70">{t('submitAppDesc', 'Complete our comprehensive membership application, detailing your financial profile, business interests, and banking requirements. This takes approximately 10–15 minutes.')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-6 shadow-[0_0_20px_rgba(79,70,229,0.4)]">2</div>
              <h3 className="text-xl font-bold text-foreground mb-4">{t('verificationAssessment', 'Verification & Assessment')}</h3>
              <p className="text-foreground/70">{t('verificationDesc', 'Our Membership Committee reviews your application, verifies your identity and financial standing, and assesses your suitability for membership. This typically takes 2–5 business days.')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-6 shadow-[0_0_20px_rgba(79,70,229,0.4)]">3</div>
              <h3 className="text-xl font-bold text-foreground mb-4">{t('approvalOnboarding', 'Approval & Onboarding')}</h3>
              <p className="text-foreground/70">{t('approvalDesc', 'Upon approval, you receive your private login credentials and a personal onboarding session with your dedicated relationship manager. Welcome to the elite.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-24 px-6 bg-background relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-6">{t('chooseTier', 'Choose Your Tier of Privilege')}</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-sm">{t('tierDisclaimer', 'All tiers require application approval. Stated asset thresholds are minimums; approval is not guaranteed.')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-foreground mb-2">Elite</h3>
              <p className="text-sm font-bold text-primary mb-6">$100K+ {t('verifiedAssets', 'verified assets')}</p>
              <ul className="space-y-4 mb-8 flex-1 text-foreground/80">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('multiCurrency', 'Multi-currency accounts')}</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('intlTransfers', 'International transfers')}</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('virtualCard', 'Virtual card')}</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('support247', '24/7 support')}</li>
              </ul>
            </div>
            <div className="bg-background border border-primary rounded-2xl p-8 flex flex-col shadow-[0_0_30px_rgba(79,70,229,0.15)] relative scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">{t('mostPopular', 'Most Popular')}</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Prestige</h3>
              <p className="text-sm font-bold text-primary mb-6">$500K+ {t('verifiedAssets', 'verified assets')}</p>
              <ul className="space-y-4 mb-8 flex-1 text-foreground/80">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('everythingInElite', 'Everything in Elite')}</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('physicalCard', 'Physical card')}</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('cryptoTrading', 'Crypto trading')}</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('prioritySupport', 'Priority support')}</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> 1% {t('cashback', 'cashback')}</li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-foreground mb-2">Sovereign</h3>
              <p className="text-sm font-bold text-primary mb-6">$2M+ {t('verifiedAssets', 'verified assets')}</p>
              <ul className="space-y-4 mb-8 flex-1 text-foreground/80">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('everythingInPrestige', 'Everything in Prestige')}</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('dedicatedBankerTier', 'Dedicated private banker')}</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('wealthManagement', 'Wealth management')}</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('airportLounge', 'Airport lounge access')}</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div> {t('exclusiveEvents', 'Exclusive events')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-card relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-6">Voices from Our Network</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-2xl border border-border flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://i.ibb.co/fYQRWF4c/Alexander.jpg" alt="Alexandra Sterling" className="w-16 h-16 rounded-full object-cover border-2 border-border" />
                <div className="flex gap-1 text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
              </div>
              <p className="text-foreground/80 italic mb-6 flex-1">"The application process was rigorous — exactly what I expected from a bank of this caliber. Once approved, the service has been exceptional. My private banker knows my business and anticipates my needs before I do."</p>
              <div>
                <p className="font-bold text-foreground">Alexandra Sterling</p>
                <p className="text-sm text-foreground/50">Founder & CEO, Sterling Global Holdings | Singapore</p>
              </div>
            </div>
            <div className="bg-background p-8 rounded-2xl border border-border flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://i.ibb.co/k2Jg8xC9/Markus.jpg" alt="Marcus Rothschild" className="w-16 h-16 rounded-full object-cover border-2 border-border" />
                <div className="flex gap-1 text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
              </div>
              <p className="text-foreground/80 italic mb-6 flex-1">"GEB is not another fintech app. It is a true private banking institution. The discretion, the attention to detail, the global reach — it is simply unmatched."</p>
              <div>
                <p className="font-bold text-foreground">Marcus Rothschild</p>
                <p className="text-sm text-foreground/50">International Investor & Philanthropist | Switzerland</p>
              </div>
            </div>
            <div className="bg-background p-8 rounded-2xl border border-border flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://i.ibb.co/q3q2KRTy/Victoria-Ashford.jpg" alt="Victoria Ashford" className="w-16 h-16 rounded-full object-cover border-2 border-border" />
                <div className="flex gap-1 text-accent">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
              </div>
              <p className="text-foreground/80 italic mb-6 flex-1">"I have accounts with several private banks. GEB is the only one that combines the exclusivity of traditional private banking with the technological sophistication of modern fintech."</p>
              <div>
                <p className="font-bold text-foreground">Victoria Ashford</p>
                <p className="text-sm text-foreground/50">Award-winning Actress & Managing Partner, Ashford Capital | United Kingdom</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-background text-center relative border-t border-border/50">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-6">Exclusivity Awaits</h2>
          <p className="text-xl text-foreground/70 mb-10">Submit your application today. Our Membership Committee reviews applications daily.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onRegister} className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
              Apply for Membership <ArrowRight size={18} />
            </button>
            <button onClick={() => onNavigate('contact')} className="w-full sm:w-auto px-8 py-4 bg-card border border-border text-foreground font-bold rounded-xl hover:border-primary/50 transition-all text-center">
              Contact Our Membership Team
            </button>
          </div>
        </div>
      </section>

      {/* Staff Image */}
      <section className="w-full">
        <img src={adminSettings.frontendContent?.homeStaffImg || "https://i.ibb.co/PsZ7fdd0/GEB-Staff-Photo.png"} alt="GEB Staff Photo" className="w-full h-auto object-contain" />
      </section>
    </div>
  );
}
