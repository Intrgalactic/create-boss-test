import { ServiceOverviewContainer } from "src/components/service-overview-container";
import Header from "src/layouts/header";
import ServiceOverview from "src/layouts/service-overview";
import speechToTextImage from 'src/assets/images/onboard-speech-to-text.png';
import webpSpeechToTextImage from 'src/assets/images/onboard-speech-to-text.webp';
import textToSpeechImage from 'src/assets/images/onboard-text-to-speech.png';
import webpTextToSpeechImage from 'src/assets/images/onboard-text-to-speech.webp';
import subtitlesToVideoImage from 'src/assets/images/onboard-subtitles-to-video.png';
import webpSubtitlesToVideoImage from 'src/assets/images/onboard-subtitles-to-video.webp';
import subtitlesFromVideoImage from 'src/assets/images/onboard-subtitles-from-video.png';
import webpSubtitlesFromVideoImage from 'src/assets/images/onboard-subtitles-from-video.webp';
import DashboardHeader from "src/layouts/dashboard-header";
import { useEffect } from "react";
import { useContext } from "react";
import { authContext } from "src/context/authContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.js";
import { fetchUrl } from "src/utils/utilities.js";
export  default function OnBoard() {
    const isLogged = useContext(authContext);
    const navigate = useNavigate();
    const imagePaths = [
        [subtitlesFromVideoImage, webpSubtitlesFromVideoImage],
        [subtitlesToVideoImage, webpSubtitlesToVideoImage],
        [speechToTextImage, webpSpeechToTextImage],
        [textToSpeechImage, webpTextToSpeechImage]
      ];
    useEffect(() => {
        if (isLogged === false) {
            navigate('/sign-in');
        }
        else if(auth.currentUser !== null) {
        
        }
    },[isLogged]);
    return (
        <div className="onboard-page">
            <DashboardHeader/>
            <ServiceOverview>
                <ServiceOverviewContainer heading="Welcome Onboard! Your Journey with Us Begins Now. Choose Your Preferred Service to Get Started!" imagePaths={imagePaths} buttonText="Go"/>
            </ServiceOverview>
        </div>
    )
}