const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {


  const express = require('express');
  const app = express();
  const createUser = require('./middleware/db/createUser');
  const getUser = require('./middleware/db/getUser');
  const textToSpeech = require('./middleware/api/textToSpeech');
  const downloadFile = require('./middleware/api/downloadFile');
  const dotenv = require('dotenv');
  const cors = require('cors');
  const multer = require('multer');
  const speechToText = require('./middleware/api/speechToText');
  const deleteFile = require('./middleware/api/deleteFile');
  const { Storage } = require('@google-cloud/storage');
  const { MongoClient } = require('mongodb');
  const getVoices = require('./middleware/api/getVoices');
  const Redis = require('ioredis');
  const csrf = require('csurf');
  const helmet = require('helmet');
  const crypto = require('crypto');
  const session = require('express-session');
  const compression = require('compression');
  dotenv.config();

  const multerStorage = multer.memoryStorage();
  const upload = multer({ storage: multerStorage });
  const redis = new Redis();
  const corsOptions = {
    origin: process.env.CORS_URL,
    optionsSuccessStatus: 200,
    credentials: true,
  };

  const uri = process.env.DB_URL;

  const path = require('path');
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');

  const DbClient = new MongoClient(uri);
  const database = DbClient.db('createBoss');
  const usersCollection = database.collection('users');

  const googleCloudStorage = new Storage({
    keyFileName: path.join(__dirname, '../../config/google.json'),
    projectId: process.env.projectId,
  });
  app.use(cors(corsOptions));
  app.use(helmet());
  const secretKey = crypto.randomBytes(32).toString('hex');
  app.use(
    session({ secret: secretKey, resave: true, saveUninitialized: true,secure:true})
  );
  app.use(bodyParser.raw({ type: 'audio/mpeg', limit: '10mb' }));
  app.use(
    express.urlencoded({
      extended: true,
      limit: 5000000,
    })
  );
  app.use(cookieParser());




  app.use(async (req, res, next) => {
    const cacheKey = req.originalUrl;
    const cachedResponse = await redis.get(cacheKey);
    if (cachedResponse) {
      res.send(cachedResponse);
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        redis.set(cacheKey, body);
        res.sendResponse(body);
      };
      next();
    }
  });

  app.use('/api/text-to-speech/get/:filename',compression());
  app.use('/api/text-to-speech/get-voices',compression());
  app.use('/api/speech-to-text/get/:filename',compression());
  app.get('/', cors(corsOptions), (req, res) => {
    res.send('OK');
  });

  app.post('/create-user', createUser(usersCollection));
  app.get('/get-user', getUser(usersCollection));

  app.post('/api/text-to-speech', upload.single('file'), textToSpeech(googleCloudStorage));
  app.get('/api/text-to-speech/get/:filename', downloadFile(googleCloudStorage));
  app.get('/api/text-to-speech/delete/:filename', deleteFile(googleCloudStorage));
  app.get('/api/text-to-speech/get-voices', getVoices());

  app.post('/api/speech-to-text', upload.single('file'), speechToText(googleCloudStorage, false));
  app.get('/api/speech-to-text/get/:filename', downloadFile(googleCloudStorage));
  app.get('/api/speech-to-text/delete/:filename', deleteFile(googleCloudStorage));

  app.post('/api/subtitles-to-video', upload.array('files'), speechToText(googleCloudStorage, true));
  app.get('/api/subtitles-to-video/get/:filename', downloadFile(googleCloudStorage));
  app.get('/api/subtitles-to-video/delete/:filename', deleteFile(googleCloudStorage));

  app.post('/api/subtitles-from-video', upload.single('file'), speechToText(googleCloudStorage, false));
  app.get('/api/subtitles-from-video/get/:filename', downloadFile(googleCloudStorage));
  app.get('/api/subtitles-from-video/delete/:filename', deleteFile(googleCloudStorage));


  app.listen(process.env.PORT || 80, () => {
    console.log('Worker process listening');
  });
}