import { SectionHeading } from "src/components/section-heading";

export function DashboardBox({heading,children}) {
    return (
        <div className="dashboard__box">
            <SectionHeading heading={heading}/>
            {children}
        </div>
    )
}