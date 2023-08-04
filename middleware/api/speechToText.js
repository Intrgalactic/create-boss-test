const asyncHandler = require("express-async-handler")
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const readline = require("readline");

const speechToText = () => {
    return asyncHandler(async (req,res) => {
        const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGI);
        const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
    
        speechSynthesizer.speakTextAsync(
            "I'm excited to try text to speech",
            result => {
                speechSynthesizer.close();
                return result.audioData;
            },
            error => {
                console.log(error);
                speechSynthesizer.close();
            });
    })
}