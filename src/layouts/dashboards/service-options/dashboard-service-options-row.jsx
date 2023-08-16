import { useEffect, useRef, useState } from "react";
import { DashboardServiceOptionButton } from "src/components/dashboard/service-option/dashboard-service-option-button";
import expandImage from 'src/assets/images/expand.png';
import webpExpandImage from 'src/assets/images/expand.webp';
import { Picture } from "src/components/picture";
import useWindowSize from "src/hooks/useWindowSize";
import { expandList } from "src/utils/utilities";

export default function DashboardServiceOptionsRow({ actions, heading }) {
    const windowSize = useWindowSize();
    const [isMobile,setIsMobile] = useState(false);
    const [isToggled,setIsToggled] = useState(false);
    const rowRef = useRef();
    const headingRef = useRef();

    useEffect(() => {
        if (windowSize.width < 768) {
            setIsMobile(true);
        }
        else {
            setIsMobile(false);
        }
    },[windowSize.width,setIsMobile]);
    return (
        <div className="dashboard__service-options-row__container" onClick={() => {expandList(isToggled,setIsToggled,rowRef,"expanded",headingRef)}} >
            {!isMobile ?
                <div className="dashboard__service-options-row__container-heading" ref={headingRef}>
                    <h1>{heading}</h1>
                    <Picture images={[webpExpandImage, expandImage]} alt="expand arrow" imgHeight="21px" imgWidth="40px" /></div> : null}

            <div className="dashboard__service-options-row" ref={rowRef} onClick={(e) => {e.stopPropagation()}}>
                {actions.map((action, index) => (
                    <DashboardServiceOptionButton text={action.text} setFilter={action.setFilter} options={action.options} setOption={action.setOption} key={index} heading={action.heading} type={action.type} file={action.file} setFile={action.setFile} acceptList={action.acceptList} color={action.color} setColor={action.setColor} />
                ))}
            </div>
        </div>
    )
}
