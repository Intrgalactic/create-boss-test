import { SectionHeading } from "./section-heading";

export function DashboardBox({heading}) {
    return (
        <div className="dashboard__box">
            <SectionHeading heading={heading}/>
            {children}
        </div>
    )
}