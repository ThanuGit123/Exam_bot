import urllib.parse
import re

with open('.env', 'r') as f:
    content = f.read()

# Extract the username, password, and the rest of the URI
match = re.search(r'MONGODB_URI=mongodb\+srv://([^:]+):([^@]+)@(.+)', content)
if match:
    user = match.group(1)
    password = match.group(2)
    rest = match.group(3)
    
    # URL-encode the username and password safely
    encoded_user = urllib.parse.quote_plus(urllib.parse.unquote_plus(user))
    encoded_password = urllib.parse.quote_plus(urllib.parse.unquote_plus(password))
    
    new_uri = f"MONGODB_URI=mongodb+srv://{encoded_user}:{encoded_password}@{rest}"
    
    # Replace the old URI with the properly encoded one
    new_content = re.sub(r'MONGODB_URI=mongodb\+srv://.+', new_uri, content)
    
    with open('.env', 'w') as f:
        f.write(new_content)
    print("Successfully encoded special characters in MongoDB URI!")
else:
    print("Error: Could not parse MongoDB URI format from .env. Is it a standard mongodb+srv:// format?")
