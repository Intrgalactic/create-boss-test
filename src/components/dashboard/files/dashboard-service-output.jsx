import { useEffect, useRef } from "react";
import { Picture } from "src/components/picture";
import fileImage from 'src/assets/images/file.png';
import webpFileImage from 'src/assets/images/file.webp';
import recordImage from 'src/assets/images/record.png';
import webpRecordImage from 'src/assets/images/record.webp';

import { useLocation } from "react-router-dom";
export function DashboardServiceOutput({ isFileAttached, setTextInput }) {
    const textAreaRef = useRef();
    const location = useLocation();
    const path = location.pathname;
    useEffect(() => {
        if (isFileAttached) {
            textAreaRef.current.value = "";
        }
    }, [isFileAttached]);
    
    return (
        <>
            {isFileAttached ? <div className="textarea-container"><textarea disabled ref={textAreaRef}>

            </textarea> <div className="dashboard__left-section-content-container-main-input-file-alert">
                    <Picture images={[webpFileImage, fileImage]} imgWidth="128px" imgHeight="128px" alt="file" />
                    <p>The File Got Attached</p>
                    <p>Refresh The Page To Input Manually</p>
                </div></div> : path !== "/dashboard/services/speech-to-text" ? <div className="textarea-container"><textarea ref={textAreaRef} onChange={(e) => { setTextInput(e.target.value) }} /></div> : 
                <div className="textarea-container">
                    <Picture images={[webpRecordImage, recordImage]} imgWidth="96px" imgHeight="96px" alt="record" />
                    <p>Click the microphone to record live</p>
                    <p>Or attach a file</p>
                </div>

            }
        </>
    )
}