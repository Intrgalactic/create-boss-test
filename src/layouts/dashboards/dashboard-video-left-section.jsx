import { ContentContainer } from "src/components/content-container";
import { SectionHeading } from "src/components/section-heading";
import { VideoPreviewContainer } from "src/components/video-preview-container";

export default function DashboardVideoLeftSection({heading,videoFile,setVideoFile}) {
    return (
        <div className='dashboard__left-section'>
             <SectionHeading heading={heading} />
             <ContentContainer containerClass="dashboard-video-left-section__container">
                <VideoPreviewContainer videoFile={videoFile} setVideoFile={setVideoFile}/>
             </ContentContainer>
        </div>
    )
}