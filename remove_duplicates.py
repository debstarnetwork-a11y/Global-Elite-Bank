with open('src/components/AdminDashboard.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if line.strip() == "</>" and lines[i+1].strip() == ")}" and lines[i-2].strip() == "</>":
        continue
    if line.strip() == ")}" and lines[i-1].strip() == "</>" and lines[i-3].strip() == ")}":
        continue
    new_lines.append(line)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.writelines(new_lines)
