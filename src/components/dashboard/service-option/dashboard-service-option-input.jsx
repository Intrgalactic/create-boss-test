import { lazy } from "react";
const DashboardOptionsSelect = lazy(() => import('./dashboard-options-select').then(module => {return {default:module.DashboardOptionsSelect}}));
export function DashboardServiceOptionInput() {
    return (
        <div classname="dashboard__service-option-input">
            <DashboardOptionsSelect/>
        </div>
    )
}