const express = require('express');
const path = require('path');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none';");
  next();
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req, res) => {
    if (req.body.action === 'place_order') {
        const cart = JSON.parse(req.body.cart);
        let total = 0;

        cart.forEach(item => {
            total += item.quantity * item.price;
        });

        res.json({ success: true, total: total });
    }
});

app.listen(port, () => {
  console.log(`Test 47 v2 server running on port ${port}`);
});
