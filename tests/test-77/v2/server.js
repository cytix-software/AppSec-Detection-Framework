const express = require('express');
const app = express();
const port = 80;

// In-memory database of invoices
const invoices = {
    1: { id: 1, user_id: 101, amount: 150.00, details: 'Invoice for John Doe' },
    2: { id: 2, user_id: 102, amount: 200.50, details: 'Invoice for Jane Smith' },
    3: { id: 3, user_id: 101, amount: 50.25, details: 'Another invoice for John Doe' },
    4: { id: 4, user_id: 103, amount: 1000.00, details: 'Admin-only invoice' }
};

app.get('/', (req, res) => {
    const invoiceId = req.query.id;
    let invoiceDetails = '';

    if (invoiceId) {
        const invoice = invoices[invoiceId];
        if (invoice) {
            invoiceDetails = `<h2>Invoice #${invoice.id}</h2><pre>${JSON.stringify(invoice, null, 2)}</pre>`;
        } else {
            invoiceDetails = `<p>No invoice found for ID ${invoiceId}.</p>`;
        }
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 77 v2</title>
        </head>
        <body>
            <h1>Invoice Lookup</h1>
            <p>Try viewing invoices with ID 1, 2, 3, or 4. Notice there is no access control.</p>
            <form method="get">
                <label for="id">Invoice ID:</label>
                <input type="number" name="id" id="id" value="${invoiceId || ''}">
                <button type="submit">View</button>
            </form>
            ${invoiceDetails}
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Test 77 v2 server running on port ${port}`);
});
