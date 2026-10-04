import re

def process_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
        else:
            print(f"Warning: Could not find exact string in {filepath}:\n{old}")
            # Try regex fallback if necessary, but exact string is safer
            
    with open(filepath, 'w') as f:
        f.write(content)

# 1. AuthViews.tsx
auth_replacements = [
    (
        '<h1 className="text-xl font-black text-white tracking-tight uppercase drop-shadow-sm">Global Elite</h1>',
        ''
    )
]
process_file('src/components/AuthViews.tsx', auth_replacements)

# 2. BiometricLogin.tsx
bio_replacements = [
    (
        '<h1 className="text-3xl font-black text-white tracking-tight uppercase drop-shadow-sm">Global Elite</h1>',
        ''
    )
]
process_file('src/components/BiometricLogin.tsx', bio_replacements)

# 3. AdminDashboard.tsx
admin_replacements = [
    (
        '<h1 className="text-xl font-black tracking-tight uppercase text-white drop-shadow-sm">Global Elite Admin</h1>',
        '<h1 className="text-xl font-bold text-foreground">Admin</h1>'
    ),
    (
        '<h1 className="text-xl font-black tracking-tight uppercase text-white drop-shadow-sm">Admin</h1>',
        '<h1 className="text-xl font-bold text-foreground">Admin</h1>'
    )
]
process_file('src/components/AdminDashboard.tsx', admin_replacements)

# 4. Sidebar.tsx
sidebar_replacements = [
    (
        '<h1 className="font-bold text-sm tracking-tight uppercase text-white drop-shadow-sm">{adminSettings?.websiteName || \'Global Elite Bank\'}</h1>',
        '<h1 className="font-bold text-sm tracking-tight uppercase text-foreground">{adminSettings?.websiteName || \'Global Elite Bank\'}</h1>'
    )
]
process_file('src/components/Sidebar.tsx', sidebar_replacements)

print("Logo text removal complete.")
