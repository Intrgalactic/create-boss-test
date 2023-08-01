

const listVoices = async (client,gender,languageCode) => {
    const [result] = await client.listVoices({ languageCode });
    const voices = result.voices.filter(voice => voice.ssmlGender === gender);
    return voices;
}

module.exports = listVoices;