import { ServiceOverviewContainer } from "src/components/service-overview-container";

export default function ServiceOverview({children}) {
    return (
        <div className="service-overview-section">
            {children}
        </div>
    )
}