from flask import Flask, request, render_template_string
import os
from lxml import etree

app = Flask(__name__)

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Test 107</title>
</head>
<body>
    <h2>Upload XML File</h2>
    <form method="post" enctype="multipart/form-data">
        <input type="file" name="xmlfile" accept=".xml" required />
        <button type="submit">Upload</button>
    </form>
</body>
</html>
'''

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        uploaded_file = request.files['xmlfile']
        if uploaded_file:
            xml_content = uploaded_file.read()
            try:
                parser = etree.XMLParser(resolve_entities=True)
                contents = etree.fromstring(xml_content, parser=parser)
                return HTML_TEMPLATE + "<p>XML file successfully parsed:</p><pre>" + etree.tostring(contents, encoding='unicode') + "</pre>"
            except etree.XMLSyntaxError as e:
                return HTML_TEMPLATE + f"<p>Error parsing XML: {e}</p>"
    return HTML_TEMPLATE

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80) 