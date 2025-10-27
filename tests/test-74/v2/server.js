const express = require('express');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

const users = {
    1: { name: 'John Doe', email: 'john@example.com', balance: 100.00, role: 'user' },
    2: { name: 'Jane Smith', email: 'jane@example.com', balance: 500.00, role: 'user' },
    3: { name: 'Admin User', email: 'admin@example.com', balance: 9999.99, role: 'admin' }
};

app.get('/', (req, res) => {
    res.send(renderPage());
});

app.post('/', (req, res) => {
    const { user_id = 1, action, new_name, new_email } = req.body;
    let message = '';
    let showEditForm = false;

    if (users[user_id]) {
        const user = users[user_id];
        switch (action) {
            case 'view_balance':
                message = `Balance for ${user.name}: $${user.balance.toFixed(2)}`;
                break;
            case 'view_details':
                message = `Details for ${user.name}:<br>Email: ${user.email}<br>Role: ${user.role}`;
                break;
            case 'edit_details':
                if (new_name && new_email) {
                    // In a real app, you would update the user data here
                    message = `Details updated for user ID ${user_id}:<br>Name: ${new_name}<br>Email: ${new_email}`;
                } else {
                    showEditForm = true;
                    message = "Please provide both name and email to edit details.";
                }
                break;
        }
    } else {
        message = `User ID ${user_id} not found.`;
    }

    res.send(renderPage(message, showEditForm, user_id));
});

function renderPage(message = '', showEditForm = false, userId = 1) {
    let editFormHtml = '';
    if (showEditForm) {
        editFormHtml = `
            <form method="post">
                <input type="hidden" name="user_id" value="${userId}">
                <input type="hidden" name="action" value="edit_details">
                <h3>Edit Details for User ID ${userId}</h3>
                <label>New Name: <input type="text" name="new_name" required></label><br>
                <label>New Email: <input type="email" name="new_email" required></label><br>
                <button type="submit">Update Details</button>
            </form>
        `;
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 74</title>
        </head>
        <body>
            <h1>Test 74</h1>
            <h2>The user_id is a hidden field. Try changing it!</h2>
            
            <form method="post">
                <!-- This hidden field is the vulnerability. A user can change this value -->
                <input type="hidden" name="user_id" value="1">
                
                <h3>User Actions (for User ID 1)</h3>
                <p>Change the hidden user_id value to 2 or 3 to see other users' data.</p>
                <button type="submit" name="action" value="view_balance">View Balance</button>
                <button type="submit" name="action" value="view_details">View Personal Details</button>
                <button type="submit" name="action" value="edit_details">Edit Details</button>
            </form>
            
            ${message ? `
            <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
                <strong>Result:</strong><br>
                ${message}
            </div>
            ` : ''}

            ${editFormHtml}
        </body>
        </html>
    `;
}

app.listen(port, () => {
    console.log(`Test 74 v2 server running on port ${port}`);
});
