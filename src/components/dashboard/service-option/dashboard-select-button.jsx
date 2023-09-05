import { lazy, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { dashboardSelectButtonContext } from "src/context/DashboardSelectButtonContext";
const CtaButton = lazy(() => import("src/components/cta-button").then(module => { return { default: module.CtaButton } }));
const DashboardOptionsSelect = lazy(() => import('./dashboard-options-select').then(module => { return { default: module.DashboardOptionsSelect } }));

export function DashboardSelectButton() {
    const listRef = useRef();
    const inputBtnRef = useRef();
    const inputFileRef = useRef();
    const colorInputRef = useRef();
    const [btnText, setBtnText] = useState("Choose");
    const dashboardSelectButtonProps = useContext(dashboardSelectButtonContext);
    useEffect(() => {
        if (dashboardSelectButtonProps.type === "input") {
            if (inputBtnRef.current) {
                addFileListeners(inputBtnRef);
            }

            if (dashboardSelectButtonProps.file) {
                setBtnText("Attached");

            }
        }
        else if (dashboardSelectButtonProps.type === "color") {
            if (dashboardSelectButtonProps.color) {
                setBtnText("Picked");
            }
        }
        return () => {
            if (inputBtnRef.current) {
                removeFileListeners(inputBtnRef);
            }
        }
    }, [dashboardSelectButtonProps && dashboardSelectButtonProps.file, setBtnText, inputBtnRef.current, dashboardSelectButtonProps && dashboardSelectButtonProps.color]);

    function removeDragEffect() {
        setBtnText("Choose");
    }
    function handleFileInputDrag(event, setBtnText) {
        event.stopPropagation();
        event.preventDefault();
        setBtnText("Drop");
    }
    function handleFileDrop(event, setBtnText) {
        event.stopPropagation();
        event.preventDefault();
        const fileList = event.dataTransfer.files;
        if (fileList[0].size > 1048576 * 15) {
            setBtnText("The File Is Too Big");
        }
        else if (fileList.length > 0) {
            dashboardSelectButtonProps.setFile(fileList[0]);
        }
    }
    function addFileListeners(fileRef) {
        fileRef.current.addEventListener('dragover', handleFileInputDrag);
        fileRef.current.addEventListener('dragleave', removeDragEffect)
        fileRef.current.addEventListener('dragend', removeDragEffect);
        fileRef.current.addEventListener('drop', handleFileDrop);
    }

    function removeFileListeners(fileRef) {
        fileRef.current.removeEventListener("dragover", handleFileInputDrag);
        fileRef.current.removeEventListener('dragleave', removeDragEffect)
        fileRef.current.removeEventListener('dragend', removeDragEffect);
        fileRef.current.removeEventListener('drop', handleFileDrop);
    }
    function toggleOptionsList() {
        listRef.current.classList.toggle('visible-list');
    }
    function chooseFile() {
        inputFileRef.current.click();
    }
    function chooseColor() {
        colorInputRef.current.click();
    }
    return (
        <div className="dashboard__select-button">
            {dashboardSelectButtonProps.type !== "input" && dashboardSelectButtonProps.type !== "color" ? <>
                <CtaButton text={dashboardSelectButtonProps.text} action={toggleOptionsList} />
            </> : dashboardSelectButtonProps.type !== "color" ?
                <>
                    <CtaButton text={btnText} action={chooseFile} ref={inputBtnRef} />
                    <input type="file" ref={inputFileRef} className="stv-input" onChange={(e) => { dashboardSelectButtonProps.setFile(dashboardSelectButtonProps.heading, e.target.files[0]) }} accept={dashboardSelectButtonProps.acceptList} />
                </>
                :
                <>
                    <CtaButton text={btnText} action={chooseColor} />
                    <input type="color" ref={colorInputRef} onChange={(e) => dashboardSelectButtonProps.setColor(dashboardSelectButtonProps.heading, e.target.value)} className="stv-input" />
                </>
            }
            {dashboardSelectButtonProps.type !== "input" && dashboardSelectButtonProps.type !== "color" && <DashboardOptionsSelect options={dashboardSelectButtonProps.options} ref={listRef} setOption={dashboardSelectButtonProps.setOption} toggleList={toggleOptionsList} setFilter={dashboardSelectButtonProps.setFilter} heading={dashboardSelectButtonProps.heading} />}
        </div>
    )
}