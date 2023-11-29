
const express = require('express');
const createUser = require('../middleware/db/createUser');
const { MongoClient } = require('mongodb');
const getUser = require('../middleware/db/getUser');
const deleteUser = require('../middleware/db/deleteUser');
const updateUser = require('../middleware/db/updateUser');
const router = express.Router();

//database
const DbClient = new MongoClient(process.env.DB_URI);
const database = DbClient.db('createBoss');
const usersCollection = database.collection('users');

//routers
router.post('/create-user',createUser(usersCollection));
router.post('/get-user',getUser(usersCollection));
router.post("/delete-user",deleteUser(usersCollection));
router.post("/update-user",updateUser(usersCollection));

module.exports = router;