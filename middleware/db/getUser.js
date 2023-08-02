const asyncHandler = require('express-async-handler');

const getUser = (collection) => {
    return asyncHandler(async (req, res) => {
        const urlParams = new URLSearchParams(req.query);
        const query = Object.fromEntries(urlParams);
        if (query.email !== undefined) {
            try {
                const user = await collection.findOne(query);
                console.log(user);
                if (user === null) {
                    res.status(400).send("Account Not Found");
                }
                else {
                    res.status(200).send({
                        email: user.email,
                        name: user.name,
                        lastName: user.lastName,
                        userName: user.userName,
                        isPaying: user.isPaying
                    })
                }
            }
            catch(err) {
                res.sendStatus(400);
            }
        }
    })
}

module.exports = getUser;