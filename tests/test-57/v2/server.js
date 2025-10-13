const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 80;

const uploads_dir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploads_dir)) {
    fs.mkdirSync(uploads_dir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploads_dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Test 57 v2</title>
</head>
<body>
    <h1>Test 57 v2</h1>
    <p>This app extracts Tar files!</p>

    <h2>Upload a Tar File</h2>
    <form action="/upload" enctype="multipart/form-data" method="post">
        <input type="file" name="tarfile" accept=".tar" required>
        <button type="submit">Upload, Extract, and Read secret.txt</button>
    </form>
    <div id="result" style="margin-top: 20px;"></div>
    <p>Upload a tar file containing secret.txt.</p></body>
</html>
    `);
});

app.post('/upload', upload.single('tarfile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const tarPath = req.file.path;
    // extracts symlinks from tar using system tar
    const cmd = `tar -xf "${tarPath}" -C "${uploads_dir}"`;

    exec(cmd, (error, stdout, stderr) => {
        let extract_message = "<span style='color:green;'>Tar archive extracted!</span>";
        if (error) {
            console.error(`exec error: ${error}`);
            extract_message = "<span style='color:red;'>Failed to extract tar file.</span>";
        }

        const secretPath = path.join(uploads_dir, 'secret.txt');
        let read_message = '';
        if (fs.existsSync(secretPath)) {
            try {
                const content = fs.readFileSync(secretPath, 'utf-8');
                read_message = "<pre>" + content.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</pre>";
            } catch (readError) {
                read_message = "<span style='color:red;'>Could not read secret.txt.</span>";
            }
        } else {
            read_message = "<span style='color:red;'>secret.txt not found after extraction.</span>";
        }

        // Clean up the uploaded tar and extracted files for the next run
        fs.unlinkSync(tarPath);
        if (fs.existsSync(secretPath)) {
             // This will remove the symlink, not the file it points to.
            fs.unlinkSync(secretPath);
        }


        res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Test 57 v2</title>
</head>
<body>
    <h1>Test 57 v2</h1>
    <p>This app extracts Tar files!</p>

    <h2>Upload a Tar File</h2>
    <form action="/upload" enctype="multipart/form-data" method="post">
        <input type="file" name="tarfile" accept=".tar" required>
        <button type="submit">Upload, Extract, and Read secret.txt</button>
    </form>
    <div style="margin-top: 10px;">
        ${extract_message}
    </div>
    <div style="margin-top: 20px;">
        ${read_message}
    </div>
    <p>Upload a tar file containing secret.txt.</p>
</body>
</html>
        `);
    });
});

app.listen(port, () => {
    console.log(`Test 57 v2 server running on port ${port}`);
});
