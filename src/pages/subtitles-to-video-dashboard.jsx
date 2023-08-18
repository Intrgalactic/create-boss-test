import { Suspense, useEffect, useState } from "react";
import { ContentContainer } from "src/components/content-container";
import DashboardHeader from "src/layouts/dashboards/dashboard-header";
import DashboardRightSection from "src/layouts/dashboards/dashboard-right-section";
import DashboardVideoLeftSection from "src/layouts/dashboards/dashboard-video-left-section";
import DashboardServiceOptionsRow from "src/layouts/dashboards/service-options/dashboard-service-options-row";
import Loader from "src/layouts/loader";
import { fontSizeOptions, detailedAlignmentOptions, mainAlignmentOptions, subBgColorOptions, subBgOpacityOptions, STTlanguageData, subtitlesColorOptions, trueFalseOptions, textStrokeOptions } from "src/utils/dashboard-static-data";
import { sendData, setLanguageProperties } from "src/utils/utilities";
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
            const data = new FormData();
            data.append('files', videoFile, videoFile.name);
            data.append('subtitlesFontSize', subtitlesSize);
            data.append("watermarkAlign", watermarkAlignment);
            data.append('logoAlign', logoAlignment);
            data.append('subtitlesAlign', subtitlesAlignment);
            data.append('subtitlesColor', subColor);
            data.append('enableTextStroke', enableTextStroke);
            data.append('subBgColor', subBgColor);
            data.append("textStroke", textStroke);
            data.append('strokeColor', strokeColor);
            data.append('enableSubBg', enableSubBg);
            data.append('subBgOpacity', subBgOpacity);
            data.append("enableShadow", subtitlesShadow)
            data.append('languageCode', languageCode);
            let fileIndex = 1;
            for (let i = 0; i < filesArr.length; i++) {
                for (let j = 0; j < filesArr[i].allowedTypes.length; j++) {
                    if (filesArr[i].file) {
                        if (filesArr[i].file.type.includes(filesArr[i].allowedTypes[j]) || filesArr[i].file.name.slice(filesArr[i].file.name.lastIndexOf(".")).includes(filesArr[i].allowedTypes[j])) {
                            data.append('files', filesArr[i].file, filesArr[i].file.name);
                            if (filesArr[i].file) {
                                data.append(filesArr[i].name, fileIndex);
                                fileIndex++;
                            }
                        }
                    }
                }
            }
            data.append('subtitlesOn', true);
            sendData(`${import.meta.env.VITE_SERVER_FETCH_URL}api/subtitles-to-video`, data, false, {
                file: videoFile,
                outputExtension: videoFile.name.slice(videoFile.name.lastIndexOf('.'))
            }, stateSetters)
        }
    }
    function setLanguageProps(code, name) {
        setLanguageProperties(setLanguage, setLanguageCode, code, name);
    }

    async function downloadFile() {
        fileDownload(filePath,`${videoFile && videoFile.name ? videoFile.name : `output.${videoFile.name.slice(videoFile.name.lastIndexOf('.') + 1)}`}`);
    }
    
    return (
        <div className="subtitles-to-video-dashboard">
            <Suspense fallback={<Loader />}>
                <DashboardHeader />
                <ContentContainer containerClass="subtitles-to-video-dashboard__container">
                    <DashboardVideoLeftSection heading="Video To Modify" videoFile={videoFile} setVideoFile={setVideoFile} sendToGetSubtitles={sendToGetSubtitles} filePath={filePath} downloadFile={downloadFile} setFilePath={setFilePath}/>
                    <DashboardRightSection configurationHeading="Default Configuration Is Set To Blank Logo Without Watermark">
                        <DashboardServiceOptionsRow actions={subtitlesOptionsRowActions} heading="Subtitles" />
                        <DashboardServiceOptionsRow actions={subtitlesBackgroundOptionsRowActions} heading="Subtitles Background" />
                        <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions} heading="Miscellaneous" />
                    </DashboardRightSection>
                </ContentContainer>
                {loadingState === true && <DownloadingLoader heading="We are modifying your video"/>}
            </Suspense>
        </div>
    )
}