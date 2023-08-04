import { SectionHeading } from "src/components/section-heading";

export function DashboardServiceInputContainer({heading,children,inputClass}) {
    return (
        <div className={`dashboard__service-input-container ${inputClass ? inputClass : ''}`}>
            {heading && <SectionHeading heading={heading}/>}
            {children}
        </div>
    )
}