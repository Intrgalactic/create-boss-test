import videoPreviewFullImage from 'src/assets/images/video-preview-full.jpg';
import webpVideoPreviewFullImage from 'src/assets/images/video-preview-full.webp';
import mobileVideoPreviewFullImage from 'src/assets/images/mobile-video-preview-full.jpg';
import mobileWebpVideoPreviewFullImage from 'src/assets/images/mobile-video-preview-full.webp';
import playBtnImg from 'src/assets/images/play-button.png';
import webpPlayBtnImg from 'src/assets/images/play-button.webp';

import { Picture } from './picture';
import useWindowSize from 'src/hooks/useWindowSize';
import { useEffect, useState } from 'react';

export function VideoPreview() {
    const windowSize = useWindowSize();
    const [images,setImages] = useState([]);
    useEffect(() => {
        if (windowSize.width < 1440 && windowSize.width > 768) {
            setImages([mobileWebpVideoPreviewFullImage,mobileVideoPreviewFullImage]);
        }
        else {
            setImages([webpVideoPreviewFullImage,videoPreviewFullImage]);
        }
    })
    return (
        <div className="video-preview">
            <Picture images={images} alt="video edit preview" imgWidth="100%" imgHeight="100%"/>
            <div className='video-controls'>
                <button><Picture images={[webpPlayBtnImg,playBtnImg]} alt="play button" imgWidth="125px" imgHeight="100px"/></button>
            </div>
        </div>
    )
}