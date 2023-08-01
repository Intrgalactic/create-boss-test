import { useEffect, useRef, useState } from "react";
import { ContentContainer } from "src/components/content-container";
import { CtaButton } from "src/components/cta-button";
import { DashboardServiceInputContainer } from "src/components/dashboard-service-input-container";
import { DashboardServiceOutput } from "src/components/dashboard-service-output";
import { FileInputContainer } from "src/components/file-input-container";
import { SectionHeading } from "src/components/section-heading";
import Loader from "./loader";
import { Picture } from "src/components/picture";
import inputCheck from 'src/assets/images/input-check.png';
import webpInputCheck from 'src/assets/images/input-check.webp';
import downloadImage from 'src/assets/images/downloaded.png';
import webpDownloadImage from 'src/assets/images/downloaded.webp';
import { Link } from "react-router-dom";
export default function DashboardLeftSection({ mainAction, headings, controls,setAbleToTranslate,textInput,handleTextChange,isTranslated,downloadFile,file,setFile}) {
    const [isFileAttached, setIsFileAttached] = useState(false);
    useEffect(() => {
        if (file) {
            setIsFileAttached(true);
        }
        if (textInput !== "" || file) {
            setAbleToTranslate("Yes");
        }
        else {
            setAbleToTranslate("No");
        }
    }, [setIsFileAttached, file,setAbleToTranslate,textInput]);
    return (
        <div className="dashboard__left-section">
            <SectionHeading heading={headings[0]} />
            <div className="dashboard__left-section-container">
                <ContentContainer containerClass="dashboard__left-section-content-container">
                    <DashboardServiceInputContainer heading={headings[1]} inputClass="dashboard__left-section-content-container-main-input">
                        <DashboardServiceOutput isFileAttached={isFileAttached} setTextInput={handleTextChange} />
                    </DashboardServiceInputContainer>
                </ContentContainer>
                <ContentContainer containerClass="dashboard__left-section-file-container">
                    <DashboardServiceInputContainer heading={headings[2]}>
                        <FileInputContainer file={file} setFile={setFile} textInput={textInput} />
                    </DashboardServiceInputContainer>
                    <DashboardServiceInputContainer heading={headings[3]}>
                        <div className='file-output-container'>
                            {!isFileAttached && !textInput ? <><Loader />
                                <p>Waiting...</p>
                                <p>For Manual Input Or File</p>
                            </> : !isTranslated ? <>
                                <Picture images={[webpInputCheck, inputCheck]} imgWidth="64px" imgHeight="62px" alt="check mark" />
                                <p>Ready</p>
                                <p>Ready To Process</p>
                            </> : 
                            <>
                            <Picture images={[webpDownloadImage,downloadImage]} imgWidth="64px" imgHeight="62px" alt="check mark" />
                                <p>Translating Completed</p>
                                <Link onClick={downloadFile}>Download</Link>
                            </>
                            }
                        </div>
                    </DashboardServiceInputContainer>
                </ContentContainer>
                <ContentContainer containerClass="dashboard__left-section-control-container">
                    {controls.map((control, index) => (
                        <DashboardServiceInputContainer inputClass="dashboard__left-section-content-container-control-input">
                            {index === controls.length - 1 ?
                                <button onClick={mainAction}>{control}</button> : <p>{control}</p>
                            }
                        </DashboardServiceInputContainer>
                    ))}
                </ContentContainer>
            </div>
        </div>
    )
}