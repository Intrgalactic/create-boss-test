import { useEffect, useRef } from "react";
import { Picture } from "src/components/picture";
import fileImage from 'src/assets/images/file.png';
import webpFileImage from 'src/assets/images/file.webp';

export function DashboardServiceOutput({ isFileAttached, setTextInput }) {
    const textAreaRef = useRef();
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
                </div></div> : <textarea ref={textAreaRef} onChange={(e) => { setTextInput(e.target.value) }}>

            </textarea>}
        </>
    )
}