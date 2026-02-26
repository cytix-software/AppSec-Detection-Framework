const express = require("express");
const session = require("express-session");
const xpath = require("xpath");
const { DOMParser } = require("xmldom");

const app = express();
const port = 80;

// BaseX REST settings
const BASEX_BASE = "http://test_71_basex:8984/rest";
const BASEX_USER = "admin";
const BASEX_PASS = "admin";

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "test71-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initialXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<data>
  <users>
    <user><username>admin</username><email>admin@example.com</email><department>IT</department></user>
    <user><username>john</username><email>john@example.com</email><department>HR</department></user>
    <user><username>jane</username><email>jane@example.com</email><department>Finance</department></user>
    <user><username>bob</username><email>bob@example.com</email><department>Marketing</department></user>
    <user><username>alice</username><email>alice@example.com</email><department>Sales</department></user>
  </users>
  <searchLog></searchLog>
</data>`;
}

function appendSearchLogUnescaped(xmlData, term) {
  const ts = new Date().toISOString();
  const entry = `<search><term>${term}</term><ts>${ts}</ts></search>`;
  return xmlData.replace("</searchLog>", `${entry}</searchLog>`);
}

function parseXml(xmlData) {
  return new DOMParser().parseFromString(xmlData, "text/xml");
}

function searchXmlData_xpath(xmlData, username) {
  try {
    const doc = parseXml(xmlData);

    const xpathQuery = `//user[username='${username}']`; // vulnerable
    const nodes = xpath.select(xpathQuery, doc);

    const results = [];
    for (const node of nodes) {
      const getText = (tag) => {
        const n = xpath.select1(tag, node);
        return n && n.firstChild ? n.firstChild.nodeValue : "";
      };

      results.push({
        username: getText("username"),
        email: getText("email"),
        department: getText("department"),
      });
    }
    return results;
  } catch {
    return [];
  }
}

function getRecentSearchTerms(xmlData, limit = 8) {
  try {
    const doc = parseXml(xmlData);
    const nodes = xpath.select("//searchLog/search/term", doc);
    const terms = nodes.map((n) => (n.firstChild ? n.firstChild.nodeValue : ""));
    return terms.slice(-limit);
  } catch {
    return [];
  }
}

function mergeUsers(...lists) {
  const out = new Map();
  for (const list of lists) {
    for (const u of list) {
      const key = (u.email || "").trim().toLowerCase() || JSON.stringify(u);
      if (!out.has(key)) out.set(key, u);
    }
  }
  return Array.from(out.values());
}

function renderUserTable(users) {
  if (!users.length) return `<p>No users found.</p>`;

  const rows = users
    .map(
      (u) => `<tr>
<td>${escapeHtml(u.username)}</td>
<td>${escapeHtml(u.email)}</td>
<td>${escapeHtml(u.department)}</td>
</tr>`
    )
    .join("");

  return `<p>Found ${users.length} users</p>
<table border="1">
<tr><th>Username</th><th>Email</th><th>Department</th></tr>
${rows}
</table>`;
}

async function searchXmlData_basex(xmlData, username) {
  const xquery = `let $doc := parse-xml(${JSON.stringify(xmlData)})
for $u in $doc//user[username = '${username}']
return <user>
  <username>{data($u/username)}</username>
  <email>{data($u/email)}</email>
  <department>{data($u/department)}</department>
</user>`;

  const url = `${BASEX_BASE}?query=${encodeURIComponent(xquery)}&method=xml`;

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${BASEX_USER}:${BASEX_PASS}`).toString("base64"),
    },
  });

  if (!resp.ok) return [];

  const body = await resp.text();
  if (!body.trim()) return [];

  // Wrap fragments so XPath can parse
  const wrapped = `<users>${body}</users>`;
  try {
    const doc = parseXml(wrapped);
    const nodes = xpath.select("//user", doc);

    return nodes.map((node) => {
      const getText = (tag) => {
        const n = xpath.select1(tag, node);
        return n && n.firstChild ? n.firstChild.nodeValue : "";
      };
      return {
        username: getText("username"),
        email: getText("email"),
        department: getText("department"),
      };
    });
  } catch {
    return [];
  }
}

app.get("/", (req, res) => {
  if (!req.session.xml_data) req.session.xml_data = initialXml();

  res.send(`<!DOCTYPE html>
<html>
<head><title>Test 71</title></head>
<body>
  <h1>Test 71</h1>

  <h2>Search Users</h2>
  <form method="post">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" placeholder="Enter username">
    <button type="submit">Search</button>
  </form>
</body>
</html>`);
});

app.post("/", async (req, res) => {
  if (!req.session.xml_data) req.session.xml_data = initialXml();

  const username = req.body.username || "";
  let xmlData = req.session.xml_data;

  // Persist audit log entry in server-side XML
  xmlData = appendSearchLogUnescaped(xmlData, username);
  req.session.xml_data = xmlData;

  const xpathResults = searchXmlData_xpath(xmlData, username);
  const xqueryResults = await searchXmlData_basex(xmlData, username);

  const merged = mergeUsers(xpathResults, xqueryResults);
  const recent = getRecentSearchTerms(xmlData, 8);

  res.send(`<!DOCTYPE html>
<html>
<head><title>Test 71</title></head>
<body>
  <h1>Test 71</h1>

  <h2>Search Users</h2>
  <form method="post">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" value="${escapeHtml(
      username
    )}" placeholder="Enter username">
    <button type="submit">Search</button>
  </form>

  <hr>
  <h3>Results</h3>
  ${renderUserTable(merged)}

  <hr>
  <h3>Recent search terms (from server-side XML audit log)</h3>
  ${
    recent.length
      ? `<ul>${recent.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`
      : `<p>No search terms logged (or XML got malformed).</p>`
  }
</body>
</html>`);
});

app.listen(port, () => {
  console.log(`Test 71 v2 server running on port ${port}`);
});