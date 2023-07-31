import { useState } from "react";
import { ContentContainer } from "src/components/content-container";
import DashboardHeader from "src/layouts/dashboard-header";
import DashboardLeftSection from "src/layouts/dashboard-left-section";
import DashboardRightSection from "src/layouts/dashboard-right-section";
import DashboardServiceOptionsRow from "src/layouts/dashboard-service-options-row";
import { audioSpeedOptions, languagesData, voiceGenderOptions, voicePitchOptions } from "src/utils/dashboard-static-data";
export default function TTSDashboard() {
    const controls = ["Text Length: 0 / 10 000","Able To Translate : Yes","Extension Of Output File : Txt","Translate"];
    const [audioSpeed,setAudioSpeed] = useState("1.0");
    const [voicePitch,setVoicePitch] = useState("0");
    const [language,setLanguage] = useState("English (US)");
    const [voiceGender,setVoiceGender] = useState('Male');
    function setAllOptions () {

    }
    const firstServiceOptionsRowActions = [
        {
            text:audioSpeed,
            options:audioSpeedOptions,
            setOption: setAudioSpeed,
            heading: "Voice Speed",
        },
        {
            text:voicePitch,
            options:voicePitchOptions,
            setOption: setVoicePitch,
            heading: "Voice Pitch",
        },
        {
            text:language,
            options:languagesData,
            setOption: setLanguage,
            heading: "Language",
        },
    ]
     const secondServiceOptionsRowActions = [
        {
            text:voiceGender,
            options:voiceGenderOptions,
            setOption: setVoiceGender,
            heading: "Voice Gender",
        },
        {
            type:"set-to-default-btn",
            text: "Set",
            setOption: setAllOptions,
            heading: "Apply Changes",
        }
    ]
    return (
        <div className="text-to-speech-dashboard">
            <DashboardHeader />
            <ContentContainer containerClass="text-to-speech-dashboard__container">
                <DashboardLeftSection headings={["Text-To-Speech","Input Your Text","Attach Your Text File","File Output"]} controls={controls}/>
                <DashboardRightSection configurationHeading="Default Configuration Is Set To Male Voice With 1.0 Voice Speed Level">
                    <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions}/>
                    <DashboardServiceOptionsRow actions={secondServiceOptionsRowActions}/>
                </DashboardRightSection>
            </ContentContainer>
        </div>
    )
}