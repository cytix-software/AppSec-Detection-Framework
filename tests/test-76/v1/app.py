from flask import Flask, request, render_template_string
from ldap3 import Server, Connection, ALL

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
    
    try:
        server = Server(ldap_host, port=ldap_port, get_info=ALL)
        conn = Connection(server, user='cn=admin,dc=example,dc=org', password='admin')
        
        if conn.bind():
            conn.search(base_dn, ldap_filter, attributes=['*'])
            results = [entry.entry_dn for entry in conn.entries]
        
        conn.unbind()
        
    except Exception as e:
        results = [f'Error: {e}']
    
    return render_template_string(HTML, user=user, filter=ldap_filter, results=results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)