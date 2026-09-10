import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

old_logo_block = """        {adminSettings?.logoUrl ? (
          <img src={adminSettings.logoUrl} alt="Global Elite Bank Logo" className="w-20 h-20 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] mb-6 mx-auto object-contain" />
        ) : (
          <div className="flex flex-col items-center justify-center mb-6">
            <img src="/logo.png" alt="Global Elite Logo" className="w-16 h-16 mb-3 object-contain brightness-0 invert opacity-90" />
            <h1 className="text-xl font-black text-white tracking-tight uppercase drop-shadow-sm">Global Elite</h1>
          </div>
        )}"""

new_logo_block = """        {adminSettings?.logoUrl ? (
          <div className="flex flex-col items-center justify-center mb-6">
            <img src={adminSettings.logoUrl} alt="Global Elite Bank Logo" className="w-20 h-20 mb-3 object-contain brightness-0 invert opacity-90" />
            <h1 className="text-xl font-black text-white tracking-tight uppercase drop-shadow-sm">Global Elite</h1>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mb-6">
            <img src="/logo.png" alt="Global Elite Logo" className="w-16 h-16 mb-3 object-contain brightness-0 invert opacity-90" />
            <h1 className="text-xl font-black text-white tracking-tight uppercase drop-shadow-sm">Global Elite</h1>
          </div>
        )}"""

if old_logo_block in content:
    content = content.replace(old_logo_block, new_logo_block)
else:
    print("Could not find old logo block. Will try regex.")
    content = re.sub(
        r'\{adminSettings\?\.logoUrl \? \([\s\S]*?\}\)',
        new_logo_block,
        content
    )

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)

print("Updated AuthViews to make all logos white with Global Elite text")
