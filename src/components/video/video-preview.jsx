import videoPreviewFullImage from 'src/assets/images/video-preview-full.jpg';
import webpVideoPreviewFullImage from 'src/assets/images/video-preview-full.webp';
import mobileVideoPreviewFullImage from 'src/assets/images/mobile-video-preview-full.jpg';
import mobileWebpVideoPreviewFullImage from 'src/assets/images/mobile-video-preview-full.webp';
import playBtnImg from 'src/assets/images/play-button.png';
import webpPlayBtnImg from 'src/assets/images/play-button.webp';
import pauseBtnImg from 'src/assets/images/pause-button.png';
import webpPauseBtnImg from 'src/assets/images/pause-button.webp';

import { Picture } from 'src/components/picture';
import useWindowSize from 'src/hooks/useWindowSize';
import { useEffect, useRef, useState } from 'react';

export function VideoPreview({videoFile,setVideoFile}) {
    const windowSize = useWindowSize();
    const [images,setImages] = useState([]);
    const [videoUrl,setVideoUrl] = useState("");
    const [isPlaying,setIsPlaying] = useState(false);
    const videoRef = useRef();
    useEffect(() => {
        if (windowSize.width < 1440 && windowSize.width > 768) {
            setImages([mobileWebpVideoPreviewFullImage,mobileVideoPreviewFullImage]);
        }
        else {
            setImages([webpVideoPreviewFullImage,videoPreviewFullImage]);
        }
    },[windowSize.width,setImages])
    useEffect(() => {
        if (videoFile) {
            const fileURL = URL.createObjectURL(videoFile);
            setVideoUrl(fileURL);
        }
    },[videoFile,setVideoUrl])
    return (
        <div className="video-preview">
            {!videoFile ?
            <Picture images={images} alt="video edit preview" imgWidth="100%" imgHeight="100%"/>
            : videoFile.type.startsWith("video") ? <video ref={videoRef} className="video-preview__video"  src={videoUrl} type={videoFile.type}/> : <p className="video-file-type-err">The Attached File Is Not A Video</p>
            }
            
            <div className='video-controls'>
                {!isPlaying && videoUrl && (videoFile ? videoFile.type.startsWith("video") : false ) ? <button onClick={() => {videoRef.current.play();setIsPlaying(true)}}>
                    <Picture images={[webpPlayBtnImg,playBtnImg]} alt="play button" imgWidth="45px" imgHeight="68.25px"/>
                </button> :
                (!isPlaying && !videoUrl) || !videoFile || (videoFile ? !videoFile.type.startsWith("video") : false) ?
                    <p>Please Choose A Video</p> :
                <button onClick={() => {videoRef.current.pause();setIsPlaying(false)}}>
                    <Picture images={[webpPauseBtnImg,pauseBtnImg]} alt="play button" imgWidth="54px" imgHeight="68.25px"/>
                </button>}
            </div>
        </div>
    )
}