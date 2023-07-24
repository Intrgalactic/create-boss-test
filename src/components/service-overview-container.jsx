import { lazy, useEffect, useRef, useState } from "react";

import speechToTextImage from 'src/assets/images/speech-to-text.png';
import webpSpeechToTextImage from 'src/assets/images/speech-to-text.webp';
import textToSpeechImage from 'src/assets/images/text-to-speech.png';
import webpTextToSpeechImage from 'src/assets/images/text-to-speech.webp';
import subtitlesToVideoImage from 'src/assets/images/subtitles-to-video.png';
import webpSubtitlesToVideoImage from 'src/assets/images/subtitles-to-video.webp';
import subtitlesFromVideoImage from 'src/assets/images/subtitles-from-video.png';
import webpSubtitlesFromVideoImage from 'src/assets/images/subtitles-from-video.webp';
import { Picture } from "./picture";
import { ContentContainer } from "./content-container";
const ServiceOverviewBox = lazy(() => import('./content-box').then(module => {
    return { default: module.ServiceOverviewBox }
}))
import { ContentBox } from "./content-box";
import { SectionHeading } from "./section-heading";

export function ServiceOverviewContainer() {
    const boxesRef = useRef();
    var timeout = 2000;
    const [isScrollingDone,setIsScrollingDone] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                const childrens = boxesRef.current.childNodes[1];
                document.body.style.overflowY = "hidden";
                const length = window.innerWidth < 512 ? childrens.childNodes.length : childrens.childNodes.length / 2;
                for (let i = 1; i < childrens.childNodes.length; i++) {
                    setTimeout(() => {
                        childrens.childNodes[i].scrollIntoView({ behavior: "smooth", inline: "nearest", block: "center" });
                    }, timeout);
                    timeout += 2000;
                }
                setTimeout(() => {
                    document.body.style.overflowY = "scroll";
                    setIsScrollingDone(true);
                }, length * 2000);
            }
        }, {
            threshold: 1,
        });
        if (boxesRef.current && !isScrollingDone) {
            if (window.innerWidth <= 768) {
                observer.observe(boxesRef.current);
            }
        }
        else if (isScrollingDone && boxesRef.current) {
            observer.unobserve(boxesRef.current);
        }
        return () => {
            observer.unobserve(boxesRef.current);
        }
    }, [boxesRef,isScrollingDone]);
    function scrollWithTimeout() {

    }
    return (
        <div className="service-overview-section__container" ref={boxesRef}>
            <SectionHeading heading="Time and Streamline Your Workflow with Our Services" />
            <ContentContainer containerClass="service-overview-section__boxes-container">
                <ContentBox heading="Getting Subtitles from Video" description="Extract accurate subtitles effortlessly, repurposing video content for wider reach and engagement." boxClass="service-overview__box ">
                    <Picture images={[subtitlesFromVideoImage, webpSubtitlesFromVideoImage]} imgWidth="116.67px" imgHeight="75px" alt="camera" />
                </ContentBox>
                <ContentBox heading="Adding Subtitles to Video" description="Enhance engagement with professional subtitles, making videos accessible and inclusive." boxClass="service-overview__box ">
                    <Picture images={[subtitlesToVideoImage, webpSubtitlesToVideoImage]} imgWidth="105px" imgHeight="75px" alt="subtitles" />
                </ContentBox>
                <ContentBox heading="Speech To Text" description="Efficiently transcribe spoken words into editable text, saving time and increasing productivity for interviews, lectures, and meetings." boxClass="service-overview__box ">
                    <Picture images={[speechToTextImage, webpSpeechToTextImage]} imgWidth="100px" imgHeight="75px" alt="qoutes" />
                </ContentBox>
                <ContentBox heading="Text To Speech " description="Transform written content into captivating audio experiences with customizable voices for books, podcasts, and presentations" boxClass="service-overview__box ">
                    <Picture images={[textToSpeechImage, webpTextToSpeechImage]} imgWidth="37.5px" imgHeight="75px" alt="microphone" />
                </ContentBox>
            </ContentContainer>
        </div>
    )
}