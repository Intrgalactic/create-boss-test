import { forwardRef } from "react"
import { motion } from "framer-motion"
import { useLocation } from "react-router-dom"

export const CtaButton = forwardRef((props, ref) => {
    const location = useLocation();
    return (
        <>
            {!location.pathname.includes("dashboard") ?
                <motion.button className="call-to-action-btn" ref={ref} onClick={props.action} transition={{ duration: 0.1 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.2 }}>
                    {props.text}
                </motion.button>
                :
                <button className="call-to-action-btn" ref={ref} onClick={props.action}>
                    {props.text}
                </button>
            }
        </>
    )
})