const client = require('elevenlabs-node');
const asyncHandler = require("express-async-handler");

const getVoices = (collection) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    return asyncHandler(async (req, res) => {
        res.setHeader("Cache-Control",'private','max-age=3600');
        try {
            var voicesArr = [];
            const voices = collection.find({email: req.query.email});
            for await (const voice of voices) {
                voicesArr.push({
                    name: voice.voiceName,
                    id: voice.voiceId,
                    previewUrl: voice.previewUrl,
                })
            }
            res.status(200).send(JSON.stringify({ voices: voicesArr }));
        }
        catch (err) {
            res.sendStatus(500);
        }
    })
}

module.exports = getVoices;