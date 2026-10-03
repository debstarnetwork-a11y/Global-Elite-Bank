import os
import glob
import re

for filepath in glob.glob('src/**/*.tsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find where adminSettings is used
    for i, line in enumerate(content.split('\n')):
        if 'adminSettings' in line:
            # simple check if it's outside any export function or const Component =
            print(f"{filepath}:{i+1}: {line.strip()}")

