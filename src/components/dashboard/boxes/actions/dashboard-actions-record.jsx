import { Picture } from "src/components/picture";
import { SectionHeading } from "src/components/section-heading";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function DashboardActionsRecord({ heading, images, imgHeight, imgWidth, alt, actions }) {
    return (
        <div className="dashboard__actions-record">
            <div className="dashboard__actions-record-heading">
                <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <Picture images={images} imgHeight={imgHeight} imgWidth={imgWidth} alt={alt} />
                </motion.div>
                <SectionHeading heading={heading} />
            </div>
            <div className="dashboard__actions-record-actions">
                {actions.map((action, index) => (
                    <div className="dashboard__actions-record-actions-record" key={index}>
                        <Picture images={action.images} imgHeight={action.imgHeight} imgWidth={action.imgWidth} alt={action.alt} />
                        <Link to={`${action.link}`}>{action.linkDescription}</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}