import { Suspense, lazy, useEffect, useState } from "react";
import { ContentContainer } from "src/components/content-container";

const DashboardServiceInputContainer = lazy(() => import('src/components/dashboard/boxes/dashboard-service-input-container').then(module => {
    return { default: module.DashboardServiceInputContainer }
}))
const DashboardServiceOutput = lazy(() => import('src/components/dashboard/files/dashboard-service-output').then(module => {
    return { default: module.DashboardServiceOutput }
}))
const FileInputContainer = lazy(() => import('src/components/dashboard/files/file-input-container').then(module => {
    return { default: module.FileInputContainer }
}))
const FileOutputContent = lazy(() => import('src/components/dashboard/files/file-output-container-content').then(module => {
    return { default: module.FileOutputContent }
}))

import { SectionHeading } from "src/components/section-heading";
import Loader from "../loader";
import inputCheck from 'src/assets/images/input-check.png';
import webpInputCheck from 'src/assets/images/input-check.webp';
import downloadImage from 'src/assets/images/downloaded.png';
import webpDownloadImage from 'src/assets/images/downloaded.webp';
import errorImage from 'src/assets/images/error.png';
import webpErrorImage from 'src/assets/images/error.webp';
import { Link } from "react-router-dom";


export default function DashboardLeftSection({ mainAction, headings, controls, setAbleToTranslate, textInput, handleTextChange, isTranslated, downloadFile, file, setFile, errorAtDownload, setErrorAtDownload }) {
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
    }, [setIsFileAttached, file, setAbleToTranslate, textInput]);
    return (
        <Suspense fallback={<Loader />}>
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
                                {errorAtDownload ?
                                    <FileOutputContent images={[webpErrorImage, errorImage]} imgHeight="64px" imgWidth="64px" alt="error" firstText="Error at downloading" >
                                        <p>Please try again by attaching new file or input text again</p>
                                    </FileOutputContent>
                                    : !isFileAttached && !textInput ? <>
                                        <Loader />
                                        <p>Waiting...</p>
                                        <p>For Manual Input Or File</p>
                                    </> : !isTranslated ?
                                        <FileOutputContent images={[webpInputCheck, inputCheck]} imgWidth="64px" imgHeight="62px" alt="check mark" firstText="Ready">
                                            <p>Ready To Process</p>
                                        </FileOutputContent>

                                        :
                                        <FileOutputContent images={[webpDownloadImage, downloadImage]} imgWidth="64px" imgHeight="62px" alt="check mark" firstText="Translating Completed">
                                            <Link onClick={downloadFile}>Download</Link>
                                        </FileOutputContent>
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
        </Suspense>
    )
}