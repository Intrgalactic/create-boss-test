import { SectionHeading } from "src/components/section-heading";
import DashboardServiceOptionsContainer from "./dashboard-service-options-container";

export default function DashboardRightSection({configurationHeading,children}) {
    return (
        <div className="dashboard__right-section">
            <SectionHeading heading="Configuration"/>
            <DashboardServiceOptionsContainer heading={configurationHeading}>
                {children}
            </DashboardServiceOptionsContainer>
        </div>
    )
}