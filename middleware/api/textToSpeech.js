
const asyncHandler = require("express-async-handler");
const listVoices = require('./listVoices');
const formatEncoding = require('../utils/formatters/formatEncoding');
const sendToStorage = require('./sendToStorage');
const fileTypes = [
    'application/pdf',
    'application/rtf',
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.oasis.opendocument.text', // ODT
    'text/plain',
];
const setContentType = require('../utils/setContentType');
const parseFile = require('../utils/fileParser');
const spellCheck = require('../utils/spellCheck');

const textToSpeech = (storage) => {
    return asyncHandler(async (req, res) => {
        var textToSynthetize;
        var contentType;
        var outputFileName = "output.mp3";
        try {
            if (req.file) {
                outputFileName = req.file.originalname;
                textToSynthetize = await getTextToSynthetize(req.file, req)
            }
            else {
                textToSynthetize = req.body.text;
            }

            const textToSpeech = require('@google-cloud/text-to-speech');
            const gender = req.body.gender.toUpperCase();
            const pitch = parseInt(req.body.pitch);
            const environment = formatEncoding(req.body.effectsProfileId)
            const client = new textToSpeech.TextToSpeechClient();
            const voices = await listVoices(client, req.body.gender.toUpperCase(), req.body.code)
            const [voiceVariants, voiceTechnologyType] = await selectBestVoice(voices)
            if (req.file) {
                var audioEncoding = req.file.mimetype === "audio/mpeg" ? "MP3" : req.file.mimetype === "audio/ogg" ? "OGG_OPUS" : "MULAW";
            }
            else {
                var audioEncoding = "MP3";
            }
            const speakingRate = parseFloat(req.body.speakingRate);

            const request = {
                input: { text: textToSynthetize },
                voice: { languageCode: req.body.code, ssmlGender: gender, name: `${req.body.code}-${voiceTechnologyType}-${voiceVariants[Math.floor(Math.random() * (voiceVariants.length - 1))]}` },
                audioConfig: { audioEncoding: audioEncoding, pitch: pitch, effectsProfileId: [environment],speakingRate:speakingRate },
            };

            const [response] = await client.synthesizeSpeech(request);
            
            contentType = await setContentType(req.body.audioEncoding)
            await sendToStorage(`${outputFileName.substring(0, outputFileName.indexOf('.'))}.${req.body.audioEncoding.toLowerCase()}`, response.audioContent, contentType, storage)

            res.status(200).send("Synthesizing Completed");
        }
        catch (err) {
            res.status(400).send(err.message);
        }
    });
}


async function getTextToSynthetize(file, req) {
    var textToSynthetize = "";
    if (file) {
        const fileBuffer = file.buffer;
        outputFileName = file.originalname;
        for (const i in fileTypes) {
            if (fileTypes[i] === file.mimetype) {
                textToSynthetize = await parseFile(fileBuffer, file.mimetype).catch(err => {
                    throw err;
                });
                break;
            }
        }
    }
    else {
        outputFileName = req.body.text;
    }
    return textToSynthetize
}

function selectBestVoice(voices) {
    const modifiedVoices = voices.filter(voice => voice.name.includes("Polyglot")).length >= 1 ? voices.filter(voice => voice.name.includes("Polyglot")) : voices.filter(voice => voice.name.includes('Neural2')).length >= 1 ? voices.filter(voice => voice.name.includes('Neural2')) : voices.filter(voice => voice.name.includes('Wavenet')).length >= 1 ? voices.filter(voice => voice.name.includes('Wavenet')) : voices.filter(voice => voice.name.includes("Standard"));
    const voiceTechnologyType = modifiedVoices[0].name.split("-")[2];
    var voiceVariants = [];
    for (const x of modifiedVoices) {
        for (const [key, value] of Object.entries(x)) {
            if (key === "name") {
                voiceVariants.push(value.split("-")[3]);
            }
        }
    }
    return [voiceVariants, voiceTechnologyType];
}
module.exports = textToSpeech;