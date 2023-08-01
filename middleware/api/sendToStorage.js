const { Storage } = require('@google-cloud/storage');
const asyncHandler = require('express-async-handler');
const { readFile } = require('fs');
const path = require('path');
const fs = require('fs');

const sendToStorage = async (filename, contentType) => {
    try {
        const googleCloudStorage = new Storage({
            keyFileName: path.join(__dirname, "../../config/google.json"),
            projectId: 'animated-alloy-236515'
        })
        const mainBucket = googleCloudStorage.bucket("create-boss");
        const file = mainBucket.file(filename);

        const stream = fs.createReadStream(filename);

        const options = {
            contentType
        }

        stream.pipe(file.createWriteStream(options));
      
    }
    catch (err) {
        return err;
    }
}

module.exports = sendToStorage;