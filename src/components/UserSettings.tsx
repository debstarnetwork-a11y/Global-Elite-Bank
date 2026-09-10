import { useState } from 'react';
import { useBank } from '../store';
import { ShieldCheck, User, Image as ImageIcon } from 'lucide-react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { validateNewPassword } from '../utils/passwordStrength';

export function SettingsView() {
  const { currentUser, changePassword, updateUserProfilePicture } = useBank();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Profile Image State
  const [imageUrl, setImageUrl] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  const handleSecuritySubmit = (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setIsError(true);
      return;
    }
    const pwdCheck = validateNewPassword(newPassword);
    if (!pwdCheck.valid) {
      setMessage(pwdCheck.error || 'Password must be at least 6 characters with a mix of characters');
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

  const handleProfileImageSubmit = (e: any) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      let finalUrl = imageUrl.trim();
      const imgMatch = finalUrl.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) {
        finalUrl = imgMatch[1];
      }
      updateUserProfilePicture(finalUrl);
      setProfileMsg('Profile picture updated successfully');
      setImageUrl('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-foreground/50 hover:text-foreground'}`}
        >
          <div className="flex items-center gap-2">
            <User size={16} /> My Profile
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'security' ? 'border-primary text-primary' : 'border-transparent text-foreground/50 hover:text-foreground'}`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} /> Security
          </div>
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-foreground">Personal Information</h3>
            <p className="text-sm text-foreground/50">Your personal details are securely stored. To update this information, please contact your account manager or the admin.</p>
            
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Full Name</label>
                <div className="w-full bg-background border border-border rounded-xl p-3 text-foreground opacity-70">
                  {currentUser?.name || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Email Address</label>
                <div className="w-full bg-background border border-border rounded-xl p-3 text-foreground opacity-70">
                  {currentUser?.email || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Phone Number</label>
                <div className="w-full bg-background border border-border rounded-xl p-3 text-foreground opacity-70">
                  {currentUser?.mobile || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Country</label>
                <div className="w-full bg-background border border-border rounded-xl p-3 text-foreground opacity-70">
                  {currentUser?.country || currentUser?.nationality || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Residential Address</label>
                <div className="w-full bg-background border border-border rounded-xl p-3 text-foreground opacity-70">
                  {currentUser?.residentialAddress || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-foreground">Profile Picture</h3>
            <p className="text-sm text-foreground/50">Update your account headshot or passport photo by pasting an image URL.</p>
            
            <div className="flex items-center gap-4 py-4">
              <div className="w-20 h-20 rounded-full border-2 border-primary p-1 shrink-0">
                <img 
                  src={currentUser?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <form onSubmit={handleProfileImageSubmit} className="space-y-3">
                  <div className="relative">
                    <ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                    <input 
                      type="text" 
                      placeholder="Paste image URL or HTML tag here..." 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-3 focus:border-primary outline-none text-sm text-foreground"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors">
                    Update Picture
                  </button>
                  {profileMsg && <p className="text-emerald-500 text-xs font-bold">{profileMsg}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Security Center</h2>
            <p className="text-sm text-foreground/70 max-w-md">Manage your account security and password.</p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-lg font-bold text-foreground mb-6">Change Password</h3>
            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              {message && (
                <div className={`p-3 rounded-lg text-sm font-bold ${isError ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {message}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground"
                  placeholder="Min. 6 chars with mix of characters"
                  required
                />
                <div className="mt-2">
                  <PasswordStrengthMeter password={newPassword} />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-foreground"
                  required
                />
              </div>
              
              <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
