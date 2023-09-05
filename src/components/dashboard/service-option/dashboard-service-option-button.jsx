
import { lazy } from "react";
import { useContext } from "react";
import { dashboardSelectButtonContext } from "src/context/DashboardSelectButtonContext";
const DashboardSelectButton = lazy(() => import("./dashboard-select-button").then(module => { return { default: module.DashboardSelectButton } }));

export function DashboardServiceOptionButton() {
    const dashboardSelectButtonProps = useContext(dashboardSelectButtonContext);
    return (
        <div className="dashboard__service-option-button">
            <p>{dashboardSelectButtonProps.heading}</p>
            <dashboardSelectButtonContext.Provider value={dashboardSelectButtonProps}>
                <DashboardSelectButton/>
            </dashboardSelectButtonContext.Provider>
        </div>
    )
}