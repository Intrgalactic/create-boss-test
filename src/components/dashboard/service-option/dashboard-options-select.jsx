import { forwardRef } from "react"
import { SearchBar } from "src/components/search-bar";

export const DashboardOptionsSelect = forwardRef((props, ref) => {
    return (
        <div className="dashboard__select-box" ref={ref}>
            {typeof (props.options[0]) === "string" ? props.options.map((option, index) => (
                <div className="dashboard__select-box-option" key={index} onClick={(e) => { props.setOption(e.target.innerHTML), props.toggleList() }}>
                    <p>{option}</p>
                </div>
            )) :
                <div className="dashboard__select-box-search">
                    <SearchBar setFilter={props.setFilter}/>
                    {props.options.map((optgroup,index) => (
                    <div className="dashboard__select-box-optgroup" key={index}>
                        <p className="select-box-optgroup-p">{optgroup.optgroup}</p>
                        {optgroup.options.map((option, index) =>
                            <div className="dashboard__select-box-option" key={index} onClick={(e) => { props.setOption(e.target.getAttribute("aria-details"),e.target.innerHTML), props.toggleList() }}>
                                <p aria-details={optgroup.code[index]} >{option}</p>
                            </div>
                        )}
                    </div>))}
                </div>
            }   
        </div>
)})
