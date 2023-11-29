const asyncHandler = require('express-async-handler');
const { URL } = require('url');

const removeUserVoice = (collection, storage) => {
    return asyncHandler(async (req, res) => {
        try {
            const voiceId = req.query.voiceId;
            await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
                headers: {
                    "xi-api-key": process.env.ELEVENLABS_API_KEY
                },
                method: "DELETE"
            }).then(async (response) => {
                if (response.status === 200) {
                    const voiceObj = await collection.findOne({ voiceId: voiceId });
                    const voiceUrl = new URL(voiceObj.previewUrl);
                    const voiceSamplePath = voiceUrl.pathname.slice(12);
                    const fileToRemove = storage.bucket("createboss").file(voiceSamplePath);
                    fileToRemove.delete().then(async () => {
                        const voiceToDelete = await collection.deleteOne({ voiceId: voiceId });
                        if (voiceToDelete.deletedCount === 1) {
                            res.sendStatus(200);
                        }
                        else {
                            res.sendStatus(400);
                        }
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        }
        catch (err) {
            console.log(err);
            res.sendStatus(404)
        }
    })
}

module.exports = removeUserVoice;