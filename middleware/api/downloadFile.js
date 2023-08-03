const asyncHandler = require('express-async-handler');

const downloadFile = (googleCloudStorage) => {
    return asyncHandler(async (req, res) => {
        try {
            // Get the file from Google Cloud Storage
            const file = await googleCloudStorage.bucket('create-boss').file(req.params.filename);

            // Download the file to a local buffer
            const [fileBuffer] = await file.download();

            // Set the appropriate Content-Type header
            res.set('Content-Type', file.metadata.contentType);

            // Serve the file for download using res.download()
            file.createReadStream().pipe(res);

        } catch (err) {
            if (err.code === 404 && err.message.includes('No such object')) {
                setTimeout(() => {
                    downloadFile(googleCloudStorage);
                  }, 1000);
            } else {
                console.error('Error downloading the file:', err);
                res.status(500).send('Error downloading the file.');
            }
        }
    })
}

module.exports = downloadFile;