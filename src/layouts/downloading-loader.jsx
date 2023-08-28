import { Picture } from "src/components/picture";
import hourglassImage from 'src/assets/images/hourglass.png';
import webpHourglassImage from 'src/assets/images/hourglass.webp';

export default function DownloadingLoader({images,alt,imgWidth,imgHeight,heading}) {

    return (
        <div className="loader">
            <div className="downloading-loader-container">
                <Picture images={[webpHourglassImage,hourglassImage]} alt="hourglass" imgWidth="52px" imgHeight="73px"/>
                <p>{heading}</p>
                <p>The bigger size it is, processing time can get extended</p>
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    )
}