import { lazy, useEffect, useRef, useState } from "react";
const CtaButton = lazy(() => import("src/components/cta-button").then(module => { return { default: module.CtaButton } }));
const DashboardOptionsSelect = lazy(() => import('./dashboard-options-select').then(module => {return {default:module.DashboardOptionsSelect}}));

export function DashboardSelectButton({ text, options, setOption, setFilter, type, acceptList, file, setFile, color, setColor }) {
    const listRef = useRef();
    const inputBtnRef = useRef();
    const inputFileRef = useRef();
    const colorInputRef = useRef();
    const [btnText, setBtnText] = useState("Choose");
    useEffect(() => {

        if (type === "input") {
            if (inputBtnRef.current) {
                addFileListeners(inputBtnRef);
            }

            if (file) {
                setBtnText("Attached");

            }

            return () => {
                if (inputBtnRef.current) {
                    removeFileListeners(inputBtnRef);
                }
            }

        }
        else if (type === "color") {
            if (color) {
                setBtnText("Picked");
            }
        }
    }, [file, setBtnText, inputBtnRef.current, color]);

    function removeDragEffect() {
        setBtnText("Choose");
    }
    function handleFileInputDrag(event,setBtnText) {
        event.stopPropagation();
        event.preventDefault();
        setBtnText("Drop");
    }
    function handleFileDrop(event,setBtnText) {
        event.stopPropagation();
        event.preventDefault();
        const fileList = event.dataTransfer.files;
        if (fileList[0].size > 1048576 * 15) {
            setBtnText("The File Is Too Big");
        }
        else if (fileList.length > 0) {
            setFile(fileList[0]);
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
            {type !== "input" && type !== "color" ? <>
                <CtaButton text={text} action={toggleOptionsList} />
            </> : type !== "color" ?
                <>
                    <CtaButton text={btnText} action={chooseFile} ref={inputBtnRef} />
                    <input type="file" ref={inputFileRef} className="stv-input" onChange={(e) => { setFile(e.target.files[0]) }} accept={acceptList} />
                </>
                :
                <>
                    <CtaButton text={btnText} action={chooseColor} />
                    <input type="color" ref={colorInputRef} onChange={(e) => setColor(e.target.value)} className="stv-input" />
                </>
            }
            {type !== "input" && type !== "color" && <DashboardOptionsSelect options={options} ref={listRef} setOption={setOption} toggleList={toggleOptionsList} setFilter={setFilter} />}
        </div>
    )
}