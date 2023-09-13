
import loadable from "@loadable/component";
const Contact = loadable(() => import("src/layouts/contact"));
const Footer = loadable(() => import("src/layouts/footer"));
const Header = loadable(() => import("src/layouts/header"));
const Hero = loadable(() => import("src/layouts/hero"));
import { Suspense, lazy } from 'react';
const ServiceOverview = lazy(() => import("src/layouts/service-overview"));
const Testimonials = lazy(() => import("src/layouts/testimonials"));
const ServiceOverviewContainer = lazy(() => import("src/components/service-overview-container").then(module => {return {default:module.ServiceOverviewContainer}}));
const Pricing = lazy(() => import("src/layouts/pricing"));
const Benefits = lazy(() => import("src/layouts/benefits"));
import speechToTextImage from 'src/assets/images/speech-to-text.png';
import webpSpeechToTextImage from 'src/assets/images/speech-to-text.webp';
import textToSpeechImage from 'src/assets/images/text-to-speech.png';
import webpTextToSpeechImage from 'src/assets/images/text-to-speech.webp';
import subtitlesToVideoImage from 'src/assets/images/subtitles-to-video.png';
import webpSubtitlesToVideoImage from 'src/assets/images/subtitles-to-video.webp';
import subtitlesFromVideoImage from 'src/assets/images/subtitles-from-video.png';
import webpSubtitlesFromVideoImage from 'src/assets/images/subtitles-from-video.webp';
import Loader from "src/layouts/loader";
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