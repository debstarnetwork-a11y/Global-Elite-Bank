import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

about_section = """        {/* About Section */}
        <section id="about" className="py-24 px-6 bg-card relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">About Global Elite</h2>
              <p className="text-foreground/60 max-w-2xl mx-auto text-lg">Built on a foundation of uncompromising standards, absolute discretion, and financial excellence.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-background rounded-2xl p-10 border border-border hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] transition-all">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Globe size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-foreground/70 leading-relaxed">
                  To provide our elite clientele with an unparalleled banking experience, merging the absolute privacy of traditional wealth management with cutting-edge digital infrastructure and unrestricted global liquidity. We empower you to manage, protect, and grow your generational wealth with complete confidence and discretion.
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

# Insert before {/* Services */}
# First, let's find {/* Services */}
idx = content.find("{/* Services */}")
if idx != -1:
    content = content[:idx] + about_section + content[idx:]

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
