import { CtaButton } from "src/components/cta-button";
import { TermsCheckbox } from "src/components/terms-label";

export function ContactForm() {
    return (
        <form>
            <input type="text" placeholder="Name"/>
            <input type="text" placeholder="Last name"/>
            <input type="text" placeholder="E-mail"/>
            <textarea placeholder="Inquiry">

            </textarea>
            <TermsCheckbox/>
            <CtaButton text="Send"/>
        </form>
    )
}