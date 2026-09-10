import React, { useState } from 'react';
import { useBank } from '../store';
import { ArrowRight, ShieldCheck, Mail, Lock, User, Key, CheckCircle, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { BiometricLogin } from './BiometricLogin';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { validateNewPassword } from '../utils/passwordStrength';

export function SignInView({ onBack, onSuccess }: { onBack: () => void, onSuccess: (user?: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const isAdminPath = typeof window !== "undefined" && (
    window.location.pathname.toLowerCase().replace(/\/+$/, '') === "/admin" ||
    window.location.pathname.toLowerCase().endsWith('/admin') ||
    window.location.hash.toLowerCase().includes('admin')
  );
  const { login, loginAsAdmin, adminSettings, currentUser, users, adminUpdateUser, sendMockEmail } = useBank();

  // Forgot Password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'verify' | 'success'>('email');
  const [generatedResetCode, setGeneratedResetCode] = useState('');
  const [enteredResetCode, setEnteredResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);


  const handleSendResetCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setForgotError('');
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your registered email address.");
      return;
    }

    const targetUser = users.find(u => u.email.trim().toLowerCase() === forgotEmail.trim().toLowerCase());
    if (!targetUser) {
      setForgotError("No registered client account was found for this email address. Please check and try again.");
      return;
    }

    setIsSendingCode(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedResetCode(code);

    setTimeout(() => {
      sendMockEmail({
        to: forgotEmail.trim(),
        subject: "🔐 Secure Password Reset Code - Global Elite Bank",
        body: `Dear ${targetUser.name},

A password reset request has been initiated for your Global Elite Bank account (${forgotEmail.trim()}).

Your 6-Digit Password Reset Verification Code is:

  >>>  ${code}  <<<

This code is valid for 15 minutes. Enter this code on the password reset screen along with your desired new password.

If you did not initiate this request, please contact Global Elite Bank Security Operations Center immediately.

Warm regards,
Private Banking Security & Identity Directorate
Global Elite Bank, Zurich, Switzerland`
      });
      setIsSendingCode(false);
      setForgotStep('verify');
    }, 400);
  };

  const handleVerifyAndResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!enteredResetCode.trim() || enteredResetCode.trim() !== generatedResetCode) {
      setForgotError("Invalid verification code. Please check your email or request a new code.");
      return;
    }

    const pwdCheck = validateNewPassword(newPassword);
    if (!pwdCheck.valid) {
      setForgotError(pwdCheck.error || "New password must be at least 6 characters with a mix of characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match. Please re-enter.");
      return;
    }

    const targetUser = users.find(u => u.email.trim().toLowerCase() === forgotEmail.trim().toLowerCase());
    if (targetUser) {
      adminUpdateUser(targetUser.id, { password: newPassword });
      sendMockEmail({
        to: forgotEmail.trim(),
        subject: "✅ Password Updated Successfully - Global Elite Bank",
        body: `Dear ${targetUser.name},

Your Global Elite Bank account password has been successfully updated.

You may now log in to the private banking portal using your new credentials.

Warm regards,
Private Banking Security Directorate
Global Elite Bank, Zurich, Switzerland`
      });
    }

    setForgotStep('success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    const result = login(email, password, isAdminPath);
    if (result.success) {
      // Require Two-Factor Authentication (Thumbprint biometrics) for all users, including Admin
      setStep(2);
    } else {
      setError(result.error || "Invalid credentials");
    }
  };

  if (step === 2) {
    return (
      <BiometricLogin 
        onLogin={() => onSuccess(currentUser)} 
        onBack={() => setStep(1)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <button onClick={onBack} className="absolute top-8 left-8 text-sm font-bold text-foreground/50 hover:text-foreground transition-colors">
        ← Back to Home
      </button>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 relative z-10 shadow-xl">
                {adminSettings?.logoUrl ? (
          <div className="flex flex-col items-center justify-center mb-6">
            <img src={adminSettings.logoUrl} alt="Global Elite Bank Logo" className="w-20 h-20 mb-3 object-contain" />
            
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mb-6">
            <img src="/logo.png" alt="Global Elite Logo" className="w-16 h-16 mb-3 object-contain" />
            
          </div>
        )}
        
        {!isForgotPassword && (
          <>
            <h2 className="text-3xl font-extrabold text-foreground text-center mb-2">{isAdminPath ? "Admin Portal" : "Welcome Back"}</h2>
            <p className="text-foreground/50 text-sm text-center mb-8">Enter your credentials to access your portfolio.</p>
          </>
        )}

        {isForgotPassword ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-2">
              <button
                type="button"
                id="forgot-password-back-btn"
                onClick={() => {
                  setIsForgotPassword(false);
                  setForgotError('');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
              <span className="text-xs uppercase font-bold text-primary tracking-wider">Account Recovery</span>
            </div>

            {forgotStep === 'email' && (
              <form onSubmit={handleSendResetCode} className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-3">
                    <Key size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Reset Password</h3>
                  <p className="text-foreground/50 text-xs mt-1">
                    Enter your registered email address to receive an automatic verification code to set a new password.
                  </p>
                </div>

                {forgotError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertTriangle size={16} className="shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                    <input
                      type="email"
                      id="forgot-password-email-input"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                      className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="forgot-password-send-code-btn"
                  disabled={isSendingCode}
                  className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSendingCode ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Sending Code to Email...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Code</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {forgotStep === 'verify' && (
              <form onSubmit={handleVerifyAndResetPassword} className="space-y-4">
                <div className="text-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-2">
                    <Mail size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Set New Password</h3>
                  <p className="text-foreground/60 text-xs mt-1">
                    An automatic reset code was sent to <strong className="text-foreground font-mono">{forgotEmail}</strong>. Enter code & your new password.
                  </p>
                </div>

                {forgotError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertTriangle size={16} className="shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest">6-Digit Code</label>
                    <button
                      type="button"
                      onClick={() => handleSendResetCode()}
                      className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={10} /> Resend Code
                    </button>
                  </div>
                  <input
                    type="text"
                    id="forgot-password-code-input"
                    maxLength={6}
                    value={enteredResetCode}
                    onChange={e => setEnteredResetCode(e.target.value.replace(/\D/g, ''))}
                    required
                    className="w-full bg-background border border-border rounded-xl py-2.5 px-4 text-center text-lg font-mono tracking-[0.4em] focus:outline-none focus:border-primary text-foreground font-bold"
                    placeholder="••••••"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5 block">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                    <input
                      type="password"
                      id="forgot-password-new-input"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground"
                      placeholder="Min. 6 chars with letters & numbers"
                    />
                  </div>
                  <div className="mt-2">
                    <PasswordStrengthMeter password={newPassword} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1.5 block">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                    <input
                      type="password"
                      id="forgot-password-confirm-input"
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      required
                      className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="forgot-password-submit-btn"
                  className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-sm shadow-md mt-2 cursor-pointer"
                >
                  <CheckCircle size={16} />
                  <span>Update & Set New Password</span>
                </button>
              </form>
            )}

            {forgotStep === 'success' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Password Reset Complete</h3>
                <p className="text-foreground/70 text-sm max-w-xs mx-auto">
                  Your account password has been successfully updated. You can now log in using your new credentials.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    id="forgot-password-success-login-btn"
                    onClick={() => {
                      setEmail(forgotEmail);
                      setPassword(newPassword);
                      setIsForgotPassword(false);
                    }}
                    className="w-full bg-foreground text-background font-bold py-3.5 rounded-xl hover:bg-foreground/90 transition-all text-sm cursor-pointer"
                  >
                    Sign In with New Password
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold rounded-lg text-center">{error}</div>}
            <div>
              <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="name@example.com" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="••••••••" />
              </div>
            </div>


            <div className="flex justify-end mb-6">
              <button
                type="button"
                id="forgot-password-btn"
                onClick={() => {
                  setIsForgotPassword(true);
                  setForgotEmail(email || '');
                  setForgotStep('email');
                  setForgotError('');
                }}
                className="text-xs font-bold text-primary hover:text-primary/80 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            
            <button type="submit" className="w-full bg-foreground text-background font-bold py-3.5 rounded-xl hover:bg-foreground/90 transition-all mt-6">
              {isAdminPath ? "Sign In to Admin Portal" : "Sign In"}
            </button>
          </form>
        )}


      </div>
    </div>
  );
}

export function SignUpView({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {
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
    const pwdCheck = validateNewPassword(password);
    if (!pwdCheck.valid) {
      setError(pwdCheck.error || "Password must be at least 6 characters long with a mix of characters.");
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
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Brunei">Brunei</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Cabo Verde">Cabo Verde</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Central African Republic">Central African Republic</option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo (Congo-Brazzaville)">Congo (Congo-Brazzaville)</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czechia (Czech Republic)">Czechia (Czech Republic)</option>
                    <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">Dominican Republic</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Eswatini (fmr. 'Swaziland')">Eswatini (fmr. 'Swaziland')</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Greece">Greece</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bissau">Guinea-Bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Holy See">Holy See</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Laos">Laos</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldova">Moldova</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar (formerly Burma)">Myanmar (formerly Burma)</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="North Korea">North Korea</option>
                    <option value="North Macedonia">North Macedonia</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Palestine State">Palestine State</option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                    <option value="Saint Lucia">Saint Lucia</option>
                    <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Marino">San Marino</option>
                    <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Korea">South Korea</option>
                    <option value="South Sudan">South Sudan</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Timor-Leste">Timor-Leste</option>
                    <option value="Togo">Togo</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
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
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="Min. 6 chars with letters & numbers" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-1 block">Confirm Password*</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="••••••••" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <PasswordStrengthMeter password={password} />
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
