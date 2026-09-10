import base64
import os

# 1x1 transparent PNG as placeholder, or a simple white circle.
# Let's just use a base64 string for a white bank-like icon or just a white square.
# Actually, I will write a simple python script to write an SVG, then we can just use the SVG. But they asked for PNG.
# I'll provide a base64 of a white PNG.
b64 = "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABLUlEQVR4nO3WgQ3CIBRA0bbTujbrOo7ruK6rI1mDBNKXvJv3k5A8UAgPhfBSEBERERERERGRZ9q27Xme52fbdts0Tdtm27b/8v35mYqIcG/sXQv3yQ/7t5xZgT/M3TjLAAuYgLMEuIEV+MJcjbMMMIENeEmAJ1iBK8zROMsAC5iBkwS4ggV4wlyJswywgAU4SYAzmIEXzJU4ywALcANHEuAEJuAlcyXOMsACVmA/AU5gAB4we+MsAyxgBvYTYAc9cIPZG2cZYIEW2EuAHTTAA2ZrnGWABSzAXgLsoAWuMEvjLAMsYAb2EmAHLXCFWRpnGWABM7CXADtogSvM0jjLAAuYgb0E2EELXGGWxlkGWMAM7CXADlrgCrM0zjLAAhbgJAEu6IeIiIiIiIiIiFzxB1c7tQ6vK+23AAAAAElFTkSuQmCC"

os.makedirs('public', exist_ok=True)
with open('public/logo.png', 'wb') as f:
    f.write(base64.b64decode(b64))
print("Saved public/logo.png")
