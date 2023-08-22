import { HeaderContainer } from "src/components/header/header-container";
import { motion } from "framer-motion";

export default function Header() {
    return (
        <motion.header initial={{opacity:0,top:-200}} animate={{opacity:1,top:0}} transition={{duration:0.3}}>
            <HeaderContainer/>
        </motion.header>
    )
}