import { Picture } from "./picture";

export function Testimonial({images,alt,imgWidth,imgHeight,description,fullName}) {
    return (
        <div className="testimonial__box">
            <div className="testimonial__box-user-details">
                <Picture images={images} alt={alt} imgWidth={imgWidth} imgHeight={imgHeight}/>
                <p>{fullName}</p>
            </div>
            <p>{description}</p>
        </div>
    )
}