import re

with open('src/components/AdminSettingsView.tsx', 'r') as f:
    content = f.read()

# Add useRef
content = content.replace(
"""import { Upload, Save, Plus, Trash } from 'lucide-react';""",
"""import { Upload, Save, Plus, Trash, CheckCircle } from 'lucide-react';\nimport { useRef } from 'react';"""
)

# Add refs for file input
content = content.replace(
"""  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ name: '', type: 'currency', usedFor: 'both', status: 'enabled' });""",
"""  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ name: '', type: 'currency', usedFor: 'both', status: 'enabled' });
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (type === 'logo') {
            updateAdminSettings({ logoUrl: event.target.result as string });
          } else {
            updateAdminSettings({ faviconUrl: event.target.result as string }); // Assuming faviconUrl exists or we just store it
          }
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };"""
)

# Replace the Upload components
content = content.replace(
"""                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Logo (Recommended size; max width, 200px and max height 100px.)</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer text-foreground/50">
                  <Upload size={24} />
                  <span className="text-sm">No file chosen</span>
                </div>""",
"""                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Logo (Recommended size; max width, 200px and max height 100px.)</label>
                <div onClick={() => logoInputRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer text-foreground/50">
                  {adminSettings.logoUrl ? <CheckCircle size={24} className="text-emerald-500" /> : <Upload size={24} />}
                  <span className="text-sm text-center line-clamp-1">{adminSettings.logoUrl ? 'Logo Uploaded' : 'No file chosen'}</span>
                  <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={(e) => handleFileUpload(e, 'logo')} />
                </div>"""
)

content = content.replace(
"""                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Favicon (Recommended type: png, size: max width, 32px and max height 32px.)</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer text-foreground/50">
                  <Upload size={24} />
                  <span className="text-sm">No file chosen</span>
                </div>""",
"""                <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Favicon (Recommended type: png, size: max width, 32px and max height 32px.)</label>
                <div onClick={() => faviconInputRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer text-foreground/50">
                  {adminSettings.faviconUrl ? <CheckCircle size={24} className="text-emerald-500" /> : <Upload size={24} />}
                  <span className="text-sm text-center line-clamp-1">{adminSettings.faviconUrl ? 'Favicon Uploaded' : 'No file chosen'}</span>
                  <input type="file" accept="image/png,image/x-icon" className="hidden" ref={faviconInputRef} onChange={(e) => handleFileUpload(e, 'favicon')} />
                </div>"""
)

with open('src/components/AdminSettingsView.tsx', 'w') as f:
    f.write(content)
