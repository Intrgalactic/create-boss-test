
const sendToStorage = async (filename, audioData, contentType,storage) => {
    try {
  
        const mainBucket = storage.bucket("create-boss");
        const file = mainBucket.file(filename);

        const stream = file.createWriteStream({
            metadata: {
                contentType: contentType
            },
            resumable: false,
            overwrite: true
        });

        stream.on('error', (err) => {
            console.error('Error writing audio to storage:', err);
        });

        stream.on('finish', () => {
            console.log('Audio data has been written to Google Cloud Storage.');
        });

        stream.write(audioData);
        stream.end();

        return true;

    }
    catch (err) {
        return err;
    }
}

module.exports = sendToStorage;