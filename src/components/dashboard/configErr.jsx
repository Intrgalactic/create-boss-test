import { motion } from "framer-motion"
import { useRef } from "react";

export function ConfigErr({ errMessage }) {
    const divRef = useRef();
    if (divRef.current) {
        setTimeout(() => {
            divRef.current.classList.add("disabled-config-err");
        }, 5000);
        setTimeout(() => {
            divRef.current.classList.remove("disabled-config-err");
        }, 5400);
    }
    return (
        <div ref={divRef}>
            <motion.div className="config-err" initial={{ opacity: 0, top: -200 }} animate={{ opacity: 1, top: 20 }} transition={{ duration: 0.3 }} >
                <p>An error during the process</p>
                <p>{errMessage}</p>
            </motion.div>
        </div>
    )
}