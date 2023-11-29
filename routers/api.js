const express = require('express');
const   router = express.Router();
const multer = require('multer');
const {MongoClient} = require('mongodb');
const {Storage} = require('@google-cloud/storage');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../config/firebase.json');
const dotenv = require('dotenv');

//middlewares
const textToSpeech = require('../middleware/api/textToSpeech');
const newSpeechToText = require('../middleware/api/newSpeechToText');
const cloneVoice = require('../middleware/api/cloneVoice');
const speechToText = require('../middleware/api/speechToText');
const checkAuth = require('../middleware/api/checkAuth');
const enhanceImage = require('../middleware/api/enhanceImage');
const downloadFile = require('../middleware/api/downloadFile');
const subtitlesToVideo = require('../middleware/api/subtitlesToVideo');;
const requestUserPasswordReset = require('../middleware/api/requestUserPasswordReset');
const resetUserPassword = require('../middleware/api/resestUserPassword');
const getUserVoices = require('../middleware/api/getVoices');
const removeUserVoice = require('../middleware/api/removeUserVoice');
dotenv.config();

//storages
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, limits: { fieldSize: 200 * 1024 * 1024 } });

const googleCloudStorage = new Storage({
    projectId: process.env.PROJECT_ID,
});
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
  });

//database
const dbUri = process.env.DB_URI;
const DbClient = new MongoClient(dbUri);
const database = DbClient.db('createBoss');
const voicesCollection = database.collection('voices');

//routes 
router.get('/',(req,res) => {
  res.send("hello");
})
//service providers
router.post('/text-to-speech', upload.single('file'), textToSpeech(googleCloudStorage));
router.post('/speech-to-text', upload.single('file'), newSpeechToText(googleCloudStorage));
router.post('/subtitles-from-video', upload.single('file'), newSpeechToText(googleCloudStorage, false));
router.post('/subtitles-to-video', upload.single("file"), subtitlesToVideo(googleCloudStorage));
router.post('/voice-clone', upload.array('files'), cloneVoice(googleCloudStorage, voicesCollection));
router.post('/image-enhance',upload.single("file"),enhanceImage(googleCloudStorage));

//auth
router.get('/check-auth', checkAuth);
router.post('/request-user-password-reset',requestUserPasswordReset(firebaseAdmin));
router.post('/reset-user-password',resetUserPassword(firebaseAdmin));

//files
router.get('/get/:filename',downloadFile(googleCloudStorage));


//misc
router.get('/get-user-voices', getUserVoices(voicesCollection));
router.delete('/user-voice',removeUserVoice(voicesCollection,googleCloudStorage));

module.exports = router;