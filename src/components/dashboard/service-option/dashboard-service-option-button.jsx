import { CtaButton } from "src/components/cta-button";
import { DashboardSelectButton } from "./dashboard-select-button";

export function DashboardServiceOptionButton({heading,text,options,setOption,setFilter,type}) {
    return (
        <div className="dashboard__service-option-button">
            <p>{heading}</p>
            {!type ? <DashboardSelectButton text={text} options={options} setOption={setOption} setFilter={setFilter}/> : <CtaButton text={text}/>}
        </div>
    )
}