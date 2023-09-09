import { SelectVoiceButtonsContainer } from "./select-voice-buttons-container";

export function SelectVoiceBox({voice,setVoice,usedVoice}) {
    return (
        <div className="text-to-speech-select-voice">
            <h3>{voice.name}</h3>
            <h4>{voice.age} {voice.accent} {voice.gender}</h4>
            <p> {voice.description}</p>
            <SelectVoiceButtonsContainer voiceId={voice.id} setVoice={setVoice} audioSrc={voice.audio} usedVoice={usedVoice}/>
        </div>
    )
}