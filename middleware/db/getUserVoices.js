const asyncHandler = require('express-async-handler');

const getUserVoices = (collection) => {
    return asyncHandler(async(req,res) => {
        const urlParams = new URLSearchParams(req.query);
        const query = Object.fromEntries(urlParams);
        try {
            const userVoices = collection.find({email:query.email});
            const fetchedVoices = [];
            for await (const doc of userVoices) {
                fetchedVoices.push({
                    voiceName: doc.voiceName,
                    voiceId: doc.voiceId,
                    previewUrl: doc.previewUrl
                })
            }
            if (await collection.countDocuments({email:query.email}) === 0) {
                res.status(200).send(JSON.stringify([]));
            }
            else {
                res.status(200).send(JSON.stringify(fetchedVoices));
            }
        }   
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    })
}

module.exports = getUserVoices;