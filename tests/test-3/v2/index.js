const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const fs = require("fs");

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const DB_FILE = path.join(__dirname, "state.json");

// Very small “DB”
function loadState() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ email: "user@example.test" }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function saveState(state) {
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
}

// Minimal cookie-backed session store in memory
const sessions = new Map();
function getSession(req) {
  const sid = req.cookies.sid;
  if (!sid) return null;
  return sessions.get(sid) || null;
}

// Login: sets a cookie (auth context for scanners)
app.get("/login", (req, res) => {
  const sid = crypto.randomBytes(16).toString("hex");
  sessions.set(sid, { loggedIn: true });

  res.cookie("sid", sid, {
    httpOnly: true,
    // sameSite left as default on purpose
  });

  res.redirect("/");
});

app.get("/logout", (req, res) => {
  const sid = req.cookies.sid;
  if (sid) sessions.delete(sid);
  res.clearCookie("sid");
  res.redirect("/");
});

// Home page shows state + form, requires login to use the action
app.get("/", (req, res) => {
  const session = getSession(req);
  if (!session?.loggedIn) {
    return res.send(`
      <h2>Test 3 V2</h2>
      <p><b>Not logged in.</b> <a href="/login">Login</a></p>
    `);
  }

  const state = loadState();
  const emailSafe = String(state.email)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  res.send(`
    <!doctype html>
    <html>
    <head><meta charset="utf-8"><title>Test 3 V2</title></head>
    <body>
      <h2>Test 3 V2</h2>
      <p><b>Logged in.</b> <a href="/logout">Logout</a></p>
      ${req.query.saved ? "<p><b>Saved.</b></p>" : ""}

      <p>Current email: <b>${emailSafe}</b></p>

      <form method="post" action="/change/email">
        <input type="text" name="email" value="${emailSafe}" />
        <button type="submit">Submit</button>
      </form>
    </body>
    </html>
  `);
});

// Authenticated, state-changing endpoint
app.post("/change/email", (req, res) => {
  const session = getSession(req);
  if (!session?.loggedIn) {
    return res.status(401).send("Not logged in.");
  }

  const state = loadState();
  state.email = req.body.email ?? state.email;
  saveState(state);

  res.redirect("/?saved=1");
});

app.listen(port, () => {
  console.log(`Test 3 V2 server running on port ${port}`);
});