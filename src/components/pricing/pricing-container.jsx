import { lazy, useRef } from "react";
const Carousel = lazy(() => import("src/components/carousel/carousel").then(module => {
    return { default: module.Carousel }
}))
const Pricing = lazy(() => import('./pricing-box').then(module => {
    return { default: module.Pricing }
}))
import { SectionHeading } from "src/components/section-heading";
import pricingCarouselButtonImage from 'src/assets/images/pricing-carousel-button.png';
import webpPricingCarouselButtonImage from 'src/assets/images/pricing-carousel-button.webp';

export function PricingContainer() {
    const carouselRef = useRef();
    const packagesAmounts = [["10,000", "10", "5", "5","All Filler Words Removal"], ["25,000", "15", "10", "10","Access to Video Enhancer", "Advanced Options For Subtitles","Audio Quality Enhancer","All Filler Words Removal"], ["100,000", "25", "20", "20","Access to Video Enhancer", "Advanced Options For Subtitles","Audio Quality Enhancer","All Filler Words Removal","Studio Quality For Text To Speech","Access to Voice Cloning", "Instant Personal Support"], ["?", "?", "?", "?","Access to Video Enhancer", "Advanced Options For Subtitles","Audio Quality Enhancer","All Filler Words Removal","Studio Quality For Text To Speech","Access to Voice Cloning", "Instant Personal Support","Access to High Volume Use"]];
    const starterServices = ["Text to Speech", "Speech to Text", "Subtitles to Video", "Subtitles from Video","All Filler Words Removal"];
    const essentialServices = ["Text to Speech", "Speech to Text", "Subtitles to Video", "Subtitles from Video","All Filler Words Removal","Access to Video Enhancer", "Advanced Options For Subtitles","Audio Quality Enhancer"];
    const professionalServices = ["Text to Speech", "Speech to Text", "Subtitles to Video", "Subtitles from Video","All Filler Words Removal","Access to Video Enhancer", "Advanced Options For Subtitles","Audio Quality Enhancer","Studio Quality For Text To Speech","Access to Voice Cloning", "Instant Personal Support"];
    const enterpriseServices = ["Text to Speech", "Speech to Text", "Subtitles to Video", "Subtitles from Video","All Filler Words Removal","Access to Video Enhancer", "Advanced Options For Subtitles","Audio Quality Enhancer","Studio Quality For Text To Speech","Access to Voice Cloning", "Instant Personal Support","Access to High Volume Use"]

    const starterDescriptions = ["words per month", "hours of audio per month", "hours of videos per month", "hours of videos per month",'Yes','Yes','Yes'];
    const essentialDescriptions = ["words per month", "hours of audio per month", "hours of videos per month", "hours of videos per month",'Yes','Yes','Yes','Yes','Yes','Yes','Yes','Yes'];
    const professionalDescriptions = ["words per month", "hours of audio per month", "hours of videos per month", "hours of videos per month",'Yes','Yes','Yes','Yes','Yes','Yes','Yes','Yes','Yes','Yes'];
    const enterpriseDescriptions = ["words per month", "hours of audio per month", "hours of videos per month", "hours of videos per month"];

    return (
        <div className="pricing-section__container" >
            <SectionHeading heading="Find Your Ideal Fit: Flexible Pricing for Every Content Creator's Journey!" />
            <Carousel images={[pricingCarouselButtonImage, webpPricingCarouselButtonImage]} alt="carousel button" imgWidth="96px" imgHeight="96px" ref={carouselRef}>
                <div className="pricing-section__boxes-container">
                    <Pricing price="35$" packageName="Starter" heading="Unlock Your Voice: Get Started with Seamless Speech Conversion" buttonText="Get Started Now" includedItems={packagesAmounts[0]} services={starterServices} descriptions={starterDescriptions} />
                    <Pricing price="50$" packageName="Essential" heading="Empower Your Content: Elevate Your Creations with Essential Tools" buttonText="Upgrade Today" includedItems={packagesAmounts[1]} services={essentialServices} descriptions={essentialDescriptions} />
                    <Pricing price="80$" packageName="Professional" heading="Unlock Your Voice: Get Started with Seamless Speech Conversion" buttonText="Unlock More Power" includedItems={packagesAmounts[2]} services={professionalServices} descriptions={professionalDescriptions} />
                    <Pricing price={"Flexible"} packageName="Enterprise" heading="Custom Solutions for Limitless Potential: Elevate Your Content Strategy Today!" buttonText="Contact" includedItems={packagesAmounts[3]} services={enterpriseServices} descriptions={enterpriseDescriptions} />
                </div>
            </Carousel>
        </div>
    )
}
