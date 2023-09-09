const client = require('elevenlabs-node');
const asyncHandler = require("express-async-handler");

const getVoices = () => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    return asyncHandler(async (req, res) => {
        console.log(apiKey);
        try {
            var voicesArr = [];
            const voices = await client.getVoices(apiKey);
            for (voice of voices.voices) {
                voicesArr.push({
                    id: voice.voice_id,
                    name:voice.name,
                    accent: voice.labels.accent,
                    description: voice.description != null ? voice.description : voice.labels.description,
                    age: voice.labels.age,
                    gender: voice.labels.gender,
                    useCase: voice.labels['use case'],
                    audio: voice.preview_url
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