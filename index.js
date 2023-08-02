const express = require('express');
const app = express();
const createUser = require('./middleware/db/createUser');
const getUser = require('./middleware/db/getUser');
const textToSpeech = require('./middleware/api/textToSpeech');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

dotenv.config();

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const corsOptions = {
    origin: process.env.CORS_URL,
    optionsSuccessStatus: 200
}


const uri = process.env.DB_URL;

const { MongoClient } = require('mongodb');
const path = require('path');
const client = new MongoClient(uri);
const database = client.db("createBoss");
const usersCollection = database.collection("users");
const googleCloudStorage = new Storage({
    keyFileName: path.join(__dirname, "../../config/google.json"),
    projectId: 'animated-alloy-236515'
})

app.use(express.urlencoded({
    extended: true,
    limit: 5000000
}));

app.get('/', cors(corsOptions), (req, res) => {
    res.send("OK");
})
app.post('/create-user', cors(corsOptions), createUser(usersCollection));

app.get('/get-user', cors(corsOptions), getUser(usersCollection));

app.get('/api/text-to-speech/:filename', cors(corsOptions), async function (req, res) {

    const filename = req.params.filename;

    try {
        // Get the file from Google Cloud Storage
        const file = googleCloudStorage.bucket('create-boss').file(filename);

        // Download the file to a local buffer
        const [fileBuffer] = await file.download();

        // Set the appropriate Content-Type header
        res.set('Content-Type', file.metadata.contentType);

        // Serve the file for download using res.download()
        file.createReadStream().pipe(res);
        
    } catch (err) {
        console.error('Error downloading the file:', err);
        res.status(500).send('Error downloading the file.');
    }

});
app.listen(process.env.PORT || 4000, () => {
    console.log('app listening');
})
app.post('/api/text-to-speech', upload.single("file"), cors(corsOptions), textToSpeech(googleCloudStorage));






