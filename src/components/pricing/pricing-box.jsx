import { Suspense, lazy, useRef, useState } from "react";
import { ContentContainer } from "src/components/content-container";
import Loader from "src/layouts/loader";
import { CtaButton } from "../cta-button";
import { Picture } from "../picture";
import expandImage from 'src/assets/images/pricing-expand.png';
import webpExpandImage from 'src/assets/images/pricing-expand.webp';
import { expandList } from "src/utils/utilities";
const PricingItem = lazy(() => import('./pricing-box-item').then(module => {
    return { default: module.PricingItem }
}))

export function Pricing({ price, packageName, heading, includedItems, buttonText, services, descriptions }) {
    const pricingBoxRef = useRef();
    const listRef = useRef();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="pricing__box">
            <ContentContainer containerClass="pricing__box-container">
                <h3>{packageName}</h3>
                <div className="pricing__box-price-details">
                    <p><font>{price}</font> / Month</p>
                </div>
                <p className="pricing__box-description">{heading}</p>
                <h4>Includes:</h4>
                <div className="pricing__box-expand-list" ref={pricingBoxRef}>
                    <div className="pricing__box-expand-list-container" ref={listRef} onClick={() => { expandList(isExpanded, setIsExpanded, pricingBoxRef, "pricing-expanded-list", listRef) }}>
                        <p>{isExpanded ? "Hide list" : "Expand list"} </p>
                        <Picture images={[webpExpandImage, expandImage]} alt="expand list" imgWidth="54px" imgHeight="54px" />
                    </div>
                    {includedItems.map((item, index) => (
                        <Suspense fallback={<Loader />}>
                            {index <= 3 ? <PricingItem item={item} index={index} service={services[index]} description={descriptions[index]} isCountable={true} /> : <PricingItem item={item} index={index} service={services[index]} description={descriptions[index]} isCountable={false} />}
                        </Suspense>
                    ))}
                </div>
                <CtaButton text={buttonText} />
            </ContentContainer>
        </div>
    )
}