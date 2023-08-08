import { lazy, useRef } from "react";
const Carousel = lazy(() => import("src/components/carousel/carousel").then(module => {
    return {default: module.Carousel}
}))
const Pricing = lazy(() => import('./pricing-box').then(module => {
    return {default: module.Pricing}
}))
import { SectionHeading } from "src/components/section-heading";
import pricingCarouselButtonImage from 'src/assets/images/pricing-carousel-button.png';
import webpPricingCarouselButtonImage from 'src/assets/images/pricing-carousel-button.webp';

export function PricingContainer() {
    const carouselRef = useRef();
    const packagesAmounts = [["10,000", "10", "5", "5"], ["25,000", "15", "10", "10"], ["50,000", "25", "20", "20"],["?","?","?","?"]];
    return (
        <div className="pricing-section__container" >
            <SectionHeading heading="Find Your Ideal Fit: Flexible Pricing for Every Content Creator's Journey!" />
            <Carousel images={[pricingCarouselButtonImage, webpPricingCarouselButtonImage]} alt="carousel button" imgWidth="96px" imgHeight="96px" ref={carouselRef}>
                <div className="pricing-section__boxes-container">
                    <Pricing price="35$" packageName="Starter" heading="Unlock Your Voice: Get Started with Seamless Speech Conversion" buttonText="Get Started Now" includedItems={packagesAmounts[0]} />
                    <Pricing price="50$" packageName="Essential" heading="Empower Your Content: Elevate Your Creations with Essential Tools" buttonText="Upgrade Today" includedItems={packagesAmounts[1]} />
                    <Pricing price="80$" packageName="Professional" heading="Unlock Your Voice: Get Started with Seamless Speech Conversion" buttonText="Unlock More Power" includedItems={packagesAmounts[2]} />
                    <Pricing price={"Flexible"} packageName="Enterprise" heading="Custom Solutions for Limitless Potential: Elevate Your Content Strategy Today!" buttonText="Contact" includedItems={packagesAmounts[3]} />
                </div>
            </Carousel>
        </div>
    )
}