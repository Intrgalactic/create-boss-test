import { Carousel } from "../carousel/carousel";
import { Testimonial } from "./testimonial-box";
import testimonialCarouselButton from 'src/assets/images/testimonial-carousel-button.png';
import webpTestimonialCarouselButton from 'src/assets/images/testimonial-carousel-button.webp';
import testimonialuserFaceEx from 'src/assets/images/testimonial-user-face-ex.png';
import webpTestimonialuserFaceEx from 'src/assets/images/testimonial-user-face-ex.webp';
import { useRef } from "react";
import { SectionHeading } from "../section-heading";
export function TestimonialsContainer() { 
    const carouselRef = useRef();
    return (
        <div className="testimonials-section__container">
            <SectionHeading heading="Words of Delight: Hear What Our Customers Say!"/>
            <Carousel images={[testimonialCarouselButton,webpTestimonialCarouselButton]} alt="carousel button" imgWidth="96px" imgHeight="96px" ref={carouselRef}>
                <div className="testimonial-section__boxes-container">
                    <Testimonial images={[webpTestimonialuserFaceEx, testimonialuserFaceEx]} alt="male face" fullName="William Carter"  testimonialHeading="Inclusivity" imgWidth="80px" imgHeight="80px" description="CreateBoss text-to-speech service enhances my audiobooks with a wide variety of customizable voices, enabling me to tailor the narration tone to suit the genre of each book. The expressive and natural delivery captures the characters' essence, captivating my listeners throughout the story." />
                    <Testimonial images={[webpTestimonialuserFaceEx, testimonialuserFaceEx]} alt="male face" fullName="Ethan Mitchell"  testimonialHeading="Accessibility" imgWidth="80px" imgHeight="80px" description="As a content creator, transcribing interviews and podcasts used to be a time-consuming task. Now, with CreateBoss cutting-edge technology, I can easily convert my spoken words into written text in no time. It has truly elevated my content creation process, and I couldn't be happier with the results!" />
                    <Testimonial images={[webpTestimonialuserFaceEx, testimonialuserFaceEx]} alt="female face" fullName="James Rivera" testimonialHeading="Empowerment" imgWidth="80px" imgHeight="80px" description="I needed subtitles for my corporate training videos, and their subtitle extraction service was a lifesaver. Uploading my videos was a breeze, and the accurate subtitles were generated quickly. I was able to edit and fine-tune the subtitles as needed, saving me valuable time." />
                    <Testimonial images={[webpTestimonialuserFaceEx, testimonialuserFaceEx]} alt="female face" fullName="Olivia Martinez" testimonialHeading="Revolution" imgWidth="80px" imgHeight="80px" description="Adding subtitles to my videos has been a game-changer for my online courses. Thanks to CreateBoss professional subtitle service, my content is now accessible to a broader audience, including those with hearing impairments. The subtitles are perfectly synchronized, and the quality is top-notch." />
               </div>
            </Carousel>
        </div>
    )
}