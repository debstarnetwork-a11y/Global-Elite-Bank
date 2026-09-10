const fs = require('fs');
const content = fs.readFileSync('src/components/AdminModules.tsx', 'utf8');

const regex = /export function AdminEmailServices\(\) \{[\s\S]*?alert\('Gallery & Email Services Settings Saved Successfully'\);\s*};\s*return \([\s\S]*?\n\s*\}\);\n\}/;

const replacement = `export function AdminEmailServices() {
  const { adminSettings, updateAdminSettings } = useBank();
  const [formData, setFormData] = useState({
    membershipApplicationsEmail: 'globalelitefund@gmail.com',
    membershipApplicationsHeading: 'Membership Applications',
    memberSupportEmail: 'globalelitefund@gmail.com',
    memberSupportHeading: 'Member Support',
    privateBankingEmail: 'globalelitefund@gmail.com',
    privateBankingHeading: 'Private Banking & Wealth',
    headOfficeAddress: 'Route de Saint-Julien 114, 1228 Plan-les-Ouates, Switzerland',
    headOfficeHeading: 'Head Office',
    headOfficeHours: 'Mon-Fri, 9:00 - 18:00 CET',
    cardLostEmail: 'globalelitefund@gmail.com',
    cardLostHeading: 'Card Lost or Stolen?',
    suspiciousActivityEmail: 'globalelitefund@gmail.com',
    suspiciousActivityHeading: 'Suspicious Activity?',
    mediaInquiriesEmail: 'globalelitefund@gmail.com',
    mediaInquiriesHeading: 'Media Inquiries?',
    partnershipInquiriesEmail: 'globalelitefund@gmail.com',
    partnershipInquiriesHeading: 'Partnership Inquiries?',
    aboutTeamIsabelleImg: 'https://i.ibb.co/1Gwq9LMm/Ms-Isabelle-Moreau.jpg',
    aboutTeamJonathanImg: 'https://i.ibb.co/mFYbyrLh/Mr-Jonathan-Westwood.jpg',
    aboutTeamHelenaImg: 'https://i.ibb.co/93tLKGxv/Dr-Helena-Van-Der-Berg.jpg',
    aboutTeamEdwardImg: 'https://i.ibb.co/jPQpZPtq/Sir-Edward-Beaumont.jpg',
    homeStaffImg: 'https://i.ibb.co/PsZ7fdd0/GEB-Staff-Photo.png',
    servicesHallImg: 'https://i.ibb.co/bjLWcpry/GEB-HALL-02.png',
    ...(adminSettings.frontendContent || {})
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateAdminSettings({ frontendContent: { ...(adminSettings.frontendContent || {}), ...formData } });
    alert('Gallery & Email Services Settings Saved Successfully');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Gallery & Email Services</h2>
      
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Contact & Support Emails</h3>
        <p className="text-foreground/70 mb-6">Manage the email addresses, titles, and contact information displayed on the frontend Contact page.</p>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border/50 pb-6">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Membership Applications Heading</label>
              <input type="text" name="membershipApplicationsHeading" value={formData.membershipApplicationsHeading} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Membership Applications Email</label>
              <input type="text" name="membershipApplicationsEmail" value={formData.membershipApplicationsEmail} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border/50 pb-6">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Member Support Heading</label>
              <input type="text" name="memberSupportHeading" value={formData.memberSupportHeading} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Member Support Email</label>
              <input type="text" name="memberSupportEmail" value={formData.memberSupportEmail} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border/50 pb-6">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Private Banking Heading</label>
              <input type="text" name="privateBankingHeading" value={formData.privateBankingHeading} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Private Banking Email</label>
              <input type="text" name="privateBankingEmail" value={formData.privateBankingEmail} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border/50 pb-6">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Card Lost/Stolen Heading</label>
              <input type="text" name="cardLostHeading" value={formData.cardLostHeading} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Card Lost/Stolen Email</label>
              <input type="text" name="cardLostEmail" value={formData.cardLostEmail} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border/50 pb-6">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Suspicious Activity Heading</label>
              <input type="text" name="suspiciousActivityHeading" value={formData.suspiciousActivityHeading} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Suspicious Activity Email</label>
              <input type="text" name="suspiciousActivityEmail" value={formData.suspiciousActivityEmail} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border/50 pb-6">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Media Inquiries Heading</label>
              <input type="text" name="mediaInquiriesHeading" value={formData.mediaInquiriesHeading} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Media Inquiries Email</label>
              <input type="text" name="mediaInquiriesEmail" value={formData.mediaInquiriesEmail} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border/50 pb-6">
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Partnership Inquiries Heading</label>
              <input type="text" name="partnershipInquiriesHeading" value={formData.partnershipInquiriesHeading} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Partnership Inquiries Email</label>
              <input type="text" name="partnershipInquiriesEmail" value={formData.partnershipInquiriesEmail} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold mt-8 mb-4">Head Office Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Head Office Heading</label>
            <input type="text" name="headOfficeHeading" value={formData.headOfficeHeading} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Head Office Address</label>
            <input type="text" name="headOfficeAddress" value={formData.headOfficeAddress} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Head Office Hours</label>
            <input type="text" name="headOfficeHours" value={formData.headOfficeHours} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
          </div>
        </div>

        <h3 className="text-lg font-bold mt-8 mb-4">Gallery Images (URLs)</h3>
        <p className="text-foreground/70 mb-6">Update the image links used across the frontend landing pages.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Homepage Staff Image</label>
            <input type="text" name="homeStaffImg" value={formData.homeStaffImg} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Services Hall Image</label>
            <input type="text" name="servicesHallImg" value={formData.servicesHallImg} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Team Member: Sir Edward</label>
            <input type="text" name="aboutTeamEdwardImg" value={formData.aboutTeamEdwardImg} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Team Member: Dr. Helena</label>
            <input type="text" name="aboutTeamHelenaImg" value={formData.aboutTeamHelenaImg} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Team Member: Mr. Jonathan</label>
            <input type="text" name="aboutTeamJonathanImg" value={formData.aboutTeamJonathanImg} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Team Member: Ms. Isabelle</label>
            <input type="text" name="aboutTeamIsabelleImg" value={formData.aboutTeamIsabelleImg} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none" />
          </div>
        </div>
        
        <button type="button" onClick={handleSave} className="px-4 py-2 bg-primary text-white font-bold rounded-lg mt-8 hover:bg-primary/90">Save All Settings</button>
      </div>
    </div>
  );
}`;

fs.writeFileSync('src/components/AdminModules.tsx', content.replace(regex, replacement));
console.log('Done!');
