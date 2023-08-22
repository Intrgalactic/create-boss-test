import { SectionHeading } from "src/components/section-heading";
import { motion } from "framer-motion";

export function AuthContainer({children,heading}) {
    return (
        <motion.div className="auth-container" initial={{opacity:0}} animate={{opacity:1}}>
            <SectionHeading heading={heading} />
            {children}
        </motion.div>
    )
}