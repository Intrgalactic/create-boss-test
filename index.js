const express = require('express');
const app = express();
const createUser = require('./middleware/createUser');
const getUser = require('./middleware/getUser');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const corsOptions = {
    origin: process.env.CORS_URL,
    optionsSuccessStatus: 200
}


const uri = process.env.DB_URL;

const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);
const database = client.db("createBoss");
const usersCollection = database.collection("users");

app.use(express.urlencoded({extended:true}));

app.get('/',cors(corsOptions),(req,res) => {
    res.send("OK");
})
app.post('/create-user',cors(corsOptions),createUser(usersCollection));

app.get('/get-user',cors(corsOptions),getUser(usersCollection));

app.listen(process.env.PORT || 3000, () => {
    console.log('app listening');
})



