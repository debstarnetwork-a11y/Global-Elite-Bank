import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

old_signup = re.search(r'export function SignUpView.*', content, flags=re.DOTALL).group(0)

new_signup = """export function SignUpView({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {
  const { register, adminSettings } = useBank();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [declaration, setDeclaration] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const handleRegister = (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!declaration || !privacyConsent) {
      setError("You must agree to the declaration and privacy policy.");
      return;
    }
    
    register(name, email, password);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 relative z-10 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Application Submitted</h2>
          <p className="text-foreground/70 text-sm mb-8">
            Your application for membership has been successfully submitted. Please wait for an administrator to review and activate your account. You will receive an email once your account is ready.
          </p>
          <button onClick={onBack} className="w-full bg-foreground text-background font-bold py-3.5 rounded-xl hover:bg-foreground/90 transition-all">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6 relative font-sans">
      <div className="max-w-3xl mx-auto relative z-10">
        <button onClick={onBack} className="text-sm font-bold text-foreground/50 hover:text-foreground transition-colors mb-8">
          ← Back to Home
        </button>
        
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Apply for Membership</h1>
            <p className="text-foreground/70">Join the world's most exclusive banking network. Complete the application below. Our Membership Committee personally reviews every submission.</p>
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 text-primary text-sm rounded-lg">
              Notice: Submission of this application does not guarantee membership. All applications are subject to verification and approval.
            </div>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-8 text-left">
            {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold rounded-lg text-center">{error}</div>}
            
            {/* Section 1 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Section 1: Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Full Legal Name*</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="e.g., John Alexander Smith" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Email Address*</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="e.g., john@email.com" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Date of Birth*</label>
                  <input type="date" required className="w-full bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary text-foreground" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Nationality*</label>
                  <select required className="w-full bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary text-foreground appearance-none">
                    <option value="">Select Nationality</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ch">Switzerland</option>
                    <option value="sg">Singapore</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Residential Address*</label>
                  <input type="text" required className="w-full bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="Full residential address" />
                </div>
              </div>
            </div>

            {/* Account Setup */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Account Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Password*</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="••••••••" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Confirm Password*</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="••••••••" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Section 2: Financial Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Estimated Total Net Worth*</label>
                  <select required className="w-full bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary text-foreground appearance-none">
                    <option value="">Select Range</option>
                    <option value="1">$100K – $500K</option>
                    <option value="2">$500K – $1M</option>
                    <option value="3">$1M – $5M</option>
                    <option value="4">$5M – $10M</option>
                    <option value="5">$10M+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Primary Source of Wealth*</label>
                  <select required className="w-full bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary text-foreground appearance-none">
                    <option value="">Select Source</option>
                    <option value="business">Business Ownership</option>
                    <option value="employment">Employment / Executive Compensation</option>
                    <option value="investments">Investments</option>
                    <option value="inheritance">Inheritance</option>
                    <option value="realestate">Real Estate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Annual Income (USD)*</label>
                  <select required className="w-full bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary text-foreground appearance-none">
                    <option value="">Select Range</option>
                    <option value="1">Under $100K</option>
                    <option value="2">$100K – $250K</option>
                    <option value="3">$250K – $500K</option>
                    <option value="4">$500K – $1M</option>
                    <option value="5">$1M+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Primary Bank(s) Currently Used*</label>
                  <input type="text" required className="w-full bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="e.g., UBS, J.P. Morgan" />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Section 3: Business & Professional Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Employment Status*</label>
                  <select required className="w-full bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary text-foreground appearance-none">
                    <option value="">Select Status</option>
                    <option value="owner">Business Owner / Entrepreneur</option>
                    <option value="executive">Executive / C-Suite</option>
                    <option value="professional">Professional (Doctor, Lawyer, etc.)</option>
                    <option value="investor">Investor</option>
                    <option value="retired">Retired</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Company / Business Name</label>
                  <input type="text" className="w-full bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="Enter company name" />
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Section 4: Banking Requirements</h3>
              <div>
                 <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2 block">Services of Interest*</label>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                   {['Multi-Currency Accounts', 'International Transfers', 'Cryptocurrency Trading', 'Elite Debit Cards', 'Business Banking', 'Wealth Management', 'Concierge Services'].map(service => (
                     <label key={service} className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background" />
                       <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{service}</span>
                     </label>
                   ))}
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Expected Annual Transaction Volume*</label>
                  <select required className="w-full bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary text-foreground appearance-none">
                    <option value="">Select Range</option>
                    <option value="1">Under $100K</option>
                    <option value="2">$100K – $500K</option>
                    <option value="3">$500K – $1M</option>
                    <option value="4">$1M – $10M</option>
                    <option value="5">$10M+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Section 5: Declaration</h3>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required checked={declaration} onChange={e => setDeclaration(e.target.checked)} className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background" />
                <span className="text-sm text-foreground/70 leading-relaxed group-hover:text-foreground transition-colors">
                  I confirm that the information provided in this application is true and accurate. I understand that Global Elite Bank may verify the information provided and that any false or misleading statements may result in rejection or termination of membership.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required checked={privacyConsent} onChange={e => setPrivacyConsent(e.target.checked)} className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background" />
                <span className="text-sm text-foreground/70 leading-relaxed group-hover:text-foreground transition-colors">
                  I consent to Global Elite Bank processing my personal data for the purposes of assessing this application in accordance with the Privacy Policy.
                </span>
              </label>
            </div>

            <button type="submit" className="w-full bg-foreground text-background font-bold py-4 rounded-xl hover:bg-foreground/90 transition-all shadow-xl">
              Submit Application for Review
            </button>
            <p className="text-center text-xs text-foreground/50">
              Note: Upon submission, your application will be reviewed by our Membership Committee. You will receive a decision via email within 2–5 business days. If approved, you will receive your login credentials and onboarding instructions.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
"""

content = content.replace(old_signup, new_signup)

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)
