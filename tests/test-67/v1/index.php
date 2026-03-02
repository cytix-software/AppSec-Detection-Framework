<?php
$out = '';
$err = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = $_POST['code'] ?? '';

    ob_start();
    try {
        eval($code);
    } catch (Throwable $e) {
        $err = $e->getMessage();
    }
    $out = ob_get_clean();
}
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interactive App</title>
</head>
<body>
  <h1>Interactive App</h1>

  <form method="post">
      <label>Enter PHP to evaluate:</label><br>
      <input type="text" name="code" style="width:400px" required><br>
      <button type="submit">Run</button>
  </form>

  <?php if ($_SERVER['REQUEST_METHOD'] === 'POST'): ?>
    <h3>Eval result</h3>
    <?php if ($err): ?>
      <pre style="color:red;"><?php echo htmlspecialchars($err); ?></pre>
    <?php endif; ?>
    <pre><?php echo htmlspecialchars($out); ?></pre>
  <?php endif; ?>
</body>
</html>