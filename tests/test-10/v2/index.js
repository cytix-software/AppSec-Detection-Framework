const express = require('express');
const multer = require('multer');
const app = express();
const port = 80;

const UPLOAD_DIRECTORY = '/app';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // tell Multer where to save the file
        cb(null, UPLOAD_DIRECTORY);
    },
    
    // Configure the filename
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send(`
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" id="file">
            <input type="submit" value="Upload File">
        </form>
    `);
});

// The POST route that handles the file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        console.log(`File saved with original name: ${req.file.originalname}`);
        res.send(`File uploaded successfully to: ${req.file.path}`);
    } else {
        res.status(400).send("Failed to upload the file.");
    }
});

app.listen(port, () => {
    console.log('Test 10 V2 App listening on ' + port);
});