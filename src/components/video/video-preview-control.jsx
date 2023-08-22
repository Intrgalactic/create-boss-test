import { forwardRef } from "react"
import { motion } from "framer-motion"

export const VideoPreviewControl = forwardRef((props, ref) => {
    return (
        <motion.div className="video-preview__control" onClick={props.onClick} ref={ref} initial={{y:-200,opacity:0}} animate={{y:0,opacity:1}} transition={{ease:"easeInOut"}}>
            {props.children}
        </motion.div>
    )
})
