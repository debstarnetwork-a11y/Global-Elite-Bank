import re

with open('src/components/PlaceholderViews.tsx', 'r') as f:
    content = f.read()

security_view_start = "export function SecurityView() {"

new_security_view = """export function SecurityView() {
  const { changePassword } = useBank();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setIsError(true);
      return;
    }
    if (newPassword.length < 4) {
      setMessage('Password must be at least 4 characters');
      setIsError(true);
      return;
    }
    
    const success = changePassword(currentPassword, newPassword);
    if (success) {
      setMessage('Password changed successfully');
      setIsError(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage('Current password is incorrect');
      setIsError(true);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Security Center</h2>
        <p className="text-foreground/60 max-w-md">Your account is secured by AES-256 encryption and biometric validation. No active threats detected.</p>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <div className="p-4 border border-border rounded-xl bg-background flex items-center justify-between">
            <span className="text-sm font-bold">2FA Status</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">ACTIVE</span>
          </div>
          <div className="p-4 border border-border rounded-xl bg-background flex items-center justify-between">
            <span className="text-sm font-bold">Biometrics</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">ENROLLED</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Lock size={20} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Change Password</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2">Current Password</label>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-primary outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2">New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-primary outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2">Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-primary outline-none" 
              required 
            />
          </div>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm font-bold ${isError ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
              {message}
            </div>
          )}

          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors mt-2">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}"""

content = re.sub(r'export function SecurityView\(\) \{[\s\S]*', new_security_view, content)

with open('src/components/PlaceholderViews.tsx', 'w') as f:
    f.write(content)
