import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

# Remove Google button block (the "Or" separator and the button)
google_btn_pattern = r'<div className="relative flex items-center py-2 mt-4">\s*<div className="flex-grow border-t border-border"></div>\s*<span className="flex-shrink-0 mx-4 text-foreground/40 text-xs font-bold uppercase tracking-widest">Or</span>\s*<div className="flex-grow border-t border-border"></div>\s*</div>\s*<button type="button" onClick=\{\(\) => \{\}\} className="w-full bg-card border border-border text-foreground font-bold py-3.5 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-3">\s*<svg viewBox="0 0 24 24" className="w-5 h-5">\s*<path [^>]+>\s*<path [^>]+>\s*<path [^>]+>\s*<path [^>]+>\s*</svg>\s*Sign Up with Google\s*</button>'
content = re.sub(google_btn_pattern, '', content)

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)

