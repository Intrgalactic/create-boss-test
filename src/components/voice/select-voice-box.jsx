import { Suspense, lazy } from 'react';
import Loader from 'src/layouts/loader';
const SelectVoiceButtonsContainer = lazy(() => import('./select-voice-buttons-container').then(module => {
    return {default: module.SelectVoiceButtonsContainer}
}));

export function SelectVoiceBox({ voice, setVoice, usedVoice }) {
    return (
        <Suspense fallback={<Loader />}>
            <div className="text-to-speech-select-voice">
                <h3>{voice.name}</h3>
                <h4>{voice.age} {voice.accent} {voice.gender}</h4>
                <p> {voice.description}</p>
                <SelectVoiceButtonsContainer voiceId={voice.id} setVoice={setVoice} audioSrc={voice.audio} usedVoice={usedVoice} />
            </div>
        </Suspense>
    )
}