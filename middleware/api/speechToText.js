const asyncHandler = require("express-async-handler")
const speech = require('@google-cloud/speech')
const setContentType = require('../utils/setContentType');
const sendToStorage = require('./sendToStorage');
const getAudioDuration = require("../utils/getAudioDuration");

const speechToText = (storage) => {
  return asyncHandler(async (req, res) => {
    const client = new speech.SpeechClient();
    var sampleRateHertz = 16000;
    var encoding = "";
    (req.file.mimetype === "video/ogg" || req.file.mimetype === "audio/ogg") ? encoding = "OGG_OPUS" : req.file.mimetype === "audio/mpeg" ? (encoding = "MP3", sampleRateHertz = 44100) : req.file.mimetype === "audio/wav" ? (encoding = "LINEAR16", sampleRateHertz = 24000) : encoding = "LINEAR16";
    const languageCode = req.body.code;

    const outputFileName = req.file.originalname;
    const contentType = setContentType(req.body.audioEncoding);
    const duration = await getAudioDuration(req.file.mimetype, req.file.buffer);

    const config = {
      languageCode: languageCode,
      enableAutomaticPunctuation: true,
      enableWordTimeOffsets: true,
      sampleRateHertz: sampleRateHertz,
      encoding: encoding
    };
    const audio = {
      content: req.file.buffer.toString('base64'),
    };

    const request = {
      config: config,
      audio: audio,
    };
    if (duration >= 60) {
      const [operation] = await client.longRunningRecognize(request);
      var [response] = await operation.promise();
    }
    else {
      var [response] = await client.recognize(request);
    }
    var wordsTimestampsArr = [];
    response.results.forEach(result => {
      result.alternatives[0].words.forEach(wordInfo => {
        const startSecs =
          `${wordInfo.startTime.seconds}` +
          '.' +
          wordInfo.startTime.nanos / 100000000;
        const endSecs =
          `${wordInfo.endTime.seconds}` +
          '.' +
          wordInfo.endTime.nanos / 100000000;
        wordsTimestampsArr.push(`[${startSecs} - ${endSecs}] ${wordInfo.word}`);
      });
    });

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    const finalTranscription = transcription + '\n \n' + wordsTimestampsArr.join('\n');

    await sendToStorage(`${outputFileName.substring(0, outputFileName.indexOf('.'))}.${req.body.audioEncoding.toLowerCase()}`, finalTranscription, contentType, storage);

    res.status(200).send("Converting Completed");
  })
}

module.exports = speechToText;