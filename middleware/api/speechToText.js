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
    console.log(req.body);
    try {
      var summary, fullSpeechToTextContent, contentType, diarizeOn, topicsOn;
      var topics = [];
      if (isVideoApi) {
        var logoIndex = req.body.enableLogo === "Yes" && req.body.logo && req.body.logo;
        var logo = req.body.enableLogo === "Yes" && req.files[logoIndex] && req.files[logoIndex];
        var logoExtension = logo && logo.originalname.slice(logo.originalname.lastIndexOf('.'));
        var watermarkIndex = req.body.enableWatermark === "Yes" && req.body.watermark && req.body.watermark;
        var watermark = req.body.enableWatermark === "Yes" && req.files[watermarkIndex] && req.files[watermarkIndex];
        var watermarkExtension = watermark && watermark.originalname.slice(watermark.originalname.lastIndexOf('.'));
        var fontIndex = req.body.subtitles && req.body.subtitles;
        var font = req.files[fontIndex] && req.files[fontIndex];
        var fontExtension = req.files[fontIndex] && req.files[fontIndex].originalname.slice(font.originalname.lastIndexOf('.'));
        var fontSize = req.body.subtitlesFontSize;
        var wordsPerLine = req.body.wordsPerLine === "Choose" ? null : req.body.wordsPerLine;
        var enableTextStroke = req.body.enableTextStroke === "No" ? false : true;
        var enableSubBg = req.body.enableSubBg === "No" ? false : true;
        var enableShadow = req.body.enableShadow === "No" ? false : true;
        var enableWordFollow = req.body.enableWordFollow === "No" ? false : true;
        var enableScale = req.body.enableScale === "No" ? false : true;
        var enableFade = req.body.enableFade === "No" ? false : true;
        var enableRotate = req.body.enableRotate === "No" ? false : true;
        var formattedSubtitlesColor = convertColorToReversedHex(req.body.subtitlesColor, "FFFFFF");
        var formattedStrokeColor = enableTextStroke ? convertColorToReversedHex(req.body.strokeColor, "000000") : null;
        var formattedSubBgColor = enableSubBg ? convertColorToReversedHex(req.body.subBgColor, "000000", parseFloat(req.body.subBgOpacity)) : null;
        var formattedWordFollowColor = enableWordFollow ? "&H" + req.body.wordFollowColor.substring(1).toUpperCase().split("").reverse().join("") : null;
        var textStroke = enableTextStroke ? req.body.textStroke.slice(0, req.body.textStroke.indexOf('P')) : null;
        var emotionsEnabled = req.body.enableEmotions === "No" ? false : true;
        var italicizeSubs = req.body.italicize === "No" ? false : true;
        var uppercaseSubs = req.body.uppercaseSubs === "No" ? false : true;
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
        
        !isVideoApi ? subtitles = await addSubtitles(response,false,req.body.languageCode) : subtitles = await addSubtitles(response, {
          video: videoStream,
          uppercaseSubs: uppercaseSubs,
          emotionsEnabled: emotionsEnabled,
          defaultColor: formattedSubtitlesColor,
          wordFollowEnabled: enableWordFollow,
          wordFollowColor: formattedWordFollowColor,
          enableScale: enableScale,
          enableFade: enableFade,
          enableRotate: enableRotate,
          enableTextStroke: enableTextStroke,
          textStrokeThickness: textStroke,
          formattedStrokeColor: formattedStrokeColor,
          wordsPerLine: wordsPerLine
        }, req.body.languageCode);
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
        const subtitlesAlign = returnAlignment(req.body.subtitlesAlign);
        const fontName = detectFont(font);
        console.log(formattedSubBgColor);
        var ASSSubtitlesTemplate = `[Script Info]\nTitle: Subtitles\nScriptType: v4.00+\nWrapStyle: 0\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,${fontName},${fontSize.substring(0, fontSize.indexOf("P"))},&HFFFFFF,${enableWordFollow ? formattedSubtitlesColor : "&HFFFFFF"},${formattedSubBgColor},${formattedSubBgColor},-1,${italicizeSubs ? "1" : "0"},0,0,100,100,0,0,${enableSubBg ? "3" : "1"},0,${enableShadow ? "2" : "0"},${subtitlesAlign},30,30,0,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`
        const srtSubtitles = convertToSrt(subtitles.join(''));
        const srtSubtitlesArr = srtSubtitles.split('\n');
        for (let i = 0; i < srtSubtitlesArr.length; i++) {
          ASSSubtitlesTemplate += `${srtSubtitlesArr[i]}\n`;
        }
        const videoPath = await addSubtitlesToVideo(videoStream.originalname.slice(videoStream.originalname.lastIndexOf('.')), ASSSubtitlesTemplate, videoStream.buffer, font, fontExtension, logo, req.body.logoAlign, logoExtension, watermark, watermarkExtension, req.body.watermarkAlign);
        const endVideoBuffer = fs.readFileSync(videoPath);
        fs.unlinkSync(videoPath);
        sendToStorage(`${outputFileName.substring(0, outputFileName.lastIndexOf('.'))}.${outputExtension}`, endVideoBuffer, contentType, storage);
        res.status(200).send(JSON.stringify({ fileName: outputFileName.substring(0, outputFileName.lastIndexOf('.')) }));
      }

    }
    catch (err) {
      console.log(err); 
      res.status(400).send(err.message);
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

async function addSubtitles(response, subtitlesProps, languageBookmark) {
  var aspectRatio;
  var subtitles = [];

  if (subtitlesProps) {
    var { video, uppercaseSubs, emotionsEnabled, defaultColor, wordFollowEnabled, wordFollowColor, enableScale, enableFade, wordsPerLine, enableRotate,enableTextStroke,formattedStrokeColor,textStrokeThickness } = subtitlesProps;
  }

  const fileName = getLanguageFromBookmark(languageBookmark);
  var wordsEmotionallyLabeled = require(`../../data/emotions/${fileName}/words.json`);
  var colorsPalette = ["0CFF00", "0046FF", "FFD500", "5900FF", "FF7000", "FF0000"];
  var happyWords = wordsEmotionallyLabeled.happy;
  var sadWords = wordsEmotionallyLabeled.sad;
  var anxiousWords = wordsEmotionallyLabeled.anxious;
  var surprisedWords = wordsEmotionallyLabeled.surprised;
  var afraidWords = wordsEmotionallyLabeled.afraid
  var angryWords = wordsEmotionallyLabeled.angry;

  var emotionsArr = [happyWords, sadWords, anxiousWords, surprisedWords, afraidWords, angryWords];
  var wordsIt = 0;

  function getAspectRatio() {
    if (video) {
      var ratio = getVideoMetrics(video, "aspectRatio");
    }
    return ratio;
  }

  if (!wordsPerLine) {
    aspectRatio = await getAspectRatio();
  }

  aspectRatio ? aspectRatio <= 1.2 ? pLength = 4 : pLength = 8 : pLength = parseInt(wordsPerLine);
  var pLengthCopy = pLength;

  for (let utterance of response.results.utterances) {
    pLength = pLengthCopy;
    wordsIt = 0;
    for (let i = 0; i < utterance.words.length; i += pLengthCopy) {
      var wordsArr = "";
      var karaokeArr = [];
      var endArr = [];

      for (let x = wordsIt; x < pLength; x++) {
        utterance.words[x]  ? endArr.push(utterance.words[x].start, utterance.words[x].end) : null;
      }

      for (let j = wordsIt; j < pLength; j++) {
        wordsArr += utterance.words[j] ? uppercaseSubs ? `${utterance.words[j].word.toUpperCase()} ` : `${utterance.words[j].word} ` : "";
        if (utterance.words[j]) {
          wordFollowEnabled ? karaokeArr.push(((utterance.words[j].end - utterance.words[j].start) * 100).toFixed(2)) : null;
        }

      }

      const start = parseFloat(Math.min(...endArr)).toFixed(2);
      const end = parseFloat(Math.max(...endArr)).toFixed(2);
      console.log(start,end)
      wordsIt += pLengthCopy;
      pLength += pLengthCopy;
      const subtitlesProps = {
        emotionsArr: emotionsArr,
        colorsPalette: colorsPalette,
        defaultColor: wordFollowEnabled ? wordFollowColor : defaultColor,
        karaokeArr: wordFollowEnabled ? karaokeArr : false,
        enableScale: enableScale,
        enableFade: enableFade,
        enableRotate: enableRotate,
        enableTextStroke,
        formattedStrokeColor:formattedStrokeColor,
        textStrokeThickness:textStrokeThickness,
        emotionsEnabled: emotionsEnabled,
      }
      checkAndPushToArray(wordsArr, subtitles, start, end, subtitlesProps);
    }
  }
  console.log(subtitles);
  return subtitles;
}

function checkAndPushToArray(subsToCheck, subtitles, start, end, subtitlesProps) {
  let modifiedWord = addEmotionsToSubtitles(subsToCheck, subtitlesProps);
  subtitles.push(`[${start} - ${end}]${modifiedWord}\n`);
}

async function addSubtitlesToVideo(videoExtension, srtSubtitles, videoBuffer, font, fontExtension, logo, logoAlign, logoExtension, watermark, watermarkExtension, watermarkAlign) {
  try {
    Ffmpeg.setFfmpegPath(ffmpegPath);

    var tempFolder = path.join(__dirname, '../.././temporary');
    const fontTempFolder = path.join(__dirname, './temporary');
    var logoFileName, logoAlignFFmpegFormat, videoWithLogoPath;
    var watermarkFileName, watermarkAlignFFmpegFormat, videoWithWatermarkPath;
    var subtitlesFontFileName;

    const srtSubtitlesBuffer = Buffer.from(srtSubtitles, 'utf-8');
    const subtitlesFileName = generateRandomFileName('.ass');
    const subtitlesVideoFileName = generateRandomFileName(videoExtension)

    const videoFileName = generateRandomFileName(videoExtension);

    fs.writeFileSync(path.join(tempFolder, subtitlesFileName), srtSubtitlesBuffer);
    fs.writeFileSync(path.join(tempFolder, videoFileName), videoBuffer);

    if (font) {
      subtitlesFontFileName = generateRandomFileName(fontExtension);
      fs.writeFileSync(path.join(fontTempFolder, subtitlesFontFileName), font.buffer);
    }

    if (logo) {
      const logoProps = createImageFile(logoExtension, tempFolder, videoExtension, logoAlign);
      videoWithLogoPath = logoProps.videoPath;
      logoFileName = logoProps.randomFileName;
      logoAlignFFmpegFormat = logoProps.ffmpegFormat;
      fs.writeFileSync(path.join(tempFolder, logoFileName), logo.buffer);
    }

    if (watermark) {
      const watermarkProps = createImageFile(watermarkExtension, tempFolder, videoExtension, watermarkAlign);
      videoWithWatermarkPath = watermarkProps.videoPath;
      watermarkFileName = watermarkProps.randomFileName;
      watermarkAlignFFmpegFormat = watermarkProps.ffmpegFormat;
      fs.writeFileSync(path.join(tempFolder, watermarkFileName), watermark.buffer);
    }

    const videoWithSubtitlesPath = path.join(tempFolder, subtitlesVideoFileName);

    const endVideoPath = await createModifiedVideos();
    return endVideoPath;


    function createModifiedVideos() {
      return new Promise((resolve, reject) => {
        Ffmpeg()
          .input(path.join(tempFolder, videoFileName))
          .complexFilter([
            {
              filter: 'subtitles',
              options: `./temporary/${subtitlesFileName}:fontsdir=./temporary/${font ? subtitlesFontFileName : "Nexa-Heavy.ttf"}.`

            }
          ])
          .toFormat(videoExtension.slice(videoExtension.indexOf('.') + 1))
          .on('start', () => {
            console.log('Creating buffer with subtitles...');
          })
          .on('end', async () => {
            fs.unlinkSync(path.join(tempFolder, subtitlesFileName));
            fs.unlinkSync(path.join(tempFolder, videoFileName));
            if (font) {
              fs.unlinkSync(path.join(fontTempFolder, subtitlesFontFileName));
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
  catch (err) {
    console.log(err);
    throw err;
  }
}

function returnAlignment(alignment) {
  switch (alignment) {
    case "Center":
      return '5';
    case "Bottom":
      return "2";
    case "Top Center":
      return "8";
    default:
      return "2";
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
  let assCounter = 1;

  const assLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line !== '') {
      const [timeRange, subtitleText] = line.split(']');
      const [startTime, endTime] = timeRange
        .replace('[', '')
        .split(' - ')

      const formatTime = (time) => {
        const [seconds, milliseconds] = time.split('.');
        const totalSeconds = parseInt(seconds, 10);
        const minutes = Math.floor(totalSeconds / 60);
        const hours = Math.floor(minutes / 60);
        return `${hours}:${minutes % 60}:${totalSeconds % 60}.${milliseconds}`;
      };

      const formattedStartTime = formatTime(startTime);
      const formattedEndTime = formatTime(endTime);

      const assLine = `Dialogue: 0,${formattedStartTime},${formattedEndTime},Default,,0,0,0,,${subtitleText}\n`;
      assLines.push(assLine);
      assCounter++;
    }
  }

  const assContent = assLines.join('');
  return assContent;

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
    var fullHexColorPrefix = opacity ? `&H${alphaHex}` : "&H";
    const cleanHexColor = color.startsWith("#") ? color.substring(1) : color;
    var fullHexColor = fullHexColorPrefix + cleanHexColor.toUpperCase().split("").reverse().join("");
    if (fullHexColor === "&HDENIFEDNU" || fullHexColor === `&H${alphaHex}DENIFEDNU`) {
      fullHexColor = !opacity ? `&H${variant}` : `&H${alphaHex}${variant}`;
    }
    return fullHexColor;
  }
  catch (err) {
    console.error('Error converting color:', err.message);
    return null;
  }
}

function addEmotionsToSubtitles(subtitles, subtitlesProps) {
  const { emotionsArr, colorsPalette, defaultColor, karaokeArr, enableScale, enableFade, emotionsEnabled, enableRotate,enableTextStroke,textStrokeThickness,formattedStrokeColor } = subtitlesProps;
  const subtilesCopy = subtitles.split(" ");
  console.log(formattedStrokeColor);
  var modifiedSubtitles = `${enableRotate ? `{\\frz${Math.floor(Math.random() * 45)}}` : ""}`;
  for (let i = 0; i < subtilesCopy.length - 1; i++) {
    var isAdded = false;
    for (let j = 0; j < emotionsArr.length; j++) {
      for (let k = 0; k < emotionsArr[j].length; k++) {
        if (subtilesCopy[i].toLowerCase() === emotionsArr[j][k]) {
          switch (j) {
            case 0: modifiedSubtitles += `{${karaokeArr ? '\\k' + karaokeArr[i] : ""}\\c${emotionsEnabled ? convertColorToReversedHex(colorsPalette[0]) : defaultColor}${enableTextStroke ? `\\bord${textStrokeThickness}\\3c${formattedStrokeColor}` : ""}${enableScale ? "\\fscx0,\\fscy0,\\t(0,250,\\fscx100\\fscy100)" : ""}${enableFade ? "\\fad(150,150)" : ""}}${subtilesCopy[i]} `; isAdded = true;
              break;
            case 1: modifiedSubtitles += `{${karaokeArr ? '\\k' + karaokeArr[i] : ""}\\c${emotionsEnabled ? convertColorToReversedHex(colorsPalette[1]) : defaultColor}${enableTextStroke ? `\\bord${textStrokeThickness}\\3c${formattedStrokeColor}` : ""}${enableScale ? "\\fscx0,\\fscy0,\\t(0,250,\\fscx100\\fscy100)" : ""}${enableFade ? "\\fad(150,150)" : ""}}${subtilesCopy[i]} `; isAdded = true;
              break;
            case 2: modifiedSubtitles += `{${karaokeArr ? '\\k' + karaokeArr[i] : ""}\\c${emotionsEnabled ? convertColorToReversedHex(colorsPalette[2]) : defaultColor}${enableTextStroke ? `\\bord${textStrokeThickness}\\3c${formattedStrokeColor}` : ""}${enableScale ? "\\fscx0,\\fscy0,\\t(0,250,\\fscx100\\fscy100)" : ""}${enableFade ? "\\fad(150,150)" : ""}}${subtilesCopy[i]} `; isAdded = true;
              break;
            case 3: modifiedSubtitles += `{${karaokeArr ? '\\k' + karaokeArr[i] : ""}\\c${emotionsEnabled ? convertColorToReversedHex(colorsPalette[3]) : defaultColor}${enableTextStroke ? `\\bord${textStrokeThickness}\\3c${formattedStrokeColor}` : ""}${enableScale ? "\\fscx0,\\fscy0,\\t(0,250,\\fscx100\\fscy100)" : ""}${enableFade ? "\\fad(150,150)" : ""}}${subtilesCopy[i]} `; isAdded = true;
              break;
            case 4: modifiedSubtitles += `{${karaokeArr ? '\\k' + karaokeArr[i] : ""}\\c${emotionsEnabled ? convertColorToReversedHex(colorsPalette[4]) : defaultColor}${enableTextStroke ? `\\bord${textStrokeThickness}\\3c${formattedStrokeColor}` : ""}${enableScale ? "\\fscx0,\\fscy0,\\t(0,250,\\fscx100\\fscy100)" : ""}${enableFade ? "\\fad(150,150)" : ""}}${subtilesCopy[i]} `; isAdded = true;
              break;
            case 5: modifiedSubtitles += `{${karaokeArr ? '\\k' + karaokeArr[i] : ""}\\c${emotionsEnabled ? convertColorToReversedHex(colorsPalette[5]) : defaultColor}${enableTextStroke ? `\\bord${textStrokeThickness}\\3c${formattedStrokeColor}` : ""}${enableScale ? "\\fscx0,\\fscy0,\\t(0,250,\\fscx100\\fscy100)" : ""}${enableFade ? "\\fad(150,150)" : ""}}${subtilesCopy[i]} `; isAdded = true;
              break;
            default: modifiedSubtitles += `{${karaokeArr ? '\\k' + karaokeArr[i] : ""}\\c${emotionsEnabled ? convertColorToReversedHex(colorsPalette[6]) : defaultColor}${enableTextStroke ? `\\bord${textStrokeThickness}\\3c${formattedStrokeColor}` : ""}${enableScale ? "\\fscx0,\\fscy0,\\t(0,250,\\fscx100\\fscy100)" : ""}${enableFade ? "\\fad(150,150)" : ""}}${subtilesCopy[i]}`;
              break;
          }
        }
        else if (j === emotionsArr.length - 1 && k === emotionsArr[j].length - 1 && !isAdded) {
          modifiedSubtitles += `{${karaokeArr ? '\\k' + karaokeArr[i] : null}\\c${defaultColor}${enableTextStroke ? `\\bord${textStrokeThickness}\\3c${formattedStrokeColor}` : ""}${enableScale ? "\\fscx0,\\fscy0,\\t(0,250,\\fscx100\\fscy100)" : ""}${enableFade ? "\\fad(150,150)" : ""}}${subtilesCopy[i]} `
        }
      }
    }

  }

  return modifiedSubtitles;

}

function getLanguageFromBookmark(bookmark) {
  switch (bookmark) {
    case "da": return "danish";
    case "en": return "english";
    case "en-AU": return "english";
    case "en-IN": return "english";
    case "en-NZ": return "english";
    case "en-US": return "english";
    case "es-419": return "spanish";
    case "es": return "spanish";
    case "fr-CA": return "french";
    case "fr": return "fr";
    case "hi": return "hindi";
    case "hi-Latn": return "hindi";
    case "id": return "indonesian";
    case "it": return "italian";
    case "ja": return "japanese";
    case "nl": return "dutch";
    case "pl": return "polish";
    case "pt-BR": return "portuguese";
    case "pt": return "portuguese";
    case "pt-PT": return "portuguese";
    case "ru": return "russian";
    case "sv": return "swedish";
    case "tr": return "turkish";
    case "uk": return "ukrainian";
    case "zh-CN": return "chinese";
    case "zh-TW": return "chinsese";
  }
}

function getVideoMetrics(video, type) {
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
        type === "aspectRatio" ? resolve(videoWidth / videoHeight) : resolve(videoHeight);
      } else {
        console.error('FFprobe process exited with code', code);
        reject(new Error(`FFprobe process exited with code ${code}`));
      }
    });
  })
}

function detectFont(font) {
  try {
    var detectedFont = fontkit.create(font.buffer);
    return detectedFont.familyName;
  }
  catch (err) {
    return "Nexa Heavy";
  }
}

module.exports = speechToText;