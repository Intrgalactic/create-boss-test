import { Picture } from "src/components/picture";

export function PlanDetailsRecord({images,heading,description,alt,imgWidth,imgHeight}) {
    return (
        <div className="dashboard_plan-details-record">
            <Picture images={images} imgWidth={imgWidth} imgHeight={imgHeight} alt={alt}/>
            <p>{heading}</p>
            <p>{description}</p>
        </div>
    )
}