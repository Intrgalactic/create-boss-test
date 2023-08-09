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
    const listenButton = useRef();
    const [isListening, setIsListening] = useState();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (isFileAttached) {
            textAreaRef.current.value = "";
        }
        const newSocket = new WebSocket(`${import.meta.env.VITE_SERVER_WEB_SOCKET}`);

        newSocket.onopen = () => {
            console.log("WebSocket connection opened");
            setSocket(newSocket);
        };

        newSocket.onmessage = (event) => {
            console.log("Received message:", event.data);
        };

        newSocket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            if (socket) {
                socket.close();
            }
        };

    }, [isFileAttached]);


    async function getMicrophone() {
        const userMedia = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        return new MediaRecorder(userMedia);
    }

    async function openMicrophone(socket) {
        try {
            const userMedia = await getMicrophone();
            const microphone = new MediaRecorder(userMedia);

            microphone.onstart = () => {
                setIsListening(true);
            };

            microphone.onstop = () => {
                setIsListening(false);
            };

            microphone.ondataavailable = (e) => {
                if (socket.readyState === WebSocket.OPEN) {
                    console.log("client: sent data to websocket");
                    socket.send(e.data);
                }
            };

            await microphone.start(500);

            return microphone;
        } catch (error) {
            console.error("Error opening microphone:", error);
            return null;
        }
    }

    function closeMicrophone(microphone) {
        if (microphone) {
            microphone.stop();
        }
    }

    async function startListening(socket) {
        let microphone = null;

        listenButton.current.addEventListener("click", async () => {
            if (!microphone) {
                microphone = await openMicrophone(socket);
            } else {
                closeMicrophone(microphone);
                microphone = null;
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