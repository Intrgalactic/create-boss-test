import { ContactForm } from "./contact-form";
import { ContentContainer } from "src/components/content-container";
import { SectionHeading } from "src/components/section-heading";

export function ContactContainer() {
    return (
        <div className="contact-section__container">
            <ContentContainer containerClass="contact-heading-description">
                <SectionHeading heading="Contact Us"/>
                <p>Have questions or need assistance? Reach out to our friendly team of experts today! We are here to help you with any 
                    inquiries or concerns you may have about our speech conversion services. Let's start a conversation and find the perfect solution for your needs.</p>
            </ContentContainer>
            <ContentContainer containerClass="contact-section__form-container">
                <ContactForm/>
            </ContentContainer>
        </div>
    )
}