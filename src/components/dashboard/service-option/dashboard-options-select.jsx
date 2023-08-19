import { Suspense, forwardRef, lazy } from "react"
import Loader from "src/layouts/loader";
const SearchBar = lazy(() => import('../../search-bar').then(module => {
    return {default: module.SearchBar}
}));
const DashboardSelectBoxOption = lazy(() => import('./dashboard-select-box').then(module => {
    return { default: module.DashboardSelectBoxOption }
}));

export const DashboardOptionsSelect = forwardRef((props, ref) => {
    return (
        <div className="dashboard__select-box" ref={ref}>
            {typeof (props.options[0]) === "string" ? props.options.map((option, index) => (
                <div className="dashboard__select-box-option" key={index} onClick={(e) => { props.setOption(e.target.innerText), props.toggleList() }}>
                    <p>{option}</p>
                </div>
            )) :
                <Suspense fallback={<Loader />}>
                    <DashboardSelectBoxOption boxClass="dashboard__select-box-search">
                        <div className="dashboard__select-box-search">
                            <SearchBar setFilter={props.setFilter} />
                            {props.options.map((optgroup, index) => (
                                <div className="dashboard__select-box-optgroup" key={index}>
                                    <p className="select-box-optgroup-p">{optgroup.optgroup}</p>
                                    {optgroup.options.map((option, index) =>
                                        <div className="dashboard__select-box-option" key={index} onClick={(e) => { props.setOption(e.target.getAttribute("aria-details"), e.target.innerText), props.toggleList() }}>
                                            <p aria-details={optgroup.code[index]} >{option}</p>
                                        </div>
                                    )}
                                </div>))}
                        </div>
                    </DashboardSelectBoxOption>
                </Suspense>
            }
        </div>
    )
})
