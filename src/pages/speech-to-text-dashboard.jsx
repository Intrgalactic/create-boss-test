import { useEffect, useState } from "react";
import { ContentContainer } from "src/components/content-container";
import DashboardHeader from "src/layouts/dashboards/dashboard-header";
import DashboardLeftSection from "src/layouts/dashboards/dashboard-left-section";
import DashboardRightSection from "src/layouts/dashboards/dashboard-right-section";
import DashboardServiceOptionsRow from "src/layouts/dashboards/service-options/dashboard-service-options-row";
import Loader from "src/layouts/loader";
import fileDownload from "js-file-download";
import {languagesData, outputExtensionOptions, } from "src/utils/dashboard-static-data";
import { handleTextChange, sendData, setLanguageProperties } from "src/utils/utilities";

export default function STTDashboard() {

    const [audioSpeed, setAudioSpeed] = useState("1.0");
    const [voicePitch, setVoicePitch] = useState("0");
    const [language, setLanguage] = useState("English (US)");
    const [languageCode, setLanguageCode] = useState("en-US");
    const [voiceGender, setVoiceGender] = useState('Male');
    const [speakersType, setSpeakersType] = useState('Home');
    const [ableToTranslate, setAbleToTranslate] = useState('No');
    const [outputExtension, setOutputExtension] = useState("Txt");
    const [textInput, setTextInput] = useState("");
    const [isTranslated, setIsTranslated] = useState(false);
    const [filePath, setFilePath] = useState('');
    const controls = [`Able To Translate : ${ableToTranslate}`, `Extension Of Output File : ${outputExtension}`, "Translate"];
    const [loadingState, setLoadingState] = useState(false);
    const [file, setFile] = useState();
    const [errorAtDownload, setErrorAtDownload] = useState();
    const [languageFilter, setLanguageFilter] = useState();
    const languageFilterRegEx = new RegExp(languageFilter, "i");
    const stateSetters = {
        setLoadingState:setLoadingState,
        setErrorAtDownload:setErrorAtDownload,
        setFilePath:setFilePath,
        setIsTranslated:setIsTranslated
    }
    function setAllOptions() {

    }
    const filteredLanguagesData = languagesData.filter(obj => languageFilterRegEx.test(obj.optgroup));

    const firstServiceOptionsRowActions = [
        {
            text: language,
            options: filteredLanguagesData,
            setOption: setLanguageProps,
            setFilter: setLanguageFilter,
            heading: "Language",
        },
        {
            type: "set-to-default-btn",
            text: "Set",
            setOption: setAllOptions,
            heading: "Apply Changes",
        }
    ]
    function setLanguageProps(code,name) {
        setLanguageProperties(setLanguage,setLanguageCode,code,name);
    }
    async function sendToSynthetize() {
        if (textInput || file) {
            setLoadingState(true);
            if (file && file.type === "text/plain") {
                const data = new FormData();
                data.append('file', file, file.name);
                data.append('code',languageCode);
                sendData(`${import.meta.env.VITE_SERVER_FETCH_URL}api/speech-to-text`,data,false,{
                    file: file,
                    outputExtension: outputExtension
                },stateSetters);
            }
        }
    }
    async function downloadFile() {
        (file && file.name) ? await fileDownload(filePath, `${file.name.substring(0, file.name.indexOf('.'))}.${outputExtension.toLowerCase()}`) : await fileDownload(filePath, `output.${outputExtension.toLowerCase()}`);
        (file && file.name) ? fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}api/speech-to-text/delete/${file.name.substring(0, file.name.indexOf('.'))}.${outputExtension.toLowerCase()}`) : fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech/delete/output.${outputExtension.toLowerCase()}`)
    }

    return (
        <div className="text-to-speech-dashboard">
            <DashboardHeader />
            <ContentContainer containerClass="text-to-speech-dashboard__container">
                <DashboardLeftSection headings={["Speech-To-Text", "Record Your Voice", "Attach Audio File", "File Output"]} controls={controls} setAbleToTranslate={setAbleToTranslate} textInput={textInput} handleTextChange={handleTextInput} mainAction={sendToSynthetize} isTranslated={isTranslated} downloadFile={downloadFile} setFile={setFile} file={file} errorAtDownload={errorAtDownload} setErrorAtDownload={setErrorAtDownload} />
                <DashboardRightSection configurationHeading="Default Configuration Is Set To English Language">
                    <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions} />
                </DashboardRightSection>
            </ContentContainer>
            {loadingState === true && <Loader />}
        </div>
    )
}