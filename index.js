const express = require('express');
const app = express();
const createUser = require('./middleware/createUser');
const getUser = require('./middleware/getUser');
const textToSpeech = require('./middleware/api/textToSpeech');
const dotenv = require('dotenv');
const cors = require('cors');
const key = require('./google-key/key.json');
const multer = require('multer');
const fs = require('fs');
dotenv.config();

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

app.use(express.urlencoded({ extended: true }));

app.get('/', cors(corsOptions), (req, res) => {
    listVoices('en-US');
    res.send("OK");
})
app.post('/create-user', cors(corsOptions), createUser(usersCollection));

app.get('/get-user', cors(corsOptions), getUser(usersCollection));

app.get('/api/text-to-speech/:file', cors(corsOptions), function (req, res) {
    let resolve = path.resolve;
    res.download(resolve(`./${req.params.file}`));
});
app.listen(process.env.PORT || 4000, () => {
    console.log('app listening');
})
app.post('/api/text-to-speech',cors(corsOptions), textToSpeech());






