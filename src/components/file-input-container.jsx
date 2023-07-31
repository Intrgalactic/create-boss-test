import { useEffect, useRef, useState } from "react";

export function FileInputContainer({file,setFile,textInput}) {
    const fileRef = useRef();
    useEffect(() => {
        if (fileRef.current && file) {
            fileRef.current.classList.add("attached-file");
        }
    },[file]);
    return (
        <div className='file-input-container' onClick={() => { document.querySelector("input[type=file]").click() }} ref={fileRef} >
            {textInput === "" ? <input type="file" onChange={(e) => {setFile(e.target.files[0].name)}} accept="text/plain"/> : <input type="file" disabled/>}
        </div>
    )
}