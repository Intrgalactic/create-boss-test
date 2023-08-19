const asyncHandler = require("express-async-handler")
const setContentType = require('../utils/setContentType');
const sendToStorage = require('./sendToStorage');
const { Deepgram } = require('@deepgram/sdk');
const path = require('path');
const { spawn } = require('child_process');
const Ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const ffprobe = require('ffprobe-static');
const fontkit = require('fontkit');

const speechToText = (storage, isVideoApi) => {
  return asyncHandler(async (req, res) => {
    try {
      var summary, fullSpeechToTextContent, contentType, diarizeOn, topicsOn;
      var topics = [];
      if (isVideoApi) {
        var logoIndex = req.body.logo && req.body.logo;
        var logo = req.files[logoIndex] && req.files[logoIndex];
        var logoExtension = logo && logo.originalname.slice(logo.originalname.lastIndexOf('.'));
        var watermarkIndex = req.body.watermark && req.body.watermark;
        var watermark = req.files[watermarkIndex] && req.files[watermarkIndex];
        var watermarkExtension = watermark && watermark.originalname.slice(watermark.originalname.lastIndexOf('.'));
        var fontIndex = req.body.subtitles && req.body.subtitles;
        var font = req.files[fontIndex] && req.files[fontIndex];
        var fontExtension = req.files[fontIndex] && req.files[fontIndex].originalname.slice(font.originalname.lastIndexOf('.'));
        var fontSize = req.body.subtitlesFontSize;
       
        var enableTextStroke = req.body.enableTextStroke === "No" ? false : true;
        var enableSubBg = req.body.enableSubBg === "No" ? false : true;
        var enableShadow = req.body.enableShadow === "No" ? false : true;
        var formattedSubtitlesColor = convertColorToReversedHex(req.body.subtitlesColor, "FFFFFF");
        var formattedStrokeColor = enableTextStroke ? convertColorToReversedHex(req.body.strokeColor, "000000") : null;
        var formattedSubBgColor = enableSubBg ? convertColorToReversedHex(req.body.subBgColor, "000000", parseFloat(req.body.subBgOpacity)) : null;
        var textStroke = enableTextStroke ? req.body.textStroke.slice(0, req.body.textStroke.indexOf('P')) : null;
      }
 
      const videoStream = isVideoApi ? req.files[0] : req.file;
      const mimetype = videoStream.mimetype;
      const outputExtension = isVideoApi ? videoStream.originalname.slice(videoStream.originalname.lastIndexOf('.')) : req.body.audioEncoding;
      const outputFileName = generateRandomFileName(`.${outputExtension.toLowerCase()}`);

      contentType = req.body.audioEncoding ? setContentType(req.body.audioEncoding) : isVideoApi ? "video/mp4" : null;
      const deepgram = new Deepgram(process.env.DEEPGRAM_KEY);
      const tier = req.body.languageCode ? (req.body.languageCode.includes('es') || req.body.languageCode.includes('en')) ? "nova" : "enhanced" : "enhanced";

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
        language: req.body.languageCode
      }

      const response = await deepgram.transcription.preRecorded(
        {
          stream: videoStream.buffer,
          mimetype: mimetype,
        },
        options
      )
      const fullTranscription = !isVideoApi ? response.results.channels[0].alternatives[0].transcript : null;

      if (summarizeOn) {
        summary = response.results.summary;
      }
      if (topicsOn) {
        addTopics(response, topics);
      }
      if (subtitlesOn) {
        var subtitles = [];
        !isVideoApi ? subtitles = await addSubtitles(response) : subtitles = await addSubtitles(response, videoStream);
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

      if (!isVideoApi) {
        await sendToStorage(`${outputFileName}`, fullSpeechToTextContent, contentType, storage);
        res.status(200).send(JSON.stringify({ fileName: outputFileName.substring(0, outputFileName.lastIndexOf('.')) }));
      }

      else {
        const srtSubtitles = convertToSrt(subtitles.join(''));
        const videoPath = await addSubtitlesToVideo(videoStream.originalname.slice(videoStream.originalname.lastIndexOf('.')), srtSubtitles, formattedSubtitlesColor, enableSubBg, formattedSubBgColor, videoStream.buffer, font, fontSize, fontExtension, req.body.subtitlesAlign, logo, req.body.logoAlign, logoExtension, watermark, watermarkExtension, req.body.watermarkAlign, enableShadow, enableTextStroke, textStroke, formattedStrokeColor, enableSubBg);
        const endVideoBuffer = fs.readFileSync(videoPath);
        fs.unlinkSync(videoPath);
        await sendToStorage(`${outputFileName.substring(0, outputFileName.lastIndexOf('.'))}.${outputExtension}`, endVideoBuffer, contentType, storage);
        res.status(200).send(JSON.stringify({ fileName: outputFileName.substring(0, outputFileName.lastIndexOf('.')) }));
      }

    }
    catch (err) {
      console.log(err);
    }
  })
}

function addTopics(response, topics) {
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

async function addSubtitles(response, video) {
  var pDuration = 6;
  var aspectRatio;
  var subtitles = [];
  function getAspectRatio() {
    if (video) {
      return new Promise((resolve, reject) => {

        var tempFolder = path.join(__dirname, '../.././temporary');
        var aspectRadioVideoFileName = generateRandomFileName(video.originalname.slice(video.originalname.lastIndexOf('.')));
        fs.writeFileSync(path.join(tempFolder, aspectRadioVideoFileName), video.buffer);
        const ffprobePath = ffprobe.path;

        const ffprobeProcess = spawn(ffprobePath, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'json', path.join(tempFolder, aspectRadioVideoFileName)]);

        let ffprobeOutput = '';

        ffprobeProcess.stdout.on('data', (data) => {
          ffprobeOutput += data.toString();
        });

        ffprobeProcess.stderr.on('data', (data) => {
          console.error(data.toString());
        });


        ffprobeProcess.on('close', (code) => {
          fs.unlinkSync(path.join(tempFolder, aspectRadioVideoFileName));
          if (code === 0) {
            const videoInfo = JSON.parse(ffprobeOutput);
            const videoWidth = videoInfo.streams[0].width;
            const videoHeight = videoInfo.streams[0].height;
            aspectRatio = videoWidth / videoHeight;
            resolve(aspectRatio);
          } else {
            console.error('FFprobe process exited with code', code);
            reject(new Error(`FFprobe process exited with code ${code}`));
          }
        });
      })
    }
  }
  aspectRatio = await getAspectRatio();
  for (let utterance of response.results.utterances) {
    if (aspectRatio <= 1) {
      for (let i = 0; i < utterance.words.length; i++) {
        subtitles.push(`[${utterance.words[i].start.toFixed(2)} - ${utterance.words[i].end.toFixed(2)}]${utterance.words[i].word.toUpperCase()}\n`);
      }
    }
    else {
      if (utterance.start + pDuration < utterance.end) {
        const transcriptionInArr = utterance.transcript.split(' ');
        const transcriptArrInParts = splitToNChunks(transcriptionInArr, pDuration);
        const transcriptLen = utterance.transcript.split(' ').length;
        const speakingTime = (utterance.end - utterance.start) / pDuration;
        var startTimeStamp = utterance.start
        var endTimeStamp = utterance.start + speakingTime;
        var transcriptPart = "";
        for (let j = 0; j < pDuration; j++) {
          for (let i = 0; i < transcriptLen / pDuration; i++) {
            transcriptPart += transcriptArrInParts[j][i] !== undefined ? (transcriptArrInParts[j][i] + " ") : '';
          }
          subtitles.push(`[${startTimeStamp.toFixed(2)} - ${endTimeStamp.toFixed(2)}]${transcriptPart}\n`);
          startTimeStamp += speakingTime;
          endTimeStamp += speakingTime;
          transcriptPart = "";
        }
      }
      else {
        subtitles.push(`[${utterance.start.toFixed(2)} - ${utterance.end.toFixed(2)}]${utterance.transcript}\n`);
      }
    }
  }
  return subtitles;
}


function splitToNChunks(array, n) {
  let result = [];
  for (let i = n; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}

async function addSubtitlesToVideo(videoExtension, srtSubtitles, subtitlesColor, enableSubBg, subBgColor, videoBuffer, font, fontSize, fontExtension, subtitlesAlign, logo, logoAlign, logoExtension, watermark, watermarkExtension, watermarkAlign, enableShadow, enableTextStroke, stroke, strokeColor, enableSubBg) {

  Ffmpeg.setFfmpegPath(ffmpegPath);

  var tempFolder = path.join(__dirname, '../.././temporary');
  var detectedFont, fontFamilyName;
  var logoFileName, logoAlignFFmpegFormat, logoVideoFileName, videoWithLogoPath;
  var watermarkFileName, watermarkAlignFFmpegFormat, watermarkVideoFileName, videoWithWatermarkPath;
  var subtitlesFontFileName, subtitlesAlignFFmpegFormat;

  const srtSubtitlesBuffer = Buffer.from(srtSubtitles, 'utf-8');
  const subtitlesFileName = generateRandomFileName('.srt');
  const subtitlesVideoFileName = generateRandomFileName(videoExtension)

  const videoFileName = generateRandomFileName(videoExtension);

  fs.writeFileSync(path.join(tempFolder, subtitlesFileName), srtSubtitlesBuffer);
  fs.writeFileSync(path.join(tempFolder, videoFileName), videoBuffer);

  if (font) {
    subtitlesFontFileName = generateRandomFileName(fontExtension);
    detectedFont = fontkit.create(font.buffer);
    fontFamilyName = detectedFont.familyName;
    fs.writeFileSync(path.join(tempFolder, subtitlesFontFileName), font.buffer);
    subtitlesAlignFFmpegFormat = returnAlignment(subtitlesAlign);
  }
  else {
    fontFamilyName = "Nexa Heavy";
    subtitlesAlignFFmpegFormat = returnAlignment(subtitlesAlign);
  }

  if (logo) {
    const logoProps = createImageFile(logoExtension, tempFolder, videoExtension, logoAlign);
    logoVideoFileName = logoProps.videoRandomFileName;
    videoWithLogoPath = logoProps.videoPath;
    logoFileName = logoProps.randomFileName;
    logoAlignFFmpegFormat = logoProps.ffmpegFormat;
    fs.writeFileSync(path.join(tempFolder, logoFileName), logo.buffer);
  }

  if (watermark) {
    const watermarkProps = createImageFile(watermarkExtension, tempFolder, videoExtension, watermarkAlign);
    watermarkVideoFileName = watermarkProps.videoRandomFileName;
    videoWithWatermarkPath = watermarkProps.videoPath;
    watermarkFileName = watermarkProps.randomFileName;
    watermarkAlignFFmpegFormat = watermarkProps.ffmpegFormat;
    fs.writeFileSync(path.join(tempFolder, watermarkFileName), watermark.buffer);
  }

  const videoWithSubtitlesPath = path.join(tempFolder, subtitlesVideoFileName);
  var shadow = enableShadow ? ",Shadow=1" : "";
  var textStroke = enableTextStroke ? `,Outline=${stroke}` : ",Outline=0";
  var outlineColor = enableTextStroke ? `,OutlineColour=${strokeColor}` : "";
  var subBg = enableSubBg ? `,BorderStyle=4,MarginV=${subtitlesAlign === "Bottom" ? "20" : "0"},BackColour=${subBgColor}` : "";
  console.log(subBgColor);
  const endVideoPath = await createModifiedVideos();
  return endVideoPath;
  
  function createModifiedVideos() {
    return new Promise((resolve, reject) => {
      Ffmpeg()
        .input(path.join(tempFolder, videoFileName))
        .complexFilter([
          {
            filter: 'subtitles',
            options: `./temporary/${subtitlesFileName}:force_style='Alignment=${subtitlesAlignFFmpegFormat},Fontsize=${fontSize},Fontsdir=./temporary,Fontfile=${subtitlesFontFileName},PrimaryColour=${subtitlesColor},Fontname=${fontFamilyName}${shadow}${textStroke}${outlineColor}${subBg}'`

          }])
        .toFormat(videoExtension.slice(videoExtension.indexOf('.') + 1))
        .on('start', () => {
          console.log('Creating buffer with subtitles...');
        })
        .on('end', async () => {
          fs.unlinkSync(path.join(tempFolder, subtitlesFileName));
          fs.unlinkSync(path.join(tempFolder, videoFileName));
          if (font) {
            fs.unlinkSync(path.join(tempFolder, subtitlesFontFileName));
          }
          if (watermark && logo) {
            addWatermarkWithFFmpeg(true, resolve, reject);
          }
          else if (watermark) {
            addWatermarkWithFFmpeg(false, resolve, reject);
          }
          else if (logo) {
            addLogoWithFFmpeg(videoWithSubtitlesPath, false, resolve, reject);
          }
          else {
            resolve(videoWithSubtitlesPath);
          }
        })
        .on('error', (err) => {
          console.error('Error generating buffer with subtitles:', err);
        })
        .save(videoWithSubtitlesPath)
    });
  }
  function addWatermarkWithFFmpeg(addLogoOnEnd, resolve, reject) {
    Ffmpeg()
      .input(videoWithSubtitlesPath) // Input from pipe
      .input(path.join(tempFolder, watermarkFileName)) // Input watermark from file
      .complexFilter([
        {
          filter: 'overlay', // Apply overlay filter for watermark
          options: watermarkAlignFFmpegFormat,
        },
      ])
      .toFormat('mp4')
      .on('start', () => {
        console.log('Adding watermark...');
        console.log(videoWithWatermarkPath);
      })
      .on('end', () => {
        fs.unlinkSync(videoWithSubtitlesPath);
        fs.unlinkSync(path.join(tempFolder, watermarkFileName));
        if (addLogoOnEnd) {
          addLogoWithFFmpeg(videoWithWatermarkPath, true, resolve, reject);
        }
        else {
          resolve(videoWithWatermarkPath);
        }
      })
      .on('error', (err) => {
        console.error('Error adding watermark:', err);
        reject(err);
      })
      .save(videoWithWatermarkPath); // Save the final video with watermark
  }
  function addLogoWithFFmpeg(videoPathToEdit, hasWatermark, resolve, reject) {
    Ffmpeg()
      .input(videoPathToEdit)
      .input(path.join(tempFolder, logoFileName)) // Input logo from buffer
      .complexFilter([
        {
          filter: 'overlay', // Apply overlay filter for logo
          options: logoAlignFFmpegFormat
        },
      ])
      .toFormat(videoExtension.slice(videoExtension.indexOf('.') + 1))
      .on('start', () => {
        console.log('Adding logo...');
      })
      .on('end', () => {
        if (!hasWatermark) {
          fs.unlinkSync(videoWithSubtitlesPath);
        }
        fs.unlinkSync(path.join(tempFolder, logoFileName));
        if (hasWatermark) {
          fs.unlinkSync(videoWithWatermarkPath)
        }
        console.log("Process Done");
        resolve(videoWithLogoPath);
      })
      .on('error', (err) => {
        console.error('Error adding logo:', err);
        reject(err);
      })
      .save(videoWithLogoPath);

  }
}

function returnAlignment(alignment) {
  switch (alignment) {
    case "Center":
      return 10;
    case "Bottom":
      return 2;
    case "Top Center":
      return 6;
    default:
      return 2;
  }
}
function returnDetailedAlignment(alignment, fontSize) {
  switch (alignment) {
    case "Top Left":
      return { x: 10, y: 10 };
    case "Top Right":
      return { x: 'main_w - overlay_w - 10', y: 10 };
    case "Bottom Left":
      return { x: 10, y: 'main_h - overlay_h - 10' };
    case "Bottom Right":
      return { x: 'main_w - overlay_w - 10', y: 'main_h - overlay_h - 10' };
    case "Center":
      return { x: '(main_w-overlay_w)/2', y: '(main_h-overlay_h)/2' };
    case "Top Center":
      return { x: '(main_w-overlay_w)/2', y: 10 };
    case "Bottom Center":
      return { x: '(main_w-overlay_w)/2', y: 'main_h - overlay_h - 10' };
    case "Left Center":
      return { x: 10, y: '(main_h-overlay_h)/2' };
    case "Right Center":
      return { x: 'main_w - overlay_w - 10', y: '(main_h-overlay_h)/2' };
    default:
      return { x: 10, y: 10 };
  }
}
function convertToSrt(inputText) {
  const lines = inputText.split('\n');
  // Initialize the SRT counter
  let srtCounter = 1;

  // Initialize an array to store the SRT lines
  const srtLines = [];

  // Loop through each line and convert it to SRT format
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line !== '') {
      const [timeRange, subtitleText] = line.split(']');
      const [startTime, endTime] = timeRange
        .replace('[', '')
        .split(' - ')
        .map(parseFloat);
      const srtLine = `${srtCounter}\n${formatTime(startTime)} --> ${formatTime(endTime)}\n${subtitleText}\n`;
      srtLines.push(srtLine);
      srtCounter++;
    }
  }

  // Format time in SRT format
  function formatTime(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.round((timeInSeconds - Math.floor(timeInSeconds)) * 1000);
    return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)},${padTime(milliseconds, 3)}`;
  }

  // Pad time values with leading zeros
  function padTime(value, length = 2) {
    return value.toString().padStart(length, '0');
  }

  // Join the SRT lines and create the final SRT content
  const srtContent = srtLines.join('\n');

  return srtContent;
}

function generateRandomFileName(extension) {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${timestamp}_${randomString}${extension}`;
}

function createImageFile() {
  watermarkVideoFileName = generateRandomFileName(watermarkExtension);
  videoWithWatermarkPath = path.join(tempFolder, `${watermarkVideoFileName.slice(0, watermarkVideoFileName.lastIndexOf('.') - 1)}${videoExtension}`);
  watermarkFileName = generateRandomFileName(watermarkExtension);
  fs.writeFileSync(path.join(tempFolder, watermarkFileName), watermark.buffer);
  watermarkAlignFFmpegFormat = returnDetailedAlignment(watermarkAlign);
}
function createImageFile(fileExtension, tempFolder, videoExtension, align) {
  const videoRandomFileName = generateRandomFileName(fileExtension);
  const videoPath = path.join(tempFolder, `${videoRandomFileName.slice(0, videoRandomFileName.lastIndexOf('.') - 1)}${videoExtension}`);
  const randomFileName = generateRandomFileName(fileExtension);
  const ffmpegFormat = returnDetailedAlignment(align);
  return {
    videoRandomFileName: videoRandomFileName,
    videoPath: videoPath,
    randomFileName: randomFileName,
    ffmpegFormat: ffmpegFormat
  }
}

function convertColorToReversedHex(color, variant, opacity) {
  if (opacity) {
    var op = 1 - opacity;
    var alphaValue = Math.round(op * 255);

    var alphaHex = alphaValue.toString(16).toUpperCase().padStart(2, '0');
  }
  try {
    var fullHexColorPrefix = opacity ? `0x${alphaHex}` : "0x";
    const cleanHexColor = color.startsWith("#") ? color.substring(1) : color;
    var fullHexColor = fullHexColorPrefix + cleanHexColor.toUpperCase().split("").reverse().join("");
    if (fullHexColor === "0xDENIFEDNU" || fullHexColor === `0x${alphaHex}DENIFEDNU`) {
      fullHexColor = !opacity ? `0x${variant}` : `0x${alphaHex}${variant}`;
    }
    return fullHexColor;
  }
  catch (err) {
    console.error('Error converting color:', err.message);
    return null;
  }
}
module.exports = speechToText;