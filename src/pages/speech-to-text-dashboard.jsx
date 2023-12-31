import { Suspense, lazy, useReducer, useState } from "react";
import { ContentContainer } from "src/components/content-container";
import loadable from "@loadable/component";
const DashboardHeader = lazy(() => import("src/layouts/dashboards/dashboard-header"));
const DashboardLeftSection = lazy(() => import("src/layouts/dashboards/dashboard-left-section"));
const DashboardRightSection = lazy(() => import("src/layouts/dashboards/dashboard-right-section"));
const DashboardServiceOptionsRow = lazy(() => import("src/layouts/dashboards/service-options/dashboard-service-options-row"));
import Loader from "src/layouts/loader";
import { STTOutputExtensionOptions, STTlanguageData, trueFalseOptions } from "src/utils/dashboard-static-data";
import { ConfigErr } from "src/components/dashboard/configErr";
import { STTReducer } from "src/utils/utilities";
import fileDownload from "js-file-download";
import { useCookies } from 'react-cookie';

export default function STTDashboard() {
    const STTInitialState = {
        language: "English (US)",
        languageCode: "en-US",
        diarization: "No",
        summarization: "No",
        outputExtension: "TXT",
        detectTopic: "No",
        punctuation: "Yes",
        timeStamps: "No",
    }
    const instructionHeading = "Steps to convert Speech To Text";
    const instructionSteps = ["Attach a file","Select language of the audio","click the translate button",{
        text: "you can check list of available languages",
        href: "https://create-boss-test.onrender.com"
    }];
    const [speechToTextProps, dispatch] = useReducer(STTReducer, STTInitialState);
    const [ableToTranslate, setAbleToTranslate] = useState('No');
    const [isTranslated, setIsTranslated] = useState(false);
    const [filePath, setFilePath] = useState('');
    const controls = [`Able To Translate : ${ableToTranslate}`, `Extension Of Output File : ${speechToTextProps.outputExtension}`, "Reset", "Translate"];
    const [loadingState, setLoadingState] = useState(false);
    const [file, setFile] = useState();
    const [errorAtDownload, setErrorAtDownload] = useState();
    const [languageFilter, setLanguageFilter] = useState();
    const [configErr,setConfigErr] = useState(false);
    const [cookies,setCookie] = useCookies('[csrf]');
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
            text: speechToTextProps.language,
            options: filteredLanguagesData,
            setOption: passToReducer,
            setFilter: setLanguageFilter,
            heading: "Language",
        },
        {
            text: speechToTextProps.outputExtension,
            options: STTOutputExtensionOptions,
            setOption: passToReducer,
            heading: "Output Extension",
        },
        {
            text: speechToTextProps.diarization,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Detect Diarization",
        },
        {
            text: speechToTextProps.summarization,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Summarize",
        },
        {
            text: speechToTextProps.detectTopic,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Topic Detection",
        },
        {
            text: speechToTextProps.punctuation,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Punctuation",
        },
        {
            text: speechToTextProps.timeStamps,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Show Timestamps",
        },
    ]
    async function sendToSynthetize() {
        if (file) {
            if (
                mimetypesArr.includes(file.type) ||
                (file.type === "audio/mpeg" && mimetypesArr.includes("audio/mp3")) ||
                (file.type === "audio/mpeg" && mimetypesArr.includes("audio/x-mp3"))
            ) {
                setLoadingState(true);
                const objWithdata = {
                    file: file,
                    languageCode: speechToTextProps.languageCode,
                    audioEncoding: speechToTextProps.outputExtension,
                    punctuationOn: speechToTextProps.punctuation,
                    topicsOn: speechToTextProps.detectTopic,
                    diarizeOn: speechToTextProps.diarization,
                    summarizeOn: speechToTextProps.summarization,
                    subtitlesOn: speechToTextProps.timeStamps
                };
                (await import("src/utils/utilities")).createDataAndSend(objWithdata, file, outputExtension, stateSetters, 'api/speech-to-text', false,cookies.csrf);
            }
            else {
                (await import("src/utils/utilities")).throwConfigErr(setConfigErr,"The file extension is not supported");
            }
        }
        else {
            (await import("src/utils/utilities")).throwConfigErr(setConfigErr,"Please attach a file");
           
        }
    }

    async function downloadFile() {
        const outputFileName = file.name.substring(0, file.name.indexOf('.')) + `.${outputExtension.toLowerCase()}`;
        fileDownload(filePath, `${file && file.name ? outputFileName : `output.${outputExtension.toLowerCase()}`}`);
    }

    function passToReducer(actionType, payload) {
        dispatch({
            type: actionType,
            payload: payload
        });
    }
  
    return (
        <div className="speech-to-text-dashboard">
            <Suspense fallback={<Loader />}>
                <DashboardHeader />
                <ContentContainer containerClass="speech-to-text-dashboard__container">
                    <DashboardLeftSection headings={["Speech-To-Text", "Record Your Voice", "Attach Audio File", "File Output"]} subHeading="Easily Retrieve Text From Any File With Details With 95% Accuracy And 5% WER (Word Error Rate)" controls={controls} setAbleToTranslate={setAbleToTranslate} mainAction={sendToSynthetize} isTranslated={isTranslated} downloadFile={downloadFile} setFile={setFile} file={file} errorAtDownload={errorAtDownload} setErrorAtDownload={setErrorAtDownload} acceptedFormats="audio/mpeg,audio/wav,video/ogg" instructionHeading={instructionHeading} instructionSteps={instructionSteps} />
                    <DashboardRightSection configurationHeading="Default Configuration Is Set To English Language">
                        <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions} heading="Voice Options" />
                    </DashboardRightSection>
                </ContentContainer>
                {loadingState === true && <Loader />}
                {configErr && <ConfigErr errMessage={configErr}/>}
            </Suspense>
        </div>
    )
}