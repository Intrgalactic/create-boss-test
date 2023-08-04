import { Suspense, lazy } from "react";
import { ContentContainer } from "src/components/content-container";
import Loader from "src/layouts/loader";
import { CtaButton } from "../cta-button";

const PricingItem = lazy(() => import('./pricing-box-item').then(module => {
    return {default:module.PricingItem}
}))

export function Pricing({ price, packageName, heading, includedItems, buttonText }) {
    const services = ["Text to Speech","Speech to Text","Subtitles to Video","Subtitles from Video"];
    const descriptions = ["words per month", "hours of audio per month","videos per month","videos per month"];
  
    return (
        <div className="pricing__box">
            <ContentContainer containerClass="pricing__box-container">
                <h3>{packageName}</h3>
                <div className="pricing__box-price-details">
                    <p><font>{price}</font> / Month</p>
                </div>
                <p className="pricing__box-description">{heading}</p>
                <h4>Includes:</h4>
                {includedItems.map((item, index) => (
                    <Suspense fallback={<Loader/>}>
                        <PricingItem item={item} index={index} service={services[index]} description={descriptions[index]}/>
                    </Suspense>
                ))}
                <CtaButton text={buttonText} />
            </ContentContainer>
        </div>
    )
}