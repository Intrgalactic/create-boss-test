import { Tooltip } from "./tooltip";

export function RangeAdjustTooltipRecord({ heading, description }) {
    return (
        <div className="range-adjust-tooltips__record">
            <p>{heading}</p>
            <Tooltip description={description} />
        </div>
    )
}