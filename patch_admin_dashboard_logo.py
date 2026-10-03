import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

old_logo = """        <div className="p-6 border-b border-border flex items-center gap-3">
          <ShieldAlert className="text-primary" size={24} />
          <h1 className="text-xl font-bold text-foreground">Admin</h1>
        </div>"""

new_logo = """        <div className="p-6 border-b border-border flex items-center gap-3">
          {adminSettings?.logoUrl ? (
            <img src={adminSettings.logoUrl} alt="Bank Logo" className="w-8 h-8 object-contain brightness-0 invert opacity-90" />
          ) : (
            <img src="/logo.png" alt="Global Elite Logo" className="w-8 h-8 object-contain brightness-0 invert opacity-90" />
          )}
          <h1 className="text-xl font-black tracking-tight uppercase text-white drop-shadow-sm">Global Elite Admin</h1>
        </div>"""

content = content.replace(old_logo, new_logo)

# Also mobile version
old_mobile_logo = """              <div className="flex items-center gap-3">
                <ShieldAlert className="text-primary" size={24} />
                <h1 className="text-xl font-bold text-foreground">Admin</h1>
              </div>"""

new_mobile_logo = """              <div className="flex items-center gap-3">
                {adminSettings?.logoUrl ? (
                  <img src={adminSettings.logoUrl} alt="Bank Logo" className="w-8 h-8 object-contain brightness-0 invert opacity-90" />
                ) : (
                  <img src="/logo.png" alt="Global Elite Logo" className="w-8 h-8 object-contain brightness-0 invert opacity-90" />
                )}
                <h1 className="text-xl font-black tracking-tight uppercase text-white drop-shadow-sm">Admin</h1>
              </div>"""

content = content.replace(old_mobile_logo, new_mobile_logo)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("Updated AdminDashboard sidebar logo")
