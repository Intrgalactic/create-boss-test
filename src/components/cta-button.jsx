import { forwardRef } from "react"

export const CtaButton = forwardRef((props,ref) => {
    return (
        <button className="call-to-action-btn" ref={ref} onClick={props.action}>
            {props.text}
        </button>
    )
})