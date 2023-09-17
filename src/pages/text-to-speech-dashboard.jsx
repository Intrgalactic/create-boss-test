import { Suspense, lazy, useEffect, useReducer, useState } from "react";
const ContentContainer = lazy(() => import("src/components/content-container").then(module => {
    return { default: module.ContentContainer }
}));
import loadable from "@loadable/component";
const DashboardHeader = lazy(() => import('src/layouts/dashboards/dashboard-header'));
const DashboardLeftSection = lazy(() => import('src/layouts/dashboards/dashboard-left-section'));
import Loader from "src/layouts/loader";
import { voiceAccentOptions, voiceAgeOptions, voiceGenderOptions } from "src/utils/dashboard-static-data";
import { TTSReducer } from "src/utils/utilities";
const TTSVoiceSelect = loadable(() => import("src/layouts/text-to-speech-voice-select"));
import { ConfigErr } from "src/components/dashboard/configErr";
import fileDownload from "js-file-download";
import { useCookies } from 'react-cookie';
import {useLocalStorage} from '@uidotdev/usehooks';
import VoiceCloningPanel from "src/layouts/voice-cloning-panel";
export default function TTSDashboard() {
    const TTSInitialState = {
        age: "Choose",
        gender: "Choose",
        accent: "Choose",
        stability: 0.50,
        clarity: 0.75,
        exaggeration: 0.00
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
    const [voices, setVoices] = useLocalStorage('voices');
    const [voice, setVoice] = useState();
    const [filteredVoices, setFilteredVoices] = useState();
    const [resultsAmount, setResultsAmount] = useState(10);
    const [configError, setConfigError] = useState(false);
    const [filteredVoicesNameFilter, setFilteredVoicesNameFilter] = useState("");
    const voiceNameFilterRegEx = new RegExp(filteredVoicesNameFilter, "i");
    const [cookies, setCookie] = useCookies('[csrf]');

    useEffect(() => {
        (async () => {
            if (voices) {
                filterVoices();
            }
            else {
                ((await import("src/utils/utilities")).getVoices(setVoices));
        
            }
        })();

    }, [TTSProps.age, TTSProps.gender, TTSProps.accent, selectedCategory,setVoices]);

    const filteredVoicesWName = filteredVoices ? filteredVoices.filter(voice => voiceNameFilterRegEx.test(voice.name)) : filteredVoices;

    async function filterVoices() {
        const filteredArr = (await import("src/utils/utilities")).filterVoices(TTSProps, voices, selectedCategory);
        setFilteredVoices(filteredArr);
    }
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
                        voiceId: voice,
                        clarity: TTSProps.clarity,
                        stability: TTSProps.stability,
                    }, file, "mp3", stateSetters, 'api/text-to-speech', false, cookies.csrf);
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
                    voiceId: voice,
                    clarity: TTSProps.clarity,
                    stability: TTSProps.stability,
                }, file, "mp3", stateSetters, 'api/text-to-speech', false, cookies.csrf);
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
    const ranges = [
        {
            heading: "Stability",
            leftTooltip: {
                heading: "More Variable",
                description: "Increasing variability can make speech more expressive with output varying between re-generations. It can also lead to instabilities."
            },
            value: TTSProps.stability,
            setValue: passToReducer,
            name: "Stability",
            rightTooltip: {
                heading: "More Stable",
                description: "Increasing stability will make the voice more consistent between re-generations, but it can also make it sounds a bit monotone. On longer text fragments we recommend lowering this value."
            },
        },
        {
            heading: "Clarity + Similarity Enhancement",
            leftTooltip: {
                heading: "Low",
                description: "Low values are recommended if background artifacts are present in generated speech."
            },
            value: TTSProps.clarity,
            setValue: passToReducer,
            name: "Clarity",
            rightTooltip: {
                heading: "High",
                description: "High enhancement boosts overall voice clarity and target speaker similarity. Very high values can cause artifacts, so adjusting this setting to find the optimal value is encouraged."
            },
        },
    ]
    return (

        <div className="text-to-speech-dashboard">
            <Suspense fallback={<Loader />}>
                <DashboardHeader />
                <ContentContainer containerClass="text-to-speech-dashboard__container">
                    <ContentContainer containerClass="tex-to-speech-dashboard__primary-voices-container">
                        <DashboardLeftSection headings={["Text-To-Speech", "Input Your Text", "Attach Text File", "File Output"]} ranges={ranges} controls={controls} setTextInput={setTextInput} setAbleToTranslate={setAbleToTranslate} textInput={textInput} handleTextChange={handleTextInput} mainAction={sendToSynthetize} isTranslated={isTranslated} downloadFile={downloadFile} setFile={setFile} file={file} errorAtDownload={errorAtDownload} setErrorAtDownload={setErrorAtDownload} acceptedFormats="text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" instructionHeading={instructionHeading} instructionSteps={instructionSteps} />
                        {filteredVoices && <TTSVoiceSelect specificVoiceSettingsActions={specificVoiceSettingsActions} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} voices={filteredVoicesWName.slice(0, resultsAmount)} setVoice={setVoice} voice={voice} setResultsAmount={setResultsAmount} totalVoicesLength={filteredVoicesWName.length} resultsAmount={resultsAmount} setFilteredVoicesNameFilter={setFilteredVoicesNameFilter} />}
                    </ContentContainer>
                    {configError && <ConfigErr errMessage={configError} />}
                </ContentContainer>
                {loadingState === true && <Loader />}

            </Suspense>
        </div>
    )
}



