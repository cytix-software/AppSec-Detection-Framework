from flask import Flask, request, render_template_string
import os

app = Flask(__name__)

# HTML template with the form
HTML_TEMPLATE = '''
<form action="" method="post">
    <input type="text" name="input" id="input" value="readme.txt">
    <input type="submit" value="Submit">
</form>
'''

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        filename = "./"
        filename += request.form['input']
        try:
            with open(filename, 'r') as f:
                output = f.read()
            return HTML_TEMPLATE + output
        except Exception as e:
            return HTML_TEMPLATE + str(e)
    return HTML_TEMPLATE

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80) 