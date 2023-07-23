
export function Picture({images,alt,imgHeight,imgWidth}) {
    return (
        <picture>
            <source srcSet={images[0]}/>
            <source srcSet={images[1]}/>
            <img src={images[1]} alt={alt} width={imgWidth} height={imgHeight} loading="lazy"/> 
        </picture>
    )
}