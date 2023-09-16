import { RangeAdjustTooltipRecord } from "./rangeAdjustTooltipRecord";
import { Tooltip } from "./tooltip";

export function RangeAdjust({ heading, leftTooltip, rightTooltip,setValue,value,name }) {
    return (
        <div className="range-adjust">
            <p className="range-adjust-heading">{heading}</p>
            <input type="range" className="range-input" min="0" max="100" value={`${value * 100}`} onChange={(e) => setValue(name,0.01 * e.target.value)}></input>
            <div className="range-adjust-tooltips">
                <RangeAdjustTooltipRecord heading={leftTooltip.heading} description={leftTooltip.description}/>
                <RangeAdjustTooltipRecord heading={rightTooltip.heading} description={rightTooltip.description}/>
            </div>
        </div>
    )
}