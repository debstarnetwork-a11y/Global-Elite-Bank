import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

# There are two password fields in SignInView. Let's find and remove the second one.
old_pw_block = """          <div>
            <label className="text-xs font-bold text-foreground/70 uppercase tracking-widest mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
              <input type="password" required className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary text-foreground" placeholder="••••••••" />
            </div>
          </div>"""

content = content.replace(old_pw_block, "")

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)
