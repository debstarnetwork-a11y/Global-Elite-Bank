from PIL import Image, ImageDraw, ImageFont
import os

# Create a 256x256 transparent image
img = Image.new('RGBA', (256, 256), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)

# Draw a simple white shield/bank building or globe
# Let's draw a white bank building
draw.polygon([(128, 30), (40, 100), (216, 100)], fill=(255, 255, 255, 255))
draw.rectangle([(50, 110), (206, 130)], fill=(255, 255, 255, 255))
draw.rectangle([(60, 140), (80, 210)], fill=(255, 255, 255, 255))
draw.rectangle([(118, 140), (138, 210)], fill=(255, 255, 255, 255))
draw.rectangle([(176, 140), (196, 210)], fill=(255, 255, 255, 255))
draw.rectangle([(40, 220), (216, 240)], fill=(255, 255, 255, 255))

os.makedirs('public', exist_ok=True)
img.save('public/logo.png', 'PNG')
print("Saved public/logo.png")
