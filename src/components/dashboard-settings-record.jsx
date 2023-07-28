import { CtaButton } from "./cta-button";

export function DashboardSettingsRecord({description,children}) {
    return (
        <div className="dashboard_settings-record">
            <p>{description}</p>
            {children}
        </div>
    )
}