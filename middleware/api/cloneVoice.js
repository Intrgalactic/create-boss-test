const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const generateRandomFileName = require('../utils/generateFileName');
const sendToStorage = require('./sendToStorage');
const createSpeech = require('../utils/createSpeechSample');
const fetch = require('node-fetch');

const cloneVoice = (cloudStorage,collection) => {
    return asyncHandler(async (req, res) => {
        console.log(req.body);
        const files = req.files;
        const apiKey = process.env.ELEVENLABS_API_KEY;
        const voiceSampleFileName = generateRandomFileName('.mp3');
        const { voiceName, email } = req.body;
        const formData = new FormData();
        formData.append("name", voiceName);
        files.forEach(file => {
            const fileBlob = new Blob([file.buffer], { type: file.mimetype });
            const fileName = file.originalname;
            console.log(fileBlob);
            formData.append('files', fileBlob, fileName);
        }) 
        console.log(files.length);
        await fetch("https://api.elevenlabs.io/v1/voices/add", {
            method: "POST",
            headers: {
                'xi-api-key': `${apiKey}`,
            },
            body: formData
        }).then(async response => {
            console.log(response);
            if (response.status === 200) {
                const data = await response.json();
                try {
                    const voiceSampleBuffer = await createSpeech(data.voice_id);
                    await sendToStorage(voiceSampleFileName,voiceSampleBuffer,"audio/mpeg",cloudStorage,"user-created-voices");
                    const url = await cloudStorage.bucket("createboss").file(`user-created-voices/${voiceSampleFileName}`).getSignedUrl({
                        action:"read",
                        expires: "01-01-2025"
                    })
                    collection.insertOne({ voiceName: voiceName, email: email,voiceId:data.voice_id,previewUrl:url[0] }).then(() => {
                        res.status(200).send("Voice Cloned")
                    });
                }
                catch (err) {
                
                    res.sendStatus(500);
                }
            }
            else {
                res.sendStatus(response.status);
            }
        }).catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    })
}

module.exports = cloneVoice;