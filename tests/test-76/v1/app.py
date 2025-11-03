import os
from flask import Flask, request, render_template_string
from ldap3 import Server, Connection, ALL
from ldap3.utils.conv import escape_filter_chars

app = Flask(__name__)

HTML = '''
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Test 76</title></head>
<body>
    <h1>Test 76 - LDAP</h1>
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
    ldap_host = os.environ.get('LDAP_HOST', 'ldap')
    ldap_port = 389
    base_dn = 'ou=users,dc=example,dc=org'
    bind_user = os.environ.get('LDAP_ADMIN_USER', 'cn=admin,dc=example,dc=org')
    bind_password = os.environ.get('LDAP_ADMIN_PASSWORD', 'admin')

    ldap_filter = f'(uid={user})'

    results = []
    conn = None
    
    try:
        server = Server(f'ldap://{ldap_host}', port=ldap_port, get_info=ALL)
        conn = Connection(server, user=bind_user, password=bind_password)
        
        if conn.bind():
            conn.search(base_dn, ldap_filter, attributes=['*'])
            # Displaying more attributes makes the demo more illustrative
            results = [str(entry.entry_attributes_as_dict) for entry in conn.entries]
        
    except Exception as e:
        results = [f'Error: {e}']
    finally:
        if conn and conn.bound:
            conn.unbind()
    
    return render_template_string(HTML, user=user, filter=ldap_filter, results=results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)