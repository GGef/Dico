// server.js
const express = require('express');
const fs = require('fs').promises; // Utilisez fs.promises pour des opérations asynchrones
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();
const cors = require('cors');
const path = require('path');


const allowedIPs = ['54.156.20.95']

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

app.use(cors());


// Middleware pour servir les fichiers statiques du dossier 'public'
app.use(express.static('public'));


// Fetch words from SheetDB
app.get('/get-words', cors(), async (req, res) => {
    try {
        const response = await fetch(`${process.env.SHEETDB_API_URL}/search?statut=false&casesensitive=false`, { // Adjust the URL path if needed
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const words = await response.json();
            res.json({ success: true, data: words });
        } else {
            throw new Error('Failed to fetch words from SheetDB');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des mots.' });
    }
});
// Route pour soumettre les réponses du quiz
app.post('/submit-word-selection', async (req, res) => {
    const { firstName, lastName, email, id } = req.body;

    // Create the data object to send to SheetDB
    const dataToSend = {
        data: [{
            "NOM PRENOM": firstName +" "+ lastName,
            "EMAIL": email,
            "ID": id
        }]
    };

    try {
        const responseSheetDB = await fetch(`${process.env.SHEETDB_API_URL}?sheet=data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        });

        const updateSheetDB = await fetch(`${process.env.SHEETDB_API_URL}/ID/${id}?sheet=mot`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({statut : 'TRUE'})
        });

        if (responseSheetDB.ok) {
            res.json({ success: true, message: 'Data successfully sent to SheetDB.' });
        } else {
            throw new Error('Failed to send data to SheetDB');
        }
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to submit data to SheetDB.' });
    }


});


// Si vous souhaitez avoir une route fallback qui renvoie 'index.html' pour toutes les routes non gérées :
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
