import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Remove the closing divs from here
old_divs = """      </div> {/* Close wrapper for views */}
      </div> {/* Close Main Content overflow container */}
      </div> {/* Close main wrapper flex container */}
      
      {/* Modals are kept outside the main scroll container but inside the component to render on top */}
      {/* System Settings Modal */}"""

new_divs = """      </div> {/* Close wrapper for views */}
      </div> {/* Close Main Content overflow container */}
      
      {/* Modals are kept outside the main scroll container but inside the component to render on top */}
      {/* System Settings Modal */}"""
content = content.replace(old_divs, new_divs)

# Add the closing div to the very bottom
old_end = """      )}
    </div>
  );
}"""

new_end = """      )}
      </div> {/* Close main wrapper flex container */}
    </div>
  );
}"""
content = content.replace(old_end, new_end)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
