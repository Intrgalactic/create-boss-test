import { useRef, useState } from "react";
import { CtaButton } from "src/components/cta-button";
import { DashboardOptionsSelect } from "./dashboard-options-select";

export function DashboardSelectButton({text,options,setOption,setFilter}) {
    const [isListToggled,setIsListToggled] = useState(false);
    const listRef = useRef();
    function toggleOptionsList() {
        listRef.current.classList.toggle('visible-list');
        console.log(listRef);
    }
    return (
        <div className="dashboard__select-button">
            <CtaButton text={text} action={toggleOptionsList}/>
            <DashboardOptionsSelect options={options} ref={listRef} setOption={setOption} toggleList={toggleOptionsList} setFilter={setFilter}/>
        </div>
    )
}