import { CtaButton } from "./cta-button";

export function ContactForm() {
    return (
        <form>
            <input type="text" placeholder="Name"/>
            <input type="text" placeholder="Last name"/>
            <input type="text" placeholder="E-mail"/>
            <textarea placeholder="Inquiry">

            </textarea>
            <label>
                <input type="checkbox"/>
                <p>have read the cancellation policy and agree with the terms and conditions.</p>
            </label>
            <CtaButton text="Send"/>
        </form>
    )
}