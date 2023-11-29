const { Deepgram } = require('@deepgram/sdk');
const asyncHandler = require("express-async-handler")
const getCodeForLanguage = require('../utils/formatters/getLanguageCode');

const subtitlesToVideo = () => {
    return asyncHandler(async (req, res) => {
        try {
            
            const video = req.file;
            const language = req.body.language;
            const languageCode = getCodeForLanguage(language);
            const deepgramOptions = {
                tier: "nova",
                punctuate: true,
                dictation: true,
                language: languageCode,
            }
            const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);
            const response = await deepgram.transcription.preRecorded(
                {
                    stream: video.buffer,
                    mimetype: video.mimetype,
                },
                deepgramOptions
            )
            const wordsArr = response.results.channels[0].alternatives[0].words.map(wordObj => { return { word: wordObj.word, punctuatedWord: wordObj.punctuated_word, start: wordObj.start, end: wordObj.end } });
            res.status(200).send(JSON.stringify(wordsArr));
        }
        catch (err) {
            res.sendStatus(500);
        }
    })
}

module.exports = subtitlesToVideo;