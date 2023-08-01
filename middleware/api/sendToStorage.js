const { Storage } = require('@google-cloud/storage');
const asyncHandler = require('express-async-handler');
const path = require('path');

const sendToStorage = async (filename) => {
    try {
        const googleCloudStorage = new Storage({
            keyFileName: path.join(__dirname, "../../config/google.json"),
            projectId: 'animated-alloy-236515'
        })
        const mainBucket = googleCloudStorage.bucket("create-boss");
        const file = mainBucket.file(filename);

        await file.save(path.join(__dirname,'../../output.mp3'));
  
    }
    catch (err) {
        return err;
    }
}

module.exports = sendToStorage;