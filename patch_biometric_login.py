import re

with open('src/components/BiometricLogin.tsx', 'r') as f:
    content = f.read()

old_logo = """        <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] mb-8">
          <span className="font-bold text-2xl font-sans">G</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Global Elite</h1>"""

new_logo = """        <div className="flex flex-col items-center justify-center mb-8">
          <img src="/logo.png" alt="Global Elite Logo" className="w-16 h-16 mb-3 object-contain brightness-0 invert opacity-90" />
          <h1 className="text-3xl font-black text-white tracking-tight uppercase drop-shadow-sm">Global Elite</h1>
        </div>"""

if old_logo in content:
    content = content.replace(old_logo, new_logo)
else:
    print("Could not find old logo in BiometricLogin.tsx")

with open('src/components/BiometricLogin.tsx', 'w') as f:
    f.write(content)

print("Updated BiometricLogin")
