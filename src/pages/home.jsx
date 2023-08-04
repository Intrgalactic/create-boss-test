import Pricing from 'src/layouts/pricing'
import Benefits from "src/layouts/benefits";
import Contact from "src/layouts/contact";
import Footer from "src/layouts/footer";
import Header from "src/layouts/header";
import Hero from "src/layouts/hero";
import ServiceOverview from "src/layouts/service-overview";
import Testimonials from "src/layouts/testimonials";
import { ServiceOverviewContainer } from 'src/components/service-overview-container';
import speechToTextImage from 'src/assets/images/speech-to-text.png';
import webpSpeechToTextImage from 'src/assets/images/speech-to-text.webp';
import textToSpeechImage from 'src/assets/images/text-to-speech.png';
import webpTextToSpeechImage from 'src/assets/images/text-to-speech.webp';
import subtitlesToVideoImage from 'src/assets/images/subtitles-to-video.png';
import webpSubtitlesToVideoImage from 'src/assets/images/subtitles-to-video.webp';
import subtitlesFromVideoImage from 'src/assets/images/subtitles-from-video.png';
import webpSubtitlesFromVideoImage from 'src/assets/images/subtitles-from-video.webp';
import { Suspense } from 'react';
import Loader from 'src/layouts/loader';
export default function Home() {
    const imagePaths = [
        [subtitlesFromVideoImage, webpSubtitlesFromVideoImage],
        [subtitlesToVideoImage, webpSubtitlesToVideoImage],
        [speechToTextImage, webpSpeechToTextImage],
        [textToSpeechImage, webpTextToSpeechImage]
    ];
    return (
        <>
            <Suspense fallback={<Loader />}>
                <Header />
                <Hero />
                <ServiceOverview>
                    <ServiceOverviewContainer heading="Time and Streamline Your Workflow with Our Services" imagePaths={imagePaths} />
                </ServiceOverview>
                <Benefits />
                <Testimonials />
                <Pricing />
                <Contact />
                <Footer />
            </Suspense>
        </>
    )
}