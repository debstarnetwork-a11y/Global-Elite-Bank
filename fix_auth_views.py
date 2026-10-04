import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

old_signin = """  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      onSuccess();
    } else {
      setError("Invalid email or password");
    }
  };"""

new_signin = """  const isAdminPath = typeof window !== 'undefined' && window.location.pathname === '/admin';
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (result && result.success) {
      onSuccess();
    } else {
      setError(result?.error || "Invalid email or password");
    }
  };"""

content = content.replace(old_signin, new_signin)

old_welcome = """<h2 className="text-2xl font-bold text-foreground text-center mb-2">Welcome Back</h2>"""
new_welcome = """<h2 className="text-2xl font-bold text-foreground text-center mb-2">{isAdminPath ? 'Admin Portal' : 'Welcome Back'}</h2>"""
content = content.replace(old_welcome, new_welcome)

# Also update register call if it fails (wait, register doesn't return anything)
old_register = """    register(name, email, password);
    login(email, password);
    onSuccess();"""
new_register = """    register(name, email, password);
    const result = login(email, password);
    if (result && result.success) {
      onSuccess();
    }
    // For now assume successful reg always forwards, but since new users are inactive, 
    // we actually can't log them in successfully. Wait! If they are inactive, login fails.
    // So if login fails, they stay on the screen with an error, or we redirect them to a pending page?
    // Let's just show an error if login fails during registration.
"""

# Let's completely rewrite AuthViews.tsx to handle this nicely.
