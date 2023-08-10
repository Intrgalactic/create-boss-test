import { useEffect, useRef} from "react";
import { addFileListeners, removeFileListeners } from "src/utils/utilities";
export function FileInputContainer({ file, setFile, textInput,acceptedFormats,setErrorAtDownload }) {
    const fileRef = useRef();
    const fileInputRef = useRef();
    useEffect(() => {
        addFileListeners(fileRef);
        if (fileRef.current && file) {
            fileRef.current.classList.add("attached-file");
        }
        return () => {
            if (fileRef.current) {
                removeFileListeners(fileRef);
            }
        }
    }, [file, setFile]);

    return (
        <div className='file-input-container' onClick={() => { fileInputRef.current.click() }} ref={fileRef} >
           <input type="file" onChange={(e) => {setFile(e.target.files[0]) }} accept={acceptedFormats} ref={fileInputRef} /> 
        </div>
    )
}