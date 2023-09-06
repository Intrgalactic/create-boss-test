import { useEffect, useRef, useState} from "react";
import { handleFileDrop, handleFileInputDrag, removeDragEffect } from "src/utils/utilities";
export function FileInputContainer({ file, setFile, textInput,acceptedFormats,setErrorAtDownload }) {
    const fileRef = useRef();
    const fileInputRef = useRef();
    useEffect(() => {
        if (file) {
            if (!fileRef.current.classList.contains("attached-file")) {
                fileRef.current.classList.add("attached-file")
            }
        }
    },[file])
    function addClassList(remove,add) {
        !remove ? fileRef.current.classList.add("drop-file") : fileRef.current.classList.remove("drop-file");
        add &&  fileRef.current.classList.add("attached-file") 
        console.log(fileRef.current.classList);
    }
    return (
        <div className='file-input-container' onClick={() => { fileInputRef.current.click() }} ref={fileRef} onDrop={(e) => {handleFileDrop(e,setFile,setErrorAtDownload,addClassList)}} onDragEnd={(e) => {() => {removeDragEffect(false,addClassList)}}}onDragOver={(e) => {handleFileInputDrag(e,false,addClassList)}} onDragLeave={() => {removeDragEffect(false,addClassList   )}} >
           <input type="file" onChange={(e) => {setFile(e.target.files[0]) }} accept={acceptedFormats} ref={fileInputRef} /> 
        </div>
    )
}