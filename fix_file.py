with open('src/components/AdminSettingsView.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""            </div>
          </div>
      </div>

      {/* Payment Settings Section */}""",
"""            </div>
          </div>
        )}
      </div>

      {/* Payment Settings Section */}""")

with open('src/components/AdminSettingsView.tsx', 'w') as f:
    f.write(content)
