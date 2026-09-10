import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

# 1. Update Menu (Remove Portfolios and Testimonials, ensure About is there)
menu_pattern = r'<div className="hidden md:flex items-center gap-8 text-sm font-medium">.*?</div>'
new_menu = """<div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">About</a>
            <a href="#services" className="text-foreground/70 hover:text-foreground transition-colors">Services</a>
            <a href="#contact" className="text-foreground/70 hover:text-foreground transition-colors">Contact</a>
          </div>"""
content = re.sub(menu_pattern, new_menu, content, flags=re.DOTALL)

# 2. Fix Home Section Text
content = content.replace('The Future of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Wealth Management</span>', 'Exclusive <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Private Banking</span>')
content = content.replace('Experience unparalleled financial control with advanced crypto integrations, instant global transfers, and military-grade biometric security.', 'Tailored financial strategies, offshore asset protection, and absolute discretion for the modern global elite.')

# 3. Add About Section (if it doesn't exist)
if '<section id="about"' not in content:
    about_section = """
        {/* About Section */}
        <section id="about" className="py-24 px-6 bg-card relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">About Our Institution</h2>
              <p className="text-foreground/60 max-w-2xl mx-auto text-lg">Built on a legacy of absolute discretion, financial excellence, and enduring stability.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-background rounded-2xl p-10 border border-border hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] transition-all">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Globe size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-foreground/70 leading-relaxed">
                  To provide distinguished clientele with an unparalleled banking experience, merging the absolute privacy of traditional wealth management with cutting-edge digital infrastructure and unrestricted global liquidity. We empower you to manage, protect, and grow your generational wealth with complete confidence and discretion.
                </p>
              </div>
              
              <div className="bg-background rounded-2xl p-10 border border-border hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-foreground/70 leading-relaxed">
                  To remain the world's most exclusive and trusted financial partner for institutional entities and ultra-high-net-worth individuals, setting the gold standard for security, innovation, and generational wealth preservation in an increasingly complex global economy.
                </p>
              </div>
            </div>
          </div>
        </section>
"""
    # Insert before {/* Services Section */}
    content = content.replace('{/* Services Section */}', about_section + '\n        {/* Services Section */}')

# 4. Remove Portfolios and Testimonials sections
portfolio_start = content.find('{/* Investment Portfolios */}')
testimonial_end = content.find(' {/* Contact Section */} ', portfolio_start)
if testimonial_end == -1:
    testimonial_end = content.find('<footer id="contact"', portfolio_start)

if portfolio_start != -1 and testimonial_end != -1:
    content = content[:portfolio_start] + content[testimonial_end:]

# 5. Make Services text unique
content = content.replace('Delivering unparalleled financial solutions with precision, security, and absolute discretion.', 'A comprehensive suite of institutional-grade financial vehicles and asset structuring frameworks.')

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
