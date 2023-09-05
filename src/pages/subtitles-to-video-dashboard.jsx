import { Suspense, lazy, useReducer, useState } from "react";
import { ContentContainer } from "src/components/content-container";
const DashboardHeader = lazy(() => import("src/layouts/dashboards/dashboard-header"));
const DashboardRightSection = lazy(() => import("src/layouts/dashboards/dashboard-right-section"));
const DashboardVideoLeftSection = lazy(() => import("src/layouts/dashboards/dashboard-video-left-section"));
const DashboardServiceOptionsRow = lazy(() => import("src/layouts/dashboards/service-options/dashboard-service-options-row"));
import Loader from "src/layouts/loader";
import { fontSizeOptions, detailedAlignmentOptions, mainAlignmentOptions, subBgColorOptions, subBgOpacityOptions, STTlanguageData, trueFalseOptions, textStrokeOptions, wordsPerLineOptions } from "src/utils/dashboard-static-data";
import { createDataAndSend } from "src/utils/utilities";
import fileDownload from "js-file-download";
import DownloadingLoader from "src/layouts/downloading-loader";

export default function STVDashboard() {
    const videoInitialState = {
        logoFile: undefined,
        logoAlignment: "Bottom Center",
        enableLogo: "No",
        watermarkFile: undefined,
        watermarkAlignment: "Top Center",
        enableWatermark: "No",
        subtitlesFontFile: undefined,
        subtitlesSize: "48PX",
        wordsPerLine: "Choose",
        subtitlesAlignment: "Top Center",
        subtitlesColor: undefined,
        enableUpperCaseSubtitles: "No",
        enableSubBg: "No",
        subBgOpacity: 1,
        subBgColor: undefined,
        enableTextStroke: "No",
        strokeSize: "1PX",
        strokeColor: undefined,
        enableItalicize: "No",
        enableSubtitlesShadow: "No",
        enableWordFollow: "No",
        enableEmotions: "No",
        wordFollowColor: undefined,
        languageCode: 'en-US',
        language: "English (US)",
        fadeIn: 'No',
        scale: "No",
    }

    const [videoProps, dispatch] = useReducer(videoPropsReducer, videoInitialState);
    const [videoFile, setVideoFile] = useState();
    const [errorAtDownload, setErrorAtDownload] = useState();
    const [loadingState, setLoadingState] = useState(false);
    const [languageFilter, setLanguageFilter] = useState('');
    const languageFilterRegEx = new RegExp(languageFilter, "i");
    const [filePath, setFilePath] = useState();

    const stateSetters = {
        setLoadingState: setLoadingState,
        setErrorAtDownload: setErrorAtDownload,
        setFilePath: setFilePath,
    }

    const filteredLanguagesData = STTlanguageData.filter(obj => languageFilterRegEx.test(obj.optgroup));

    const filesArr = [
        {
            allowedTypes: [".ttf", '.otf', '.woff', 'woff2'],
            file: videoProps.subtitlesFontFile,
            name: "subtitles"
        },
        {
            allowedTypes: ["image"],
            file: videoProps.logoFile,
            name: "logo"
        },
        {
            allowedTypes: ["image"],
            file: videoProps.watermarkFile,
            name: "watermark"
        }
    ]

    function videoPropsReducer(state, action) {
        const payload = action.payload;
        switch (action.type) {
            case "Language": return { ...state, languageCode: payload[0], language: payload[1] };
            case "Subtitles Font": return { ...state, subtitlesFontFile: action.payload };
            case "Italicize": return { ...state, enableItalicize: action.payload };
            case "Subtitles Color": return { ...state, subtitlesColor: action.payload };
            case "Uppercase Subtitles": return { ...state, enableUpperCaseSubtitles: payload };
            case "Subtitles Size": return { ...state, subtitlesSize: payload };
            case "Subtitles Align": return { ...state, subtitlesAlignment: payload };
            case "Emotions Detection": return { ...state, enableEmotions: payload };
            case "Enable Stroke": return { ...state, enableTextStroke: payload };
            case "Stroke Color": return { ...state, strokeColor: payload };
            case "Stroke Size": return { ...state, strokeSize: payload };
            case "Subtitles Shadow": return { ...state, enableSubtitlesShadow: payload };
            case "Word Follow": return { ...state, enableWordFollow: payload };
            case "Word Follow Color": return { ...state, wordFollowColor: payload };
            case "Enable Sub BG": return { ...state, enableSubBg: payload };
            case "Subtitles BG Color": return { ...state, subBgColor: payload };
            case "Sub Bg Opacity": return { ...state, subBgOpacity: payload };
            case "Logo": return { ...state, logoFile: payload };
            case "Logo Align": return { ...state, logoAlignment: payload };
            case "Enable Logo": return { ...state, enableLogo: payload };
            case "Watermark": return { ...state, watermarkFile: payload };
            case "Watermark Align": return { ...state, watermarkAlignment: payload };
            case "Enable Watermark": return { ...state, enableWatermark: payload };
            case "Fade In": return { ...state, fadeIn: payload };
            case "Slide Up": return { ...state, slideUp: payload };
            case "Slide Down": return { ...state, slideDown: payload };
            case "Scale": return { ...state, scale: payload };
            case "Words Per Line": return {...state, wordsPerLine: payload};
        }
    }
    const subtitlesOptionsRowActions = [
        {
            text: videoProps.language,
            options: filteredLanguagesData,
            setOption: passToReducer,
            setFilter: setLanguageFilter,
            heading: "Language",
        },
        {
            heading: "Subtitles Font",
            type: "input",
            file: videoProps.subtitlesFontFile,
            setFile: passToReducer,
            acceptList: "application/font-*,.ttf, .otf, .woff, .woff2"
        },
        {
            heading: "Italicize",
            options: trueFalseOptions,
            setOption: passToReducer,
            text: videoProps.enableItalicize
        },
        {
            heading: "Subtitles Color",
            type: "color",
            color: videoProps.subtitlesColor,
            setColor: passToReducer,
        },
        {
            heading: "Uppercase Subtitles",
            options: trueFalseOptions,
            setOption: passToReducer,
            text: videoProps.enableUpperCaseSubtitles
        },

        {
            text: videoProps.subtitlesSize,
            options: fontSizeOptions,
            setOption: passToReducer,
            heading: "Subtitles Size",

        },
        {
            text: videoProps.subtitlesAlignment,
            options: mainAlignmentOptions,
            setOption: passToReducer,
            heading: "Subtitles Align",

        },
        {
            text: videoProps.enableEmotions,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Emotions Detection"
        },
        {
            text: videoProps.enableTextStroke,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Enable Stroke"
        },
        {
            heading: "Stroke Color",
            type: "color",
            color: videoProps.strokeColor,
            setColor: passToReducer
        },
        {
            text: videoProps.strokeSize,
            options: textStrokeOptions,
            setOption: passToReducer,
            heading: "Stroke Size"
        },
        {
            text: videoProps.enableSubtitlesShadow,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Subtitles Shadow"
        },
        {
            text: videoProps.wordsPerLine,
            options: wordsPerLineOptions,
            setOption: passToReducer,
            heading: "Words Per Line"
        },
        {
            text: videoProps.enableWordFollow,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Word Follow"
        },
        {
            heading: "Word Follow Color",
            type: "color",
            color: videoProps.wordFollowColor,
            setColor: passToReducer,
        },

    ]
    const subtitlesEffectsOptionsRowActions = [{
        text: videoProps.fadeIn,
        options: trueFalseOptions,
        setOption: passToReducer,
        heading: "Fade In",
    },
    {
        text: videoProps.scale,
        options: trueFalseOptions,
        setOption: passToReducer,
        heading: "Scale"
    }
    ]
    const subtitlesBackgroundOptionsRowActions = [
        {
            color: videoProps.subBgColor,
            options: subBgColorOptions,
            setColor: passToReducer,
            type: "color",
            heading: "Subtitles BG Color",
        },
        {
            text: videoProps.subBgOpacity,
            options: subBgOpacityOptions,
            setOption: passToReducer,
            heading: "Sub Bg Opacity",
        },
        {
            text: videoProps.enableSubBg,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Enable Sub BG"
        }
    ]
    const firstServiceOptionsRowActions = [
        {
            heading: "Logo",
            type: "input",
            file: videoProps.logoFile,
            setFile: passToReducer,
            acceptList: "image/*, .svg",
        },
        {
            text: videoProps.logoAlignment,
            options: detailedAlignmentOptions,
            setOption: passToReducer,
            heading: "Logo Align",
        },
        {
            text: videoProps.enableLogo,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Enable Logo"
        },
        {
            heading: "Watermark",
            type: "input",
            file: videoProps.watermarkFile,
            setFile: passToReducer,
            acceptList: "image/*, .svg",
        },
        {
            text: videoProps.watermarkAlignment,
            options: detailedAlignmentOptions,
            setOption: passToReducer,
            heading: "Watermark Align",
        },
        {
            text: videoProps.enableWatermark,
            options: trueFalseOptions,
            setOption: passToReducer,
            heading: "Enable Watermark"
        }
    ]

    async function sendToGetSubtitles() {
        if (videoFile) {
            setLoadingState(true);
            const objWithdata = {
                languageCode: videoProps.languageCode,
                files: videoFile,
                subtitlesFontSize: videoProps.subtitlesSize,
                watermarkAlign: videoProps.watermarkAlignment,
                logoAlign: videoProps.logoAlignment,
                subtitlesAlign: videoProps.subtitlesAlignment,
                subtitlesColor: videoProps.subtitlesColor,
                enableTextStroke: videoProps.enableTextStroke,
                subBgColor: videoProps.subBgColor,
                textStroke: videoProps.strokeSize,
                strokeColor: videoProps.strokeColor,
                enableSubBg: videoProps.enableSubBg,
                subBgOpacity: videoProps.subBgOpacity,
                enableShadow: videoProps.enableSubtitlesShadow,
                enableEmotions: videoProps.enableEmotions,
                italicize: videoProps.enableItalicize,
                uppercaseSubs: videoProps.enableUpperCaseSubtitles,
                enableWordFollow: videoProps.enableWordFollow,
                wordFollowColor: videoProps.wordFollowColor,
                enableScale: videoProps.scale,
                enableFade: videoProps.fadeIn,
                enableLogo: videoProps.enableLogo,
                enableWatermark: videoProps.enableWatermark,
                wordsPerLine: videoProps.wordsPerLine
            };
            createDataAndSend(objWithdata, videoFile, videoFile.name.slice(videoFile.name.lastIndexOf('.')), stateSetters, 'api/subtitles-to-video', filesArr);
        }
    }

    async function downloadFile() {
        fileDownload(filePath, `${videoFile && videoFile.name ? videoFile.name : `output.${videoFile.name.slice(videoFile.name.lastIndexOf('.') + 1)}`}`);
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
                    <DashboardVideoLeftSection heading="Video To Modify" videoFile={videoFile} setVideoFile={setVideoFile} sendToGetSubtitles={sendToGetSubtitles} filePath={filePath} downloadFile={downloadFile} setFilePath={setFilePath} />
                    <DashboardRightSection configurationHeading="Default Configuration Is Set To Blank Logo Without Watermark">
                        <DashboardServiceOptionsRow actions={subtitlesOptionsRowActions} heading="Subtitles" />
                        <DashboardServiceOptionsRow actions={subtitlesEffectsOptionsRowActions} heading="Subtitles Effects" />
                        <DashboardServiceOptionsRow actions={subtitlesBackgroundOptionsRowActions} heading="Subtitles Background" />
                        <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions} heading="Miscellaneous" />
                    </DashboardRightSection>
                </ContentContainer>
                {loadingState === true && <DownloadingLoader heading="We are modifying your video" />}
            </Suspense>
        </div>
    )
}