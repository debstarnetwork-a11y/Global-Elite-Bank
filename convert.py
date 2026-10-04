import urllib.request
# Just use a generic bank PNG from a reliable CDN
url = "https://cdn.iconscout.com/icon/free/png-256/free-bank-1493262-1262846.png"
urllib.request.urlretrieve(url, "public/logo.png")
