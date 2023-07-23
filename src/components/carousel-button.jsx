import { Picture } from "./picture";

export function CarouselButton({images,alt,imgWidth,imgHeight,onClick,buttonClass}) {
    return (
        <img src={images[1]} alt={alt} width={imgWidth} height={imgHeight} loading="lazy" className={`carousel-button ${buttonClass}`} onClick={onClick}/> 
    )
}