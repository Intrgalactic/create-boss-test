import { useEffect, useRef, useState } from "react";
import { VideoPreview } from "./video-preview";
import { VideoPreviewControl } from "./video-preview-control";
import { handleFileDrop, handleFileInputDrag, removeDragEffect } from "src/utils/utilities";
export function VideoPreviewContainer({ videoFile, setVideoFile, sendToGetSubtitles }) {
    const fileInputRef = useRef();
    const fileRef = useRef();
    const modifyRef = useRef();
    const [labelText, setLabelText] = useState("Choose Video");
    useEffect(() => {
        if (fileRef.current && videoFile) {
            setLabelText("Attached");
        }
    }, [videoFile, fileRef.current])
    return (
        <div className="video-preview__container">
            <VideoPreviewControl>
                <label ref={fileRef} onClick={() => { fileInputRef.current.click() }} onDrop={(e) => { handleFileDrop(e, setVideoFile) }} onDragEnd={(e) => { () => { removeDragEffect(setLabelText) } }} onDragOver={(e) => { handleFileInputDrag(e, setLabelText) }} onDragLeave={() => { removeDragEffect(setLabelText) }}>{labelText}</label>
                <input type="file" accept="video/*" ref={fileInputRef} onChange={(e) => { setVideoFile(e.target.files[0]) }} />
            </VideoPreviewControl>
            <VideoPreview videoFile={videoFile} />
            <VideoPreviewControl>
                <button onClick={sendToGetSubtitles} ref={modifyRef} >Modify</button>
            </VideoPreviewControl>
        </div>
    )
}