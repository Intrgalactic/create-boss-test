import videoPreviewFullImage from 'src/assets/images/video-preview-full.jpg';
import webpVideoPreviewFullImage from 'src/assets/images/video-preview-full.webp';
import mobileVideoPreviewFullImage from 'src/assets/images/mobile-video-preview-full.jpg';
import mobileWebpVideoPreviewFullImage from 'src/assets/images/mobile-video-preview-full.webp';
import mobileVideoPreviewFullImage2 from 'src/assets/images/mobile-video-preview-full-2.jpg';
import mobileWebpVideoPreviewFullImage2 from 'src/assets/images/mobile-video-preview-full-2.webp';
import playBtnImg from 'src/assets/images/play-button.png';
import webpPlayBtnImg from 'src/assets/images/play-button.webp';
import pauseBtnImg from 'src/assets/images/pause-button.png';
import webpPauseBtnImg from 'src/assets/images/pause-button.webp';
import skipBtnImg from 'src/assets/images/skip-forward-button.png';
import webpSkipBtnImg from 'src/assets/images/skip-forward-button.webp';
import skipReversedBtnImg from 'src/assets/images/rotated-skip-forward-button.png';
import webpReversedSkipBtnImg from 'src/assets/images/rotated-skip-forward-button.webp';
import { Picture } from 'src/components/picture';
import useWindowSize from 'src/hooks/useWindowSize';
import { useEffect, useRef, useState } from 'react';
import { VideoPreviewControlBtn } from './video-preview-control-btn';

export function VideoPreview({ videoFile }) {
    const windowSize = useWindowSize();
    const [images, setImages] = useState([]);
    const [videoUrl, setVideoUrl] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef();
    useEffect(() => {
        if (windowSize.width < 1440 && windowSize.width > 768) {
            setImages([mobileWebpVideoPreviewFullImage, mobileVideoPreviewFullImage]);
        }
        else if (windowSize.width < 768) {
            setImages([mobileWebpVideoPreviewFullImage2,mobileVideoPreviewFullImage2]);
        }
        else {
            setImages([webpVideoPreviewFullImage, videoPreviewFullImage]);
        }
    }, [windowSize.width, setImages])

    useEffect(() => {
        if (videoFile) {
            const fileURL = URL.createObjectURL(videoFile);
            setVideoUrl(fileURL);
            setIsPlaying(false);
        }
    }, [videoFile, setVideoUrl])


    return (
        <div className="video-preview">
            {!videoFile ?
                <Picture images={images} alt="video edit preview" imgWidth="100%" imgHeight="100%" />
                : videoFile.type.startsWith("video") ? <video ref={videoRef} className="video-preview__video" src={videoUrl} type={videoFile.type} onEnded={() => {setIsPlaying(false)}}/> : <p className="video-file-type-err">The Attached File Is Not A Video</p>
            }

            <div className='video-controls'>
                {!isPlaying && videoUrl && (videoFile ? videoFile.type.startsWith("video") : false) ?
                    <>
                        <VideoPreviewControlBtn ref={videoRef} images={[skipReversedBtnImg, webpReversedSkipBtnImg]} alt="skip backwards button" imgWidth="47.5px" imgHeight="46.5px" sign="+"/>
                        <button onClick={() => { videoRef.current.currentTime === videoRef.current.duration ? videoRef.current.currentTime = 0 : null;videoRef.current.play(); setIsPlaying(true) }}>
                            <Picture images={[webpPlayBtnImg, playBtnImg]} alt="play button" imgWidth="47.5px" imgHeight="46.5px" />
                        </button>
                        <VideoPreviewControlBtn ref={videoRef} images={[skipBtnImg, webpSkipBtnImg]} alt="skip forward button" imgWidth="47.5px" imgHeight="46.5px"  sign="+"/>
                    </>
                    :
                    (!isPlaying && !videoUrl) || !videoFile || (videoFile ? !videoFile.type.startsWith("video") : false) && (videoRef.current && videoRef.current.currentTime != 0) ?
                        <p>Please Choose A Video</p> :
                        <>
                            <VideoPreviewControlBtn ref={videoRef} images={[skipReversedBtnImg, webpReversedSkipBtnImg]} alt="skip backwards button" imgWidth="47.5px" imgHeight="46.5px" sign="-" />
                            <button onClick={() => { videoRef.current.pause(); setIsPlaying(false); console.log(videoRef.current.currentTime) }}>
                                <Picture images={[webpPauseBtnImg, pauseBtnImg]} alt="play button" imgWidth="38.5px" imgHeight="46.5px" />
                            </button>
                            <VideoPreviewControlBtn ref={videoRef} images={[skipBtnImg, webpSkipBtnImg]} alt="skip forward button" imgWidth="47.5px" imgHeight="46.5px" sign="+" />
                        </>}
            </div>
        </div>
    )
}