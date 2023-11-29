
function getCodeForLanguage(language) {
    switch (language) {
        case "Danish":
            return "da";
        case "English":
            return "en";
        case "Spanish":
            return "es-419";
        case "French":
            return "fr-CA";
        case "Hindi":
            return "hi";
        case "Indonesian":
            return "id";
        case "Italian":
            return "it";
        case "Japanese":
            return "ja";
        case "Dutch":
            return "nl";
        case "Polish":
            return "pl";
        case "Portuguese":
            return "pt-BR";
        case "Russian":
            return "ru";
        case "Swedish":
            return "sv";
        case "Turkish":
            return "tr";
        case "Ukrainian":
            return "uk";
        case "Chinese":
            return "zh-CN";
        default:
            return null; // Handle the case where optgroup is not found
    }
}

module.exports = getCodeForLanguage;