const asyncHandler = require('express-async-handler');

const deleteUser = (collection) => {
    return asyncHandler(async (req,res) => {
        const urlParams = new URLSearchParams(req.query);
        const query = Object.fromEntries(urlParams);
        if (query.email !== undefined) {
            try {
                collection.deleteOne({email: query.email}).then(() => {
                    res.status(200).send("Account Removed");
                })
            }
            catch(err) {
                res.status(500).send(err);
            }
        }
        else {
            res.sendStatus(400)
        }
    })
}

module.exports = deleteUser;