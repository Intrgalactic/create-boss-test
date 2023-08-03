
export function DashboardBoxContent({children,boxClass}) {
    return (
        <div className={`dashboard__box-content ${boxClass ? boxClass : ""}`}>
            {children}
        </div>
    )
}