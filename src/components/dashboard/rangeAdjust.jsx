import { RangeAdjustTooltipRecord } from "./rangeAdjustTooltipRecord";
import { Tooltip } from "./tooltip";

export function RangeAdjust({ heading, leftTooltip, rightTooltip }) {
    return (
        <div className="range-adjust">
            <p className="range-adjust-heading">{heading}</p>
            <input type="range" className="range-input"></input>
            <div className="range-adjust-tooltips">
                <RangeAdjustTooltipRecord heading={leftTooltip.heading} description={leftTooltip.description}/>
                <RangeAdjustTooltipRecord heading={rightTooltip.heading} description={rightTooltip.description}/>
            </div>
        </div>
    )
}