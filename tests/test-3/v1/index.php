<?php //This updated test app reflects true CSRF on an authenticated endpoint as to an unauthenticated one.
session_start();

$store = __DIR__ . "/state.json";
if (!file_exists($store)) {
    file_put_contents($store, json_encode([
        "email" => "user@example.test",
        "display_name" => "User"
    ], JSON_PRETTY_PRINT));
}

function load_state(string $file): array {
    $raw = @file_get_contents($file);
    $data = json_decode($raw ?: "", true);
    return is_array($data) ? $data : ["email" => "", "display_name" => ""];
}
function save_state(string $file, array $state): void {
    file_put_contents($file, json_encode($state, JSON_PRETTY_PRINT));
}

$state = load_state($store);

// minimal auth
if (isset($_GET["login"])) {
    $_SESSION["logged_in"] = true;
    header("Location: /");
    exit;
}
if (isset($_GET["logout"])) {
    session_destroy();
    header("Location: /");
    exit;
}

$loggedIn = !empty($_SESSION["logged_in"]);

if (!$loggedIn) {
    ?>
    <!doctype html>
    <html><head><meta charset="utf-8"><title>Account</title></head>
    <body>
      <h2>Account</h2>
      <p><b>Not logged in.</b> <a href="/?login=1">Login</a></p>
    </body></html>
    <?php
    exit;
}

/**
 * Update actions (intentionally no token / no origin checks).
 * Persistent change for verification.
 */

// POST update (scanner-friendly)
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["email"])) {
    $state["email"] = (string)$_POST["email"];
    save_state($store, $state);
    header("Location: /?saved=1");
    exit;
}

// Optional GET update (off by default)
// Toggle to true if you want an HTTP-friendly browser demonstration.
$enableGetUpdate = true;
if ($enableGetUpdate && isset($_GET["email"])) {
    $state["email"] = (string)$_GET["email"];
    save_state($store, $state);
    header("Location: /?saved=1");
    exit;
}

$emailSafe = htmlspecialchars($state["email"], ENT_QUOTES, "UTF-8");
$nameSafe  = htmlspecialchars($state["display_name"], ENT_QUOTES, "UTF-8");
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Account</title></head>
<body>
  <h2>Account</h2>
  <p><b>Logged in.</b> <a href="/?logout=1">Logout</a></p>

  <?php if (isset($_GET["saved"])): ?>
    <p><b>Saved.</b></p>
  <?php endif; ?>

  <h3>Profile</h3>
  <ul>
    <li>Display name: <b><?= $nameSafe ?></b></li>
    <li>Email: <b><?= $emailSafe ?></b></li>
  </ul>

  <h3>Update email</h3>
  <form method="POST" action="/">
    <input type="email" name="email" value="<?= $emailSafe ?>" required>
    <button type="submit">Save</button>
  </form>
</body>
</html>