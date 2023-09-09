import { useRef } from "react";
import { useState } from "react"
import { Picture } from "../picture";
import audioImg from 'src/assets/images/audio.png';
import webpAudioImg from 'src/assets/images/audio.png';

export function SelectVoiceButtonsContainer({audioSrc,voiceId,setVoice,usedVoice}) {
    const [isPlaying,setIsPlaying] = useState(false);
    const audioRef = useRef();
    function playAudio() {
        if (isPlaying) {
            audioRef.current.pause();
        }
        else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
    return (
        <div className="select-voice__buttons-container">
            <button onClick={playAudio} className="audio-btn">
                <audio ref={audioRef} >
                    <source src={audioSrc} type="audio/mpeg"/>
                </audio>
                <p>Sample</p> <Picture images={[audioImg,webpAudioImg]} imgWidth="52px" imgHeight="44px" alt="audio"/>
            </button>
            <button className="voice-use-btn" onClick={() => {setVoice(voiceId)}}>
                {usedVoice === voiceId ? "Using" : "Use"}
            </button>
        </div>
    )
}