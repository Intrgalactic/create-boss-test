import { useEffect, useState } from "react";
import { ContentContainer } from "src/components/content-container";
import DashboardHeader from "src/layouts/dashboard-header";
import DashboardLeftSection from "src/layouts/dashboard-left-section";
import DashboardRightSection from "src/layouts/dashboard-right-section";
import DashboardServiceOptionsRow from "src/layouts/dashboard-service-options-row";
import Loader from "src/layouts/loader";
import fileDownload from "js-file-download";
import { speakersTypeOptions, audioSpeedOptions, languagesData, outputExtensionOptions, voiceGenderOptions, voicePitchOptions } from "src/utils/dashboard-static-data";
export default function TTSDashboard() {

    const [audioSpeed, setAudioSpeed] = useState("1.0");
    const [voicePitch, setVoicePitch] = useState("0");
    const [language, setLanguage] = useState("English (US)");
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
    function setAllOptions() {

    }
    const firstServiceOptionsRowActions = [
        {
            text: audioSpeed,
            options: audioSpeedOptions,
            setOption: setAudioSpeed,
            heading: "Voice Speed",
        },
        {
            text: voicePitch,
            options: voicePitchOptions,
            setOption: setVoicePitch,
            heading: "Voice Pitch",
        },
        {
            text: language,
            options: languagesData,
            setOption: setLanguageProperties,
            heading: "Language",
        },
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
        },
        {
            type: "set-to-default-btn",
            text: "Set",
            setOption: setAllOptions,
            heading: "Apply Changes",
        }
    ]
    function setLanguageProperties(code, name) {
        setLanguage(name);
        setLanguageCode(code);
    }
    function handleTextChange(e) {
        if (isTranslated) {
            setIsTranslated(false);
        }
        setTextInput(e);
    }
    async function sendToSynthetize() {
        if (textInput || file) {
            setLoadingState(true);
            if (file) {
                const data = new FormData();
                data.append('file', file, file.name);
                const queryString = `code=${languageCode}&gender=${voiceGender}&pitch=${voicePitch}&effectsProfileId=${speakersType}&audioEncoding=${outputExtension}`;
                const queryParams = Object.fromEntries(new URLSearchParams(queryString));
                for (const [key, value] of Object.entries(queryParams)) {
                    data.append(key, value);
                }
           
                sendData(data);
            }
            else {
                sendData(`code=${languageCode}&gender=${voiceGender}&pitch=${voicePitch}&effectsProfileId=${speakersType}&audioEncoding=${outputExtension}&text=${textInput}`);
            }
        }
    }
    function downloadFile() {
        fileDownload(filePath, `output.${outputExtension.toLowerCase()}`);
    }
    async function sendData(data) {
        try {
            await fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech`, {
                method: "POST",
                body: data,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            }).then(async () => {
                const rawFileResponse = await fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech/output.${outputExtension.toLowerCase()}`);
                const file = await rawFileResponse.blob();
                setFilePath(file);
                setIsTranslated(true);
                setLoadingState(false);
            })

        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="text-to-speech-dashboard">
            <DashboardHeader />
            <ContentContainer containerClass="text-to-speech-dashboard__container">
                <DashboardLeftSection headings={["Text-To-Speech", "Input Your Text", "Attach Your Text File", "File Output"]} controls={controls} setAbleToTranslate={setAbleToTranslate} textInput={textInput} handleTextChange={handleTextChange} mainAction={sendToSynthetize} isTranslated={isTranslated} downloadFile={downloadFile} setFile={setFile} file={file} />
                <DashboardRightSection configurationHeading="Default Configuration Is Set To Male Voice With 1.0 Voice Speed Level">
                    <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions} />
                    <DashboardServiceOptionsRow actions={secondServiceOptionsRowActions} />
                </DashboardRightSection>
            </ContentContainer>
            {loadingState === true && <Loader />}
        </div>
    )
}