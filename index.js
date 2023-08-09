const express = require('express');
const app = express();
const http = require('http');
const createUser = require('./middleware/db/createUser');
const getUser = require('./middleware/db/getUser');
const textToSpeech = require('./middleware/api/textToSpeech');
const downloadFile = require('./middleware/api/downloadFile');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const speechToText = require('./middleware/api/speechToText');
const liveSpeechToText = require('./middleware/api/liveSpeechToText');
const deleteFile = require('./middleware/api/deleteFile');
const { Storage } = require('@google-cloud/storage');
const { MongoClient } = require('mongodb');
const WebSocket = require('ws');
dotenv.config();

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const corsOptions = {
    origin: process.env.CORS_URL,
    optionsSuccessStatus: 200
}

const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const uri = process.env.DB_URL;

const path = require('path');
const bodyParser = require('body-parser');

const DbClient = new MongoClient(uri);
const database = DbClient.db("createBoss");
const usersCollection = database.collection("users");

const googleCloudStorage = new Storage({
    keyFileName: path.join(__dirname, "../../config/google.json"),
    projectId: 'animated-alloy-236515'
})

wss.on('connection',(ws) => {
    liveSpeechToText(ws);
    wss.send('siemanko');
})

app.use(cors(corsOptions));

app.use(express.urlencoded({
    extended: true,
    limit: 5000000
}));

app.use(bodyParser.raw({ type: "audio/mpeg", limit: "1mb" }));

app.get('/', cors(corsOptions), (req, res) => {
    res.send("OK");
})

app.post('/create-user', createUser(usersCollection));
app.get('/get-user', cors(corsOptions), getUser(usersCollection));

app.post('/api/text-to-speech', upload.single("file"), cors(corsOptions), textToSpeech(googleCloudStorage));
app.get('/api/text-to-speech/get/:filename',downloadFile(googleCloudStorage));
app.get('/api/text-to-speech/delete/:filename', deleteFile(googleCloudStorage))

app.post('/api/speech-to-text', upload.single('file'), speechToText(googleCloudStorage));
app.get('/api/speech-to-text/get/:filename', cors(corsOptions), downloadFile(googleCloudStorage));
app.get('/api/speech-to-text/delete/:filename', deleteFile(googleCloudStorage))


app.listen(process.env.PORT || 80, () => {
    console.log('app listening');
})





