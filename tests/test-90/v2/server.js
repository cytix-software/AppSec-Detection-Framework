const express = require('express');
const axios = require('axios');
const yauzl = require('yauzl');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/', async (req, res) => {
    let response_text = '<h1>Test 90</h1>';
    const url = 'https://github.com/githubtraining/hellogitworld/archive/refs/heads/master.zip';
    const downloadedFilePath = '/tmp/example.zip';

    try {
        // download the file
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(downloadedFilePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            // unzips the file and saves it
            yauzl.open(downloadedFilePath, { lazyEntries: true }, (err, zipfile) => {
                if (err) {
                    response_text += "Failed to open downloaded package.";
                    res.send(response_text);
                    return;
                }
                response_text += "<p>Files downloaded:</p>";
                zipfile.readEntry();
                zipfile.on('entry', (entry) => {
                    response_text += entry.fileName + '\n';
                    zipfile.readEntry();
                });
                zipfile.on('end', () => {
                    res.send(response_text);
                });
            });
        });

        writer.on('error', (err) => {
            response_text += "Failed to write downloaded file.";
            res.send(response_text);
        });

    } catch (error) {
        response_text += "Failed to download file.";
        res.send(response_text);
    }
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 90 v2 server running on port ${port}`);
});
