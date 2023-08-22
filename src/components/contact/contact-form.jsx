import { CtaButton } from "src/components/cta-button";
import { TermsCheckbox } from "src/components/terms-label";
import { motion } from "framer-motion";

export function ContactForm() {
    return (
        <motion.form initial={{x:-500}} animate={{x:0}}>
            <input type="text" placeholder="Name"/>
            <input type="text" placeholder="Last name"/>
            <input type="text" placeholder="E-mail"/>
            <textarea placeholder="Inquiry">
            </textarea>
            <TermsCheckbox/>
            <CtaButton text="Send"/>
        </motion.form>
    )
}