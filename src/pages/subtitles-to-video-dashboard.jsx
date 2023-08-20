import { Suspense, lazy, useState } from "react";
import { ContentContainer } from "src/components/content-container";
const DashboardHeader = lazy(() => import("src/layouts/dashboards/dashboard-header"));
const DashboardRightSection = lazy(() => import("src/layouts/dashboards/dashboard-right-section"));
const DashboardVideoLeftSection = lazy(() => import("src/layouts/dashboards/dashboard-video-left-section"));
const DashboardServiceOptionsRow = lazy(() => import("src/layouts/dashboards/service-options/dashboard-service-options-row"));
import Loader from "src/layouts/loader";
import { fontSizeOptions, detailedAlignmentOptions, mainAlignmentOptions, subBgColorOptions, subBgOpacityOptions, STTlanguageData, trueFalseOptions, textStrokeOptions } from "src/utils/dashboard-static-data";
import { createDataAndSend, sendData, setLanguageProperties } from "src/utils/utilities";
import fileDownload from "js-file-download";
import DownloadingLoader from "src/layouts/downloading-loader";

export default function STVDashboard() {
    const [logoAlignment, setLogoAlignment] = useState("Bottom Center");
    const [videoFile, setVideoFile] = useState();
    const [watermarkFile, setWatermarkFile] = useState();
    const [subtitlesFontFile, setSubtitlesFontFile] = useState();
    const [logoFile, setLogoFile] = useState();
    const [loadingState, setLoadingState] = useState(false);
    const [watermarkAlignment, setWatermarkAlignment] = useState('Top Center');
    const [subtitlesSize, setSubtitlesSize] = useState("48PX");
    const [subtitlesAlignment, setSubtitlesAlignment] = useState("Bottom");
    const [subBgOpacity, setSubBgOpacity] = useState(1);
    const [subBgColor, setSubBgColor] = useState();
    const [enableTextStroke, setEnableTextStroke] = useState('No');
    const [languageFilter, setLanguageFilter] = useState('');
    const languageFilterRegEx = new RegExp(languageFilter, "i");
    const [languageCode, setLanguageCode] = useState('en-US');
    const [subColor, setSubColor] = useState();
    const [filePath, setFilePath] = useState();
    const [errorAtDownload, setErrorAtDownload] = useState();
    const [enableSubBg, setEnableSubBg] = useState("No");
    const [textStroke, setTextStroke] = useState("1PX");
    const [subtitlesShadow, setSubtitlesShadow] = useState("No");
    const [language, setLanguage] = useState("English (US)")
    const [strokeColor, setStrokeColor] = useState("");
    const stateSetters = {
        setLoadingState: setLoadingState,
        setErrorAtDownload: setErrorAtDownload,
        setFilePath: setFilePath,
    }
    const filteredLanguagesData = STTlanguageData.filter(obj => languageFilterRegEx.test(obj.optgroup));
    const filesArr = [
        {
            allowedTypes: [".ttf", '.otf', '.woff', 'woff2'],
            file: subtitlesFontFile,
            name: "subtitles"
        },
        {
            allowedTypes: ["image"],
            file: logoFile,
            name: "logo"
        },
        {
            allowedTypes: ["image"],
            file: watermarkFile,
            name: "watermark"
        }
    ]
    const subtitlesOptionsRowActions = [
        {
            text: language,
            options: filteredLanguagesData,
            setOption: setLanguageProps,
            setFilter: setLanguageFilter,
            heading: "Language",
        },
        {
            heading: "Subtitles Font",
            type: "input",
            file: subtitlesFontFile,
            setFile: setSubtitlesFontFile,
            acceptList: "application/font-*,.ttf, .otf, .woff, .woff2"
        },
        {
            heading: "Subtitles Color",
            type: "color",
            color: subColor,
            setColor: setSubColor,
        },
        {
            text: subtitlesSize,
            options: fontSizeOptions,
            setOption: setSubtitlesSize,
            heading: "Subtitles Size",

        },
        {
            text: subtitlesAlignment,
            options: mainAlignmentOptions,
            setOption: setSubtitlesAlignment,
            heading: "Subtitles Align",

        },
        {
            text: enableTextStroke,
            options: trueFalseOptions,
            setOption: setEnableTextStroke,
            heading: "Enable Stroke"
        },
        {
            heading: "Stroke Color",
            type: "color",
            color: strokeColor,
            setColor: setStrokeColor
        },
        {
            text: textStroke,
            options: textStrokeOptions,
            setOption: setTextStroke,
            heading: "Stroke Size"
        },
        {
            text: subtitlesShadow,
            options: trueFalseOptions,
            setOption: setSubtitlesShadow,
            heading: "Subtitles Shadow"
        },

    ]
    const subtitlesBackgroundOptionsRowActions = [
        {
            color: subBgColor,
            options: subBgColorOptions,
            setColor: setSubBgColor,
            type: "color",
            heading: "Subtitles BG Color",
        },
        {
            text: subBgOpacity,
            options: subBgOpacityOptions,
            setOption: setSubBgOpacity,
            heading: "Sub Bg Opacity",
        },
        {
            text: enableSubBg,
            options: trueFalseOptions,
            setOption: setEnableSubBg,
            heading: "Enable Sub BG"
        }
    ]
    const firstServiceOptionsRowActions = [
        {
            heading: "Logo",
            type: "input",
            file: logoFile,
            setFile: setLogoFile,
            acceptList: "image/*, .svg",
        },
        {
            heading: "Watermark",
            type: "input",
            file: watermarkFile,
            setFile: setWatermarkFile,
            acceptList: "image/*, .svg",
        },
        {
            text: logoAlignment,
            options: detailedAlignmentOptions,
            setOption: setLogoAlignment,
            heading: "Logo Align",
        },
        {
            text: watermarkAlignment,
            options: detailedAlignmentOptions,
            setOption: setWatermarkAlignment,
            heading: "Watermark Align",
        }

    ]

    async function sendToGetSubtitles() {
        if (videoFile) {
            setLoadingState(true);
            const objWithdata = {
                languageCode: languageCode,
                files: videoFile,
                subtitlesFontSize: subtitlesSize,
                watermarkAlign: watermarkAlignment,
                logoAlign: logoAlignment,
                subtitlesAlign: subtitlesAlignment,
                subtitlesColor: subColor,
                enableTextStroke: enableTextStroke,
                subBgColor: subBgColor,
                textStroke: textStroke,
                strokeColor: strokeColor,
                enableSubBg: enableSubBg,
                subBgOpacity: subBgOpacity,
                enableShadow: subtitlesShadow
            };
            createDataAndSend(objWithdata, videoFile, videoFile.name.slice(videoFile.name.lastIndexOf('.')), stateSetters, 'api/subtitles-to-video', filesArr);
        }
    }
    function setLanguageProps(code, name) {
        setLanguageProperties(setLanguage, setLanguageCode, code, name);
    }

    async function downloadFile() {
        fileDownload(filePath, `${videoFile && videoFile.name ? videoFile.name : `output.${videoFile.name.slice(videoFile.name.lastIndexOf('.') + 1)}`}`);
    }

    return (
        <div className="subtitles-to-video-dashboard">
            <Suspense fallback={<Loader />}>
                <DashboardHeader />
                <ContentContainer containerClass="subtitles-to-video-dashboard__container">
                    <DashboardVideoLeftSection heading="Video To Modify" videoFile={videoFile} setVideoFile={setVideoFile} sendToGetSubtitles={sendToGetSubtitles} filePath={filePath} downloadFile={downloadFile} setFilePath={setFilePath} />
                    <DashboardRightSection configurationHeading="Default Configuration Is Set To Blank Logo Without Watermark">
                        <DashboardServiceOptionsRow actions={subtitlesOptionsRowActions} heading="Subtitles" />
                        <DashboardServiceOptionsRow actions={subtitlesBackgroundOptionsRowActions} heading="Subtitles Background" />
                        <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions} heading="Miscellaneous" />
                    </DashboardRightSection>
                </ContentContainer>
                {loadingState === true && <DownloadingLoader heading="We are modifying your video" />}
            </Suspense>
        </div>
    )
}