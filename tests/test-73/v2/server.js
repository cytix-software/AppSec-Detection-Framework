const express = require('express');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

class PublicInfo {
    getInfo() {
        return "This is public information.";
    }
}

class SecretData {
    getInfo() {
        return "<b>Secret:</b> The admin password is 'hunter2'.";
    }
}

class SystemInfo {
    getInfo() {
        return `<b>System:</b> Node.js version: ${process.version}`;
    }
}

const classMap = {
    PublicInfo,
    SecretData,
    SystemInfo
};

app.get('/', (req, res) => {
    res.send(`
        <h1>Test 73</h1>
        <form method="post">
            <label for="class">Select class to get info (There are 3 classes, PublicInfo, SecretData, and SystemInfo):</label><br>
            <input type="text" id="class" name="class" placeholder="PublicInfo, SecretData, or SystemInfo">
            <button type="submit">Get Info</button>
        </form>
    `);
});

app.post('/', (req, res) => {
    const className = req.body.class;
    let message = '';

    if (className && classMap[className]) {
        const ClassToInstantiate = classMap[className];
        const obj = new ClassToInstantiate();
        message = obj.getInfo();
    } else {
        message = `Class '${className}' does not exist.`;
    }

    res.send(`
        <h1>Test 73</h1>
        <form method="post">
            <label for="class">Select class to get info (There are 3 classes, PublicInfo, SecretData, and SystemInfo):</label><br>
            <input type="text" id="class" name="class" placeholder="PublicInfo, SecretData, or SystemInfo">
            <button type="submit">Get Info</button>
        </form>
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            ${message}
        </div>
    `);
});

app.listen(port, () => {
    console.log(`Test 73 v2 server running on port ${port}`);
});
