import { Picture } from "src/components/picture";
import trustImage from 'src/assets/images/trust.png';
import webpTrustImage from 'src/assets/images/trust.webp';

export function Testimonial({images,alt,imgWidth,imgHeight,description,fullName}) {
    return (
        <div className="testimonial__box">
            <div className="testimonial__box-user-details">
                <Picture images={images} alt={alt} imgWidth={imgWidth} imgHeight={imgHeight}/>
                <p>{fullName}</p>
            </div>
            <p>{description}</p>
            <Picture images={[webpTrustImage,trustImage]} alt="trust stars" imgWidth="300px" imgHeight="50px"/>
        </div>
    )
}