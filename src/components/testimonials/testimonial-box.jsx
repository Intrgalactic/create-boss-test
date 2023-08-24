import { Picture } from "src/components/picture";
import trustImage from 'src/assets/images/trust.png';
import webpTrustImage from 'src/assets/images/trust.webp';

export function Testimonial({ images, alt, imgWidth, imgHeight, description, fullName,testimonialHeading }) {
    return (
        <div className="testimonial__box">
            <div className="testimonial-description">
                <h3 className="testimonial-heading">{testimonialHeading}</h3>
                <p className="testimonial-user-description">{description}</p>
                <Picture picClass="testimonial-user-face" images={images} alt={alt} imgWidth={imgWidth} imgHeight={imgHeight} />
            </div>
            <div className="testimonial-user-details">
                <Picture picClass="testimonial-stars" images={[webpTrustImage, trustImage]} alt="trust stars" imgWidth="300px" imgHeight="50px" />
                <p className="testimonial-user-name">{fullName}</p>
            </div>
        </div>
    )
}