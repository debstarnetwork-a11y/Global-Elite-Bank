import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace import
content = content.replace("import { CardsView, AnalyticsView, SecurityView } from './components/PlaceholderViews';",
                          "import { CardsView, AnalyticsView } from './components/PlaceholderViews';\nimport { SettingsView } from './components/UserSettings';")

# Replace render logic
content = content.replace("{currentView === 'Security' && <SecurityView />}",
                          "{currentView === 'Settings' && <SettingsView />}")

# Remove old security view if there was another reference
content = content.replace("SecurityView", "SettingsView")

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Updated App.tsx to use SettingsView")
