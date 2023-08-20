import { useEffect, useRef, useState } from "react";
import { Picture } from "src/components/picture";
import fileImage from 'src/assets/images/file.png';
import webpFileImage from 'src/assets/images/file.webp';
import recordImage from 'src/assets/images/record.png';
import webpRecordImage from 'src/assets/images/record.webp';
import pauseImage from 'src/assets/images/pause.png';
import webpPauseImage from 'src/assets/images/pause.webp';
import { useLocation } from "react-router-dom";

export function DashboardServiceOutput({ isFileAttached, setTextInput, setFile, textInput }) {
    const textAreaRef = useRef();
    const location = useLocation();
    const path = location.pathname;
    const listenButton = useRef();
    const [microphoneStream, setMicrophoneStream] = useState();
    var audioChunks = [];

    useEffect(() => {
        if (textAreaRef.current) {
            if (textInput === "") {
                textAreaRef.current.value = "";
            }
            else if (isFileAttached, !isFileAttached) {
                textAreaRef.current.value = "";
            }
        }
    }, [isFileAttached, textInput]);

    function enableMicrophone() {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((mediaStream) => {
            const mediaRecorder = new MediaRecorder(mediaStream);
            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const reader = new FileReader();
                reader.onload = () => {
                    const file = new File([audioBlob], "audio.wav", { type: "audio/wav" });
                    setFile(file);
                };
                reader.readAsArrayBuffer(audioBlob);
            };
            setMicrophoneStream(mediaRecorder);
            mediaRecorder.start();
        });
    }

    function disableMicrophone() {
        microphoneStream.stop();
        setMicrophoneStream();
    }
    console.log(isFileAttached);
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
                        {!microphoneStream ?
                            <>
                                <span onClick={enableMicrophone} className="record-button" ref={listenButton}><Picture images={[webpRecordImage, recordImage]} imgWidth="64px" imgHeight="64px" alt="record" /></span>
                                <p>Click the microphone to record live</p>
                                <p>Or attach a file</p></> :
                            <>
                                <span onClick={disableMicrophone} className="record-button"><Picture images={[webpPauseImage, pauseImage]} imgWidth="64px" imgHeight="64px" alt="record" /></span>
                                <p>Pause to get text</p>
                                <p>Click the pause button to stop recording</p>
                            </>}
                    </div>

            }
        </>
    )
}