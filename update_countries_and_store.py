import re

# 1. Update store.tsx Defaults
store_code = open('src/store.tsx', 'r').read()
store_code = store_code.replace(
    '"The TAX code is required to enable you to continue with this transaction. Please contact our online customer care on representative with the live chat: they will help you with the appropriate TAX code for this transaction."',
    '"The TAX code is required to enable you to continue with this transaction. Please contact our online customer care on representative via live chat; they will help you with the appropriate TAX code for this transaction."'
)
store_code = store_code.replace('requireCot:', 'requireCode1:')
store_code = store_code.replace('requireSwift:', 'requireCode2:')
store_code = store_code.replace('requireImf:', 'requireCode3:')
store_code = store_code.replace('requireTax:', 'requireCode4:')
store_code = store_code.replace('requireAml:', 'requireCode5:')
open('src/store.tsx', 'w').write(store_code)


# 2. Update all Nationality <select>s
countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
    "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", 
    "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", 
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", 
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. 'Swaziland')", "Ethiopia", "Fiji", "Finland", 
    "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
    "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", 
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", 
    "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", 
    "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", 
    "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", 
    "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", 
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
    "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", 
    "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", 
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", 
    "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

country_options = '\n'.join([f'                          <option value="{c}">{c}</option>' for c in countries])
country_options_indent2 = '\n'.join([f'                    <option value="{c}">{c}</option>' for c in countries])

auth_code = open('src/components/AuthViews.tsx', 'r').read()
auth_code = re.sub(r'<option value="">Select Nationality</option>.*?<\/select>', f'<option value="">Select Nationality</option>\n{country_options_indent2}\n                  </select>', auth_code, flags=re.DOTALL)
open('src/components/AuthViews.tsx', 'w').write(auth_code)

admin_code = open('src/components/AdminDashboard.tsx', 'r').read()
admin_code = re.sub(r'<option value="">Select Nationality\.\.\.</option>.*?<\/select>', f'<option value="">Select Nationality...</option>\n{country_options}\n                        </select>', admin_code, flags=re.DOTALL)
admin_code = re.sub(r'<option value="">Select Nationality</option>.*?<\/select>', f'<option value="">Select Nationality</option>\n{country_options_indent2}\n                  </select>', admin_code, flags=re.DOTALL)
open('src/components/AdminDashboard.tsx', 'w').write(admin_code)

print("Updated countries and store.")
