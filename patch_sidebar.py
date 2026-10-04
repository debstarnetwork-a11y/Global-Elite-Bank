import re

with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

old_logo = """        {adminSettings?.logoUrl ? (
          <img src={adminSettings.logoUrl} alt="Bank Logo" className="w-10 h-10 object-contain rounded-xl shadow-lg" />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-lg">
            <Building2 size={22} />
          </div>
        )}
        <div className="leading-tight">
          <h1 className="font-bold text-sm tracking-tight uppercase text-foreground">{adminSettings?.websiteName || 'Global Elite Bank'}</h1>"""

new_logo = """        {adminSettings?.logoUrl ? (
          <img src={adminSettings.logoUrl} alt="Bank Logo" className="w-10 h-10 object-contain brightness-0 invert opacity-90" />
        ) : (
          <img src="/logo.png" alt="Global Elite Logo" className="w-10 h-10 object-contain brightness-0 invert opacity-90" />
        )}
        <div className="leading-tight">
          <h1 className="font-bold text-sm tracking-tight uppercase text-white drop-shadow-sm">{adminSettings?.websiteName || 'Global Elite Bank'}</h1>"""

content = content.replace(old_logo, new_logo)

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)

print("Updated Sidebar to make logo and text white")
