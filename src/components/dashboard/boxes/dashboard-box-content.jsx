import { motion } from "framer-motion"

export function DashboardBoxContent({children,boxClass}) {
    return (
        <motion.div className={`dashboard__box-content ${boxClass ? boxClass : ""}`} initial={{opacity:0,x:-100}} animate={{opacity:1,x:0}} transition={{ease:"easeInOut"}}>
            {children}
        </motion.div>
    )
}