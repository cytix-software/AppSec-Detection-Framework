const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 80;

app.get('/', (req, res) => {
    const html = `
        <form action="" method="post" enctype="multipart/form-data">
            <input type="file" name="input" id="input">
            <input type="submit" value="Upload File" name="submit">
        </form>
        `
    res.send(html)
});

app.post('/', upload.single('input'), (req, res) =>{
    if (req.file) {
        const filePath = req.file.path;
        const uploadedFile = require('./' + filePath); 
        console.log(`Received file: ${req.file.originalname}`);
        res.send(`File uploaded successfully to ${req.file.path}`);
    } else {
        res.status(400).send("No file uploaded.");
    }
});

app.listen(port, () => {
    console.log('Test 6 V2 App listening on ' + port);
});