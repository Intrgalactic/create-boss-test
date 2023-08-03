import { Picture } from "./picture";

export function FileOutputContent({images,firstText,secondText,imgWidth,imgHeight,alt,children}) {
    return (
        <>
            <Picture images={images} alt={alt} imgWidth={imgWidth} imgHeight={imgHeight}/>
            <p>{firstText}</p>
            {children}
         
        </>
    )
}