
export function SelectVoiceBox({heading,preHeading,voiceDescription}) {
    return (
        <div className="text-to-speech-select-voice">
            <h3>{heading}</h3>
            <h4>{preHeading}</h4>
            <p>{voiceDescription}</p>
        </div>
    )
}