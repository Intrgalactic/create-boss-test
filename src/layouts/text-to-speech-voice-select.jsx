import { SearchBar } from "src/components/search-bar";
import { SectionHeading } from "src/components/section-heading";
import { SelectButton } from "src/components/select-button";
import { SelectVoiceBox } from "src/components/voice/select-voice-box";
import { SpecificVoiceSettingSelect } from "src/components/voice/specific-voice-setting-select";
import { dashboardSelectButtonContext } from "src/context/DashboardSelectButtonContext";
export default function TTSVoiceSelect({ specificVoiceSettingsActions, selectedCategory, setSelectedCategory, voices, voice, setVoice, setResultsAmount, totalVoicesLength, resultsAmount,setFilteredVoicesNameFilter }) {
    const categoriesArr = ["Advertisment", "Narrative & Story", "Conversational", "Animation", "Social Media", "Tv", "Educational", "News Presenter", "Video Games", "Audiobook"];
    const specificPropertiesArr = ["Age", "Gender", "Accent"];
    return (
        <div className="tts-voice-select">
            <SectionHeading heading="Select Your Voice" />
            <div className="voice-select__container">
                <div className="tts-voice-select__search">
                    <SearchBar setFilter={setFilteredVoicesNameFilter}/>
                </div>
                <div className="tts-voice-select__category-select">
                    {categoriesArr.map((voiceCategory, index) => (
                        <SelectButton heading={voiceCategory} key={index} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                    ))}
                </div>
                <div className="tts-voice-select__specific-property-select">
                    {specificPropertiesArr.map((prop, index) => (
                        <SpecificVoiceSettingSelect heading={prop} key={index} settings={specificVoiceSettingsActions[index]} setSelectedCategory={setSelectedCategory} />
                    ))}
                </div>
                <div className="tts-voice-select__voice-library">
                    {voices.map((v, index) => (
                        <SelectVoiceBox voice={v} key={index} setVoice={setVoice} usedVoice={voice} />
                    ))}
                    {totalVoicesLength > resultsAmount && <div className="tts-voice-select__load-more" onClick={() => { setResultsAmount(amount => amount + 10) }}>
                        <p>Load More</p>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}