import { lazy, useState } from "react";
import { ContentContainer } from "src/components/content-container";
const DashboardHeader = lazy(() => import("src/layouts/dashboards/dashboard-header"));
const DashboardLeftSection = lazy(() => import("src/layouts/dashboards/dashboard-left-section"));
const DashboardRightSection = lazy(() => import("src/layouts/dashboards/dashboard-right-section"));
const DashboardServiceOptionsRow = lazy(() => import("src/layouts/dashboards/service-options/dashboard-service-options-row"));
import fileDownload from "js-file-download" ;
import Loader from "src/layouts/loader";
import { STTOutputExtensionOptions, STTlanguageData, trueFalseOptions } from "src/utils/dashboard-static-data";
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
    const [diarization, setDiarization] = useState("No");
    const [summarization, setSummarization] = useState('No');
    const [detectTopic, setDetectTopic] = useState("No");
    const [punctuation, setPunctuation] = useState('Yes');
    const [timeStamps, setTimeStamps] = useState("No");
    const [languageFilter, setLanguageFilter] = useState();
    const languageFilterRegEx = new RegExp(languageFilter, "i");
    const stateSetters = {
        setLoadingState: setLoadingState,
        setErrorAtDownload: setErrorAtDownload,
        setFilePath: setFilePath,
        setIsTranslated: setIsTranslated
    }
    const filteredLanguagesData = STTlanguageData.filter(obj => languageFilterRegEx.test(obj.optgroup));
    const mimetypesArr = [
        "audio/mpeg",
        "video/ogg",
        "audio/wav",
        "audio/ogg",
        "audio/mpeg",
        "audio/webm",
        "audio/flac",
        "audio/amr",
        "audio/aac",
        "audio/opus",
        "audio/weba",
        "audio/x-m4a",
        "audio/aiff",
        "audio/x-ms-wma",
        "audio/mpeg",
        "video/ogg",
        "video/quicktime",
        "video/mp4"
    ];
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
    function setLanguageProps(code, name) {
        setLanguageProperties(setLanguage, setLanguageCode, code, name);
    }

    async function sendToSynthetize() {
        if (textInput || file) {
            const data = new FormData();
            if (
                mimetypesArr.includes(file.type) ||
                (file.type === "audio/mpeg" && mimetypesArr.includes("audio/mp3")) ||
                (file.type === "audio/mpeg" && mimetypesArr.includes("audio/x-mp3"))
            ) {
                const data = new FormData()
                const objWithdata = {
                    file: file,
                    languageCode: languageCode,
                    audioEncoding: outputExtension,
                    punctuationOn: punctuation,
                    topicsOn: detectTopic,
                    diarizeOn: diarization,
                    summarizeOn: summarization,
                    subtitlesOn: timeStamps
                };
                appendToFormData(objWithdata, data);

                sendData(`${import.meta.env.VITE_SERVER_FETCH_URL}api/speech-to-text`, data, false, {
                    file: file,
                    outputExtension: outputExtension
                }, stateSetters);
            }
            setLoadingState(true);
        }
    }
    function appendToFormData(objWithData, formData) {
        for (const [key, value] of Object.entries(objWithData)) {
            formData.append(`${key}`, value);
        }
    }
    async function downloadFile() {
        const outputFileName = file.name.substring(0, file.name.indexOf('.')) + `.${outputExtension.toLowerCase()}`;
        fileDownload(filePath,`${file && file.name ? outputFileName : `output.${outputExtension.toLowerCase()}`}`);
    }

    return (
        <div className="speech-to-text-dashboard">
            <DashboardHeader />
            <ContentContainer containerClass="speech-to-text-dashboard__container">
                <DashboardLeftSection headings={["Speech-To-Text", "Record Your Voice", "Attach Audio File", "File Output"]} controls={controls} setAbleToTranslate={setAbleToTranslate} mainAction={sendToSynthetize} isTranslated={isTranslated} downloadFile={downloadFile} setFile={setFile} file={file} errorAtDownload={errorAtDownload} setErrorAtDownload={setErrorAtDownload} acceptedFormats="audio/mpeg,audio/wav,video/ogg" />
                <DashboardRightSection configurationHeading="Default Configuration Is Set To English Language">
                    <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions} heading="Voice Options"/>
                </DashboardRightSection>
            </ContentContainer>
            {loadingState === true && <Loader />}
        </div>
    )
}