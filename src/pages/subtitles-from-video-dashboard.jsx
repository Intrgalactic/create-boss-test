import { Suspense, lazy, useReducer, useState } from "react";
import loadable from "@loadable/component";
import fileDownload from "js-file-download";
const DashboardHeader = lazy(() => import("src/layouts/dashboards/dashboard-header"));
const ContentContainer = lazy(() => import("src/components/content-container").then(module => {
    return {default: module.ContentContainer}
}));
const DashboardRightSection = lazy(() => import("src/layouts/dashboards/dashboard-right-section"));
const DashboardVideoLeftSection = lazy(() => import("src/layouts/dashboards/dashboard-video-left-section"));
const DashboardServiceOptionsRow = lazy(() => import("src/layouts/dashboards/service-options/dashboard-service-options-row"));
import Loader from "src/layouts/loader";
import { STTOutputExtensionOptions, STTlanguageData, trueFalseOptions } from "src/utils/dashboard-static-data";
import { STTReducer } from "src/utils/utilities";
import { ConfigErr } from "src/components/dashboard/configErr";
import { useCookies } from 'react-cookie';

export default function SFVDashboard() {
    const [videoFile, setVideoFile] = useState();
    const [loadingState, setLoadingState] = useState(false);
    const [languageFilter, setLanguageFilter] = useState('');
    const languageFilterRegEx = new RegExp(languageFilter, "i");
    const [filePath, setFilePath] = useState();
    const [errorAtDownload, setErrorAtDownload] = useState();
    const [outputExtension, setOutputExtension] = useState("TXT");
    const [configErr,setConfigErr] = useState();
    const [cookies,setCookie] = useCookies('[csrf]');
    const SFVInitialState = {
        language: "English (US)",
        languageCode: "en-US",
        outputExtension: "TXT",
        diarization: "No",
        summarization: "No",
        detectTopic: "No",
        punctuation: "Yes",
        timeStamps: "No",
    }
    const [SFVProps,dispatch] = useReducer(STTReducer,SFVInitialState);

    const stateSetters = {
        setLoadingState: setLoadingState,
        setErrorAtDownload: setErrorAtDownload,
        setFilePath: setFilePath,
    }

    const filteredLanguagesData = STTlanguageData.filter(obj => languageFilterRegEx.test(obj.optgroup));
    
    const subtitlesOptionsRowActions = [
        {
            text: SFVProps.language,
            options: filteredLanguagesData,
            setOption: passToReducer,
            setFilter: setLanguageFilter,
            heading: "Language",
        },
        {
            text: SFVProps.outputExtension,
            options: STTOutputExtensionOptions,
            setOption: passToReducer,
            heading: "Output Extension",
        },
        {
            text: SFVProps.diarization,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Detect Diarization",
        },
        {
            text: SFVProps.summarization,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Summarize",
        },
        {
            text: SFVProps.detectTopic,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Topic Detection",
        },
        {
            text: SFVProps.punctuation,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Punctuation",
        },
        {
            text: SFVProps.timeStamps,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Show Timestamps",
        },
    ]

  

    async function sendToGetSubtitles() {
        if (videoFile) {
            setLoadingState(true);
            (await import('src/utils/utilities')).createDataAndSend({
                audioEncoding: SFVProps.outputExtension,
                punctuationOn: SFVProps.punctuation,
                topicsOn: SFVProps.detectTopic,
                diarizeOn: SFVProps.diarization,
                summarizeOn: SFVProps.summarization,
                subtitlesOn: SFVProps.timeStamps,
                languageCode:SFVProps.languageCode,
                file: videoFile
            },videoFile,SFVProps.outputExtension.toLowerCase(),stateSetters,'api/subtitles-from-video',false,cookies.csrf);
        }
        else {
            (await import("src/utils/utilities")).throwConfigErr(setConfigErr,"Please attach a file");
        }
    }

    async function downloadFile() {
        fileDownload(filePath,`${videoFile && videoFile.name ? `${videoFile.name.slice(0,videoFile.name.lastIndexOf(".") - 1)}.${outputExtension.toLowerCase()}` : `output.${videoFile}.${outputExtension.toLowerCase()}`}`);
    }

    function passToReducer(actionType, payload) {
        dispatch({
            type: actionType,
            payload: payload
        });
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
                {configErr && <ConfigErr errMessage={configErr}/>}
            </Suspense>
        </div>
    )
}