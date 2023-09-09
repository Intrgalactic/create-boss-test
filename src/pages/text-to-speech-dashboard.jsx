import { Suspense, lazy, useEffect, useReducer, useState } from "react";
import { ContentContainer } from "src/components/content-container";
const DashboardHeader = lazy(() => import('src/layouts/dashboards/dashboard-header'));
const DashboardLeftSection = lazy(() => import('src/layouts/dashboards/dashboard-left-section'));
const DashboardRightSection = lazy(() => import('src/layouts/dashboards/dashboard-right-section'));
const DashboardServiceOptionsRow = lazy(() => import('src/layouts/dashboards/service-options/dashboard-service-options-row'));
import Loader from "src/layouts/loader";
import fileDownload from "js-file-download";
import { createDataAndSend, fetchUrl } from "src/utils/utilities";
import { handleTextChange } from "src/utils/utilities";
import { voiceAccentOptions, voiceAgeOptions, voiceGenderOptions } from "src/utils/dashboard-static-data";
import TTSVoiceSelect from "src/layouts/text-to-speech-voice-select";
import { ConfigErr } from "src/components/dashboard/configErr";

export default function TTSDashboard() {
    const TTSInitialState = {
        age: "Choose",
        gender: "Choose",
        accent: "Choose"
    }

    const [TTSProps, dispatch] = useReducer(TTSReducer, TTSInitialState);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [ableToTranslate, setAbleToTranslate] = useState('No');
    const [textInput, setTextInput] = useState("");
    const [isTranslated, setIsTranslated] = useState(false);
    const [filePath, setFilePath] = useState('');
    const controls = [`Text Length: ${textInput.length} / 10 000`, `Able To Translate : ${ableToTranslate}`, `Extension Of Output File : mp3`, "Reset", "Translate"];
    const [loadingState, setLoadingState] = useState(false);
    const [file, setFile] = useState();
    const [errorAtDownload, setErrorAtDownload] = useState();
    const [voices, setVoices] = useState();
    const [voice, setVoice] = useState();
    const [filteredVoices,setFilteredVoices] = useState();
    const [resultsAmount,setResultsAmount] = useState(10);
    const [configError,setConfigError] = useState(false);
    useEffect(() => {
        async function getVoices() {
            const voices = await fetchUrl(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech/get-voices`);
            setVoices(voices.voices);
        }
        getVoices();
    }, [setVoices])
    useEffect(() => {
        if(voices) {
            const age = TTSProps.age === "Choose" ? "" : TTSProps.age.toLowerCase();
            const gender = TTSProps.gender === "Choose" ? "" : TTSProps.gender.toLowerCase();
            const accent = TTSProps.accent === "Choose" ? "" : TTSProps.accent.toLowerCase();
            setFilteredVoices(voices.filter(voice => voice.useCase && voice.useCase.includes(selectedCategory.toLowerCase()) && voice.age.includes(age) && gender === "" ? voice.gender.includes(gender) : voice.gender === gender && voice.accent.includes(accent)  ));
        }
    },[voices,setFilteredVoices,TTSProps.age,TTSProps.gender,TTSProps.accent,selectedCategory]);
    function TTSReducer(state, action) {
        const payload = action.payload;
        switch (action.type) {
            case "Age": return { ...state, age: payload };
            case "Gender": return { ...state, gender: payload };
            case "Accent": return { ...state, accent: payload };
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
        if ((textInput || file) && voice) {
            setLoadingState(true);
            if (file) {
                console.clear();
                console.log(voice);
                if (file.type === "text/plain" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/pdf") {
                    createDataAndSend({
                        file: file,
                        voiceId: voice
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
                    voiceId: voice
                }, file, "mp3", stateSetters, 'api/text-to-speech');
            }

        }
        else if(!configError) {
            setConfigError(true);
            setTimeout(() => {
                setConfigError(false);
            },5400);
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
            options: voiceAccentOptions,
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
                    {filteredVoices && <TTSVoiceSelect specificVoiceSettingsActions={specificVoiceSettingsActions} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} voices={filteredVoices.slice(0,resultsAmount)} setVoice={setVoice} voice={voice} setResultsAmount={setResultsAmount} totalVoicesLength={filteredVoices.length} resultsAmount={resultsAmount}/>}
                    {configError === true && <ConfigErr errMessage="Please input the text and select the voice"/>}
                </ContentContainer>
                {loadingState === true && <Loader />}
            
            </Suspense>
        </div>
    )
}



