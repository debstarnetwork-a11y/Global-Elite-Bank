import React, { useState } from 'react';
import { Mail, MapPin, MessageSquare, Briefcase, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useBank, DEFAULT_FRONTEND_CONTENT } from '../../store';

export function ContactView({ onRegister }: { onRegister: () => void }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { createContactInquiry, adminSettings } = useBank();
  
  const content = {
    ...DEFAULT_FRONTEND_CONTENT,
    ...(adminSettings.frontendContent || {})
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    netWorth: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createContactInquiry(formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', country: '', netWorth: '', message: '' });
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-card border-b border-border/50">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 tracking-tight mb-6">
            {content.contactPageHeading || "Contact Our Membership Team"}
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Whether you have a question about membership, need assistance with your application, or are an existing member seeking support — our team is available to assist you with the discretion and professionalism you deserve.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-4">
              {content.howToReachUsHeading || "How to Reach Us"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <Briefcase size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{content.membershipApplicationsHeading}</h3>
              <p className="text-sm text-foreground/70 mb-4">For inquiries regarding membership applications, eligibility, and onboarding.</p>
              <p className="text-sm font-medium text-foreground">Email: <a href={`mailto:${content.membershipApplicationsEmail}`} className="text-primary hover:underline">{content.membershipApplicationsEmail}</a></p>
              <p className="text-xs text-foreground/50 mt-2 uppercase tracking-widest font-bold">Response: Within 1 business day</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{content.memberSupportHeading}</h3>
              <p className="text-sm text-foreground/70 mb-4">For approved members seeking account assistance, transfer support, or general banking help.</p>
              <p className="text-sm font-medium text-foreground">Email: <a href={`mailto:${content.memberSupportEmail}`} className="text-primary hover:underline">{content.memberSupportEmail}</a></p>
              <p className="text-xs text-foreground/50 mt-2 uppercase tracking-widest font-bold">Availability: 24/7</p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{content.privateBankingHeading}</h3>
              <p className="text-sm text-foreground/70 mb-4">For Sovereign-tier members and those seeking wealth management services.</p>
              <p className="text-sm font-medium text-foreground">Email: <a href={`mailto:${content.privateBankingEmail}`} className="text-primary hover:underline">{content.privateBankingEmail}</a></p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{content.headOfficeHeading}</h3>
              <p className="text-sm text-foreground/70 mb-4 whitespace-pre-wrap">{content.headOfficeAddress}</p>
              <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold">Hours: {content.headOfficeHours}</p>
              <p className="text-xs text-rose-500 mt-2 font-bold bg-rose-500/10 px-2 py-1 rounded inline-block">Visits by appointment only</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form & FAQ */}
      <section className="py-24 px-6 bg-card border-y border-border/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Inquiry Form */}
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-4">Submit an Inquiry</h2>
            <p className="text-foreground/70 mb-8">Complete the form below and a member of our Membership Team will contact you within 1 business day.</p>
            
            {isSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl p-8 text-center flex flex-col items-center">
                <CheckCircle2 size={48} className="mb-4" />
                <h3 className="text-2xl font-bold mb-2">Inquiry Submitted</h3>
                <p>Thank you for reaching out. A member of our Membership Team will contact you shortly.</p>
              </div>
            ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Full Name*</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder="e.g., John Smith" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Email Address*</label>
                  <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" placeholder="e.g., john@email.com" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Country of Residence*</label>
                  <select required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground appearance-none">
                    <option value="">Select Country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ch">Switzerland</option>
                    <option value="sg">Singapore</option>
                    <option value="ae">UAE</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">I Am Interested In*</label>
                  <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground appearance-none">
                    <option value="">Select Topic</option>
                    <option value="membership">Membership Application</option>
                    <option value="private">Private Banking Services</option>
                    <option value="business">Business Banking</option>
                    <option value="wealth">Wealth Management</option>
                    <option value="support">Existing Account Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Estimated Net Worth*</label>
                <select required value={formData.netWorth} onChange={e => setFormData({...formData, netWorth: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground appearance-none">
                  <option value="">Select Range</option>
                  <option value="1">$100K – $500K</option>
                  <option value="2">$500K – $1M</option>
                  <option value="3">$1M – $5M</option>
                  <option value="4">$5M – $10M</option>
                  <option value="5">$10M+</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1 block">Message*</label>
                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={5} placeholder="Please describe your inquiry or banking requirements..." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground resize-none"></textarea>
              </div>

              <button className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all">
                Submit Inquiry
              </button>
              <p className="text-xs text-foreground/50 text-center mt-4">
                By submitting this form, you agree to our Privacy Policy and Terms of Service. This form is not a membership application.
              </p>
            </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "How do I apply for membership?", a: "Click \"Apply for Membership\" and complete the application form. You will be asked to provide details about your financial standing, business activities, and banking needs. Our Membership Committee reviews every application personally." },
                { q: "How long does the application process take?", a: "Our Membership Committee typically completes its review within 2–5 business days. Complex applications may take longer. You will be notified of the decision via email." },
                { q: "What happens after I am approved?", a: "Upon approval, you will receive your private login credentials and a personal onboarding session with a member of our team. You can then fund your account and begin using our services immediately." },
                { q: "What if my application is declined?", a: "Declined applicants are welcome to reapply after 12 months. The decision of the Membership Committee is final and confidential." },
                { q: "Is there a fee to apply?", a: "No. The membership application is complimentary. However, please note that certain services and account tiers have associated fees, which will be clearly communicated upon approval." },
                { q: "What documents are required for verification?", a: "Approved applicants must provide a valid government-issued ID (passport or national ID), proof of address (utility bill or bank statement dated within 3 months), and documentation verifying assets or income as declared in the application." }
              ].map((faq, i) => (
                <div key={i} className="bg-background rounded-xl p-6 border border-border">
                  <h4 className="font-bold text-foreground mb-2 text-lg">{faq.q}</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="text-rose-500" />
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300">
              {content.urgentAssistanceHeading || "Urgent Assistance (Existing Members)"}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border border-l-4 border-l-rose-500">
              <h4 className="font-bold text-foreground mb-2">{content.cardLostHeading}</h4>
              <p className="text-sm text-foreground/70 mb-3">Report it immediately via secure message in your member portal or email:</p>
              <a href={`mailto:${content.cardLostEmail}`} className="text-primary text-sm font-bold hover:underline">{content.cardLostEmail}</a>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border border-l-4 border-l-rose-500">
              <h4 className="font-bold text-foreground mb-2">{content.suspiciousActivityHeading}</h4>
              <p className="text-sm text-foreground/70 mb-3">Report it instantly via secure message in your member portal or email:</p>
              <a href={`mailto:${content.suspiciousActivityEmail}`} className="text-primary text-sm font-bold hover:underline">{content.suspiciousActivityEmail}</a>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border border-l-4 border-l-blue-500">
              <h4 className="font-bold text-foreground mb-2">{content.mediaInquiriesHeading}</h4>
              <p className="text-sm text-foreground/70 mb-3">Contact our press office directly:</p>
              <a href={`mailto:${content.mediaInquiriesEmail}`} className="text-primary text-sm font-bold hover:underline">{content.mediaInquiriesEmail}</a>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border border-l-4 border-l-blue-500">
              <h4 className="font-bold text-foreground mb-2">{content.partnershipInquiriesHeading}</h4>
              <p className="text-sm text-foreground/70 mb-3">Reach our business development team:</p>
              <a href={`mailto:${content.partnershipInquiriesEmail}`} className="text-primary text-sm font-bold hover:underline">{content.partnershipInquiriesEmail}</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-card text-center relative border-t border-border/50">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:from-[#1e3a8a] hover:via-accent hover:to-secondary active:from-[#1e3a8a] active:via-accent active:to-secondary cursor-pointer transition-all duration-300 mb-6">Begin Your Application</h2>
          <p className="text-xl text-foreground/70 mb-10">Join the world's most exclusive banking network. Submit your application today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onRegister} className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2">
              Apply for Membership <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
