import { useEffect, useRef, useState } from "react";
import { VideoPreview } from "./video-preview";
import { VideoPreviewControl } from "./video-preview-control";
import { handleFileDrop, handleFileInputDrag, removeDragEffect } from "src/utils/utilities";
export function VideoPreviewContainer({ videoFile, setVideoFile, sendToGetSubtitles,filePath,downloadFile,setFilePath }) {
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
    return (
        <div className="video-preview__container">
            <VideoPreviewControl>
                <label ref={fileRef} onClick={() => { fileInputRef.current.click() }} onDrop={(e) => { handleFileDrop(e, setVideoFile); }} onDragEnd={(e) => { () => { removeDragEffect(setLabelText) } }} onDragOver={(e) => { handleFileInputDrag(e, setLabelText) }} onDragLeave={() => { removeDragEffect(setLabelText) }}>{labelText}
                <input type="file" accept="video/*" ref={fileInputRef} onChange={(e) => { setVideoFile(e.target.files[0]);setFilePath() }} /></label>
            </VideoPreviewControl>
            <VideoPreview videoFile={videoFile} />
            <VideoPreviewControl>
                <button onClick={() => {!filePath ? sendToGetSubtitles() : downloadFile()}} ref={modifyRef} >{filePath ? "Download" : "Modify"}</button>
            </VideoPreviewControl>
            <VideoPreviewControl>
                <button onClick={() => {setVideoFile();setFilePath();}} ref={modifyRef} >Reset</button>
            </VideoPreviewControl>
        </div>
    )
}