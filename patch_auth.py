import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

# Add adminSettings to useBank
if 'const { login, adminSettings }' not in content:
    content = content.replace(
        'export function SignInView({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {',
        'export function SignInView({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {\n  const [email, setEmail] = useState("");\n  const [password, setPassword] = useState("");\n  const [error, setError] = useState("");\n  const { login, adminSettings } = useBank();\n\n  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    if (login(email, password)) {\n      onSuccess();\n    } else {\n      setError("Invalid email or password");\n    }\n  };'
    )

logo_replacement = """        {adminSettings?.logoUrl ? (
          <img src={adminSettings.logoUrl} alt="Logo" className="w-12 h-12 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] mb-6 mx-auto object-contain" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] mb-6 mx-auto">
            <span className="font-bold text-xl">G</span>
          </div>
        )}"""

content = re.sub(
    r'<div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-\[0_0_20px_rgba\(79,70,229,0\.3\)\] mb-6 mx-auto">\s*<span className="font-bold text-xl">G</span>\s*</div>',
    logo_replacement,
    content
)

form_replacement = """        <form className="space-y-4" onSubmit={handleSubmit}>
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
          </div>"""

content = re.sub(
    r'<form className="space-y-4" onSubmit=\{e => \{ e.preventDefault\(\); onSuccess\(\); \}\}>[\s\S]*?</div>\s*</div>',
    form_replacement,
    content
)

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)
