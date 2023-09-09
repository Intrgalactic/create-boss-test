
const mammoth = require('mammoth');
const pdfParser = require('pdf-parse');
const Docxtemplater = require('docxtemplater');
const unzipper = require('unzipper');
const xmljs = require('xml-js');

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
        throw err;
    }
}

async function parseDocx(fileBuffer) {
    try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value;
    } catch (err) {
        console.error('Error parsing DOCX:', err);
        throw err;
    }
}

async function parseOdt(fileBuffer) {
    try {
        const zip = await unzipper.Open.buffer(fileBuffer);

        const contentXmlFile = zip.files.find((file) => file.path === 'content.xml');
        if (!contentXmlFile) {
            throw new Error('No content.xml found in the ODT file.');
        }

        const contentXml = await contentXmlFile.buffer();

        const contentJson = xmljs.xml2json(contentXml, { compact: true, spaces: 4 });
        const plainText = getContentFromJson(contentJson);
        return plainText;
    } catch (err) {
        console.error('Error parsing ODT file:', err);
        throw err;
    }
}

function getContentFromJson(contentJson) {
    var textContent = "";
    const textData = JSON.parse(contentJson);
    console.log(textData['office:document-content']['office:body']['office:text']['text:p'][0]["text:span"]);
    for (let i = 0; i < textData['office:document-content']['office:body']['office:text']['text:p'].length - 1; i++) {
        if (typeof (textData['office:document-content']['office:body']['office:text']['text:p'][i]['text:span']) === "object" && textData['office:document-content']['office:body']['office:text']['text:p'][i]['text:span']._text) {
            textContent += `${textData['office:document-content']['office:body']['office:text']['text:p'][i]['text:span']._text}\n`;
        }
        if (Array.isArray(textData['office:document-content']['office:body']['office:text']['text:p'][i]['text:span'])) {
            textContent += `${textData['office:document-content']['office:body']['office:text']['text:p'][i]['text:span'][i]._text}\n`;
        }
       
    }
    console.log(textData);
    return textContent;
}
async function parseDoc(docBuffer) {
    try {
    const docx = new Docxtemplater();
    docx.loadZip(docBuffer);

    const docText = docx.getFullText();
    return docText;
    }
    catch(err) {
        throw err;
    }
}

module.exports = parseFile;