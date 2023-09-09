
const asyncHandler = require("express-async-handler");
const voice = require('elevenlabs-node');
const sendToStorage = require('./sendToStorage');
const generateRandomFileName = require('../utils/generateFileName');
const { AudioContext } = require('node-web-audio-api');
const fileTypes = [
    'application/pdf',
    'application/rtf',
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.oasis.opendocument.text', // ODT
    'text/plain',
];

const parseFile = require('../utils/fileParser');
const getVoices = require('./getVoices');

const textToSpeech = (storage) => {
    return asyncHandler(async (req, res) => {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        var textInput;
        var outputFileName = generateRandomFileName(`.mp3`);
        try {
            if (req.file) {
                outputFileName = encodeURIComponent(req.file.originalname);
                textInput = await getTextToSynthetize(req.file, req)
                console.log(textInput);
            }
            else {
                textInput = req.body.text;
            }

            await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${req.body.voiceId}/stream`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'xi-api-key': `${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: textInput,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5
                    }
                })
            }).then(response => response.arrayBuffer()).then(async arrayBuffer => {
                const buffer = Buffer.from(arrayBuffer);
                await sendToStorage(outputFileName, buffer, "audio/mpeg", storage)
                res.status(200).send(JSON.stringify({ fileName: outputFileName.substring(0, outputFileName.lastIndexOf('.')) }));
            })


        }
        catch (err) {
            console.log(err);
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


module.exports = textToSpeech;