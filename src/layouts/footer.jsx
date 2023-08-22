import { FooterContainer } from "src/components/footer/footer-container";
import Callout from "./callout";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function Footer() {
    const path = useMemo(() =>{return useLocation().pathname});
    return (
        <motion.footer>
            {path !=="/sign-up" ? <Callout heading="Ready to Begin?" description="Start your speech conversion journey today and unlock a world of possibilities with our comprehensive services" btnText="Let's get started!"/> : null}
            <FooterContainer/>
        </motion.footer>
    )
}