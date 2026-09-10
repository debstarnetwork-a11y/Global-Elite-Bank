import os
import glob
import re

for filepath in glob.glob('src/**/*.tsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()

    if 'adminSettings' in content and 'useBank' not in content:
        print(f"File {filepath} uses adminSettings but NO useBank found!")

