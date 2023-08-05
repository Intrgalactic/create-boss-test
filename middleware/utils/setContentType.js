
function setContentType(audioEncoding) {
    switch (audioEncoding) {
        case "MP3": return "audio/mpeg";
            break;
        case "OGG": return "audio/ogg";
            break;
        case "WAV": return "audio/wav";
            break;
        default:
            return "audio/mpeg";
        case "TXT": return "text/plain";
            break;
        case "DOCX": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            break;
        case "DOC": return "application/msword";
            break;
        case "PDF": return "application/pdf";
            break;        
    }
}

module.exports = setContentType;