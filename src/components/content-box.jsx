import { CtaButton } from "./cta-button";

export function ContentBox({ heading, description, children,boxClass,buttonText }) {
    return (
        <div className={`content-box ${boxClass ? boxClass : ''}`}>
            {children}
            <h3>{heading}</h3>
            <p>{description}</p>
            {buttonText ? <CtaButton text={buttonText}/> : null}
        </div>
    )
}