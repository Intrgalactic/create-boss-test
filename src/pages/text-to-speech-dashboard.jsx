import { Suspense, lazy, useEffect, useReducer, useState } from "react";
const ContentContainer = lazy(() => import("src/components/content-container").then(module => {
    return {default: module.ContentContainer}
}));
    import loadable from "@loadable/component";
const DashboardHeader = lazy(() => import('src/layouts/dashboards/dashboard-header'));
const DashboardLeftSection = lazy(() => import('src/layouts/dashboards/dashboard-left-section'));
const Loader = loadable(() => import("src/layouts/loader"));
import { voiceAccentOptions, voiceAgeOptions, voiceGenderOptions } from "src/utils/dashboard-static-data";
import { TTSReducer } from "src/utils/utilities";
const TTSVoiceSelect = loadable(() => import("src/layouts/text-to-speech-voice-select"));
const ConfigErr = lazy(() => import("src/components/dashboard/configErr").then(module => {
    return {default: module.ConfigErr}
}))


export default function TTSDashboard() {
    const TTSInitialState = {
        age: "Choose",
        gender: "Choose",
        accent: "Choose"
    }
    const instructionHeading = "Steps to convert Text To Speech";
    const instructionSteps = ["Input text in the textarea or attach file", "Select a voice", "click the translate button", {
        text: "you can check list of available languages",
        href: "https://create-boss-test.onrender.com"
    }];
    const [TTSProps, dispatch] = useReducer(TTSReducer, TTSInitialState);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [ableToTranslate, setAbleToTranslate] = useState('No');
    const [textInput, setTextInput] = useState("");
    const [isTranslated, setIsTranslated] = useState(false);
    const [filePath, setFilePath] = useState('');
    const controls = [`Text Length: ${textInput.length} / 5000`, `Able To Translate : ${ableToTranslate}`, `Extension Of Output File : mp3`, "Reset", "Translate"];
    const [loadingState, setLoadingState] = useState(false);
    const [file, setFile] = useState();
    const [errorAtDownload, setErrorAtDownload] = useState();
    const [voices, setVoices] = useState();
    const [voice, setVoice] = useState();
    const [filteredVoices, setFilteredVoices] = useState();
    const [resultsAmount, setResultsAmount] = useState(10);
    const [configError, setConfigError] = useState(false);
    const [filteredVoicesNameFilter, setFilteredVoicesNameFilter] = useState("");
    const voiceNameFilterRegEx = new RegExp(filteredVoicesNameFilter, "i");

    useEffect(() => {
        setLoadingState(true);
        async function getVoices() {
            const voices = await (await import("src/utils/utilities")).fetchUrl(`${import.meta.env.VITE_SERVER_FETCH_URL}api/text-to-speech/get-voices`);
            setVoices(voices.voices);
            setLoadingState(false);
        }
        getVoices();
    }, [setVoices])
    useEffect(() => {
        (async () => {
            if (voices) {
                const filteredArr = (await import("src/utils/utilities")).filterVoices(TTSProps, voices, selectedCategory);
                setFilteredVoices(filteredArr);
            }
        })();
       
    }, [voices, setFilteredVoices, TTSProps.age, TTSProps.gender, TTSProps.accent, selectedCategory]);

    const filteredVoicesWName = filteredVoices ? filteredVoices.filter(voice => voiceNameFilterRegEx.test(voice.name)) : filteredVoices;

    const stateSetters = {
        setLoadingState: setLoadingState,
        setErrorAtDownload: setErrorAtDownload,
        setFilePath: setFilePath,
        setIsTranslated: setIsTranslated
    }

    async function handleTextInput(e) {
        (await import("src/utils/utilities")).handleTextChange(e, {
            isTranslated: isTranslated,
            errorAtDownload: errorAtDownload
        }, {
            setErrorAtDownload: setErrorAtDownload,
            setIsTranslated: setIsTranslated

        })
        setTextInput(e);
    }
    async function sendToSynthetize() {
        if ((textInput && textInput.length < 5000 && voice) || file && voice) {
            if (file) {
                if (file.type === "text/plain" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/pdf") {
                    setLoadingState(true);
                    (await import("src/utils/utilities")).createDataAndSend({
                        file: file,
                        voiceId: voice
                    }, file, "mp3", stateSetters, 'api/text-to-speech');
                }
                else {
                    (await import("src/utils/utilities")).throwConfigErr(setConfigError, "The file extension is not supported");
                    return false;
                }
            }
            else if (!file) {
                setLoadingState(true);
                (await import("src/utils/utilities")).createDataAndSend({
                    text: textInput,
                    voiceId: voice
                }, file, "mp3", stateSetters, 'api/text-to-speech');
            }

        }
        else if (!configError) {
            if (textInput.length > 5000) {
                (await import("src/utils/utilities")).throwConfigErr(setConfigError, "Text length is longer than 5000 characters");
            }
            else {
                (await import("src/utils/utilities")).throwConfigErr(setConfigError, "Please input the text and select the voice");
            }
        }
    }

    async function downloadFile() {
        if (file) {
            var outputFileName = file.name.substring(0, file.name.indexOf('.')) + `.mp3`;
        }
        (await import("js-file-download")).fileDownload(filePath, `${file && file.name ? outputFileName : `output.mp3`}`);
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
                    <DashboardLeftSection headings={["Text-To-Speech", "Input Your Text", "Attach Text File", "File Output"]} controls={controls} setTextInput={setTextInput} setAbleToTranslate={setAbleToTranslate} textInput={textInput} handleTextChange={handleTextInput} mainAction={sendToSynthetize} isTranslated={isTranslated} downloadFile={downloadFile} setFile={setFile} file={file} errorAtDownload={errorAtDownload} setErrorAtDownload={setErrorAtDownload} acceptedFormats="text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" instructionHeading={instructionHeading} instructionSteps={instructionSteps} />
                    {filteredVoices && <TTSVoiceSelect specificVoiceSettingsActions={specificVoiceSettingsActions} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} voices={filteredVoicesWName.slice(0, resultsAmount)} setVoice={setVoice} voice={voice} setResultsAmount={setResultsAmount} totalVoicesLength={filteredVoicesWName.length} resultsAmount={resultsAmount} setFilteredVoicesNameFilter={setFilteredVoicesNameFilter} />}
                    {configError && <ConfigErr errMessage={configError} />}
                </ContentContainer>
                {loadingState === true && <Loader />}

            </Suspense>
        </div>
    )
}



