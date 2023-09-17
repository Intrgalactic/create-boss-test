import { useEffect, useRef} from "react";
import { addClassList, handleFileDrop, handleFileInputDrag, removeDragEffect } from "src/utils/utilities";
export function FileInputContainer({ file, setFile,acceptedFormats,setErrorAtDownload }) {
    const fileRef = useRef();
    const fileInputRef = useRef();
    useEffect(() => {
        if (file) {
            if (!fileRef.current.classList.contains("attached-file")) {
                fileRef.current.classList.add("attached-file")
            }
        }
        else {
            fileRef.current.classList.remove("attached-file")
        }
    },[file])

    return (
        <div className='file-input-container' onClick={() => { fileInputRef.current.click() }} ref={fileRef} onDrop={(e) => {handleFileDrop(e,setFile,setErrorAtDownload,addClassList,fileInputRef,"attached-file","drop-file" )}} onDragEnd={(e) => {() => {removeDragEffect(false,addClassList,fileInputRef,"attached-file","drop-file" )}}}onDragOver={(e) => {handleFileInputDrag(e,false,addClassList,fileInputRef,"attached-file","drop-file" )}} onDragLeave={() => {removeDragEffect(false,addClassList,fileInputRef,"attached-file","drop-file" )}} >
           <input type="file" onChange={(e) => {setFile(e.target.files[0]);fileInputRef.current.value = null }} accept={acceptedFormats} ref={fileInputRef} /> 
        </div>
    )
}