
const asyncHandler = require("express-async-handler");
const sendToStorage = require('./sendToStorage');

const generateRandomFileName = require('../utils/generateFileName');
const fileTypes = [
    'application/pdf',
    'application/rtf',
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.oasis.opendocument.text', // ODT
    'text/plain',
];

const parseFile = require('../utils/fileParser');
const createSpeech = require("../utils/createSpeechSample");
const verifyToken = require("../utils/verifyToken");

const textToSpeech = (storage) => {

    return asyncHandler(async (req, res) => {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : req.cookies.jwt;
        const tokenUser = verifyToken(token);
        var textInput;
        var outputFileName = generateRandomFileName(`.mp3`);
        if (tokenUser.exp > Date.now() / 1000) {
            try {
                if (req.file) {
                    textInput = await getTextToSynthetize(req.file, req)
                }
                else {
                    textInput = req.body.text;
                }
                console.log(req.body,textInput,req.file);
                const buffer = await createSpeech(req.body.voiceId, req.body.stability, req.body.clarity, textInput).catch(err => {
                    console.log(err);
                    throw err;
                });
                console.log(buffer);
                await sendToStorage(outputFileName, buffer, "audio/mpeg", storage)
                res.status(200).send(JSON.stringify({ fileName: outputFileName.substring(0, outputFileName.lastIndexOf('.')) }));
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err.message);
            }
        }
        else {
            console.log('expired');
            res.sendStatus(403);
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