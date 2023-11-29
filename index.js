
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const api = require('./routers/api');
const db = require('./routers/db');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const corsOptions = {
  origin: process.env.CORS_URL,
  optionsSuccessStatus: 200,
};

const bodyParser = require('body-parser');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(cors(corsOptions));
app.use(helmet());

app.use(bodyParser.raw({ type: 'audio/mpeg', limit: '10mb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: 5000000,
  })
);

app.use(cookieParser());

app.use('/api',api);
app.use('/db',db);

app.listen(process.env.PORT || 80, () => {
  console.log('Worker process listening');
});
