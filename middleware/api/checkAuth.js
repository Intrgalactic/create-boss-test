const jwt = require('jsonwebtoken');

const checkAuth = (req, res) => {
    const token = req.cookies.jwt;
    console.log(token);
    if (token) {
        // Validate the token
        try {
            const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY);
            // Token is valid
            console.log(decoded)
            res.json({ authenticated: true });
        } catch (error) {
            console.log(error);
            // Token validation failed
            res.json({ authenticated: false });
        }
    } else {
        // No token present
        res.json({ authenticated: false });
    }
}

module.exports = checkAuth;