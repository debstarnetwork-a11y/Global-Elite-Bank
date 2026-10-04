import React from 'react';
import { ArrowRight, Globe, ArrowLeftRight, Bitcoin, CreditCard, Building2, Landmark, ConciergeBell } from 'lucide-react';
import { useBank } from '../../store';

export function ServicesView({ onRegister, onNavigate }: { onRegister: () => void, onNavigate: (view: any) => void }) {
  const { adminSettings } = useBank();
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-card border-b border-border/50">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 tracking-tight mb-6">
            Private Banking Services, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300">Perfected</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed mb-6">
            As a member of Global Elite Bank, you gain access to a comprehensive suite of financial services — each delivered with the discretion, precision, and global reach befitting your status.
          </p>
          <div className="inline-block bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-2 rounded-lg">
            Note: All services are available exclusively to approved members. To request access, please submit a membership application.
          </div>
        </div>
      </section>

      {/* GEB Hall Image */}
      <section className="w-full">
        <img src={adminSettings.frontendContent?.servicesHallImg || "https://i.ibb.co/bjLWcpry/GEB-HALL-02.png"} alt="GEB HALL 02" className="w-full h-auto object-contain" />
      </section>

      {/* Services List */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {[
            {
              icon: <Globe size={32} />,
              title: 'Multi-Currency Private Accounts',
              desc: 'Manage your global wealth with ease. Hold, convert, and transact in 40+ currencies with preferential exchange rates and real-time visibility — all within a single, secure account.',
              privileges: ['Hold 40+ currencies simultaneously', 'Preferential exchange rates for members', 'Local account details in 10+ financial centers', 'Instant currency conversion', 'No minimum balance requirements (post-approval)', 'Dedicated support for large transactions'],
              eligibility: 'All membership tiers'
            },
            {
              icon: <ArrowLeftRight size={32} />,
              title: 'International Transfers & Settlements',
              desc: 'Move funds across borders with speed, security, and favorable rates. Whether it is a business acquisition, property purchase, or private settlement, GEB executes your transfers with precision.',
              privileges: ['Real exchange rates with minimal transparent fees', 'SWIFT, SEPA, and instant GEB-to-GEB transfers', 'Large-value transaction handling', 'Priority processing for Sovereign members', 'Official transfer slips for every transaction', 'Multi-currency settlement support'],
              eligibility: 'All membership tiers'
            },
            {
              icon: <Bitcoin size={32} />,
              title: 'Cryptocurrency Trading & Custody',
              desc: 'Access digital assets with institutional-grade security. Trade 50+ cryptocurrencies, stake for yield, and store your holdings in cold storage — all within your private GEB account.',
              privileges: ['50+ cryptocurrencies supported', 'Institutional-grade cold storage custody', 'Real-time market data and advanced charting', 'Limit and stop orders', 'Crypto staking with up to 12% APY', 'Dedicated crypto desk for Sovereign members', 'Crypto transfer receipts for every transaction'],
              eligibility: 'Prestige and Sovereign tiers'
            },
            {
              icon: <CreditCard size={32} />,
              title: 'Elite Debit Cards',
              desc: 'Spend anywhere in the world with cards that reflect your status. Zero foreign transaction fees, real exchange rates, and privileged perks.',
              privileges: ['Zero foreign transaction fees worldwide', 'Real exchange rates on every purchase', 'Virtual and physical card options', 'Up to 3% cashback (Sovereign tier)', 'Global travel insurance', 'Airport lounge access (Sovereign tier)', 'Concierge service (Sovereign tier)', 'Instant freeze/unfreeze via app'],
              eligibility: 'All membership tiers (physical card from Prestige)'
            },
            {
              icon: <Building2 size={32} />,
              title: 'Business & Corporate Banking',
              desc: 'For members with business interests, GEB offers bespoke corporate solutions — multi-currency business accounts, batch payments, and dedicated corporate support.',
              privileges: ['Multi-currency business accounts', 'Batch payments (up to 5,000 payments)', 'API access for treasury automation', 'Multi-user access with role permissions', 'Dedicated corporate relationship manager', 'Integration with enterprise accounting systems', 'Custom reporting and analytics', 'Trade finance support (Sovereign tier)'],
              eligibility: 'Business owners and corporate entities (by application)'
            },
            {
              icon: <Landmark size={32} />,
              title: 'Wealth Management & Advisory',
              desc: 'For our Sovereign members, GEB offers comprehensive wealth management — personalized investment strategies, portfolio construction, and exclusive advisory services.',
              privileges: ['Dedicated wealth advisor', 'Bespoke portfolio management', 'Access to exclusive investment products', 'Tax optimization guidance', 'Estate and succession planning', 'Family office support', 'Exclusive networking events', 'Priority access to private offerings'],
              eligibility: 'Sovereign tier only'
            },
            {
              icon: <ConciergeBell size={32} />,
              title: 'Concierge & Lifestyle Services',
              desc: 'Beyond banking, GEB supports your lifestyle. Our concierge team assists with travel, events, and exclusive experiences — ensuring that your time is spent on what matters.',
              privileges: ['24/7 lifestyle concierge', 'Travel and accommodation booking', 'Exclusive event access', 'Fine dining reservations', 'Luxury goods sourcing', 'Personal shopping assistance'],
              eligibility: 'Sovereign tier only'
            }
          ].map((service, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-8 lg:p-12 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  {service.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300">{service.title}</h2>
              </div>
              <p className="text-foreground/70 text-lg leading-relaxed mb-8 max-w-4xl">{service.desc}</p>
              
              <div className="bg-background rounded-xl p-6 border border-border mb-6">
                <h3 className="font-bold text-foreground mb-4 uppercase tracking-widest text-xs text-primary">Key Privileges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.privileges.map((privilege, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-foreground/80 text-sm">{privilege}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-border/50 text-foreground/70 text-sm font-medium">
                <strong>Eligibility:</strong> {service.eligibility}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6 bg-card border-y border-border/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-4">Membership Tier Comparison</h2>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-border bg-background">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-border/30">
                  <th className="p-4 font-bold text-foreground border-b border-border">Service</th>
                  <th className="p-4 font-bold text-foreground border-b border-border text-center">Elite</th>
                  <th className="p-4 font-bold text-foreground border-b border-border text-center">Prestige</th>
                  <th className="p-4 font-bold text-foreground border-b border-border text-center">Sovereign</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: 'Multi-Currency Accounts', e: '✓', p: '✓', s: '✓' },
                  { name: 'International Transfers', e: '✓', p: '✓', s: '✓' },
                  { name: 'Virtual Card', e: '✓', p: '✓', s: '✓' },
                  { name: 'Physical Card', e: '—', p: '✓', s: '✓' },
                  { name: 'Crypto Trading', e: '—', p: '✓', s: '✓' },
                  { name: 'Business Banking', e: '—', p: 'By Application', s: '✓' },
                  { name: 'Dedicated Private Banker', e: '—', p: '—', s: '✓' },
                  { name: 'Wealth Management', e: '—', p: '—', s: '✓' },
                  { name: 'Concierge & Lifestyle', e: '—', p: '—', s: '✓' },
                  { name: 'Airport Lounge Access', e: '—', p: '—', s: '✓' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-card/50 transition-colors">
                    <td className="p-4 font-medium text-foreground">{row.name}</td>
                    <td className="p-4 text-center font-bold text-foreground/70">{row.e === '✓' ? <span className="text-emerald-500">✓</span> : row.e}</td>
                    <td className="p-4 text-center font-bold text-foreground/70">{row.p === '✓' ? <span className="text-emerald-500">✓</span> : row.p}</td>
                    <td className="p-4 text-center font-bold text-foreground/70">{row.s === '✓' ? <span className="text-emerald-500">✓</span> : row.s}</td>
                  </tr>
                ))}
                <tr className="bg-primary/5">
                  <td className="p-4 font-bold text-primary">Minimum Assets</td>
                  <td className="p-4 text-center font-bold text-primary">$100K+</td>
                  <td className="p-4 text-center font-bold text-primary">$500K+</td>
                  <td className="p-4 text-center font-bold text-primary">$2M+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-background text-center relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-6">Access Reserved for Members</h2>
          <p className="text-xl text-foreground/70 mb-10">Submit your application to request access to our private banking services.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onRegister} className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2">
              Apply for Membership <ArrowRight size={18} />
            </button>
            <button onClick={() => onNavigate('contact')} className="px-8 py-4 bg-card border border-border text-foreground font-bold rounded-xl hover:border-primary/50 transition-all">
              Contact Membership Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
