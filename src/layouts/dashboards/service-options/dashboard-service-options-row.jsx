import { DashboardServiceOptionButton } from "src/components/dashboard/service-option/dashboard-service-option-button";

export default function DashboardServiceOptionsRow({actions}) {
    return (
        <div className="dashboard__service-options-row">
            {actions.map((action,index) => (
                <DashboardServiceOptionButton text={action.text} setFilter={action.setFilter} options={action.options} setOption={action.setOption} key={index} heading={action.heading} type={action.type}/>
            ))}
        </div>
    )
}