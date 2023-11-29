const crypto = require('crypto');
const sendTemplateEmail = require('../email/sendEmail');

const requestUserPasswordReset = (firebase) => {
    return ((req, res) => {
        try {
            const email = req.body.email;
            firebase.auth().getUserByEmail(email).then(() => {
                const db = firebase.firestore();
                const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase();
                const resetCodeDoc = {
                    code: resetCode,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Timestamp from the Firebase server
                    validUntil: firebase.firestore.Timestamp.now().toMillis() + (60 * 60 * 1000), // 1 hour from now
                };
                db.collection('passwordResetCodes').doc(email).set(resetCodeDoc);
                sendTemplateEmail("Password Reset", req.body.email, [{ name: "FNAME", content: "Mateusz" }, { name: "USEREMAIL", content: req.body.email }, { name: "CODE", content: resetCode }])
                res.sendStatus(200);
            }).catch(() => {
                res.sendStatus(403);
            })
        }
        catch (err) {
            res.sendStatus(500);
        }
    })
}

module.exports = requestUserPasswordReset;