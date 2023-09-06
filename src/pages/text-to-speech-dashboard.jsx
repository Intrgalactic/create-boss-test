import { Suspense, lazy, useReducer, useState } from "react";
import { ContentContainer } from "src/components/content-container";
const DashboardHeader = lazy(() => import('src/layouts/dashboards/dashboard-header'));
const DashboardLeftSection = lazy(() => import('src/layouts/dashboards/dashboard-left-section'));
const DashboardRightSection = lazy(() => import('src/layouts/dashboards/dashboard-right-section'));
const DashboardServiceOptionsRow = lazy(() => import('src/layouts/dashboards/service-options/dashboard-service-options-row'));
import Loader from "src/layouts/loader";
import fileDownload from "js-file-download";
import { createDataAndSend } from "src/utils/utilities";
import { handleTextChange } from "src/utils/utilities";
import { voiceAgeOptions, voiceGenderOptions } from "src/utils/dashboard-static-data";
import TTSVoiceSelect from "src/layouts/text-to-speech-voice-select";

export default function TTSDashboard() {
    const TTSInitialState = {
        voiceDestiny: 'None',
        age: "Choose",
        gender: "Choose",
        accent: "Choose"
    }
    
    const [TTSProps,dispatch] = useReducer(TTSReducer,TTSInitialState);
    const [ableToTranslate, setAbleToTranslate] = useState('No');
    const [textInput, setTextInput] = useState("");
    const [isTranslated, setIsTranslated] = useState(false);
    const [filePath, setFilePath] = useState('');
    const controls = [`Text Length: ${textInput.length} / 10 000`, `Able To Translate : ${ableToTranslate}`, `Extension Of Output File : mp3`, "Reset", "Translate"];
    const [loadingState, setLoadingState] = useState(false);
    const [file, setFile] = useState();
    const [errorAtDownload, setErrorAtDownload] = useState();

    function TTSReducer(state,action) {
        const payload = action.payload;
        switch(action.type) {
            case "Voice Category": return {...state,voiceDestiny: payload};
            case "Age": return {...state,age:payload};
            case "Gender": return {...state,gender:payload};
            case "Accent": return {...state,accent:payload};
        }
    }

    const stateSetters = {
        setLoadingState: setLoadingState,
        setErrorAtDownload: setErrorAtDownload,
        setFilePath: setFilePath,
        setIsTranslated: setIsTranslated
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
                if (file.type === "text/plain" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/pdf") {
                    createDataAndSend({
                        file: file,
                    }, file, "mp3", stateSetters, 'api/text-to-speech');
                }
                else {
                    setErrorAtDownload("The File Extension Is Not Supported");
                    setLoadingState(false);
                    return false;
                }
            }
            else if (!file) {
                createDataAndSend({
                    text: textInput,
                }, file, outputExtension, stateSetters, 'api/text-to-speech');
            }

        }
    }

    async function downloadFile() {
        if (file) {
            var outputFileName = file.name.substring(0, file.name.indexOf('.')) + `.mp3`;
        }
        fileDownload(filePath, `${file && file.name ? outputFileName : `output.mp3`}`);
    }

    const specificVoiceSettingsActions = [
        {
            text: TTSProps.age,
            options: voiceAgeOptions,
            setOption: passToReducer,
            heading: "Age"
        },
        {
            text: TTSProps.gender,
            options: voiceGenderOptions,
            setOption: passToReducer,
            heading: "Gender"
        },
        {
            text: TTSProps.accent,
            options: voiceAgeOptions,
            setOption: passToReducer,
            heading: "Accent"
        } 
    ]
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
                    <TTSVoiceSelect category={TTSProps.voiceDestiny} setCategory={passToReducer} specificVoiceSettingsActions={specificVoiceSettingsActions}/>
                </ContentContainer>
                {loadingState === true && <Loader />}
            </Suspense>
        </div>
    )
}



