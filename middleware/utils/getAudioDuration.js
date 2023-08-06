const wavDecoder = require('wav-decoder');
const nodeID3 = require('node-id3');
const oggParser = require('ogg-parser');
const mp3Duration = require('mp3-duration');
async function getAudioDuration(mimeType, buffer) {
    switch (mimeType) {
        case "audio/mpeg": return await getMp3Duration(buffer);
            break;
        case "audio/wav": return await getWavDuration(buffer);
            break;
        case "audio/ogg": return await getOggDuration(buffer);
    }
}

function getWavDuration(fileBuffer) {
    const wavData = wavDecoder.decode.sync(fileBuffer);
    const durationInSeconds = wavData.channelData[0].length / wavData.sampleRate;
    return durationInSeconds;
}

function getOggDuration(fileBuffer) {
    const oggData = oggParser.parse(fileBuffer);
    // Extract the "duration" field from the comments (if available).
    const durationInSeconds = oggData.comments.duration || 0;
    return durationInSeconds;
}

function getMp3Duration(fileBuffer) {
    return new Promise((resolve, reject) => {
        mp3Duration(fileBuffer, (err, duration) => {
            if (err) {
                reject(err);
            } else {
                resolve(duration);
            }
        });
    });
}

module.exports = getAudioDuration;