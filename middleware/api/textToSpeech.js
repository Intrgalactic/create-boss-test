
const asyncHandler = require("express-async-handler");
const listVoices = require('./listVoices');
const formatEncoding = require('../utils/formatters/formatEncoding');
const sendToStorage = require('./sendToStorage');
const generateRandomFileName = require('../utils/generateFileName');
const googleEnv = require("../../config/google.json");

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

const textToSpeech = (storage) => {
    return asyncHandler(async (req, res) => {
        var textToSynthetize;
        var contentType;
        var outputFileName = generateRandomFileName(`.${req.body.audioEncoding.toLowerCase()}`);
        var outputFileNameWithoutExt = outputFileName.substring(0, outputFileName.lastIndexOf("."));
        var sampleRateHertz = 16000;
        var audioEncoding;
        try {
            if (req.file) {
                outputFileName = encodeURIComponent(req.file.originalname);
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
            req.body.audioEncoding === "WAV" ? (audioEncoding = "LINEAR16", sampleRateHertz = 24000) : req.body.audioEncoding === "OGG" ? audioEncoding = "OGG_OPUS" : (audioEncoding = "MP3", sampleRateHertz = 44100);
            const speakingRate = parseFloat(req.body.speakingRate);
            const request = {
                input: { text: textToSynthetize },
                voice: { languageCode: req.body.code, ssmlGender: gender, name: `${req.body.code}-${voiceTechnologyType}-${voiceVariants[Math.floor(Math.random() * (voiceVariants.length - 1))]}` },
                audioConfig: { audioEncoding: audioEncoding, pitch: pitch, effectsProfileId: [environment], speakingRate: speakingRate, sampleRateHertz: sampleRateHertz },
            };
            if (req.file) {
                if (req.file.size < 5000) {
                    synthesizeAndSend();
                }
                else {
                    if (req.body.code === "en-US" || req.body.code === "es-US") {
                        const longClient = new textToSpeech.TextToSpeechLongAudioSynthesizeClient();
                        console.log(`gs://create-boss/${outputFileName}`)
                        const request = await longClient.synthesizeLongAudio({
                            parent: `projects/${googleEnv.project_id}/locations/global`,
                            audioConfig: { audioEncoding: audioEncoding },
                            input: { text: textToSynthetize },
                            voice: { language_code: req.body.code, name: `${req.body.code}-${voiceTechnologyType}-${voiceVariants[Math.floor(Math.random() * (voiceVariants.length - 1))]}` },
                            output_gcs_uri: `gs://create-boss/example.pdf`
                        })

                    }
                    else {
                        res.status(503).send("Files bigger than 5 Kb must be only in US English or US Spanish");
                    }
                }
            }
            else {
                synthesizeAndSend();
            }
            async function synthesizeAndSend() {
                const [response] = await client.synthesizeSpeech(request);
                contentType = await setContentType(req.body.audioEncoding)
                const outputExtension = req.body.audioEncoding.toLowerCase() === "ogg" ? "opus" : req.body.audioEncoding.toLowerCase()
                await sendToStorage(`${outputFileNameWithoutExt}.${outputExtension}`, response.audioContent, contentType, storage)
                res.status(200).send(JSON.stringify({ fileName: outputFileNameWithoutExt }));
            }
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