import { CtaButton } from "./cta-button";
import { motion } from "framer-motion";

export function ContentBox({ heading, description, children,boxClass,buttonText }) {
    return (
        <motion.div className={`content-box ${boxClass ? boxClass : ''}`} whileHover={{scale:1.2}} transition={{duration:0.1}}>
            {children}
            <h3>{heading}</h3>
            <p>{description}</p>
            {buttonText ? <CtaButton text={buttonText}/> : null}
        </motion.div>
    )
}