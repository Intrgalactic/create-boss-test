import { SectionHeading } from "src/components/section-heading";
import { motion } from "framer-motion";

export function DashboardServiceInputContainer({heading,children,inputClass}) {
    return (
        <motion.div className={`dashboard__service-input-container ${inputClass ? inputClass : ''}`} initial={{x:-100,opacity:0}} animate={{x:0,opacity:1}} transition={{ease:"easeInOut"}}>
            {heading && <SectionHeading heading={heading}/>}
            {children}
        </motion.div>
    )
}