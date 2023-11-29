const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const getUser = (collection) => {
    return asyncHandler(async (req, res) => {
        if (req.body.email !== undefined) {
            try {
                const user = await collection.findOne({ email: req.body.email });
                if (user === null) {
                    res.status(404).send("Account Not Found");
                }
                else {
                    var token = false;
                    const secretKey = process.env.JSON_WEB_TOKEN_SECRET_KEY;
                    if (req.body.getToken === "true") {
                        token = jwt.sign({ email: req.body.email }, secretKey, { expiresIn: req.body.web ? "24h" : "7d" });
                    }
                    if (req.body.web) {
                        if (req.body.getToken) {
                            res.cookie("jwt", token, {
                                httpOnly: true,
                                secure: true,
                                sameSite: "strict"
                            })
                        }
                        res.status(200).send({
                            email: user.email,
                            name: user.name,
                            lastName: user.lastName,
                            userName: user.userName,
                            isPaying: user.isPaying,
                            emailChanged: user.emailChanged,
                        })
                    }
                    else {
                        res.status(200).send({
                            email: user.email,
                            name: user.name,
                            lastName: user.lastName,
                            userName: user.userName,
                            isPaying: user.isPaying,
                            emailChanged: user.emailChanged,
                            token: token
                        })
                    }
                }
            }
            catch (err) {
                console.log(err);
                res.sendStatus(400);
            }
        }
    })
}

module.exports = getUser;