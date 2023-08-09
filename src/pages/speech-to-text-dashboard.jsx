import { useState } from "react";
import { ContentContainer } from "src/components/content-container";
import DashboardHeader from "src/layouts/dashboards/dashboard-header";
import DashboardLeftSection from "src/layouts/dashboards/dashboard-left-section";
import DashboardRightSection from "src/layouts/dashboards/dashboard-right-section";
import DashboardServiceOptionsRow from "src/layouts/dashboards/service-options/dashboard-service-options-row";
import Loader from "src/layouts/loader";
import fileDownload from "js-file-download";
import {STTOutputExtensionOptions, STTlanguageData, trueFalseOptions } from "src/utils/dashboard-static-data";
import { sendData, setLanguageProperties } from "src/utils/utilities";

export default function STTDashboard() {

    const [language, setLanguage] = useState("English (US)");
    const [languageCode, setLanguageCode] = useState("en-US");
    const [ableToTranslate, setAbleToTranslate] = useState('No');
    const [outputExtension, setOutputExtension] = useState("TXT");
    const [textInput, setTextInput] = useState("");
    const [isTranslated, setIsTranslated] = useState(false);
    const [filePath, setFilePath] = useState('');
    const controls = [`Able To Translate : ${ableToTranslate}`, `Extension Of Output File : ${outputExtension}`, "Translate"];
    const [loadingState, setLoadingState] = useState(false);
    const [file, setFile] = useState();
    const [errorAtDownload, setErrorAtDownload] = useState();
    const [diarization,setDiarization] = useState("No");
    const [summarization,setSummarization] = useState('No');
    const [detectTopic,setDetectTopic] = useState("No");
    const [punctuation,setPunctuation] = useState('Yes');
    const [timeStamps,setTimeStamps] = useState("No");
    const [languageFilter, setLanguageFilter] = useState();
    const languageFilterRegEx = new RegExp(languageFilter, "i");
    const stateSetters = {
        setLoadingState:setLoadingState,
        setErrorAtDownload:setErrorAtDownload,
        setFilePath:setFilePath,
        setIsTranslated:setIsTranslated
    }
    const filteredLanguagesData = STTlanguageData.filter(obj => languageFilterRegEx.test(obj.optgroup));

    const firstServiceOptionsRowActions = [
        {
            text: language,
            options: filteredLanguagesData,
            setOption: setLanguageProps,
            setFilter: setLanguageFilter,
            heading: "Language",
        },
        {
            text: outputExtension,
            options: STTOutputExtensionOptions,
            setOption: setOutputExtension,
            heading: "Output Extension",
        },
        {
            text: diarization,
            options: trueFalseOptions,
            setOption: setDiarization,
            heading: "Detect Diarization",
        },
        {
            text: summarization,
            options: trueFalseOptions,
            setOption: setSummarization,
            heading: "Summarize",
        },
        {
            text: detectTopic,
            options: trueFalseOptions,
            setOption: setDetectTopic,
            heading: "Topic Detection",
        },
        {
            text: punctuation,
            options: trueFalseOptions,
            setOption: setPunctuation,
            heading: "Punctuation",
        },
        {
            text: timeStamps,
            options: trueFalseOptions,
            setOption: setTimeStamps,
            heading: "Show Timestamps",
        },
    ]
    function setLanguageProps(code,name) {
        setLanguageProperties(setLanguage,setLanguageCode,code,name);
    } 
    async function sendToSynthetize() {
        if (textInput || file) {
            setLoadingState(true);
            if ((file) && (
            file.type === "audio/mpeg" || 
            file.type === "video/ogg" || 
            file.type === "audio/wav" || 
            file.type === "audio/ogg" || 
            file.type === 'audio/mpeg' ||
            file.type === 'audio/webm' ||
            file.type === 'audio/flac' ||
            file.type === 'audio/amr' ||
            file.type === 'audio/aac' ||
            file.type === 'audio/opus' ||
            file.type === 'audio/weba' ||
            file.type === 'audio/x-m4a' ||
            file.type === 'audio/aiff' ||
            file.type === 'audio/x-ms-wma' ||
            file.type === 'audio/mpeg' ||
            file.type === 'video/ogg' ||
            file.type === 'video/quicktime' ||
            file.type === 'video/mp4')) {
                const data = new FormData()
                data.append('file', file, file.name);
                data.append('code',languageCode);
                data.append('audioEncoding',outputExtension);
                data.append('punctuationOn',punctuation);
                data.append('topicsOn',detectTopic);
                data.append('diarizeOn',diarization);
                data.append('summarizeOn',summarization)
                data.append('subtitlesOn',timeStamps);
                sendData(`${import.meta.env.VITE_SERVER_FETCH_URL}api/speech-to-text`,data,false,{
                    file: file,
                    outputExtension: outputExtension
                },stateSetters);
            }
            else {
                setErrorAtDownload("The File Extension Is Not Supported");
                setLoadingState(false);
                return false;
            }
        }
    }
    async function downloadFile() {
        console.log(filePath, `${file.name.substring(0, file.name.indexOf('.'))}`);
        (file && file.name) ? await fileDownload(filePath, `${file.name.substring(0, file.name.indexOf('.'))}.${outputExtension.toLowerCase()}`) : await fileDownload(filePath, `output.${outputExtension.toLowerCase()}`);
    }

    return (
        <div className="speech-to-text-dashboard">
            <DashboardHeader />
            <ContentContainer containerClass="speech-to-text-dashboard__container">
                <DashboardLeftSection headings={["Speech-To-Text", "Record Your Voice", "Attach Audio File", "File Output"]} controls={controls} setAbleToTranslate={setAbleToTranslate} mainAction={sendToSynthetize} isTranslated={isTranslated} downloadFile={downloadFile} setFile={setFile} file={file} errorAtDownload={errorAtDownload} setErrorAtDownload={setErrorAtDownload} acceptedFormats="audio/mpeg,audio/wav,video/ogg"/>
                <DashboardRightSection configurationHeading="Default Configuration Is Set To English Language">
                    <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions} />
                </DashboardRightSection>
            </ContentContainer>
            {loadingState === true && <Loader />}
        </div>
    )
}