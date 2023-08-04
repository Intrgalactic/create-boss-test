
import { Suspense, lazy } from "react";
import { SectionHeading } from "./section-heading";
import Loader from "src/layouts/loader";

const ServiceOverviewContainer = lazy(() => import('src/components/service-overview-container').then(module => {
    return {default:module.ServiceOverviewContainer}
}))

export function OnBoardContainer() {
    return (
        <Suspense fallback={<Loader />}>
            <div className="onboard-container">
                <SectionHeading heading="Welcome Onboard! Your Journey with Us Begins Now. Choose Your Preferred Service to Get Started!" />
                <ServiceOverviewContainer />
            </div>
        </Suspense>
    )
}