
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
const parseFile = require('../utils/fileParser');

const textToSpeech = (storage) => {
    return asyncHandler(async (req, res) => {
        var textToSynthetize;
        var contentType;
        var outputFileName = "output.mp3";
        var voiceVariants = [];
        textToSynthetize = await getTextToSynthetize(req.file,req);
        const textToSpeech = require('@google-cloud/text-to-speech');
        console.log(req.body);
        const gender = req.body.gender.toUpperCase();
        const pitch = parseInt(req.body.pitch);
        const environment = formatEncoding(req.body.effectsProfileId);
        
        const client = new textToSpeech.TextToSpeechClient();
        const voices = await listVoices(client, req.body.gender.toUpperCase(), req.body.code);
        const modifiedVoices = voices.filter(voice => voice.name.includes("Polyglot")).length >= 1 ? voices.filter(voice => voice.name.includes("Polyglot")) : voices.filter(voice => voice.name.includes('Neural2')).length >= 1 ? voices.filter(voice => voice.name.includes('Neural2')) : voices.filter(voice => voice.name.includes('Wavenet')).length >= 1 ? voices.filter(voice => voice.name.includes('Wavenet')) : voices.filter(voice => voice.name.includes("Standard"));

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
        contentType = await setContentType(req.body.audioEncoding);

        await sendToStorage(`${outputFileName.substring(0, outputFileName.indexOf('.'))}.${req.body.audioEncoding.toLowerCase()}`, response.audioContent, contentType, storage);
        
        res.status(200).send("Synthesizing Completed");
    });
}

function setContentType(audioEncoding) {
    switch (audioEncoding) {
        case "MP3": return "audio/mpeg";
            break;
        case "OGG": return "audio/ogg";
            break;
        case "WAV": return "audio/wav";
            break;
        default:
            return "audio/mpeg";
    }
}

async function getTextToSynthetize(file,req) {
    var textToSynthetize = "";
    if (file) {
        const fileBuffer = file.buffer;
        outputFileName = file.originalname;
        for (const i in fileTypes) {
            if (fileTypes[i] === file.fileType) {
                textToSynthetize = await parseFile(fileBuffer, file.fileType);
                break;
            }
        }
    }
    else {
        textToSynthetize = req.body.text;
    }
    return textToSynthetize
}
module.exports = textToSpeech;