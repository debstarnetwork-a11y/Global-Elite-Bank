import re

with open('src/components/AuthViews.tsx', 'r') as f:
    content = f.read()

# I will find the block in SignInView and remove the confirmPassword div
def replace_signin(match):
    signin_body = match.group(1)
    # Remove the Confirm Password block
    signin_body = re.sub(r'\s*<div>\s*<label[^>]*>Confirm Password</label>.*?</div>\s*</div>', '', signin_body, flags=re.DOTALL)
    # Restore the Sign In button text because it might have been changed to Submit Application
    signin_body = re.sub(r'Submit Application', 'Sign In', signin_body)
    return "export function SignInView" + signin_body + "export function SignUpView"

content = re.sub(r'export function SignInView(.*?)export function SignUpView', replace_signin, content, flags=re.DOTALL)

with open('src/components/AuthViews.tsx', 'w') as f:
    f.write(content)

