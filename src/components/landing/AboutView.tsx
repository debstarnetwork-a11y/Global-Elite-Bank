import React from 'react';
import { ShieldCheck, Globe, Users, Award, ArrowRight } from 'lucide-react';
import { useBank, DEFAULT_FRONTEND_CONTENT } from '../../store';

export function AboutView({ onRegister, onNavigate }: { onRegister: () => void, onNavigate: (view: any) => void }) {
  const { adminSettings } = useBank();
  
  const content = {
    ...DEFAULT_FRONTEND_CONTENT,
    ...(adminSettings.frontendContent || {})
  };

  const committeeMembers = [
    {
      name: content.aboutTeamEdwardName || 'Sir Edward Beaumont',
      role: content.aboutTeamEdwardRole || 'Chairman, Membership Committee',
      heading: content.aboutTeamEdwardHeading || 'Membership Committee Chairman',
      desc: 'Former Head of Private Banking at a leading Swiss institution with 35+ years of experience serving UHNW clients worldwide.',
      img: content.aboutTeamEdwardImg || 'https://i.ibb.co/jPQpZPtq/Sir-Edward-Beaumont.jpg'
    },
    {
      name: content.aboutTeamHelenaName || 'Dr. Helena Van Der Berg',
      role: content.aboutTeamHelenaRole || 'Chief Risk Officer',
      heading: content.aboutTeamHelenaHeading || 'Chief Risk Officer',
      desc: 'Former regulator at the European Central Bank with deep expertise in financial crime prevention and regulatory compliance.',
      img: content.aboutTeamHelenaImg || 'https://i.ibb.co/93tLKGxv/Dr-Helena-Van-Der-Berg.jpg'
    },
    {
      name: content.aboutTeamJonathanName || 'Mr. Jonathan Westwood',
      role: content.aboutTeamJonathanRole || 'Head of Private Banking',
      heading: content.aboutTeamJonathanHeading || 'Head of Private Banking',
      desc: 'Seasoned relationship manager who has personally overseen portfolios exceeding $5 billion for high-net-worth families and institutions.',
      img: content.aboutTeamJonathanImg || 'https://i.ibb.co/mFYbyrLh/Mr-Jonathan-Westwood.jpg'
    },
    {
      name: content.aboutTeamIsabelleName || 'Ms. Isabelle Moreau',
      role: content.aboutTeamIsabelleRole || 'Chief Compliance Officer',
      heading: content.aboutTeamIsabelleHeading || 'Chief Compliance Officer',
      desc: 'Former Head of Anti-Money Laundering at a major international bank, ensuring that GEB maintains the highest standards of integrity.',
      img: content.aboutTeamIsabelleImg || 'https://i.ibb.co/1Gwq9LMm/Ms-Isabelle-Moreau.jpg'
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-card border-b border-border/50">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 tracking-tight mb-6">
            A Private Institution for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300">Select Few</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Global Elite Bank was founded on a singular principle: true banking excellence requires selectivity. We are not a mass-market bank. We are a curated community of the world's most accomplished individuals.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-8">Our History</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">The Founding Vision</h3>
                  <p className="text-foreground/70 leading-relaxed">Global Elite Bank was established in 2016 by a consortium of private bankers, wealth managers, and technology pioneers who recognized a gap in the market: the world's elite deserved a bank that combined the discretion and service of traditional private banking with the speed and innovation of modern technology.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">The Membership Model</h3>
                  <p className="text-foreground/70 leading-relaxed">Unlike conventional banks that pursue customer acquisition at any cost, GEB adopted a membership model from day one. Every applicant is assessed on financial standing, business legitimacy, and personal integrity. This ensures that our community remains exclusive, secure, and aligned with our values.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">The Global Elite Network</h3>
                  <p className="text-foreground/70 leading-relaxed">Today, our 48,500+ members form one of the world's most powerful financial networks. From entrepreneurs and investors to family offices and global enterprises, our members share a commitment to excellence and a desire for banking that matches their ambition.</p>
                </div>
              </div>
            </div>
            <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img src="https://images.unsplash.com/photo-1577416412292-747c6607f055?auto=format&fit=crop&q=80&w=1000" alt="Swiss Bank Vault" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <p className="text-xl font-bold text-white mb-2">Geneva, Switzerland</p>
                <p className="text-white/70">Established 2016</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 px-6 bg-card border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-background p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-foreground/70 leading-relaxed">To provide the world's most accomplished individuals with a private banking experience that is secure, sophisticated, and truly global — without compromise.</p>
            </div>
            <div className="bg-background p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-foreground/70 leading-relaxed">A global network of elite individuals connected by a shared financial institution that anticipates their needs, protects their privacy, and facilitates their ambitions.</p>
            </div>
          </div>
          
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck size={24} />, title: 'Discretion', desc: 'Your financial privacy is sacred. We operate with the utmost confidentiality across all touchpoints.' },
              { icon: <Award size={24} />, title: 'Excellence', desc: 'We hold ourselves to the highest standards in service, technology, and integrity.' },
              { icon: <Globe size={24} />, title: 'Global Fluency', desc: 'We understand the complexities of international wealth and navigate them seamlessly for our members.' },
              { icon: <Users size={24} />, title: 'Selectivity', desc: 'We protect the quality of our community by carefully vetting every applicant.' },
              { icon: <ArrowRight size={24} />, title: 'Innovation', desc: 'We blend the finest traditions of private banking with cutting-edge financial technology.' }
            ].map((v, i) => (
              <div key={i} className="bg-background p-6 rounded-xl border border-border">
                <div className="text-primary mb-4">{v.icon}</div>
                <h4 className="font-bold text-foreground mb-2">{v.title}</h4>
                <p className="text-sm text-foreground/70 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Membership Committee */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-6">
              {content.committeeSectionHeading || "The Gatekeepers of Excellence"}
            </h2>
            <p className="text-foreground/70 max-w-3xl text-lg leading-relaxed mb-8">
              Every application to Global Elite Bank is reviewed by our Membership Committee — a distinguished panel of senior bankers, compliance experts, and business leaders. The Committee evaluates each applicant on:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-foreground/80">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div> <strong className="text-foreground">Financial Standing:</strong> Verified assets, income sources, and financial stability</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div> <strong className="text-foreground">Business Legitimacy:</strong> Nature of business activities and international exposure</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div> <strong className="text-foreground">Compliance & Integrity:</strong> Background checks, sanctions screening, and risk assessment</li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div> <strong className="text-foreground">Alignment with Values:</strong> Commitment to lawful, ethical, and responsible banking</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {committeeMembers.map((member, i) => (
              <div key={i} className="bg-card p-6 rounded-xl border border-border flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-border/50">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-foreground mb-1">{member.name}</h4>
                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-4">{member.role}</p>
                <p className="text-sm text-foreground/70 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-24 px-6 bg-card border-y border-border/50 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-12">Recognition & Standing</h2>
          <div className="space-y-4">
             <div className="p-4 bg-background border border-border rounded-lg inline-block w-full max-w-md mx-auto">
               <span className="text-xl mr-2">🏆</span> <span className="font-medium text-foreground">Best Private Digital Bank 2024</span> <span className="text-sm text-foreground/50 ml-2">— Global Finance Awards</span>
             </div>
             <div className="p-4 bg-background border border-border rounded-lg inline-block w-full max-w-md mx-auto">
               <span className="text-xl mr-2">🏆</span> <span className="font-medium text-foreground">Most Exclusive Banking Experience</span> <span className="text-sm text-foreground/50 ml-2">— European Banking Excellence</span>
             </div>
             <div className="p-4 bg-background border border-border rounded-lg inline-block w-full max-w-md mx-auto">
               <span className="text-xl mr-2">🏆</span> <span className="font-medium text-foreground">Top 10 Private Banks Worldwide</span> <span className="text-sm text-foreground/50 ml-2">— Forbes Wealth Report</span>
             </div>
             <div className="p-4 bg-background border border-border rounded-lg inline-block w-full max-w-md mx-auto">
               <span className="text-xl mr-2">🏆</span> <span className="font-medium text-foreground">Excellence in Financial Security</span> <span className="text-sm text-foreground/50 ml-2">— International Banking Awards</span>
             </div>
             <div className="p-4 bg-background border border-border rounded-lg inline-block w-full max-w-md mx-auto">
               <span className="text-xl mr-2">🏆</span> <span className="font-medium text-foreground">Member Satisfaction 4.9/5</span> <span className="text-sm text-foreground/50 ml-2">— Independent Review</span>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-background text-center relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-6">Membership is a Privilege</h2>
          <p className="text-xl text-foreground/70 mb-10">Submit your application. If approved, you will join a community of the world's most accomplished individuals.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onRegister} className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2">
              Apply for Membership <ArrowRight size={18} />
            </button>
            <button onClick={() => onNavigate('contact')} className="px-8 py-4 bg-card border border-border text-foreground font-bold rounded-xl hover:border-primary/50 transition-all">
              Speak to Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
