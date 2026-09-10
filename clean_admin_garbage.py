import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Pattern for the garbage block
garbage_pattern = r'\s*<div>\s*<label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Password</label>\s*<input type="text" value=\{newUserForm\.password\}[^>]*/>\s*</div>\s*<div>\s*<label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Zip / Postal Code</label>\s*<input type="text" value=\{newUserForm\.zipCode\}[^>]*/>\s*</div>\s*<div>\s*<label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Occupation</label>\s*<input type="text" value=\{newUserForm\.occupation\}[^>]*/>\s*</div>\s*</div>'

new_content = re.sub(garbage_pattern, '', content)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(new_content)
