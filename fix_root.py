import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Make the outer return a Fragment
content = content.replace('return (\n    <div className="flex h-screen bg-background text-foreground overflow-hidden w-full absolute inset-0 z-[100]">\n', 
                          'return (\n    <>\n    <div className="flex h-screen bg-background text-foreground overflow-hidden w-full absolute inset-0 z-[100]">\n')

content = content.replace('      </div> {/* Close main wrapper flex container */}\n    </div>\n  );\n}',
                          '      </div> {/* Close main wrapper flex container */}\n    </>\n  );\n}')

# Wait, if there were 2 divs at the end in my previous patch... I'll just change the end to the correct one.
with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
