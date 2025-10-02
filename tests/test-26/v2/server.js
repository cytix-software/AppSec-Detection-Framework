const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 80;

const uploadDir = path.join(__dirname, 'uploads');
// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, path.basename(file.originalname))
});
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
      <title>Test 26</title>
  </head>
  <body>
      <h1>Test 26</h1>
      <h2>Upload a File</h2>
      <form action="/" method="post" enctype="multipart/form-data">
          <input type="file" name="file" required>
          <input type="submit" value="Upload">
      </form>
  </body>
  </html>`);
});

app.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const allowedExtensions = ['jpg', 'png', 'gif', 'txt', 'pdf'];
  const fileName = path.basename(req.file.originalname);
  const fileExt = path.extname(fileName).slice(1);
  if (allowedExtensions.includes(fileExt)) {
    res.send(`File uploaded successfully: <a href="/uploads/${encodeURIComponent(fileName)}">${fileName}</a>`);
  } else {
    res.send('Invalid file type.');
  }
});

app.use('/uploads', express.static(uploadDir));

app.listen(port, () => {
  console.log(`Test 26 v2 server running on port ${port}`);
});


