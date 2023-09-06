import { SectionHeading } from "src/components/section-heading";
import { SelectButton } from "src/components/select-button";
import { SpecificVoiceSettingSelect } from "src/components/voice/specific-voice-setting-select";
import { dashboardSelectButtonContext } from "src/context/DashboardSelectButtonContext";
export default function TTSVoiceSelect({setCategory,specificVoiceSettingsActions,category}) {
    const categoriesArr = ["Advertisment","Narrative & Story","Conversational","Animation","Social Media","Tv","Educational"];
    const specificPropertiesArr = ["Age","Gender","Accent"]
    return (
        <div className="tts-voice-select">
            <SectionHeading heading="Select Your Voice"/>
            <div className="tts-voice-select__category-select">
                {categoriesArr.map((voiceCategory,index) => (
                    <SelectButton heading={voiceCategory} setCategory={setCategory} key={index} category={category}/>
                ))}
            </div>
            <div className="tts-voice-select__specific-property-select">
                    {specificPropertiesArr.map((prop,index) => (
                        <SpecificVoiceSettingSelect heading={prop} key={index} settings={specificVoiceSettingsActions[index]}/>
                    ))}
            </div>
            <div className="tts-voice-select__voice-library">

            </div>
        </div>
    )
}