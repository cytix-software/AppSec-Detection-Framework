const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path')
const app = express();
const port = 80;

//const TEMP_DIR_PREFIX = path.join(os.tmpdir(), 'node-app-');

app.get('/', (req, res) => {
    let output = '';
    
    try {
        // create temp file and dir
        const tempDir = os.tmpdir();
        const tempFilename = path.join(tempDir, 'tempfile.js');

        output += `Temporary directory created at: ${tempDir}<br>`;
        output += `Temporary file created at: ${tempFilename}<br><br>`;

        // Write the data and change permissions
        fs.writeFileSync(tempFilename, 'console.log("Sensitive data")'); 
        
        output += "File contents: ";

        require(tempFilename);

        output += "Executed content (check server console)<br><br>";
        
        try {
            fs.unlinkSync(tempFilename);
            fs.rmdirSync(tempDir);
            output += 'Temporary file and directory deleted.';
        } catch (cleanupError) {
            output += `Cleanup failed: ${cleanupError.message}<br>`;
            console.error("Cleanup error:", cleanupError);
        }
    } catch (error) {
        output += `ERROR: ${error.message}<br>`;
        console.error("File operation failed:", error);
    }
    res.send(output);
});

app.listen(port, () => {
    console.log('Test 12 V2 App listening on ' + port);
});