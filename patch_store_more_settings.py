import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

new_fields = """
  preferenceContactEmail: string;
  websiteCurrency: string;
  homepageUrl: string;
  requireKycWithdrawal: boolean;
  requireKycRegistration: boolean;
  requireEmailVerification: boolean;
  mailServer: string;
  emailFrom: string;
  emailFromName: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUrl: string;
  captchaSecret: string;
  captchaSiteKey: string;
  activeTheme: string;
"""

default_fields = """
    preferenceContactEmail: "support@globalelite.com",
    websiteCurrency: "$",
    homepageUrl: "",
    requireKycWithdrawal: false,
    requireKycRegistration: false,
    requireEmailVerification: false,
    mailServer: "",
    emailFrom: "support@globalelite.com",
    emailFromName: "Global Elite",
    googleClientId: "",
    googleClientSecret: "",
    googleRedirectUrl: "http://yoursite.com/auth/google/callback",
    captchaSecret: "",
    captchaSiteKey: "",
    activeTheme: "dark",
"""

content = content.replace("requireOtp: boolean;", "requireOtp: boolean;" + new_fields)
content = content.replace("requireOtp: false,", "requireOtp: false," + default_fields)

with open('src/store.tsx', 'w') as f:
    f.write(content)
