import { Suspense, lazy, useState } from "react";
import { ContentContainer } from "src/components/content-container";
const DashboardHeader = lazy(() => import('src/layouts/dashboards/dashboard-header'));
const DashboardLeftSection = lazy(() => import('src/layouts/dashboards/dashboard-left-section'));
const DashboardRightSection = lazy(() => import('src/layouts/dashboards/dashboard-right-section'));
const DashboardServiceOptionsRow = lazy(() => import('src/layouts/dashboards/service-options/dashboard-service-options-row'));
import Loader from "src/layouts/loader";
import fileDownload from "js-file-download";
import { speakersTypeOptions, languagesData, outputExtensionOptions, voiceGenderOptions, voicePitchOptions,audioSpeedOptions } from "src/utils/dashboard-static-data";
import { sendData, setLanguageProperties } from "src/utils/utilities";
import { handleTextChange } from "src/utils/utilities";

export default function TTSDashboard() {

    const [voicePitch, setVoicePitch] = useState("0");
    const [language, setLanguage] = useState("English (US)");
    const [audioSpeed, setAudioSpeed] = useState('1');
    const [languageCode, setLanguageCode] = useState("en-US");
    const [voiceGender, setVoiceGender] = useState('Male');
    const [speakersType, setSpeakersType] = useState('Home');
    const [ableToTranslate, setAbleToTranslate] = useState('No');
    const [outputExtension, setOutputExtension] = useState("MP3");
    const [textInput, setTextInput] = useState("");
    const [isTranslated, setIsTranslated] = useState(false);
    const [filePath, setFilePath] = useState('');
    const controls = [`Text Length: ${textInput.length} / 10 000`, `Able To Translate : ${ableToTranslate}`, `Extension Of Output File : ${outputExtension}`, "Translate"];
    const [loadingState, setLoadingState] = useState(false);
    const [file, setFile] = useState();
    const [errorAtDownload, setErrorAtDownload] = useState();
    const [languageFilter, setLanguageFilter] = useState();
    const languageFilterRegEx = new RegExp(languageFilter, "i");
    const stateSetters = {
        setLoadingState: setLoadingState,
        setErrorAtDownload: setErrorAtDownload,
        setFilePath: setFilePath,
        setIsTranslated: setIsTranslated
    }
    const filteredLanguagesData = languagesData.filter(obj => languageFilterRegEx.test(obj.optgroup));

    const firstServiceOptionsRowActions = [
        {
            text: voicePitch,
            options: voicePitchOptions,
            setOption: setVoicePitch,
            heading: "Voice Pitch",
        },
        {
            text: language,
            options: filteredLanguagesData,
            setOption: setLanguageProps,
            setFilter: setLanguageFilter,
            heading: "Language",
        },
        {
            text: audioSpeed,
            options: audioSpeedOptions,
            setOption: setAudioSpeed,
            heading: "Audio Speed"
        }
    ]
    const secondServiceOptionsRowActions = [
        {
            text: voiceGender,
            options: voiceGenderOptions,
            setOption: setVoiceGender,
            heading: "Voice Gender",
        },
        {
            text: speakersType,
            options: speakersTypeOptions,
            setOption: setSpeakersType,
            heading: "Speakers Type",
        },
        {
            text: outputExtension,
            options: outputExtensionOptions,
            setOption: setOutputExtension,
            heading: "Output Extension",
        }
    ]
    function setLanguageProps(code, name) {
        setLanguageProperties(setLanguage, setLanguageCode, code, name);
    }
    function handleTextInput(e) {
        handleTextChange(e, {
            isTranslated: isTranslated,
            errorAtDownload: errorAtDownload
        }, {
            setErrorAtDownload: setErrorAtDownload,
            setIsTranslated: setIsTranslated

        })
        setTextInput(e);
    }
    async function sendToSynthetize() {
        if (textInput || file) {
            setLoadingState(true);
            if (file) {
                if (file.type === "text/plain" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/pdf" ) {
                    const data = new FormData();
                    const queryString = `code=${languageCode}&gender=${voiceGender}&pitch=${voicePitch}&effectsProfileId=${speakersType}&audioEncoding=${outputExtension}&speakingRate=${audioSpeed}`;
                    const queryParams = Object.fromEntries(new URLSearchParams(queryString));
                    for (const [key, value] of Object.entries(queryParams)) {
                        data.append(key, value);
                    }
                    data.append('file', file, file.name);
                    data.append('fileType', file.type);
                    sendData(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech`, data, false, {
                        file: file,
                        outputExtension: outputExtension
                    }, stateSetters);
                }
                else {
                    setErrorAtDownload("The File Extension Is Not Supported");
                    setLoadingState(false);
                    return false;
                }
            }
            else if (!file) {
                sendData(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech`, `code=${languageCode}&gender=${voiceGender}&pitch=${voicePitch}&effectsProfileId=${speakersType}&audioEncoding=${outputExtension}&text=${textInput}&speakingRate=${audioSpeed}`, "application/x-www-form-urlencoded", {
                    file: file,
                    outputExtension: outputExtension
                }, stateSetters);
            }

        }
    }

    async function downloadFile() {
        (file && file.name) ? console.log(filePath, `${file.name.substring(0, file.name.indexOf('.'))}`) : console.log(filePath, `output.${outputExtension.toLowerCase()}`);
        (file && file.name) ? await fileDownload(filePath, `${file.name.substring(0, file.name.indexOf('.'))}.${outputExtension.toLowerCase()}`) : await fileDownload(filePath, `output.${outputExtension.toLowerCase()}`);
    }
    return (
        <div className="text-to-speech-dashboard">
            <Suspense fallback={<Loader />}>
                <DashboardHeader />
                <ContentContainer containerClass="text-to-speech-dashboard__container">
                    <DashboardLeftSection headings={["Text-To-Speech", "Input Your Text", "Attach Text File", "File Output"]} controls={controls} setAbleToTranslate={setAbleToTranslate} textInput={textInput} handleTextChange={handleTextInput} mainAction={sendToSynthetize} isTranslated={isTranslated} downloadFile={downloadFile} setFile={setFile} file={file} errorAtDownload={errorAtDownload} setErrorAtDownload={setErrorAtDownload} acceptedFormats="text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"/>
                    <DashboardRightSection configurationHeading="Default Configuration Is Set To Male Voice With 1.0 Voice Speed Level">
                        <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions} />
                        <DashboardServiceOptionsRow actions={secondServiceOptionsRowActions} />
                    </DashboardRightSection>
                </ContentContainer>
                {loadingState === true && <Loader />}
            </Suspense>
        </div>
    )
}



