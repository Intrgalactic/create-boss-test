import { Suspense, useState } from "react";
import { ContentContainer } from "src/components/content-container";
import DashboardHeader from "src/layouts/dashboards/dashboard-header";
import DashboardLeftSection from "src/layouts/dashboards/dashboard-left-section";
import DashboardRightSection from "src/layouts/dashboards/dashboard-right-section";
import DashboardVideoLeftSection from "src/layouts/dashboards/dashboard-video-left-section";
import DashboardServiceOptionsRow from "src/layouts/dashboards/service-options/dashboard-service-options-row";
import Loader from "src/layouts/loader";
import { logoAlignmentOptions, subtitlesFontOptions, videoSpeedOptions, watermarkAlignmentOptions, watermarkSizeOptions } from "src/utils/dashboard-static-data";

export default function STVDashboard() {
    const [videoSpeed, setVideoSpeed] = useState('1X');
    const [logoAlignment, setLogoAlignment] = useState("Bottom Center");
    const [videoFile, setVideoFile] = useState();
    const [watermarkFile, setWatermarkFile] = useState();
    const [subtitlesFontFile, setSubtitlesFontFile] = useState();
    const [logoFile, setLogoFile] = useState();
    const [loadingState, setLoadingState] = useState(false);
    const [watermarkAlignment, setWatermarkAlignment] = useState('Center');
    const [watermarkSize, setWatermarkSize] = useState("48PX");
    const firstServiceOptionsRowActions = [
        {
            heading: "Subtitles Font",
            type: "input",
            file: subtitlesFontFile,
            setFile: setSubtitlesFontFile,
        },
        {
            text: videoSpeed,
            options: videoSpeedOptions,
            setOption: setVideoSpeed,
            heading: "Video Speed",
        },
        {
            text: logoAlignment,
            options: logoAlignmentOptions,
            setOption: setLogoAlignment,
            heading: "Logo Align",
        },

        {
            text: watermarkAlignment,
            options: watermarkAlignmentOptions,
            setOption: setWatermarkAlignment,
            heading: "Watermark Align",
        },
        {
            text: watermarkSize,
            options: watermarkSizeOptions,
            setOption: setWatermarkSize,
            heading: "Watermark Size",
        },
        {
            heading: "Logo",
            type:"input",
            file: logoFile,
            setFile: setLogoFile,
            acceptList: "image/*, .svg",
        },
        {
            heading: "Watermark",
            type: "input",
            file: watermarkFile,
            setFile: setWatermarkFile,
            acceptList: "image/*, .svg",
        }

    ]
    async function sendToGetSubtitles() {
        if (videoFile) {
            const data = new FormData();
            console.log(videoFile);
            data.append('file',videoFile,videoFile.name);
            data.append('subtitlesOn',true);
            console.log(data);
            const subtitles = await fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}api/subtitles-to-video`,{
                method: "POST",
                body:data,
                
            });
            console.log(subtitles.json());
        }
    }
    return (
        <div className="subtitles-to-video-dashboard">
            <Suspense fallback={<Loader />}>
                <DashboardHeader />
                <ContentContainer containerClass="subtitles-to-video-dashboard__container">
                    <DashboardVideoLeftSection heading="Video To Modify" videoFile={videoFile} setVideoFile={setVideoFile} sendToGetSubtitles={sendToGetSubtitles}/>
                    <DashboardRightSection configurationHeading="Default Configuration Is Set To Blank Logo Without Watermark">
                        <DashboardServiceOptionsRow actions={firstServiceOptionsRowActions} />
                    </DashboardRightSection>
                </ContentContainer>
                {loadingState === true && <Loader />}
            </Suspense>
        </div>
    )
}