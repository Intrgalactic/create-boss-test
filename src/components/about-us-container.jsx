import { SectionHeading } from "./section-heading";
import about from 'src/assets/images/about-us.png';
import webpAbout from 'src/assets/images/about-us.webp';
import { ContentContainer } from "./content-container";
import { Picture } from "./picture";

export function AboutUsContainer() {
    return (
        <div className="about-us-section__container">
            <SectionHeading heading="Empowering Voices, Redefining Communication: Our Story at CreateBoss" />
            <p className="section-heading-description">Step into the world of CreateBoss, where every word becomes a powerful tool for change and connection.</p>
            <ContentContainer containerClass="about-us-section__content">
                <Picture images={[about,webpAbout]} alt="about us" imgWidth="483px" imgHeight="610px"/>
                <p>At CreateBoss, we are trailblazers in the field of speech conversion, revolutionizing the way content is created and communicated. Headquartered in Poland, we are a powerhouse of innovation and cutting-edge technology, setting new industry standards and exceeding expectations.
                    <br/>
                    <br/>
                    Our relentless commitment to excellence and our passion for transforming the spoken word into powerful written content have positioned us as industry disruptors. As a trusted partner for businesses and content creators alike, we empower our clients to unleash the full potential of their messages.
                    <br/>
                    <br/>
                    Driven by a team of seasoned experts and powered by state-of-the-art AI technology, we deliver unparalleled accuracy and efficiency in every aspect of speech-to-text, text-to-speech, and subtitles. Our goal is to break barriers, amplify voices, and make impactful connections on a global scale.
                    <br/>
                    <br/>
                    Join the ranks of our satisfied clients who have experienced the power of our services firsthand. Embrace the future of speech conversion with confidence, knowing that you are partnering with the pioneers of the industry. Let us propel your communication to new heights and open doors to endless possibilities. Together, we are redefining the world of speech conversion, and we're just getting started.</p>
            </ContentContainer>
        </div>
    )
}