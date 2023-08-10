const path = require('path');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const { spawn } = require('child_process');
const pathToFfmpeg = require('ffmpeg-static');

const sendToStorage = async (filename, data, contentType, storage) => {
    try {
        const mainBucket = storage.bucket("create-boss");
        const file = mainBucket.file(filename);
        
        var contentEncoding;
        var metadata = {
            contentType: contentType
        }

        if (contentType === "text/plain" || contentType === "application/pdf" || contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            contentEncoding = "utf-8";
            metadata.contentEncoding = contentEncoding;
        }

        const stream = file.createWriteStream({
            metadata: metadata,
            resumable: false,
            overwrite: true
        });

        switch (contentType) {
            case "application/pdf": savePDF(stream, data);
                break;
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": saveDOCX(filename, data, stream);
                break;
            case "audio/mpeg": saveMP3(filename, data, stream);
                break;
            default: await stream.write(data); stream.end();
                break;
        }

        stream.on('error', (err) => {
            console.error('Error writing audio to storage:', err);
            throw err;
        });

        stream.on('finish', () => {
            console.log('Audio data has been written to Google Cloud Storage.');
        });

        return true;

    }
    catch (err) {
        throw new Error(err);
    }
}

module.exports = sendToStorage;

function savePDF(stream, data) {
    try {
        const doc = new PDFDocument();
        const fontPath = path.join(__dirname, '../../misc/fonts/NotoSans-Regular.ttf');
        doc.font(fontPath);
        doc.fontSize(8).text(data, 100, 100);

        doc.pipe(stream);
        doc.end();
    }
    catch (err) {
        throw Error(err);
    }
}

async function saveDOCX(filename, data, stream) {
    try {
        const docxBuffer = await generateDocxContent(filename, data);
        stream.write(docxBuffer);
        stream.end();
    }
    catch (err) {
        throw Error(err);
    }
}

function generateDocxContent(filename, data) {
    try {
        const index = filename.lastIndexOf('.');
        const title = filename.slice(0, index);

        const doc = new Document({
            sections: [],
        });

        doc.addSection({
            properties: {},
            children: [
                new Paragraph({

                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: title, bold: true, size: 24 }),
                            ],
                        }),
                        new Paragraph({ text: "", size: 16 }),
                        new Paragraph({
                            children: [

                                new TextRun({ text: data, size: 16 })
                            ]
                        }),
                    ],
                }),
            ],
        });
        doc.creator = 'Create-Boss'; // Set the creator of the document
        doc.title = title; // 
        const docxBuffer = Packer.toBuffer(doc);
        return docxBuffer;
    }
    catch (err) {
        throw Error(err);
    }
}
async function saveMP3(filename, audioData, stream) {
    try {
        const audioBuffer = await encodeMp3(filename, audioData);
        await stream.write(audioBuffer);
        stream.end();
    }
    catch (err) {
        throw Error(err);
    }
}
function encodeMp3(filename, inputBuffer) {
    const outputFormat = filename.slice(filename.lastIndexOf(".") + 1);
    return new Promise((resolve, reject) => {
        const convert = spawn(pathToFfmpeg, [
            '-i', 'pipe:0',       // Read input from stdin
            '-ar', '44100',
            '-ac', '2',
            '-f', outputFormat,  // Output format
            '-b:a', '320k',
            'pipe:1',            // Write output to stdout
        ]);

        let outputBuffer = Buffer.alloc(0);

        convert.stdout.on('data', (data) => {
            outputBuffer = Buffer.concat([outputBuffer, data]);
        });

        convert.on('exit', (code) => {
            if (code === 0) {
                resolve(outputBuffer);
            } else {
                reject(new Error('Conversion failed.'));
            }
        });

        // Handle errors
        convert.on('error', (err) => {
            reject(err);
        });

        // Pipe the input buffer to the ffmpeg process
        convert.stdin.write(inputBuffer);
        convert.stdin.end();
    });
}

