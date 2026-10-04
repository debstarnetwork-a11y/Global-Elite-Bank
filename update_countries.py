import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

countries_array = """[
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 
  'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 
  'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 
  'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 
  'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 
  'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 
  'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 
  'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (formerly Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 
  'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 
  'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 
  'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 
  'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
]"""

old_countries = "['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Switzerland', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Japan', 'South Korea', 'Singapore', 'United Arab Emirates', 'Saudi Arabia', 'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Nigeria', 'Kenya', 'India', 'China']"

content = content.replace(old_countries, countries_array)

address_field = """                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Occupation</label>
                    <input type="text" value={newUserForm.occupation} onChange={e => setNewUserForm({...newUserForm, occupation: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Residential Address</label>
                    <input type="text" value={newUserForm.residentialAddress} onChange={e => setNewUserForm({...newUserForm, residentialAddress: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />
                  </div>"""

content = content.replace(
    '                  <div>\\n                    <label className="block text-xs font-bold text-foreground/50 uppercase mb-1">Occupation</label>\\n                    <input type="text" value={newUserForm.occupation} onChange={e => setNewUserForm({...newUserForm, occupation: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 text-sm text-foreground focus:border-primary outline-none" />\\n                  </div>',
    address_field
)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
