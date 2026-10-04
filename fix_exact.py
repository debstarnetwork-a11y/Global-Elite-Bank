with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

import re

# replace everything from Update / Save to {isAddUserModalOpen
content = re.sub(
    r'Update \/ Save\s*<\/button>\s*<\/div>\s*<\/div>.*?(?=\{\/\* Add New User Modal \*\/)',
    r'''Update / Save
                  </button>
                </div>
              </div>
              </>
            )}
            </div>
          </div>
        </div>
      )}
      
      ''',
    content,
    flags=re.DOTALL
)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
