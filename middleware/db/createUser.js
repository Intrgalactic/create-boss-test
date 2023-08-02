const asyncHandler = require('express-async-handler');

const createUser = (collection) => {
    return asyncHandler(async(req,res) => {
        if (req.body.name !== 'undefined' && req.body.userName !== 'undefined' && req.body.email !== 'undefined' && req.body.isPaying !== 'undefined' && req.body.isNew !== 'undefined') {
            const query = req.body;
            try {
                collection.insertOne(query).then(() => {
                    res.status(201).send("Account Created");
                })
            }
            catch(err) {
                res.status(500).send(err);
            }
        }
        else {
            res.sendStatus(400);
        }
    })
}

module.exports = createUser;