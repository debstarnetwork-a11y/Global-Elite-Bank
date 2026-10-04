import re

with open('src/components/UserSettings.tsx', 'r') as f:
    content = f.read()

# Replace handleProfileImageSubmit
old_submit = """  const handleProfileImageSubmit = (e: any) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      updateUserProfilePicture(imageUrl);
      setProfileMsg('Profile picture updated successfully');
      setImageUrl('');
    }
  };"""

new_submit = """  const handleProfileImageSubmit = (e: any) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      let finalUrl = imageUrl.trim();
      const imgMatch = finalUrl.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) {
        finalUrl = imgMatch[1];
      }
      updateUserProfilePicture(finalUrl);
      setProfileMsg('Profile picture updated successfully');
      setImageUrl('');
    }
  };"""

content = content.replace(old_submit, new_submit)

# Change input type from 'url' to 'text'
# find the specific input
old_input = """                    <input 
                      type="url" 
                      placeholder="Paste image URL here..." 
                      value={imageUrl}"""
new_input = """                    <input 
                      type="text" 
                      placeholder="Paste image URL or HTML tag here..." 
                      value={imageUrl}"""

content = content.replace(old_input, new_input)

with open('src/components/UserSettings.tsx', 'w') as f:
    f.write(content)
print("Updated UserSettings")
