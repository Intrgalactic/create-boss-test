import { DashboardSelectButton } from "../dashboard/service-option/dashboard-select-button";
import { dashboardSelectButtonContext } from "src/context/DashboardSelectButtonContext";
export function SpecificVoiceSettingSelect({ heading, settings }) {
    return (
        <div className="specific-voice-setting-select">
            <h3>{heading}</h3>
            < dashboardSelectButtonContext.Provider value={settings}>
                <DashboardSelectButton />
            </ dashboardSelectButtonContext.Provider>
        </div>
    )
}