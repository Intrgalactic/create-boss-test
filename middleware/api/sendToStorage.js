const path = require('path');
const PDFDocument = require('pdfkit');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const sendToStorage = async (filename, data, contentType, storage) => {
    try {
        const mainBucket = storage.bucket("create-boss");
        const file = mainBucket.file(filename);
        var contentEncoding;

        var metadata = {
            contentType: contentType
        }

        if (contentType === "text/plain" || contentType === "application/pdf" || contentType === "application/msword" || contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
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
            case "application/msword": saveDOCXDOC(filename, data, stream);
                break;
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": saveDOCXDOC(filename, data, stream);
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
        throw err;
    }
}

module.exports = sendToStorage;

function savePDF(stream, data) {

    const doc = new PDFDocument();
    const fontPath = path.join(__dirname, '../../misc/fonts/NotoSans-Regular.ttf');
    doc.font(fontPath);
    doc.fontSize(16).text(data, 100, 100);

    doc.pipe(stream);
    doc.end();


}

async function saveDOCXDOC(filename, data, stream) {
    const docxBuffer = await generateDocxDocContent(filename, data);
    console.log(docxBuffer);
    stream.write(docxBuffer);
    stream.end();
}

function generateDocxDocContent(filename, data) {
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
                    new Paragraph({text: "",size: 16}),
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