import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

pattern = r'(<button \n                        onClick=\{\(\) => \{\n                          updateAdminSettings\(\{ \[settingKey\]: !adminSettings\[key\] \}\);\n                          showToast\(\'Settings Updated\', `\$\{label\} is now \$\{!adminSettings\[key\] \? \'Enabled\' : \'Disabled\'\}`\);\n                        \}\}\n                        className={`w-12 h-6 rounded-full relative transition-colors \$\{adminSettings\[key\] \? \'bg-emerald-500\' : \'bg-foreground/20\'\}`\}\n                      >\n                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform \$\{adminSettings\[key\] \? \'translate-x-6\' : \'\'\}`\} />\n                      </button>)[\s\S]*?(                  \);\n               \}\)\})'

clean_settings_jsx = """\\1
                    </div>
\\2"""

new_content = re.sub(pattern, clean_settings_jsx, content)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(new_content)
