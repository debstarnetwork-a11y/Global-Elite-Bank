import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Fix double return (
content = content.replace('                return (\n                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">\n                return (\n                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">',
                          '                return (\n                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">')

# Fix duplicate useState
content = content.replace("const [isUserModalOpen, setIsUserModalOpen] = useState(false);\n  const [isUserModalOpen, setIsUserModalOpen] = useState(false);", "const [isUserModalOpen, setIsUserModalOpen] = useState(false);")

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
