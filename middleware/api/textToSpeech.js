
const asyncHandler = require("express-async-handler");
const listVoices = require('./listVoices');
const languageDetect = require('languagedetect');
const lngDetector = new languageDetect();
const fs = require('fs');
const formatEncoding = require('../utils/formatters/formatEncoding');
const sendToStorage = require('./sendToStorage');
const textToSpeech = (storage) => {
    return asyncHandler(async (req, res) => {
        var textToSynthetize;
        var contentType;
        var outputFileName = "output.mp3";
        console.log(req.body);
        if (req.file) {
           textToSynthetize = req.file.buffer.toString("utf-8");
           outputFileName = req.file.originalname;
        }
        else {
            textToSynthetize = req.body.text;
        }
        const textToSpeech = require('@google-cloud/text-to-speech');
        const gender = req.body.gender.toUpperCase();
        const pitch = parseInt(req.body.pitch);
        const util = require('util');
        const environment = formatEncoding(req.body.effectsProfileId);
        const client = new textToSpeech.TextToSpeechClient();
        const voices = await listVoices(client, req.body.gender.toUpperCase(), req.body.code);
        const modifiedVoices = voices.filter(voice => voice.name.includes("Polyglot")).length >= 1 ? voices.filter(voice => voice.name.includes("Polyglot")) : voices.filter(voice => voice.name.includes('Neural2')).length >= 1 ? voices.filter(voice => voice.name.includes('Neural2')) : voices.filter(voice => voice.name.includes('Wavenet')).length >= 1 ? voices.filter(voice => voice.name.includes('Wavenet')) : voices.filter(voice => voice.name.includes("Standard"));
        var voiceVariants = [];
        const voiceTechnologyType = modifiedVoices[0].name.split("-")[2];
        for (const x of modifiedVoices) {
            for (const [key, value] of Object.entries(x)) {
                if (key === "name") {
                    voiceVariants.push(value.split("-")[3]);
                }
            }
        }
        const request = {
            input: { text: textToSynthetize },
            voice: { languageCode: req.body.code, ssmlGender: gender, name: `${req.body.code}-${voiceTechnologyType}-${voiceVariants[Math.floor(Math.random() * (voiceVariants.length - 1))]}` },
            audioConfig: { audioEncoding: "MP3", pitch: pitch, effectsProfileId: [environment] },
        };

        const [response] = await client.synthesizeSpeech(request);
        switch(req.body.audioEncoding) {
            case "MP3" : contentType = "audio/mpeg";
                break;
            case "OGG" : contentType = "audio/ogg";
                break;
            case "WAV" : contentType = "audio/wav";
                break;
            default :
                contentType = "audio/mpeg";
        }
        
        await sendToStorage(`${outputFileName.substring(0,outputFileName.indexOf('.'))}.${req.body.audioEncoding.toLowerCase()}`,response.audioContent,contentType,storage);
        res.status(200).send("Synthesizing Completed");
        console.log('Audio content written to file: output.mp3');
    });
}

module.exports = textToSpeech;