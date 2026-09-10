import os
import glob
import re

for filepath in glob.glob('src/**/*.tsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find where adminSettings is used
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'adminSettings' in line:
            # simple heuristic: if it's not indented or indented less than 2 spaces, it might be global
            # let's just print them all with their context
            pass
            
    # better yet, let's remove everything inside a function block and see if adminSettings is still there
    # naive brace matching:
    idx = 0
    brace_depth = 0
    clean_content = []
    
    while idx < len(content):
        if content[idx] == '{':
            brace_depth += 1
            idx += 1
        elif content[idx] == '}':
            brace_depth -= 1
            idx += 1
        else:
            if brace_depth == 0:
                clean_content.append(content[idx])
            idx += 1
            
    clean_text = "".join(clean_content)
    if 'adminSettings' in clean_text:
        print(f"File {filepath} uses adminSettings in global scope!")
        
