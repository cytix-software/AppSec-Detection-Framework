from flask import Flask, request, render_template_string
from ldap3 import Server, Connection, ALL
import traceback

app = Flask(__name__)

HTML = '''
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>CWE-90: LDAP Injection Demo (Python)</title></head>
<body>
    <h1>CWE-90: LDAP Injection (Python)</h1>
    <form method="get">
        <label for="user">Username:</label>
        <input type="text" id="user" name="user" value="{{ user }}">
        <button type="submit">Search</button>
    </form>
    <h2>LDAP Query:</h2>
    <pre>{{ filter }}</pre>
    <h2>Debug Info:</h2>
    <pre>{{ debug_info }}</pre>
    <h2>Results:</h2>
    {% if results %}
        <ul>
        {% for result in results %}
            <li>{{ result }}</li>
        {% endfor %}
        </ul>
    {% else %}
        <p>No results found.</p>
    {% endif %}
</body>
</html>
'''

@app.route('/', methods=['GET'])
def index():
    user = request.args.get('user', '')
    ldap_host = 'ldap://ldap'
    ldap_port = 389
    base_dn = 'ou=users,dc=example,dc=org'
    # Vulnerable filter
    ldap_filter = f'(uid={user})'
    results = []
    debug_info = []
    
    try:
        debug_info.append(f"Connecting to: {ldap_host}:{ldap_port}")
        server = Server(ldap_host, port=ldap_port, get_info=ALL)
        debug_info.append(f"Server info: {server}")
        
        # Authenticate as admin to perform searches
        conn = Connection(server, user='cn=admin,dc=example,dc=org', password='admin')
        debug_info.append(f"Connection created: {conn}")
        
        if conn.bind():
            debug_info.append("Bind successful")
            debug_info.append(f"Base DN: {base_dn}")
            debug_info.append(f"Filter: {ldap_filter}")
            
            # First, let's try to search for everything to see what's in the directory
            conn.search('dc=example,dc=org', '(objectClass=*)', attributes=['*'])
            debug_info.append(f"All entries found: {len(conn.entries)}")
            for entry in conn.entries:
                debug_info.append(f"Entry: {entry.entry_dn}")
            
            # Now do the actual search
            conn.search(base_dn, ldap_filter, attributes=['*'])
            debug_info.append(f"Filtered results: {len(conn.entries)}")
            results = [entry.entry_dn for entry in conn.entries]
            
        else:
            debug_info.append("Bind failed")
            debug_info.append(f"Bind result: {conn.result}")
            
        conn.unbind()
        
    except Exception as e:
        debug_info.append(f"Exception: {str(e)}")
        debug_info.append(f"Traceback: {traceback.format_exc()}")
        results = [f'Error: {e}']
    
    return render_template_string(HTML, user=user, filter=ldap_filter, results=results, debug_info='\n'.join(debug_info))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)