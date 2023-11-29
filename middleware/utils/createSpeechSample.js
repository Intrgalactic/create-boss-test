
async function createSpeech(voiceId, stability, clarity, textInput) {
    const text = textInput ? textInput : "This is a sample text generated with use of artificial intelligence";
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceStability = stability ? stability : 0.5;
    const voiceClarity = clarity ? clarity : 0.75;
    return await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: "POST",
        headers: {
            'Accept': 'audio/mpeg',
            "xi-api-key": `${apiKey}`,
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
                stability: voiceStability,
                similarity_boost: voiceClarity
            }
        })
    }).then(response => response.arrayBuffer()).then(async arrayBuffer => {
        const buffer = Buffer.from(arrayBuffer);
        return buffer;
    }).catch(err => {
        console.log(err);
        throw err;
    })
}

module.exports = createSpeech