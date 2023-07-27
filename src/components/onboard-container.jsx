
import { SectionHeading } from "./section-heading";
import { ServiceOverviewContainer } from "./service-overview-container";

export function OnBoardContainer() {
    return (
        <div className="onboard-container">
            <SectionHeading heading="Welcome Onboard! Your Journey with Us Begins Now. Choose Your Preferred Service to Get Started!"/>
            <ServiceOverviewContainer/>
        </div>
    )
}