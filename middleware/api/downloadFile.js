const asyncHandler = require('express-async-handler');

const MAX_RETRY_ATTEMPTS = 5;
const RETRY_INTERVAL = 2000; // 2 seconds

const downloadFile = (googleCloudStorage) => {
    return asyncHandler(async (req, res) => {
        let retryAttempts = 0;

        while (retryAttempts < MAX_RETRY_ATTEMPTS) {
            try {
                const file = await googleCloudStorage.bucket('create-boss').file(req.params.filename);
                const [fileBuffer] = await file.download();

                res.set('Content-Type', file.metadata.contentType);

                file.createReadStream().pipe(res);

                return;

            } catch (err) {
                if (err.code === 404 && err.message.includes('No such object')) {
                    retryAttempts++;
                    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
                } else {
                    console.error('Error downloading the file:', err);
                    res.status(500).send('Error downloading the file.');
                    return; // Exit the loop on other errors
                }
            }
        }
        console.error('File not found after multiple attempts.');
        res.status(404).send('File not found.');
    });
};

module.exports = downloadFile;