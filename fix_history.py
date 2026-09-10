import re
import glob

for filename in glob.glob('src/components/*.tsx'):
    with open(filename, 'r') as f:
        content = f.read()
    
    content = content.replace("adminSettings?.websiteName || '{adminSettings?.websiteName || 'Global Elite Bank'}'", "adminSettings?.websiteName || 'Global Elite Bank'")
    content = content.replace("adminSettings?.websiteName || \"{adminSettings?.websiteName || 'Global Elite Bank'}\"", "adminSettings?.websiteName || 'Global Elite Bank'")
    
    with open(filename, 'w') as f:
        f.write(content)

