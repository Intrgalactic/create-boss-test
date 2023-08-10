import { useEffect, useRef, useState } from "react";
import { VideoPreview } from "./video-preview";
import { VideoPreviewControl } from "./video-preview-control";
import { addFileListeners, removeFileListeners } from "src/utils/utilities";
export function VideoPreviewContainer({ videoFile, setVideoFile }) {
    const fileInputRef = useRef();
    const fileRef = useRef();
    const [labelText,setLabelText] = useState("Choose Image");
    useEffect(() => {
        addFileListeners(fileRef);
        if (fileRef.current && videoFile) {
            setLabelText("Attached");
        }

        return () => {
            if (fileRef.current) {
                removeFileListeners(fileRef);
            }
        }
    },[videoFile,fileRef.current])

    return (
        <div className="video-preview__container">
            <VideoPreviewControl>
                <label for="video-file" ref={fileRef} onClick={() => {fileInputRef.current.click()}}>{labelText}</label>
                <input type="file" accept="video/*" ref={fileInputRef} onChange={(e) => { setVideoFile(e.target.files[0]) }} name="video-file" id="video-file"/>
            </VideoPreviewControl>
            <VideoPreview />
            <VideoPreviewControl>
                <button>Modify</button>
            </VideoPreviewControl>
        </div>
    )
}