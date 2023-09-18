import { forwardRef } from 'react';
import { useRef } from 'react';
import fileAttachImage from 'src/assets/images/file-attachment.png';
import webpFileattachImage from 'src/assets/images/file-attachment.webp';
import { Picture } from 'src/components/picture';
import { addClassList, handleFileDrop, handleFileInputDrag, removeDragEffect } from 'src/utils/utilities';

export const VoiceCloningFilesInput = forwardRef((props,ref) => {
    const fileInputRef = useRef();
    const fileRef = useRef();
    return (
        <div className="voice-cloning-voice-input__container">
            <label for="cloned-voice-name" className='cloned-voice-name-label'>
                <p>Name</p>
                <input type="name" className="cloned-voice-name cloned-voice-input" name="cloned-voice-name" placeholder='Name' onChange={(e) => {ref.current.voiceName = e.target.value}}></input>
            </label>
            <div className="voice-cloning-files-input__container" ref={fileRef} onClick={() => { fileInputRef.current.click() }} onDrop={async (e) => { handleFileDrop(e, props.setFile, props.setErrorAtDownload, addClassList, fileRef, "voice-clone-attach-file", "voice-clone-drop-file") }} onDragEnd={(e) => { () => { removeDragEffect(false, addClassList, fileRef, "voice-clone-attach-file", "voice-clone-drop-file") } }} onDragOver={(e) => { handleFileInputDrag(e, false, addClassList, fileRef, "voice-clone-attach-file", "voice-clone-drop-file") }} onDragLeave={() => { fileRef.current.classList.contains("voice-clone-drop-file") && removeDragEffect(false, addClassList, fileRef, "voice-clone-attach-file", "voice-clone-drop-file") }}>
                <div className="voice-cloning-childs">
                    <Picture images={[fileAttachImage, webpFileattachImage]} imgWidth="64px" imgHeight="64px" alt="file attach" />
                    <p>Click or drag and drop to upload a file</p>
                    <p>Each file cannot exceed 10MB in size</p>
                    <input type="file" ref={fileInputRef} className="voice-clone-file-input" onChange={(e) => { e.target.files[0].size > 1048576 * 10 ? props.setErrorAtDownload("The fill is too big") : props.setFile(e.target.files[0]); fileInputRef.current.value = null }} accept='video/*,audio/*' />
                </div>
            </div>
            <label for="cloned-voice-description" className="cloned-voice-description-label">
                <p>Description of the voice</p>
                <textarea className="cloned-voice-description cloned-voice-input" onChange={(e) => {ref.current.voiceDescription = e.target.value}} placeholder='How would you describe the voice? e.g. &quot;An old American male voice with a slight hoarseness in his throat. Perfect for news.&quot;'></textarea>
            </label>
            <button className="submit-voice-btn" onClick={props.submitToClone}>Clone</button>
        </div>
    )
})