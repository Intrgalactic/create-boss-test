import { useEffect, useRef, useState } from "react";
import { VideoPreview } from "./video-preview";
import { VideoPreviewControl } from "./video-preview-control";
import { handleFileDrop, handleFileInputDrag, removeDragEffect } from "src/utils/utilities";
export function VideoPreviewContainer({ videoFile, setVideoFile, sendToGetSubtitles,filePath,downloadFile,setFilePath,resetSettings,setErrorAtDownload }) {
    const fileInputRef = useRef();
    const fileRef = useRef();
    const modifyRef = useRef();
    const [labelText, setLabelText] = useState("Choose Video");
    useEffect(() => {
        if (fileRef.current && videoFile) {
            setLabelText("Attached");
        }
        else {
            setLabelText("Choose Video");
        }
    }, [videoFile, fileRef.current])
    function resetVideoSettings() {
        setVideoFile();
        setFilePath();
        resetSettings();
    }
    console.log(labelText);
    return (
        <div className="video-preview__container">
            <VideoPreviewControl>
                <label ref={fileRef} onDrop={(e) => { handleFileDrop(e, setVideoFile,setErrorAtDownload,setLabelText);setFilePath() }} onDragEnd={(e) => { () => { removeDragEffect(setLabelText) } }} onDragOver={(e) => { handleFileInputDrag(e, setLabelText) }} onDragLeave={() => { removeDragEffect(setLabelText) }}>{labelText}
                <input type="file" accept="video/*" ref={fileInputRef} onChange={(e) => { setVideoFile(e.target.files[0]);setFilePath();fileInputRef.current.value = null}}/></label>
            </VideoPreviewControl>
            <VideoPreview videoFile={videoFile}/>
            <VideoPreviewControl>
                <button onClick={resetVideoSettings} ref={modifyRef} >Reset</button>
            </VideoPreviewControl>
            <VideoPreviewControl>
                <button onClick={() => {!filePath ? sendToGetSubtitles() : downloadFile()}} ref={modifyRef} >{filePath ? "Download" : "Modify"}</button>
            </VideoPreviewControl>
        </div>
    )
}