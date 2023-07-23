import { ContentContainer } from "src/components/content-container";
import { CtaButton } from "src/components/cta-button";

export default function Callout({heading,description,btnText}) {
    return (
        <div className="callout">
            <ContentContainer containerClass="callout-heading-description">
                <h3>{heading}</h3>
                <p>{description}</p>
            </ContentContainer>
            <CtaButton text={btnText}/>
        </div>
    )
}