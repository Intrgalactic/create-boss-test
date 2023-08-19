import { Carousel } from "../carousel/carousel";
import { Testimonial } from "./testimonial-box";
import firstTestimonialUserFace from 'src/assets/images/testimonial-face-1.jpg';
import webpFirstTestimonialUserFace from 'src/assets/images/testimonial-face-1.webp';
import secondTestimonialUserFace from 'src/assets/images/testimonial-face-2.jpg';
import webpSecondTestimonialUserFace from 'src/assets/images/testimonial-face-2.webp';
import firstTestimonialFemaleUserFace from 'src/assets/images/testimonial-female-user-face-1.png';
import webpFirstTestimonialFemaleUserFace from 'src/assets/images/testimonial-female-user-face-1.webp';
import secondTestimonialFemaleUserFace from 'src/assets/images/testimonial-female-user-face-2.png';
import webpSecondTestimonialFemaleUserFace from 'src/assets/images/testimonial-female-user-face-2.webp';
import testimonialCarouselButton from 'src/assets/images/testimonial-carousel-button.png';
import webpTestimonialCarouselButton from 'src/assets/images/testimonial-carousel-button.webp';
import { useRef } from "react";
import { SectionHeading } from "../section-heading";
export function TestimonialsContainer() { 
    const carouselRef = useRef();
    return (
        <div className="testimonials-section__container">
            <SectionHeading heading="Words of Delight: Hear What Our Customers Say!"/>
            <Carousel images={[testimonialCarouselButton,webpTestimonialCarouselButton]} alt="carousel button" imgWidth="96px" imgHeight="96px" ref={carouselRef}>
                <div className="testimonial-section__boxes-container">
                    <Testimonial images={[webpFirstTestimonialUserFace, firstTestimonialUserFace]} alt="male face" fullName="David Lee"  imgWidth="80px" imgHeight="80px" description="CreateBoss text-to-speech service has taken my audiobooks to a whole new level. The range of customizable voices allows me to match the tone of the narration to the genre of each book. The natural and expressive delivery captures the essence of the characters and keeps my listeners engaged throughout the story." />
                    <Testimonial images={[secondTestimonialUserFace, webpSecondTestimonialUserFace]} alt="male face" fullName="John Smith"  imgWidth="80px" imgHeight="80px" description="As a content creator, transcribing interviews and podcasts used to be a time-consuming task. Now, with CreateBoss cutting-edge technology, I can easily convert my spoken words into written text in no time. It has truly elevated my content creation process, and I couldn't be happier with the results!" />
                    <Testimonial images={[webpFirstTestimonialFemaleUserFace, firstTestimonialFemaleUserFace]} alt="female face" fullName="Sarah Williams" imgWidth="80px" imgHeight="80px" description="I needed subtitles for my corporate training videos, and their subtitle extraction service was a lifesaver. Uploading my videos was a breeze, and the accurate subtitles were generated quickly. I was able to edit and fine-tune the subtitles as needed, saving me valuable time." />
                    <Testimonial images={[webpSecondTestimonialFemaleUserFace, secondTestimonialFemaleUserFace]} alt="female face" fullName="Emily Johnson" imgWidth="80px" imgHeight="80px" description="Adding subtitles to my videos has been a game-changer for my online courses. Thanks to CreateBoss professional subtitle service, my content is now accessible to a broader audience, including those with hearing impairments. The subtitles are perfectly synchronized, and the quality is top-notch." />
               </div>
            </Carousel>
        </div>
    )
}