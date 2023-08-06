

const listVoices = async (client, gender, languageCode) => {
    try {
        const [result] = await client.listVoices({ languageCode });
        const voices = result.voices.filter(voice => voice.ssmlGender === gender);
        return voices;
    }
    catch(err) {
        throw err;
    }
}
module.exports = listVoices;