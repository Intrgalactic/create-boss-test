import { SectionHeading } from "src/components/section-heading";

export default function DashboardServiceOptionsContainer({heading,children}) {
    return (
        <div className="dashboard__service-options-container">
            <SectionHeading heading={heading}/>
            {children}
        </div>
    )
}