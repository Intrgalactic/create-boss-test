import { useEffect, useRef, useState } from "react";
import { Picture } from "src/components/picture";
import fileImage from 'src/assets/images/file.png';
import webpFileImage from 'src/assets/images/file.webp';
import recordImage from 'src/assets/images/record.png';
import webpRecordImage from 'src/assets/images/record.webp';
import pauseImage from 'src/assets/images/pause.png';
import webpPauseImage from 'src/assets/images/pause.webp';
import { useLocation } from "react-router-dom";
export function DashboardServiceOutput({ isFileAttached, setTextInput }) {
    const textAreaRef = useRef();
    const location = useLocation();
    const path = location.pathname;
    const [isListening, setIsListening] = useState();
    const [recorder, setRecorder] = useState();
    const [audioStream, setAudioStream] = useState();
    useEffect(() => {
        if (isFileAttached) {
            textAreaRef.current.value = "";
        }
    }, [isFileAttached]);
    let audioChunks = [];

    const SILENCE_THRESHOLD = -20; // Adjust this value based on your needs
    let silenceDetected = false;
    let lastVolume = 0;
    async function getUserMedia() {
        try {
            const mediaAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(mediaAudioStream);
            setRecorder(mediaRecorder);
            setAudioStream(mediaAudioStream);
            silenceDetected = false;
            lastVolume = 0;

            mediaRecorder.start();
            setIsListening(true);
            checkSilence();
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }
    function checkSilence() {
        if (recorder) {
            const volume = recorder.volume * 100; // Adjust volume level based on your needs
            if (volume <= SILENCE_THRESHOLD) {
                if (!silenceDetected) {
                    silenceDetected = true;
                    lastVolume = volume;
                    disableRecording();
                } else if (Math.abs(volume - lastVolume) <= 2) { // Adjust this value based on your needs
                    recorder.stop();
                    audioStream.getTracks().forEach(track => track.stop());
                    setAudioStream(false);
                    recorder.exportWAV(sendToSpeechToText);
                    return;
                }
            } else {
                silenceDetected = false;
                lastVolume = volume;
            }

            requestAnimationFrame(checkSilence);
        }
    }
    function disableRecording() {
        if (recorder) {
          recorder.stop();
          setRecorder({
            ...recorder,
            ondataavailable : null
          })
          audioStream.getTracks().forEach(track => track.stop());
          setAudioStream(null);
          setIsListening(false);
      
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      
          sendToSpeechToText(audioBlob);
        }
      }
    function sendToSpeechToText(blob) {
        console.log(blob);
    }
    return (
        <>
            {isFileAttached ?
                <div className="textarea-container">
                    <textarea disabled ref={textAreaRef}>
                    </textarea>
                    <div className="dashboard__left-section-content-container-main-input-file-alert">
                        <Picture images={[webpFileImage, fileImage]} imgWidth="128px" imgHeight="128px" alt="file" />
                        <p>The File Got Attached</p>
                        <p>Refresh The Page To Input Manually</p>
                    </div>
                </div> : path !== "/dashboard/services/speech-to-text" ?
                    <div className="textarea-container">
                        <textarea ref={textAreaRef} onChange={(e) => { setTextInput(e.target.value) }} />
                    </div> :
                    !isFileAttached &&
                    <div className="textarea-container">
                        {!isListening ?
                            <>
                                <span onClick={getUserMedia} className="record-button"><Picture images={[webpRecordImage, recordImage]} imgWidth="96px" imgHeight="96px" alt="record" /></span>
                                <p>Click the microphone to record live</p>
                                <p>Or attach a file</p></> :
                            <>
                                <span onClick={disableRecording}><Picture images={[webpPauseImage, pauseImage]} imgWidth="96px" imgHeight="96px" alt="record" /></span>
                                <p>Click the pause button to stop recording</p>
                            </>}
                    </div>

            }
        </>
    )
}