import { forwardRef } from "react";
import { ContentContainer } from "src/components/content-container";
import { FilesList } from "src/components/dashboard/files/files-list";
import { VoiceCloningFilesInput } from "src/components/dashboard/files/voice-cloning-files-input-container";
import { ServiceInstruction } from "src/components/dashboard/service-instruction-box";
import { SectionHeading } from "src/components/section-heading";

const VoiceCPanel = forwardRef((props,ref) => {
    const instructionSteps = ["Attach files with sample of your voice", "Name your voice", "Describe your voice", "Notice that quality of the recordings is more important than the quantity"];
    return (
        <div className="voice-cloning">
            <ContentContainer containerClass="voice-cloning__left-section">
                <SectionHeading heading="Voice Cloning" />
                <ContentContainer containerClass="voice-cloning__main-container">
                    <ContentContainer containerClass="voice-cloning__left-section-form">
                        <VoiceCloningFilesInput setFile={props.setFile} setErrorAtDownload={props.setErrorAtDownload} submitToClone={props.submitToClone} ref={ref}/>
                    </ContentContainer>
                    <ContentContainer containerClass="voice-cloning__left-left-section-info">
                        <div className="files-list__container">
                            <p>Files List</p>
                            <FilesList files={props.files} removeFile={props.removeFile}/>
                        </div>
                        <ServiceInstruction heading="Steps to clone your voice" steps={instructionSteps} />
                    </ContentContainer>
                </ContentContainer>
            </ContentContainer>
        </div>
    )
});

const VoiceCloningPanel = VoiceCPanel;
export default VoiceCloningPanel;