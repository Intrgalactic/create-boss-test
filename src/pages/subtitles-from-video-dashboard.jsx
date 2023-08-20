import { Suspense, lazy, useState } from "react";
import { ContentContainer } from "src/components/content-container";
const DashboardHeader = lazy(() => import("src/layouts/dashboards/dashboard-header"));
const DashboardRightSection = lazy(() => import("src/layouts/dashboards/dashboard-right-section"));
const DashboardVideoLeftSection = lazy(() => import("src/layouts/dashboards/dashboard-video-left-section"));
const DashboardServiceOptionsRow = lazy(() => import("src/layouts/dashboards/service-options/dashboard-service-options-row"));
import Loader from "src/layouts/loader";
import { STTOutputExtensionOptions, STTlanguageData, trueFalseOptions } from "src/utils/dashboard-static-data";
import {  createDataAndSend, setLanguageProperties } from "src/utils/utilities";
import fileDownload from "js-file-download";

export default function SFVDashboard() {
    const [videoFile, setVideoFile] = useState();
    const [loadingState, setLoadingState] = useState(false);
    const [languageFilter, setLanguageFilter] = useState('');
    const languageFilterRegEx = new RegExp(languageFilter, "i");
    const [languageCode, setLanguageCode] = useState('en-US');
    const [filePath, setFilePath] = useState();
    const [errorAtDownload, setErrorAtDownload] = useState();
    const [language, setLanguage] = useState("English (US)")
    const [outputExtension, setOutputExtension] = useState("TXT");
    const [diarization, setDiarization] = useState("No");
    const [summarization, setSummarization] = useState('No');
    const [detectTopic, setDetectTopic] = useState("No");
    const [punctuation, setPunctuation] = useState('Yes');
    const [timeStamps, setTimeStamps] = useState("No");

    const stateSetters = {
        setLoadingState: setLoadingState,
        setErrorAtDownload: setErrorAtDownload,
        setFilePath: setFilePath,
    }

    const filteredLanguagesData = STTlanguageData.filter(obj => languageFilterRegEx.test(obj.optgroup));

    const subtitlesOptionsRowActions = [
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

  

    async function sendToGetSubtitles() {
        if (videoFile) {
            setLoadingState(true);
            createDataAndSend({
                audioEncoding: outputExtension,
                punctuationOn: punctuation,
                topicsOn: detectTopic,
                diarizeOn: diarization,
                summarizeOn: summarization,
                subtitlesOn: timeStamps,
                languageCode:languageCode,
                file: videoFile
            },videoFile,outputExtension.toLowerCase(),stateSetters,'api/subtitles-from-video',false);
        }
    }
    function setLanguageProps(code, name) {
        setLanguageProperties(setLanguage, setLanguageCode, code, name);
    }

    async function downloadFile() {
        fileDownload(filePath,`${videoFile && videoFile.name ? `${videoFile.name.slice(0,videoFile.name.lastIndexOf(".") - 1)}.${outputExtension.toLowerCase()}` : `output.${videoFile}.${outputExtension.toLowerCase()}`}`);
    }
    
    return (
        <div className="subtitles-to-video-dashboard">
            <Suspense fallback={<Loader />}>
                <DashboardHeader />
                <ContentContainer containerClass="subtitles-to-video-dashboard__container">
                    <DashboardVideoLeftSection heading="Subtitles From Video" videoFile={videoFile} setVideoFile={setVideoFile} sendToGetSubtitles={sendToGetSubtitles} filePath={filePath} downloadFile={downloadFile} setFilePath={setFilePath}/>
                    <DashboardRightSection configurationHeading="Default Configuration Is Set To Subtitles With Punctuation Only">
                        <DashboardServiceOptionsRow actions={subtitlesOptionsRowActions} heading="Subtitles" />
                    </DashboardRightSection>
                </ContentContainer>
                {loadingState === true && <Loader/>}
            </Suspense>
        </div>
    )
}