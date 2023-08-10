const asyncHandler = require("express-async-handler")
const speech = require('@google-cloud/speech')
const setContentType = require('../utils/setContentType');
const sendToStorage = require('./sendToStorage');
const getAudioDuration = require("../utils/getAudioDuration");
const { Deepgram } = require('@deepgram/sdk');

const speechToText = (storage, needFile) => {
  return asyncHandler(async (req, res) => {
    try {
      var topics = [];
      var summary;
      var fullSpeechToTextContent;
      var contentType;
      var diarizeOn;
      var topicsOn;
      console.log(req.file);
      const outputFileName = req.file.originalname;
      contentType = req.body.audioEncoding ? setContentType(req.body.audioEncoding) : null;
      const deepgram = new Deepgram(process.env.DEEPGRAM_KEY);
      const tier = req.body.code ? (req.body.code.includes('es') || req.body.code.includes('en')) ? "nova" : "enhanced" : "enhanced";
      diarizeOn = req.body.diarizeOn ? convertToBoolean(req.body.diarizeOn) : false;
      topicsOn = req.body.topicsOn ? convertToBoolean(req.body.topicsOn) : false;
      const punctuationOn = req.body.punctuationOn ? convertToBoolean(req.body.punctuationOn) : true;
      const subtitlesOn = convertToBoolean(req.body.subtitlesOn);
      const summarizeOn = req.body.summarizeOn ? req.body.summarizeOn === "No" ? false : 'v2' : false;
      const options = {
        tier: tier,
        model: "general",
        paragraphs: true,
        smart_format: punctuationOn,
        punctuate: punctuationOn,
        detect_topics: topicsOn,
        utterances: true,
        diarize: diarizeOn,
        summarize: summarizeOn,
        language: "en"
      }

      const response = await deepgram.transcription.preRecorded(
        {
          stream: req.file.buffer,
          mimetype: req.file.mimetype,
        },
        options
      )

      const fullTranscription = needFile ? response.results.channels[0].alternatives[0].transcript : null;

      if (summarizeOn) {
        summary = response.results.summary;
      }
      if (topicsOn) {
        addTopics(response, topics);
      }
      if (subtitlesOn) {
        var subtitles = [];
        addSubtitles(response, subtitles);
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
          copiedDiarization.push([[`${diarization[i].speaker}:\n${sentences}`]])
        }
      }
      diarizeOn ? copiedDiarization = copiedDiarization.join('\n') : null;
      !diarizeOn ? fullSpeechToTextContent = `Transcription:\n\n${fullTranscription}\n` : fullSpeechToTextContent = `Transcription:\n\n${copiedDiarization}\n`
      summarizeOn ? fullSpeechToTextContent += `\nSummary:\n\n${summary.short}\n` : null;
      subtitlesOn ? fullSpeechToTextContent += `\nSubtitles:\n\n${subtitles.join('\n')}\n` : null;
      topicsOn ? fullSpeechToTextContent += `\nTopics:\n\n${topics}\n` : null;
      if (needFile) {
        await sendToStorage(`${outputFileName.substring(0, outputFileName.indexOf('.'))}.${req.body.audioEncoding.toLowerCase()}`, fullSpeechToTextContent, contentType, storage);
        res.status(200).send("Converting Completed");
      }
      else {
        console.log(subtitles);
        res.status(200).send(JSON.stringify({subtitles: subtitles.join('\n')}));
      }
    }

    catch (err) {
      console.log(err);
    }
  })
}

function addTopics(response, topics) {
  console.log(response.results.channels[0].alternatives[0]);
  for (let i = 0; i < response.results.channels[0].alternatives[0].topics.length; i++) {

    if (typeof (response.results.channels[0].alternatives[0].topics[i].topics[0]) === "object") {
      topics.push(response.results.channels[0].alternatives[0].topics[i].topics[0].topic);
    }
  }
}

function addDiarization(response, diarization) {
  const speakersParagraphs = response.results.channels[0].alternatives[0].paragraphs.paragraphs;
  for (let i = 0; i < speakersParagraphs.length; i++) {
    const sentences = speakersParagraphs[i].sentences;
    var speakerSentences = [];
    for (let j = 0; j < sentences.length; j++) {
      speakerSentences.push(sentences[j].text);
    }
    var speakerObj = {
      speaker: `Speaker ${speakersParagraphs[i].speaker}`,
      speakerSentences: speakerSentences
    }
    diarization.push(speakerObj);
  }
}

function convertToBoolean(variable) {
  if (variable === "No") {
    return false;
  }
  else {
    return true;
  }
}

function addSubtitles(response, subtitles) {
  for (let utterance of response.results.utterances) {
    if (utterance.start + 6 < utterance.end) {
      const transcriptionInArr = utterance.transcript.split(' ');
      const transcriptArrInParts = splitToNChunks(transcriptionInArr, 6);
      const transcriptLen = utterance.transcript.split(' ').length;
      const speakingTime = (utterance.end - utterance.start) / 6;
      var startTimeStamp = utterance.start
      var endTimeStamp = utterance.start + speakingTime;
      var transcriptPart = "";
      for (let j = 0; j < 6; j++) {
        for (let i = 0; i < transcriptLen / 6; i++) {
          transcriptPart += transcriptArrInParts[j][i] !== undefined ? (transcriptArrInParts[j][i] + " ") : '';
        }
        subtitles.push(`[${startTimeStamp.toFixed(2)} - ${endTimeStamp.toFixed(2)}]\n${transcriptPart}\n`);
        startTimeStamp += speakingTime;
        endTimeStamp += speakingTime;
        transcriptPart = "";
      }
    }
    else {
      subtitles.push(`[${utterance.start} - ${utterance.end}] ${utterance.transcript}\n`);
    }
  }
}


function splitToNChunks(array, n) {
  let result = [];
  for (let i = n; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}
module.exports = speechToText;