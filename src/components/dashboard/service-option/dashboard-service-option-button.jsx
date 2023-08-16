import { CtaButton } from "src/components/cta-button";
import { DashboardSelectButton } from "./dashboard-select-button";

export function DashboardServiceOptionButton({heading,text,options,setOption,setFilter,type,setFile,file,acceptList,color,setColor}) {
    return (
        <div className="dashboard__service-option-button">
            <p>{heading}</p>
            <DashboardSelectButton text={text} options={options} setOption={setOption} setFilter={setFilter} type={type} file={file} setFile={setFile} acceptList={acceptList} color={color} setColor={setColor} />
        </div>
    )
}