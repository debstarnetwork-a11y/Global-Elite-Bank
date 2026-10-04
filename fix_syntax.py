import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

old_string = """      {/* General Admin Settings Modal */}
      {/* Other Views Placeholder */}"""

new_string = """      {/* General Admin Settings Modal */}
            </div>
          ) : null}
          
      {/* Other Views Placeholder */}"""

content = content.replace(old_string, new_string)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
