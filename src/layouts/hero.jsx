import { CtaButton } from "src/components/cta-button";
import { motion } from "framer-motion";
export default function Hero() {
    const initialTextProps = {
        opacity:0,
    }
    const animateTextProps = {
        opacity:1,
    }
    return (
        <motion.div className="hero-section" initial={{opacity:0,top:-400}} whileInView={{opacity:1,top:0}} transition={{duration:0.3}}>
            <div className="hero-section__container">
                <motion.h1 initial={initialTextProps} transition={{duration:0.5}} animate={animateTextProps}>CreateBoss - The One Stop<br />Shop For Any Content Creator</motion.h1>
                <motion.p initial={initialTextProps} transition={{duration:0.5}} animate={animateTextProps}>Unleash Your Content's Full Potential with CreateBoss - Your All-in-One Hub for Speech Conversion and Video Subtitles.</motion.p>
                <CtaButton text="Try Now"/>
            </div>
        </motion.div>
    )
}