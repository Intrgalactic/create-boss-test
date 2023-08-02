import { useEffect, useRef, useState } from "react";

export function FileInputContainer({ file, setFile, textInput }) {
    const fileRef = useRef();
    const fileInputRef = useRef();
    useEffect(() => {
        fileRef.current.addEventListener('dragover', handleFileInputDrag);
        fileRef.current.addEventListener('dragleave', removeDragEffect)
        fileRef.current.addEventListener('dragend', removeDragEffect);
        fileRef.current.addEventListener('drop',handleFileDrop);
        if (fileRef.current && file) {
            fileRef.current.classList.add("attached-file");
        }
        return () => {
            fileRef.current.removeEventListener("dragover",handleFileInputDrag);
            fileRef.current.removeEventListener('dragleave', removeDragEffect)
            fileRef.current.removeEventListener('dragend', removeDragEffect);
            fileRef.current.removeEventListener('drop',handleFileDrop);
        }
    }, [file, setFile]);

    function removeDragEffect() {
        fileRef.current.classList.remove("input-dragged");
    }
    function handleFileInputDrag(event) {
        event.stopPropagation();
        event.preventDefault();
        fileRef.current.classList.add('input-dragged');
    }
    function handleFileDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        const fileList = event.dataTransfer.files;
        if (fileList.length > 0) {
            setFile(fileList[0]);
        }
    }
    return (
        <div className='file-input-container' onClick={() => { document.querySelector("input[type=file]").click() }} ref={fileRef} >
            {textInput === "" ? <input type="file" onChange={(e) => { setFile(e.target.files[0]) }} accept="text/plain" ref={fileInputRef} /> : <input type="file" disabled />}
        </div>
    )
}