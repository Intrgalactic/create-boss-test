import { useEffect, useRef, useState } from "react";
import { Picture } from "src/components/picture";
import fileImage from 'src/assets/images/file.png';
import webpFileImage from 'src/assets/images/file.webp';
import recordImage from 'src/assets/images/record.png';
import webpRecordImage from 'src/assets/images/record.webp';
import pauseImage from 'src/assets/images/pause.png';
import webpPauseImage from 'src/assets/images/pause.webp';
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

export function DashboardServiceOutput({ isFileAttached, setTextInput }) {
    const textAreaRef = useRef();
    const location = useLocation();
    const path = location.pathname;
    const listenButton = useRef();
    const [isListening, setIsListening] = useState();

    useEffect(() => {
        if (isFileAttached) {
            textAreaRef.current.value = "";
        }

        const socket = io("http://localhost:4000",{ transports: ["websocket"] });
        console.log(socket);
        socket.on("connect", async () => {
            await startListening(socket);
        });

        socket.on("transcript", (transcript) => {
            console.log(transcript);
        });
        return () => {
            socket.disconnect();
        }

    }, [isFileAttached]);


    async function getMicrophone() {
        const userMedia = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        return new MediaRecorder(userMedia);
    }

    async function openMicrophone(microphone, socket) {
        console.log(socket);
        await microphone.start(500);

        microphone.onstart = () => {
            setIsListening(true);
        };

        microphone.onstop = () => {
            setIsListening(false);
        };

        microphone.ondataavailable = (e) => {
            console.log("client: sent data to websocket");
            socket.emit("packet-sent", e.data);
        };
    }

    async function closeMicrophone(microphone) {
        microphone.stop();
    }

    async function startListening(socket) {
        
        let microphone;

        console.log("client: waiting to open microphone");
        console.log(socket);
        listenButton.current.addEventListener("click", async () => {
            if (!microphone) {
                microphone = await getMicrophone();
                await openMicrophone(microphone, socket);
            } else {
                await closeMicrophone(microphone);
                microphone = undefined;
            }
        });
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
                                <span onClick={startListening} className="record-button" ref={listenButton}><Picture images={[webpRecordImage, recordImage]} imgWidth="96px" imgHeight="96px" alt="record" /></span>
                                <p>Click the microphone to record live</p>
                                <p>Or attach a file</p></> :
                            <>
                                <span onClick={closeMicrophone}><Picture images={[webpPauseImage, pauseImage]} imgWidth="96px" imgHeight="96px" alt="record" /></span>
                                <p>Click the pause button to stop recording</p>
                            </>}
                    </div>

            }
        </>
    )
}