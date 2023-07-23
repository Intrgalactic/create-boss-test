import { ContentContainer } from "./content-container";
import { CtaButton } from "./cta-button";
import { PricingItem } from "./pricing-box-item";

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
                    <PricingItem item={item} index={index} service={services[index]} description={descriptions[index]}/>
                ))}
                <CtaButton text={buttonText} />
            </ContentContainer>
        </div>
    )
}