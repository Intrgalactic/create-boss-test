import { Picture } from "src/components/picture";
import { motion } from "framer-motion";

export function PlanDetailsRecord({ images, heading, description, alt, imgWidth, imgHeight }) {
    return (
        <div className="dashboard_plan-details-record">
            <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                <Picture images={images} imgWidth={imgWidth} imgHeight={imgHeight} alt={alt} />
            </motion.div>
            <p>{heading}</p>
            <p>{description}</p>
        </div>
    )
}