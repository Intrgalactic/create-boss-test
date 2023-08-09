
const deleteFile = (storage) => {
    return (req,res) => {
        try {
            const filename = req.params.filename;
            storage.bucket('create-boss').file(filename).delete();
            res.sendStatus(200);
        }
        catch (err) {
            res.sendStatus(400);
        }
    }
}

module.exports = deleteFile;