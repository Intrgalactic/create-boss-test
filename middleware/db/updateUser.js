const asyncHandler = require('express-async-handler');

const updateUser = (collection) => {
    return asyncHandler(async (req, res) => {
        if ((req.body.username !== "undefined" || req.body.newEmail !== "undefined") && req.body.email !== "undefined") {
            const { username, newEmail, email,emailChanged } = req.body;
            const filter = { email: email };
            const options = { upsert: false };
            if (username) {
                var updateDoc = {
                    $set: {
                        userName: username
                    }
                }
            }
            else {
                var updateDoc = {
                    $set: {
                        email: newEmail,
                        emailChanged: emailChanged
                    }
                }
            }
            console.log(updateDoc,email);
            try {
                await collection.updateOne(filter, updateDoc, options);
                res.status(204).send("Username Updated");
            }
            catch {
                res.sendStatus(500);
            }
        }
        else {
            res.sendStatus(400);
        }
    })
}

module.exports = updateUser;