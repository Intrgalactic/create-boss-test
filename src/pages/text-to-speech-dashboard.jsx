import { Suspense, lazy, useReducer, useState } from "react";
import { ContentContainer } from "src/components/content-container";
const DashboardHeader = lazy(() => import('src/layouts/dashboards/dashboard-header'));
const DashboardLeftSection = lazy(() => import('src/layouts/dashboards/dashboard-left-section'));
const DashboardRightSection = lazy(() => import('src/layouts/dashboards/dashboard-right-section'));
const DashboardServiceOptionsRow = lazy(() => import('src/layouts/dashboards/service-options/dashboard-service-options-row'));
import Loader from "src/layouts/loader";
import fileDownload from "js-file-download";
import { speakersTypeOptions, languagesData, outputExtensionOptions, voiceGenderOptions, voicePitchOptions, audioSpeedOptions } from "src/utils/dashboard-static-data";
import { createDataAndSend } from "src/utils/utilities";
import { handleTextChange } from "src/utils/utilities";

export default function TTSDashboard() {
    const TTSInitialState = {
        voicePitch: "0",
        language: "English (US)",
        audioSpeed: '1',
        languageCode: "en-US",
        voiceGender: 'Male',
        speakersType: 'Home',
        outputExtension: "MP3"
      };
    
    const [textToSpeechProps,dispatch] = useReducer(TTSReducer,TTSInitialState);
    const [ableToTranslate, setAbleToTranslate] = useState('No');

    const [textInput, setTextInput] = useState("");
    const [isTranslated, setIsTranslated] = useState(false);
    const [filePath, setFilePath] = useState('');
    const controls = [`Text Length: ${textInput.length} / 10 000`, `Able To Translate : ${ableToTranslate}`, `Extension Of Output File : ${textToSpeechProps.outputExtension}`, "Reset", "Translate"];
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
    function TTSReducer(state,action) {
        const payload = action.payload;
        switch(action.type) {
            case "Language": return {...state,language: payload[1],languageCode: payload[0]};
            case "Voice Pitch": return {...state,voicePitch: payload};
            case "Voice Gender": return {...state,voiceGender: payload};
            case "Audio Speed": return {...state,audioSpeed: payload};
            case "Speakers Type": return {...state,speakersType: payload};
            case "Output Extension": return {...state,outputExtension: payload};
        }
    }
    const voiceOptionsRowActions = [
        {
            text: textToSpeechProps.voicePitch,
            options: voicePitchOptions,
            setOption: passToReducer,
            heading: "Voice Pitch",
        },
        {
            text:  textToSpeechProps.language,
            options: filteredLanguagesData,
            setOption: passToReducer,
            setFilter: setLanguageFilter,
            heading: "Language",
        },
        {
            text:  textToSpeechProps.voiceGender,
            options: voiceGenderOptions,
            setOption: passToReducer,
            heading: "Voice Gender",
        },
        {
            text:  textToSpeechProps.audioSpeed,
            options: audioSpeedOptions,
            setOption: passToReducer,
            heading: "Audio Speed"
        }
    ]
    const voiceMiscellaneousOptionsRowActions = [
        {
            text:  textToSpeechProps.speakersType,
            options: speakersTypeOptions,
            setOption: passToReducer,
            heading: "Speakers Type",
        },
        {
            text:  textToSpeechProps.outputExtension,
            options: outputExtensionOptions,
            setOption: passToReducer,
            heading: "Output Extension",
        }
    ]
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
                if (file.type === "text/plain" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/pdf") {
                    console.log(file);
                    createDataAndSend({
                        code: languageCode,
                        gender: voiceGender,
                        pitch: voicePitch,
                        effectsProfileId: speakersType,
                        audioEncoding: outputExtension,
                        speakingRate: audioSpeed,
                        file: file,
                    }, file, outputExtension, stateSetters, 'api/text-to-speech');
                }
                else {
                    setErrorAtDownload("The File Extension Is Not Supported");
                    setLoadingState(false);
                    return false;
                }
            }
            else if (!file) {
                createDataAndSend({
                    code: languageCode,
                    gender: voiceGender,
                    pitch: voicePitch,
                    effectsProfileId: speakersType,
                    audioEncoding: outputExtension,
                    text: textInput,
                    speakingRate: audioSpeed
                }, file, outputExtension, stateSetters, 'api/text-to-speech');
            }

        }
    }

    async function downloadFile() {
        if (file) {
            var outputFileName = file.name.substring(0, file.name.indexOf('.')) + `.${outputExtension.toLowerCase()}`;
        }
        fileDownload(filePath, `${file && file.name ? outputFileName : `output.${outputExtension.toLowerCase()}`}`);
    }
    function passToReducer(actionType, payload) {
        dispatch({
            type: actionType,
            payload: payload
        });
    }
    return (
        <div className="text-to-speech-dashboard">
            <Suspense fallback={<Loader />}>
                <DashboardHeader />
                <ContentContainer containerClass="text-to-speech-dashboard__container">
                    <DashboardLeftSection headings={["Text-To-Speech", "Input Your Text", "Attach Text File", "File Output"]} controls={controls} setTextInput={setTextInput} setAbleToTranslate={setAbleToTranslate} textInput={textInput} handleTextChange={handleTextInput} mainAction={sendToSynthetize} isTranslated={isTranslated} downloadFile={downloadFile} setFile={setFile} file={file} errorAtDownload={errorAtDownload} setErrorAtDownload={setErrorAtDownload} acceptedFormats="text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                    <DashboardRightSection configurationHeading="Default Configuration Is Set To Male Voice With 1.0 Voice Speed Level">
                        <DashboardServiceOptionsRow actions={voiceOptionsRowActions} heading="Voice Options" />
                        <DashboardServiceOptionsRow actions={voiceMiscellaneousOptionsRowActions} heading="Miscellaneous" />
                    </DashboardRightSection>
                </ContentContainer>
                {loadingState === true && <Loader />}
            </Suspense>
        </div>
    )
}



