with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

bad_block = """          <div>
            <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="••••••••" />
            </div>
          </div>"""

# Find the first occurrence (which is in SignInView)
idx = content.find(bad_block)
if idx != -1:
    content = content[:idx] + content[idx+len(bad_block):]

# Also let's fix the submit button text in SignInView
content = content.replace('Submit Application', 'Sign In', 1)

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)
