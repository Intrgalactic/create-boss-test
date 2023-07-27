import { lazy, useEffect, useRef, useState } from "react";

import { Picture } from "./picture";
import { ContentContainer } from "./content-container";
import { ContentBox } from "./content-box";
import { SectionHeading } from "./section-heading";

export function ServiceOverviewContainer({heading,imagePaths,buttonText}) {
    return (
        <div className="service-overview-section__container" >
            <SectionHeading heading={heading} />
            <ContentContainer containerClass="service-overview-section__boxes-container">
                <ContentBox heading="Getting Subtitles from Video" description="Extract accurate subtitles effortlessly, repurposing video content for wider reach and engagement." boxClass="service-overview__box " buttonText={buttonText}>
                    <Picture images={imagePaths[0]} imgWidth="116.67px" imgHeight="75px" alt="camera" />
                </ContentBox>
                <ContentBox heading="Adding Subtitles to Video" description="Enhance engagement with professional subtitles, making videos accessible and inclusive." boxClass="service-overview__box " buttonText={buttonText}>
                    <Picture images={imagePaths[1]} imgWidth="105px" imgHeight="75px" alt="subtitles" />
                </ContentBox>
                <ContentBox heading="Speech To Text" description="Efficiently transcribe spoken words into editable text, saving time and increasing productivity for interviews, lectures, and meetings." boxClass="service-overview__box " buttonText={buttonText}>
                    <Picture images={imagePaths[2]} imgWidth="100px" imgHeight="75px" alt="qoutes" />
                </ContentBox>
                <ContentBox heading="Text To Speech " description="Transform written content into captivating audio experiences with customizable voices for books, podcasts, and presentations" boxClass="service-overview__box " buttonText={buttonText}>
                    <Picture images={imagePaths[3]} imgWidth="37.5px" imgHeight="75px" alt="microphone" />
                </ContentBox>
            </ContentContainer>
        </div>
    )
}