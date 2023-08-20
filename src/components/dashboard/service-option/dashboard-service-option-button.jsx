
import { lazy } from "react";
const DashboardSelectButton = lazy(() => import("./dashboard-select-button").then(module => {return {default: module.DashboardSelectButton}}));

export function DashboardServiceOptionButton({heading,text,options,setOption,setFilter,type,setFile,file,acceptList,color,setColor}) {
    return (
        <div className="dashboard__service-option-button">
            <p>{heading}</p>
            <DashboardSelectButton text={text} options={options} setOption={setOption} setFilter={setFilter} type={type} file={file} setFile={setFile} acceptList={acceptList} color={color} setColor={setColor} />
        </div>
    )
}