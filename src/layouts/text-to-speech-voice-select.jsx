import { lazy } from "react";
import DashboardServiceOptionsRow from "./dashboards/service-options/dashboard-service-options-row";
const SearchBar = lazy(() => import("src/components/search-bar").then(module => {
    return { default: module.SearchBar }
}))
const SectionHeading = lazy(() => import('src/components/section-heading').then(module => {
    return { default: module.SectionHeading }
}))
const SelectButton = lazy(() => import('src/components/select-button').then(module => {
    return { default: module.SelectButton }
}))
const SelectVoiceBox = lazy(() => import("src/components/voice/select-voice-box").then(module => {
    return { default: module.SelectVoiceBox }
}))
const SpecificVoiceSettingSelect = lazy(() => import("src/components/voice/specific-voice-setting-select").then(module => {
    return { default: module.SpecificVoiceSettingSelect }
}))
export default function TTSVoiceSelect({ specificVoiceSettingsActions, selectedCategory, setSelectedCategory, voices, voice, setVoice, setResultsAmount, totalVoicesLength, resultsAmount, setFilteredVoicesNameFilter }) {
    const categoriesArr = ["Advertisment", "Narrative & Story", "Conversational", "Animation", "Social Media", "Tv", "Educational", "News Presenter", "Video Games", "Audiobook"];
    const specificPropertiesArr = ["Age", "Gender", "Accent"];
    return (
        <div className="tts-voice-select">
            <SectionHeading heading="Select Your Voice" />
            <div className="voice-select__container">
                <div className="tts-voice-select__search">
                    <SearchBar setFilter={setFilteredVoicesNameFilter} />
                </div>
                <DashboardServiceOptionsRow heading="Voice Category">
                    <div className="tts-voice-select__category-select">
                        {categoriesArr.map((voiceCategory, index) => (
                            <SelectButton heading={voiceCategory} key={index} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                        ))}
                    </div>
                </DashboardServiceOptionsRow>

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