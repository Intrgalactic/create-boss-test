
const asyncHandler = require('express-async-handler');
const getCodeForLanguage = require('../utils/formatters/getLanguageCode');
const convertToBoolean = require('../utils/convertToBoolean');
const { Deepgram } = require('@deepgram/sdk');
const verifyToken = require('../utils/verifyToken');
const sendToStorage = require('./sendToStorage');
const setContentType = require('../utils/setContentType');
const generateRandomFileName = require('../utils/generateFileName');

const newSpeechToText = (storage) => {
    return asyncHandler(async (req, res) => {
        const token = req.cookies.jwt || req.headers.authorization.split(" ")[1];
        const tokenUser = verifyToken(token);
        if (tokenUser.exp > Date.now() / 1000) {
            try {
                console.log(req.body);
                const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);
                const language = getCodeForLanguage(req.body.languageCode);
                const topicsOn = convertToBoolean(req.body.topicsOn);
                const summarizeOn = convertToBoolean(req.body.summarizeOn);
                const diarizeOn = convertToBoolean(req.body.diarizeOn);
                const subtitlesOn = convertToBoolean(req.body.subtitlesOn);
                const outputExtension = req.body.audioEncoding;
                const contentType = setContentType(req.body.audioEncoding.toUpperCase());
                const outputFileName = generateRandomFileName(`.${outputExtension.toLowerCase()}`);
                const tier = language.includes('es') || language.includes('en') ? "nova" : "enhanced";
                const subtitles = [];
                const topics = [];
                const file = req.file;
                const mimetype = file.mimetype;
                var fullSpeechToTextContent = ``;
                const options = {
                    tier: tier,
                    model: "general",
                    paragraphs: true,
                    smart_format: convertToBoolean(req.body.punctuationOn),
                    punctuate: convertToBoolean(req.body.punctuationOn),
                    detect_topics: topicsOn,
                    utterances: true,
                    diarize: convertToBoolean(req.body.diarizeOn),
                    summarize: summarizeOn === true ? "v2" : false,
                    language: language
                }

                const response = await deepgram.transcription.preRecorded(
                    {
                        stream: file.buffer,
                        mimetype: mimetype,
                    },
                    options
                )
                const fullTranscription = response.results.channels[0].alternatives[0].transcript;
                if (summarizeOn) {
                    var summary = response.results.summary;
                }
                if (topicsOn) {
                    addTopics(response, topics);
                }

                if (diarizeOn) {
                    var diarization = [];
                    var copiedDiarization = [];
                    addDiarization(response, diarization);
                    for (let i = 0; i < diarization.length; i++) {
                        var sentences = "";
                        for (let j = 0; j < diarization[i].speakerSentences.length; j++) {
                            sentences += `${diarization[i].speakerSentences[j]}\n`;
                        }
                        if (diarization[i - 1]) {
                            copiedDiarization.push(sentences);
                        }
                        else {
                            copiedDiarization.push([[`${diarization[i].speaker}:\n${sentences}`]])
                        }
                    }
                }
                if (subtitlesOn) {
                    var splittedTimestampsArr = [];
                    for (let utterance of response.results.utterances) {
                        subtitles.push(`[${parseFloat(utterance.start).toFixed(2)}] - [${parseFloat(utterance.end).toFixed(2)}] ${utterance.transcript}`);
                        splittedTimestampsArr.push({
                            timestamp: `${parseFloat(utterance.start).toFixed(2)} - ${parseFloat(utterance.end).toFixed(2)}`,
                            transcript: utterance.transcript
                        })
                    }
                }

                diarizeOn ? copiedDiarization = copiedDiarization.join('\n') : null;
                fullSpeechToTextContent = `Transcription:\n\n${fullTranscription}\n`
                diarizeOn ? fullSpeechToTextContent = `Transcription With Speakers:\n\n${copiedDiarization}\n` : null;
                summarizeOn && summary ? fullSpeechToTextContent += `\nSummary:\n\n${summary.short}\n` : null;
                subtitlesOn ? fullSpeechToTextContent += `\nTimestamps:\n\n${subtitles.join('\n')}\n` : null;
                topicsOn ? fullSpeechToTextContent += `\nTopics:\n\n${topics}\n` : null;

                await sendToStorage(`${outputFileName}`, fullSpeechToTextContent, contentType, storage);
                res.status(200).send(JSON.stringify({
                    fileName: outputFileName.substring(0, outputFileName.lastIndexOf('.')),
                    data: {transcription: fullTranscription, topics: topics || false, diarization: copiedDiarization || false, summary: summarizeOn ? summary.short : false, timestamps: splittedTimestampsArr}
                }));
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err.message);
            }
        }
        else {
            res.sendStatus(403);
        }
    })
}

function addDiarization(response, diarization) {
    const paragraphs = response.results.channels[0].alternatives[0].paragraphs;
    const speakersParagraphs = paragraphs ? paragraphs.paragraphs : false;
    if (!speakersParagraphs) {
        return false;
    }
    for (let i = 0; i < speakersParagraphs.length; i++) {
        const sentences = speakersParagraphs[i].sentences;
        var speakerSentences = [];
        for (let j = 0; j < sentences.length; j++) {
            speakerSentences.push(sentences[j].text);
        }
        var speakerObj = {
            speaker: `Speaker ${parseInt(speakersParagraphs[i].speaker) + 1}`,
            speakerSentences: speakerSentences
        }
        diarization.push(speakerObj);
    }
}

function addTopics(response, topics) {
    for (let i = 0; i < response.results.channels[0].alternatives[0].topics[0].topics.length; i++) {
        if (response.results.channels[0].alternatives[0].topics[0].topics[i].confidence > 0.65) {
            topics.push(response.results.channels[0].alternatives[0].topics[0].topics[i].topic);
        }
    }
}

module.exports = newSpeechToText;