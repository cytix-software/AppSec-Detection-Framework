const express = require("express");
const fs = require("fs");

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.type("html").send(`
    <form action="" method="post">
      <input type="text" name="input" id="input" value="readme.txt">
      <input type="submit" value="Submit">
    </form>
  `);
});

app.post("/", (req, res) => {
  const user_input = String(req.body.input ?? "");

  // Replicate the v1-style filtering:
  // removes ../ and .../ but can be bypassed with .../...//
  const sanitised = user_input
    .replaceAll("../", "")
    .replaceAll(".../", "");

  const filename = "./" + sanitised;
  console.log("Path:", filename);

  try {
    const data = fs.readFileSync(filename, "utf8");
    res.status(200).send("File content: " + data);
  } catch (err) {
    res.status(404).send("File not found!");
  }
});

app.listen(port, () => {
  console.log("Test 9 V2 App listening on " + port);
});