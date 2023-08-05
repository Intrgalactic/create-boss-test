const asyncHandler = require("express-async-handler")
const speech = require('@google-cloud/speech')
const setContentType = require('../utils/setContentType');
const sendToStorage = require('./sendToStorage');

const speechToText = (storage) => {
    return asyncHandler(async (req, res) => {
        const client = new speech.SpeechClient();
        const encoding = 'WEBM_OPUS';
        const sampleRateHertz = 16000;
        const languageCode = req.body.code;
        const outputFileName = req.file.originalname;
        const contentType = setContentType(req.body.audioEncoding);    
        const config = {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
        };
        const audio = {
            content: req.file.buffer.toString('base64'),
        };

        const request = {
            config: config,
            audio: audio,
        };
       
        const [response] = await client.recognize(request);
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
        await sendToStorage(`${outputFileName.substring(0, outputFileName.indexOf('.'))}.${req.body.audioEncoding.toLowerCase()}`, transcription, contentType, storage);
        
    })
}

module.exports = speechToText;