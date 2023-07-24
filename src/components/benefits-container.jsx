import { ContentBox } from "src/components/content-box";
import { ContentContainer } from "src/components/content-container";
import moneyImage from 'src/assets/images/money.png';
import webpMoneyImage from 'src/assets/images/money.webp';
import { Picture } from "./picture";
import { SectionHeading } from "./section-heading";
import { useEffect, useRef, useState } from "react";
import { detectIsElementVisible, launchObserver } from "src/utils/utilities";
export function BenefitsContainer() {
    const boxesRef = useRef();
    var timeout = 2000;
    const [isScrollingDone, setIsScrollingDone] = useState(false);
    const controller = new AbortController();

    const observer = new IntersectionObserver(entries => {
        detectIsElementVisible(entries[0].isIntersecting,boxesRef,controller,setIsScrollingDone,timeout);
    }, {
        threshold: 1,
    });

    useEffect(() => {
        launchObserver(boxesRef, isScrollingDone, observer);
    }, [boxesRef, isScrollingDone]);
    return (
        <div className="benefits-section__container" ref={boxesRef}>
            <Picture images={[moneyImage, webpMoneyImage]} imgHeight="290.89px" imgWidth="404.25px" alt="money bag" />
            <div className="benefits-section__pre-container">
                <SectionHeading heading="Discover the Advantages of Our Speech Conversion Services" />
                <ContentContainer containerClass="benefits-section__boxes-container">
                    <ContentBox heading="Time-Saving Efficiency" description="Streamline your workflow and save valuable time with automated speech conversion, eliminating tedious manual transcription." boxClass="benefits__box" />
                    <ContentBox heading="Enhanced Accessibility" description="Reach a wider audience by adding professional subtitles or converting text to speech, ensuring inclusivity and engagement." boxClass="benefits__box" />
                    <ContentBox heading="High Accuracy" description="Experience precise transcriptions and conversions with our cutting-edge technology, guaranteeing the fidelity of your content." boxClass="benefits__box" />
                    <ContentBox heading="Boosted Productivity" description="Maximize output and efficiency by eliminating manual transcription, repurposing content, and navigating through files effortlessly." boxClass="benefits__box" />
                </ContentContainer>
            </div>
        </div>
    )
}