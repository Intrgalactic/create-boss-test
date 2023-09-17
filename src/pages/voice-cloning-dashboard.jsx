import { useEffect, useRef, useState } from "react";
import { ContentContainer } from "src/components/content-container";
import { ConfigErr } from "src/components/dashboard/configErr";
import DashboardHeader from "src/layouts/dashboards/dashboard-header";
import VoiceCloningPanel from "src/layouts/voice-cloning-panel";
import { throwConfigErr } from "src/utils/utilities";

export default function VCDashboard() {
    const [files,setFiles] = useState([]);
    const [errorAtDownload,setErrorAtDownload] = useState();
    const [configErr,setConfigErr] = useState(false);
    const formRef = useRef({
        voiceName: "",
        voiceDescription: "",
    })
    function appendFiles(file) {
        var size = file.size;
        var i = 0;
        const sizesArr = ["Bytes","Kb","Mb","Gb"];
        while(size > 900) {
            size/=1024;
            i++;
        }

        const fileObj = {
            name:file.name.slice(0,15) + (file.name.length > 15 ? "..." : ""),
            size:Math.round(size * 100)/100 + " " + sizesArr[i],
            originalFile: file 
        }
        var filesArrCopy = [...files];
        filesArrCopy.push(fileObj);
        setFiles(filesArrCopy);
    }
    function removeFile(fileIndex) {
        const filteredFiles = files.filter((file,index) => index != fileIndex);
        setFiles(filteredFiles);
    }
    useEffect(() => {
        if (errorAtDownload) {
            throwConfigErr(setConfigErr,"The file size exceeds 10 MB");
            setErrorAtDownload(false);
        }
    },[errorAtDownload,setErrorAtDownload]);
    
    function submitToClone() {
        if (formRef.current.voiceName.length === 0) {
            throwConfigErr(setConfigErr,"Please name your voice");
        }
        else if (formRef.current.voiceDescription.length === 0) {
            throwConfigErr(setConfigErr,"Please describe your voice");
        }
        else if(files.length === 0) {
            throwConfigErr(setConfigErr,"Please attach atleast one sample file of your voice")
        }
        
        else {
            for (let file of files) {
                if (file.originalFile.type.startsWith("video") || file.originalFile.type.startsWith("audio")) {

                }
                else {
                    throwConfigErr(setConfigErr,"Some files extensions are not supported, please remove them");
                    break;
                }
            }
        }
    }
    return (
        <div className="voice-cloning-dashboard">
            <DashboardHeader/>
            <ContentContainer containerClass="voice-cloning__container">
                <VoiceCloningPanel files={files} setFile={appendFiles} setErrorAtDownload={setErrorAtDownload} removeFile={removeFile} submitToClone={submitToClone} ref={formRef}/>
                {configErr && <ConfigErr errMessage={configErr}/>}
            </ContentContainer>
            
        </div>
    )
}