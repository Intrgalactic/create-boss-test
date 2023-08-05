
const mammoth = require('mammoth');
const pdfParser = require('pdf-parse');
const Docxtemplater = require('docxtemplater');
const unzipper = require('unzipper');
const xmljs = require('xml-js');
const { spawn } = require('child_process');
const { Readable } = require('readable-stream');

const fs = require('fs');

const parseFile = async (fileBuffer, fileType) => {
    switch (fileType) {
        case "text/plain": return fileBuffer.toString('utf-8');
            break;
        case "application/pdf": return await parsePdf(fileBuffer);
            break;
        case "application/msword": return await parseDoc(fileBuffer);
            break;
        case "application/vnd.oasis.opendocument.text": return await parseOdt(fileBuffer);
            break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": return await parseDocx(fileBuffer);
            break;
        default: return fileBuffer.toString('utf-8');
    }
}


const parsePdf = async (fileBuffer) => {
    try {
        const data = await pdfParser(fileBuffer);
        return data.text;
    } catch (err) {
        console.error('Error parsing PDF:', err);
        return null;
    }
}

async function parseDocx(fileBuffer) {
    try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        console.log(result);
        return result.value;
    } catch (err) {
        console.error('Error parsing DOCX:', err);
        return null;
    }
}

async function parseOdt(fileBuffer) {
    try {
        const zip = await unzipper.Open.buffer(fileBuffer);

        // Find the content.xml file within the ODT archive
        const contentXmlFile = zip.files.find((file) => file.path === 'content.xml');
        if (!contentXmlFile) {
            throw new Error('No content.xml found in the ODT file.');
        }

        // Extract the content from the content.xml file
        const contentXml = await contentXmlFile.buffer();

        // Convert the XML content to JSON
        const contentJson = xmljs.xml2json(contentXml, { compact: true, spaces: 4 });
        // Extract the plain text from the JSON representation
        const plainText = getContentFromJson(contentJson);
        return plainText;
    } catch (err) {
        console.error('Error parsing ODT file:', err);
        throw err;
    }
}

function getContentFromJson(contentJson) {
    // The structure of the ODT content varies based on the file content.
    // You may need to inspect the JSON structure to find the correct path for the text content.
    // This example assumes a specific path for demonstration purposes.

    // Replace the following path with the actual path to the text content in your ODT file.
    var textContent = "";
    const textData = JSON.parse(contentJson);
    console.log(textData['office:document-content']['office:body']['office:text']['text:p'][0]["text:span"]);
    for (let i = 0; i < textData['office:document-content']['office:body']['office:text']['text:p'].length; i++) {
        if (typeof (textData['office:document-content']['office:body']['office:text']['text:p'][i]['text:span']) === "object" && textData['office:document-content']['office:body']['office:text']['text:p'][i]['text:span']._text) {
            textContent += `${textData['office:document-content']['office:body']['office:text']['text:p'][i]['text:span']._text}\n`;
        }
        if (Array.isArray(textData['office:document-content']['office:body']['office:text']['text:p'][i]['text:span'])) {
            textContent += `${textData['office:document-content']['office:body']['office:text']['text:p'][i]['text:span'][i]._text}\n`;
        }
    }
    console.log(textContent);
    return textContent;
}
async function parseDoc(docBuffer) {
    const docx = new Docxtemplater();
    docx.loadZip(docBuffer);

    const docText = docx.getFullText();
    return docText;
}

module.exports = parseFile;