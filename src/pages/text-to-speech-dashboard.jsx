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
    const [errorAtDownload, setErrorAtDownload] = useState();
    const [languageFilter, setLanguageFilter] = useState();
    const languageFilterRegEx = new RegExp(languageFilter, "i");
    function setAllOptions() {

    }
    const filteredLanguagesData = languagesData.filter(obj => languageFilterRegEx.test(obj.optgroup));

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
            options: filteredLanguagesData,
            setOption: setLanguageProperties,
            setFilter: setLanguageFilter,
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
        if (isTranslated || errorAtDownload) {
            setErrorAtDownload(false);
            setIsTranslated(false);
        }
        setTextInput(e);
    }
    async function sendToSynthetize() {
        if (textInput || file) {
            setLoadingState(true);
            if (file && file.type === "text/plain") {
                const data = new FormData();
                const queryString = `code=${languageCode}&gender=${voiceGender}&pitch=${voicePitch}&effectsProfileId=${speakersType}&audioEncoding=${outputExtension}`;
                const queryParams = Object.fromEntries(new URLSearchParams(queryString));
                for (const [key, value] of Object.entries(queryParams)) {
                    data.append(key, value);
                }
                data.append('file', file, file.name);
                sendData(data);
            }
            else if (!file) {
                sendData(`code=${languageCode}&gender=${voiceGender}&pitch=${voicePitch}&effectsProfileId=${speakersType}&audioEncoding=${outputExtension}&text=${textInput}`, "application/x-www-form-urlencoded");
            }

        }
    }
    async function downloadFile() {
        (file && file.name) ? await fileDownload(filePath, `${file.name.substring(0, file.name.indexOf('.'))}.${outputExtension.toLowerCase()}`) : await fileDownload(filePath, `output.${outputExtension.toLowerCase()}`);
        (file && file.name) ? fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech/delete/${file.name.substring(0, file.name.indexOf('.'))}.${outputExtension.toLowerCase()}`) : fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech/delete/output.${outputExtension.toLowerCase()}`)
    }
    async function sendData(data, type) {
        var options;
        if (type) {
            options = {
                method: "POST",
                body: data,
                headers: {
                    "Content-Type": type
                }
            }
        }
        else {
            options = {
                method: "POST",
                body: data,
            }
        }
        try {
            await fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech`, options).then(async (res) => {
                var rawFileResponse;
                if (res.status === 200) {
                    if (file) {
                        const fileName = file.name.substring(0, file.name.indexOf('.'));
                        if (file.name) {
                            rawFileResponse = await fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech/get/${fileName}.${outputExtension.toLowerCase()}`).catch(err => {
                                setLoadingState(false);
                                setErrorAtDownload(err.message);
                            });
                        }
                    }

                    else {
                        rawFileResponse = await fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech/get/output.${outputExtension.toLowerCase()}`).catch(err => {
                            setLoadingState(false);
                            setErrorAtDownload(err.message);
                        });;
                    }

                    const fileToDownload = await rawFileResponse.blob();
                    setFilePath(fileToDownload);
                    setIsTranslated(true);
                    setLoadingState(false);
                }
            })

        }
        catch (err) {
            setLoadingState(false);
            setErrorAtDownload(err.message);
        }
    }
    return (
        <div className="text-to-speech-dashboard">
            <DashboardHeader />
            <ContentContainer containerClass="text-to-speech-dashboard__container">
                <DashboardLeftSection headings={["Text-To-Speech", "Input Your Text", "Attach Your Text File", "File Output"]} controls={controls} setAbleToTranslate={setAbleToTranslate} textInput={textInput} handleTextChange={handleTextChange} mainAction={sendToSynthetize} isTranslated={isTranslated} downloadFile={downloadFile} setFile={setFile} file={file} errorAtDownload={errorAtDownload} setErrorAtDownload={setErrorAtDownload} />
                <DashboardRightSection configurationHeading="Default Configuration Is Set To Male Voice With 1.0 Voice Speed Level">
                    <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions} />
                    <DashboardServiceOptionsRow actions={secondServiceOptionsRowActions} />
                </DashboardRightSection>
            </ContentContainer>
            {loadingState === true && <Loader />}
        </div>
    )
}