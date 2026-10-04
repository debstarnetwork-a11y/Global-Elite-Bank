import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

old_logo = """        {adminSettings?.logoUrl ? (
          <img src={adminSettings.logoUrl} alt="Global Elite Bank Logo" className="w-20 h-20 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] mb-6 mx-auto object-contain" />
        ) : (
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
              <span className="font-black text-3xl tracking-tighter drop-shadow-md">GEB</span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight uppercase">Global Elite Bank</h1>
          </div>
        )}"""

# If the old logo code has been modified slightly, I will just search for the start and end of it.
# Let's replace the whole fallback block.

new_logo = """        {adminSettings?.logoUrl ? (
          <img src={adminSettings.logoUrl} alt="Global Elite Bank Logo" className="w-20 h-20 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] mb-6 mx-auto object-contain" />
        ) : (
          <div className="flex flex-col items-center justify-center mb-6">
            <img src="/logo.png" alt="Global Elite Logo" className="w-16 h-16 mb-3 object-contain" />
            <h1 className="text-xl font-black text-white tracking-tight uppercase drop-shadow-sm">Global Elite</h1>
          </div>
        )}"""

if old_logo in content:
    content = content.replace(old_logo, new_logo)
else:
    print("Could not find the exact old_logo block. Will use regex.")
    content = re.sub(
        r'\{adminSettings\?\.logoUrl \? \([\s\S]*?\}\)',
        new_logo,
        content
    )

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)
print("Updated AuthViews with PNG and white text")
