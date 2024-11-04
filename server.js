const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint to save data
app.post('/save-data', (req, res) => {
    console.log('Received data:', req.body); // Log received data
    const { name, number } = req.body;
    const filePath = path.join(__dirname, 'data.json');

    // Read existing data and check for duplicates
    fs.readFile(filePath, 'utf8', (err, fileData) => {
        let jsonData = [];
        if (!err && fileData) {
            jsonData = JSON.parse(fileData);
        }

        // Check if number already exists
        const isDuplicate = jsonData.some(entry => entry.number === number);
        if (isDuplicate) {
            return res.status(400).json({ message: 'ČÍSLO JE JIŽ ZAREGISTROVANÉ' });
        }

        // Append new data
        jsonData.push({ name, number });
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'NEPODAŘILO SE ULOŽIT DATA - ZKUSTE TO ZNOVU' });
            }
            res.status(200).json({ message: 'ÚSPĚŠNĚ JSI SE ZAREGISTROVAL - VYHLÁŠENÍ PROBĚHNE V 23:30' });
        });
    });
});

// Create an empty data.json file if it doesn't exist
const filePath = path.join(__dirname, 'data.json');
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
