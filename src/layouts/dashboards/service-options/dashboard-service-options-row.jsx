import { useRef, useState } from "react";
import { DashboardServiceOptionButton } from "src/components/dashboard/service-option/dashboard-service-option-button";
import expandImage from 'src/assets/images/expand.png';
import webpExpandImage from 'src/assets/images/expand.webp';
import { Picture } from "src/components/picture";
import { expandList } from "src/utils/utilities";
import { dashboardSelectButtonContext } from "src/context/DashboardSelectButtonContext";

export default function DashboardServiceOptionsRow({ actions, heading, children }) {
    const [isToggled, setIsToggled] = useState(false);
    const rowRef = useRef();
    const headingRef = useRef();

    function expandOptionsList(e) {
        if (e.target !== rowRef.current && !e.target.classList.contains("call-to-action-btn") && !e.target.classList.contains("tts-voice-select__category-select") && !e.target.classList.contains("dashboard__service-option-button") && e.target.nodeName !== "P" && e.target.nodeName !== "BUTTON" && e.target.nodeName !== "INPUT" && !e.target.classList.contains("dashboard__service-options-row__container") && !e.target.classList.contains("dashboard__select-box-option")) {
            expandList(isToggled, setIsToggled, rowRef, "expanded", headingRef);
        }
    }
    return (
        <div className="dashboard__service-options-row__container" onClick={expandOptionsList} >
            <div className="dashboard__service-options-row__container-heading" ref={headingRef}>
                <h1>{heading}</h1>
                <Picture images={[webpExpandImage, expandImage]} alt="expand arrow" imgHeight="21px" imgWidth="40px" /></div>
            <div className="dashboard__service-options-row" ref={rowRef}>
                {actions ? actions.map((action, index) => (
                    <dashboardSelectButtonContext.Provider value={action} key={index}>
                        <DashboardServiceOptionButton isSectionOpened={isToggled}/>
                    </dashboardSelectButtonContext.Provider>
                )) : children}
            </div>
        </div>
    )
}
