with open('src/components/AdminDashboard.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if "Update / Save" in line:
        new_lines.append(line)
        new_lines.append(lines[i+1])
        new_lines.append(lines[i+2])
        new_lines.append(lines[i+3])
        new_lines.append("              </>\n            )}\n")
        continue
    # skip the original next 3 lines since we appended them
    if i >= 3 and "Update / Save" in lines[i-3]:
        continue
    if i >= 2 and "Update / Save" in lines[i-2]:
        continue
    if i >= 1 and "Update / Save" in lines[i-1]:
        continue
    new_lines.append(line)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.writelines(new_lines)
