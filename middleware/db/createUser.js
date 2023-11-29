const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const createUser = (collection) => {
    return asyncHandler(async (req, res) => {
        if (req.body.name !== 'undefined' && req.body.userName !== 'undefined' && req.body.email !== 'undefined' && req.body.isPaying !== 'undefined' && req.body.isNew !== 'undefined') {
            const query = req.body;
            try {
                collection.insertOne(query).then(() => {
                    const secretKey = process.env.JSON_WEB_TOKEN_SECRET_KEY;
                    const token = jwt.sign({ email: req.body.email }, secretKey, { expiresIn: req.body.web ? "24h" : "7d" });
                    console.log(token);
                    if (req.body.web) {
                        res.cookie("jwt", token, {
                            httpOnly: false, // Recommended for security reasons to prevent XSS attacks
                            maxAge: 24 * 60 * 60 * 1000,
                            secure: false // Set to true if you are using HTTPS, even on localhost
                        });
                        res.sendStatus(201);
                    }
                    else {
                        res.status(201).send(JSON.stringify(token));
                    }
                })
            }
            catch (err) {
                console.log(err);
                res.status(500).send(err);
            }
        }
        else {
            res.sendStatus(400);
        }
    })
}

module.exports = createUser;