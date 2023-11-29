const resetUserPassword = (firebase) => {
    return ((req, res) => {
        const email = req.body.email;
        const code = req.body.code;
        const newPassword = req.body.newPassword;
        const db = firebase.firestore();
        console.log(newPassword);
        db.collection("passwordResetCodes").doc(email).get()
            .then((doc) => {
                if (doc.exists && doc.data().code === code) {
                    return firebase.auth().getUserByEmail(email);
                } else {
                    throw new Error('Invalid code or document does not exist.');
                }
            })
            .then((user) => {
                return firebase.auth().updateUser(user.uid, { password: newPassword });
            })
            .then(() => {
                res.sendStatus(200);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send(error.message);
            });
    });
}

module.exports = resetUserPassword;