import { HeaderContainer } from "src/components/header/header-container";
import { motion } from "framer-motion";
import useWindowSize from "src/hooks/useWindowSize";

export default function DashboardHeader() {
    const windowSize = useWindowSize();
    return (
        <motion.header className="dashboard-header" initial={windowSize.width > 768 ? {x:-300} : {y:-300}} animate={windowSize.width > 768 ? {x:0} : {y:0}} transition={{ease:"easeInOut"}}>
            <HeaderContainer/>
        </motion.header>
    )
}