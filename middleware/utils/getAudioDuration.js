const wavDecoder = require('wav-decoder');
const nodeID3 = require('node-id3');
const OggParser = require('ogg-parser');
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
    const oggParser = new OggParser();

    let offset = 0;
    const chunkSize = 1024; // You can adjust the chunk size
    try {
        while (offset < fileBuffer.length) {
            const end = Math.min(offset + chunkSize, fileBuffer.length);
            const chunk = fileBuffer.slice(offset, end);

            // Process the data using the ogg-parser library
            oggParser.write(chunk);

            offset = end;
        }

        oggParser.end();


        return new Promise((resolve) => {

            oggParser.on('data', (tag) => {
                console.log('Tag Type:', tag.type);
                console.log('Tag Value:', tag.value);
            });

            oggParser.on('end', () => {
                console.log('Parsing complete');
                resolve();
            });
        });
    }
    catch (err) {
        console.log(err);
    }
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