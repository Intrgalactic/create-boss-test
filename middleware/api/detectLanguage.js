const { Translate } = require('@google-cloud/translate').v2;

const detectLanguage = async (text) => {
    const translate = new Translate();
    var textToDetect = "";
    var textLength = 0;
    const maxTextLength = text.length < 100 ? 40 : 100;
    text.length < maxTextLength ? textLength = text.length : textLength = maxTextLength;
    for (let i = 0; i < textLength; i++) {
        textToDetect += text[i];
    }
    let [detections] = await translate.detect(textToDetect);
    detections = Array.isArray(detections) ? detections : [detections];
    return detections[0].language;
}

module.exports = detectLanguage