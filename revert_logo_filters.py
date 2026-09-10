import os

files_to_patch = [
    'src/components/BiometricLogin.tsx',
    'src/components/Sidebar.tsx',
    'src/components/AuthViews.tsx',
    'src/components/AdminDashboard.tsx'
]

for filepath in files_to_patch:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove the white filter from the image classes
    content = content.replace(' brightness-0 invert opacity-90', '')
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Removed filters from {filepath}")
