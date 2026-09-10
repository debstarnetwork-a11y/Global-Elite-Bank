import { X, ArrowLeft } from 'lucide-react';

export function PrivacyPolicy({ onClose }: { onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border w-full max-w-3xl rounded-2xl p-6 md:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/40 gap-3">
          <button
            id="privacy-policy-back-btn"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-background text-foreground border border-border hover:border-primary/50 transition-colors shadow-sm"
            title="Move back"
          >
            <ArrowLeft size={15} />
            <span>Move Back</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Privacy Policy</h2>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground p-1 rounded-lg">
            <X size={22} />
          </button>
        </div>
        
        <div className="space-y-6 text-foreground/80 leading-relaxed max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar text-sm md:text-base">
          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h3>
            <p className="mb-2">Global Elite collects information to provide better services to our customers. We collect information in the following ways:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Information:</strong> Name, address, phone number, email address, Social Security number, and other identifying information</li>
              <li><strong>Financial Information:</strong> Account balances, payment history, credit information, and transaction details</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information, and usage data</li>
              <li><strong>Communication Records:</strong> Records of your communications with us, including phone calls and emails</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h3>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide and maintain our banking services</li>
              <li>Process transactions and manage your accounts</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Prevent fraud and enhance security</li>
              <li>Improve our services and customer experience</li>
              <li>Communicate with you about your accounts and services</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">3. Information Sharing</h3>
            <p className="mb-2">We do not sell, rent, or trade your personal information. We may share your information only in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>With your consent or at your direction</li>
              <li>With service providers who assist us in our operations</li>
              <li>To comply with legal obligations or court orders</li>
              <li>To protect our rights, property, or safety</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">4. Data Security</h3>
            <p className="mb-2">We implement robust security measures to protect your information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Encryption:</strong> All sensitive data is encrypted in transit and at rest</li>
              <li><strong>Access Controls:</strong> Strict access controls limit who can view your information</li>
              <li><strong>Monitoring:</strong> Continuous monitoring for suspicious activities</li>
              <li><strong>Regular Audits:</strong> Regular security audits and assessments</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">5. Your Rights and Choices</h3>
            <p className="mb-2">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access and review your personal information</li>
              <li>Request corrections to inaccurate information</li>
              <li>Opt out of certain communications</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>File a complaint with regulatory authorities</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">6. Cookies and Tracking Technologies</h3>
            <p className="mb-2">We use cookies and similar technologies to enhance your experience on our website. These technologies help us:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content and advertisements</li>
              <li>Improve website functionality and performance</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">7. Third-Party Services</h3>
            <p>Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">8. Children's Privacy</h3>
            <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">9. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date.</p>
          </section>
        </div>

        <div className="mt-6 pt-4 border-t border-border/40 flex justify-start">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-foreground/10 text-foreground font-bold rounded-xl hover:bg-foreground/20 transition-colors text-sm flex items-center gap-1.5"
          >
            <ArrowLeft size={15} />
            <span>Move Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function TermsOfService({ onClose }: { onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border w-full max-w-3xl rounded-2xl p-6 md:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/40 gap-3">
          <button
            id="terms-back-btn"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-background text-foreground border border-border hover:border-primary/50 transition-colors shadow-sm"
            title="Move back"
          >
            <ArrowLeft size={15} />
            <span>Move Back</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Terms of Service</h2>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground p-1 rounded-lg">
            <X size={22} />
          </button>
        </div>
        <div className="space-y-6 text-foreground/80 leading-relaxed max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar text-sm md:text-base">
          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">1. Agreement to Terms</h3>
            <p>By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.</p>
          </section>
          
          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">2. Account Registration</h3>
            <p>To use certain features of our services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
          </section>
          
          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">3. Use of Services</h3>
            <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You must not use our services in any way that violates any applicable local, national, or international law or regulation.</p>
          </section>
          
          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">4. Limitation of Liability</h3>
            <p>In no event shall Global Elite, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.</p>
          </section>
        </div>

        <div className="mt-6 pt-4 border-t border-border/40 flex justify-start">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-foreground/10 text-foreground font-bold rounded-xl hover:bg-foreground/20 transition-colors text-sm flex items-center gap-1.5"
          >
            <ArrowLeft size={15} />
            <span>Move Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function LegalDisclosure({ onClose }: { onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border w-full max-w-3xl rounded-2xl p-6 md:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/40 gap-3">
          <button
            id="legal-disclosure-back-btn"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-background text-foreground border border-border hover:border-primary/50 transition-colors shadow-sm"
            title="Move back"
          >
            <ArrowLeft size={15} />
            <span>Move Back</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Legal Disclosure</h2>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground p-1 rounded-lg">
            <X size={22} />
          </button>
        </div>
        <div className="space-y-6 text-foreground/80 leading-relaxed max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar text-sm md:text-base">
          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">Company Information</h3>
            <p>Global Elite Bank Ltd.<br />Route de Saint-Julien 114<br />1228 Plan-les-Ouates, Switzerland<br />Registration Number: CHE-123.456.789<br />Regulated by the Swiss Financial Market Supervisory Authority (FINMA).</p>
          </section>
          
          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">Regulatory Status</h3>
            <p>Global Elite Bank is authorized and regulated by FINMA. We are a member of the Swiss Bankers Association (SBA) and a signatory to the Agreement on the Swiss banks' code of conduct with regard to the exercise of due diligence (CDB).</p>
          </section>
          
          <section>
            <h3 className="text-xl font-bold text-foreground mb-3">Deposit Protection</h3>
            <p>Your deposits are protected by the Swiss deposit insurance scheme (esisuisse). The maximum amount covered by the scheme is CHF 100,000 per client and bank.</p>
          </section>
        </div>

        <div className="mt-6 pt-4 border-t border-border/40 flex justify-start">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-foreground/10 text-foreground font-bold rounded-xl hover:bg-foreground/20 transition-colors text-sm flex items-center gap-1.5"
          >
            <ArrowLeft size={15} />
            <span>Move Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
