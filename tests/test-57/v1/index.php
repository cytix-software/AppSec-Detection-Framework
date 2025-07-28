<?php
// CWE-59: Improper Link Resolution Before File Access
// This application demonstrates a vulnerability where a user can upload a tar file containing a symlink, which is then extracted and read, leading to a sensitive file being read.

$uploads_dir = __DIR__ . '/uploads/';
$extract_message = '';
$read_message = '';

// Handle tar file upload, extraction, and reading 'secret.txt'
if (isset($_FILES['tarfile'])) {
    $tar_path = $uploads_dir . basename($_FILES['tarfile']['name']);
    if (move_uploaded_file($_FILES['tarfile']['tmp_name'], $tar_path)) {
        // VULNERABLE: No sanitization, extracts symlinks from tar using system tar
        $cmd = "tar -xf " . escapeshellarg($tar_path) . " -C " . escapeshellarg($uploads_dir);
        shell_exec($cmd);
        $extract_message = "<span style='color:green;'>Tar archive extracted!</span>";
        // Attempt to read 'secret.txt' immediately after extraction
        $secret_path = $uploads_dir . 'secret.txt';
        if (file_exists($secret_path)) {
            $content = file_get_contents($secret_path);
            $read_message = "<pre>" . htmlspecialchars($content) . "</pre>";
        } else {
            $read_message = "<span style='color:red;'>secret.txt not found after extraction.</span>";
        }
    } else {
        $extract_message = "<span style='color:red;'>Failed to upload tar file.</span>";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-59: Tar Symlink Extraction Vulnerability</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .vulnerable { color: red; }
    </style>
</head>
<body>
    <h1>CWE-59: Tar Symlink Extraction Vulnerability</h1>
    <p class="vulnerable">This app is vulnerable: it extracts tar files without checking for symlinks!</p>

    <h2>Upload a Tar File</h2>
    <form enctype="multipart/form-data" method="post">
        <input type="file" name="tarfile" accept=".tar" required>
        <button type="submit">Upload, Extract, and Read secret.txt</button>
    </form>
    <div style="margin-top: 10px;">
        <?php echo $extract_message; ?>
    </div>
    <div style="margin-top: 20px;">
        <?php echo $read_message; ?>
    </div>

    <p>Upload a tar file containing a symlink named <code>secret.txt</code> (e.g., <code>secret.txt</code> → <code>/etc/passwd</code>). The app will extract and immediately display the contents of <code>secret.txt</code>.</p>
</body>
</html> 