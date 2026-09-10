import re

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

old_img = """          <div className="w-10 h-10 rounded-full border-2 border-accent p-0.5">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>"""

new_img = """          <div className="w-10 h-10 rounded-full border-2 border-accent p-0.5 shrink-0 overflow-hidden">
            <img 
              src={currentUser?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>"""

content = content.replace(old_img, new_img)

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
print("Updated Header profile picture")
