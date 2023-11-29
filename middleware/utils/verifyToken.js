
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    console.log(token);
    return jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY, (err, user) => {
        if (err) return false;
        else return user;
    })
}

module.exports = verifyToken;