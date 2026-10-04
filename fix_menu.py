with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

old_menu = """          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#services" className="text-foreground/70 hover:text-foreground transition-colors">Services</a>
            <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">About</a>
            
            <a href="#contact" className="text-foreground/70 hover:text-foreground transition-colors">Contact</a>
          </div>"""

new_menu = """          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">About</a>
            <a href="#services" className="text-foreground/70 hover:text-foreground transition-colors">Services</a>
            <a href="#portfolios" className="text-foreground/70 hover:text-foreground transition-colors">Portfolios</a>
            <a href="#testimonials" className="text-foreground/70 hover:text-foreground transition-colors">Testimonials</a>
            <a href="#contact" className="text-foreground/70 hover:text-foreground transition-colors">Contact</a>
          </div>"""

content = content.replace(old_menu, new_menu)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
