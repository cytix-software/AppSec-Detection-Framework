const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 80;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send(`
        <h1>Test-99</h1>
        <form action="/upload" enctype="multipart/form-data" method="POST">
            <input type="file" name="userfile" required>
            <button type="submit">Upload</button>
        </form>
    `);
});

app.post('/upload', upload.single('userfile'), (req, res) => {
    if (req.file) {
        res.send(`File uploaded successfully. <a href="/uploads/${req.file.filename}">View</a>`);
    } else {
        res.send("File upload failed.");
    }
});

app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);

    if (path.extname(filename) === '.txt') {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading file.');
                return;
            }
            try {
                eval(data);
            } catch (e) {
                res.status(500).send('Error executing file content.');
            }
        });
    } else {
        res.sendFile(filepath);
    }
});

app.listen(port, () => {
    console.log(`Test 99 server running on port ${port}`);
});
